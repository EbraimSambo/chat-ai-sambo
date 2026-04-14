import { NextRequest, NextResponse } from 'next/server';
import { getAIReply } from '@/lib/ai';
import { findChatById, insertMessages, listMessages, touchChat } from '@/db/repositories/chat.repository';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { searchParams } = req.nextUrl;
  const page = Math.max(1, Number(searchParams.get('page') ?? 1));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? 20)));

  const chat = await findChatById(id);
  if (!chat) return NextResponse.json({ error: 'Chat não encontrado.' }, { status: 404 });

  const { data, total } = await listMessages(id, page, limit);

  return NextResponse.json({
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { prompt } = await req.json();

  if (!prompt?.trim()) {
    return NextResponse.json({ error: 'Prompt é obrigatório.' }, { status: 400 });
  }

  const chat = await findChatById(id);
  if (!chat) return NextResponse.json({ error: 'Chat não encontrado.' }, { status: 404 });

  const reply = await getAIReply(prompt);
  const inserted = await insertMessages([
    { chatId: id, role: 'user', content: prompt },
    { chatId: id, role: 'assistant', content: reply },
  ]);
  await touchChat(id);

  return NextResponse.json({ messages: inserted, reply }, { status: 201 });
}
