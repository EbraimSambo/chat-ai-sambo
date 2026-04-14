import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { chats } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/chats/:id — busca chat por id
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [chat] = await db.select().from(chats).where(eq(chats.id, id));

  if (!chat) {
    return NextResponse.json({ error: 'Chat não encontrado.' }, { status: 404 });
  }

  return NextResponse.json(chat);
}
