import { db } from '@/db';
import { chats, messages, type NewChat, type NewMessage } from '@/db/schema';
import { eq, asc, desc, count } from 'drizzle-orm';

export async function createChat(data: Pick<NewChat, 'title'>) {
  const [chat] = await db.insert(chats).values(data).returning();
  return chat;
}

export async function listChats(page: number, limit: number) {
  const offset = (page - 1) * limit;
  const [data, [{ total }]] = await Promise.all([
    db.select().from(chats).orderBy(desc(chats.updatedAt)).limit(limit).offset(offset),
    db.select({ total: count() }).from(chats),
  ]);
  return { data, total: Number(total) };
}

export async function findChatById(id: string) {
  const [chat] = await db.select().from(chats).where(eq(chats.id, id));
  return chat ?? null;
}

export async function touchChat(id: string) {
  await db.update(chats).set({ updatedAt: new Date() }).where(eq(chats.id, id));
}

export async function insertMessages(rows: NewMessage[]) {
  return db.insert(messages).values(rows).returning();
}

export async function listMessages(chatId: string, page: number, limit: number) {
  const offset = (page - 1) * limit;
  const [data, [{ total }]] = await Promise.all([
    db.select().from(messages).where(eq(messages.chatId, chatId)).orderBy(asc(messages.createdAt)).limit(limit).offset(offset),
    db.select({ total: count() }).from(messages).where(eq(messages.chatId, chatId)),
  ]);
  return { data, total: Number(total) };
}
