import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { db } from '@/db';
import { chats, messages } from '@/db/schema';
import { desc, count } from 'drizzle-orm';

// POST /api/chats — cria chat com base num prompt
export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt?.trim()) {
    return NextResponse.json({ error: 'Prompt é obrigatório.' }, { status: 400 });
  }

  // Gera resposta da IA
  const { text } = await generateText({
    model: google('gemini-2.5-flash'),
    prompt,
  });

  // Usa as primeiras palavras do prompt como título
  const title = prompt.slice(0, 60).trim();

  // Cria o chat e as mensagens numa transação
  const [chat] = await db.insert(chats).values({ title }).returning();

  await db.insert(messages).values([
    { chatId: chat.id, role: 'user', content: prompt },
    { chatId: chat.id, role: 'assistant', content: text },
  ]);

  return NextResponse.json({ chat, reply: text }, { status: 201 });
}

// GET /api/chats?page=1&limit=10 — lista chats paginados
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = Math.max(1, Number(searchParams.get('page') ?? 1));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') ?? 10)));
  const offset = (page - 1) * limit;

  const [data, [{ total }]] = await Promise.all([
    db.select().from(chats).orderBy(desc(chats.updatedAt)).limit(limit).offset(offset),
    db.select({ total: count() }).from(chats),
  ]);

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total: Number(total),
      totalPages: Math.ceil(Number(total) / limit),
    },
  });
}
