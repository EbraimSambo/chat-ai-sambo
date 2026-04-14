import { NextRequest, NextResponse } from 'next/server';
import { getAIReply } from '@/lib/ai';
import { createChat, insertMessages, listChats } from '@/db/repositories/chat.repository';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt?.trim()) {
    return NextResponse.json({ error: 'Prompt é obrigatório.' }, { status: 400 });
  }

  const reply = await getAIReply(prompt);
  const chat = await createChat({ title: prompt.slice(0, 60).trim() });
  await insertMessages([
    { chatId: chat.id, role: 'user', content: prompt },
    { chatId: chat.id, role: 'assistant', content: reply },
  ]);

  return NextResponse.json({ chat, reply }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = Math.max(1, Number(searchParams.get('page') ?? 1));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') ?? 10)));

  const { data, total } = await listChats(page, limit);

  return NextResponse.json({
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
