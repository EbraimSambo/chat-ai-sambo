import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '@/lib/api/chat.api';
import type { Chat, PaginatedResponse } from '@/types/chat';
import { messagesKey } from './use-chat-messages';

export const CHATS_KEY = ['chats'] as const;

export function useChats(page = 1, limit = 20) {
  return useQuery({
    queryKey: [...CHATS_KEY, page, limit],
    queryFn: () => chatApi.list(page, limit),
  });
}

export function useCreateChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (prompt: string) => chatApi.create(prompt),

    onSuccess: (data) => {
      // Popula o cache de mensagens do novo chat imediatamente
      queryClient.setQueryData(messagesKey(data.chat.id), {
        data: [
          {
            id: `seeded-user-${Date.now()}`,
            chatId: data.chat.id,
            role: 'user' as const,
            content: data.chat.title,
            createdAt: new Date().toISOString(),
          },
          {
            id: `seeded-assistant-${Date.now()}`,
            chatId: data.chat.id,
            role: 'assistant' as const,
            content: data.reply,
            createdAt: new Date().toISOString(),
          },
        ],
        pagination: { page: 1, limit: 50, total: 2, totalPages: 1 },
      });

      // Adiciona o novo chat no topo da lista sem refetch
      queryClient.setQueryData<PaginatedResponse<Chat>>(
        [...CHATS_KEY, 1, 20],
        (old) => {
          if (!old) return old;
          return { ...old, data: [data.chat, ...old.data] };
        }
      );
    },
  });
}
