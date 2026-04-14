import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { db } from '@/db';
import { chats, messages } from '@/db/schema';
import { eq, asc, count } from 'drizzle-orm';

// GET /api/chats/:id/messages?page=1&limit=20 — mensagens paginadas
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = req.nextUrl;
  const page = Math.max(1, Number(searchParams.get('page') ?? 1));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? 20)));
  const offset = (page - 1) * limit;

  const [chat] = await db.select().from(chats).where(eq(chats.id, id));
  if (!chat) {
    return NextResponse.json({ error: 'Chat não encontrado.' }, { status: 404 });
  }

  const [data, [{ total }]] = await Promise.all([
    db.select().from(messages).where(eq(messages.chatId, id)).orderBy(asc(messages.createdAt)).limit(limit).offset(offset),
    db.select({ total: count() }).from(messages).where(eq(messages.chatId, id)),
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

// POST /api/chats/:id/messages — continua a conversa
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { prompt } = await req.json();

  if (!prompt?.trim()) {
    return NextResponse.json({ error: 'Prompt é obrigatório.' }, { status: 400 });
  }

  const [chat] = await db.select().from(chats).where(eq(chats.id, id));
  if (!chat) {
    return NextResponse.json({ error: 'Chat não encontrado.' }, { status: 404 });
  }

  const { text } = await generateText({
    model: google('gemini-2.5-flash'),
    prompt,
  });

  const inserted = await db.insert(messages).values([
    { chatId: id, role: 'user', content: prompt },
    { chatId: id, role: 'assistant', content: text },
  ]).returning();

  // Atualiza updatedAt do chat
  await db.update(chats).set({ updatedAt: new Date() }).where(eq(chats.id, id));

  return NextResponse.json({ messages: inserted, reply: text }, { status: 201 });
}
