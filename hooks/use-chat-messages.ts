import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '@/lib/api/chat.api';
import { CHATS_KEY } from './use-chats';
import type { Message, PaginatedResponse } from '@/types/chat';

export const messagesKey = (chatId: string) => ['messages', chatId] as const;

export function useChatMessages(chatId: string) {
  return useQuery({
    queryKey: messagesKey(chatId),
    queryFn: () => chatApi.getMessages(chatId),
    staleTime: 1000 * 60, // 1 min — não refetch desnecessário
  });
}

export function useSendMessage(chatId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (prompt: string) => chatApi.sendMessage(chatId, prompt),

    // Optimistic update — adiciona as mensagens imediatamente antes da resposta
    onMutate: async (prompt: string) => {
      await queryClient.cancelQueries({ queryKey: messagesKey(chatId) });

      const previous = queryClient.getQueryData<PaginatedResponse<Message>>(messagesKey(chatId));

      const optimisticUser: Message = {
        id: `optimistic-user-${Date.now()}`,
        chatId,
        role: 'user',
        content: prompt,
        createdAt: new Date().toISOString(),
      };
      const optimisticAssistant: Message = {
        id: `optimistic-assistant-${Date.now()}`,
        chatId,
        role: 'assistant',
        content: '...',
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<PaginatedResponse<Message>>(messagesKey(chatId), (old) => {
        if (!old) return old;
        return {
          ...old,
          data: [...old.data, optimisticUser, optimisticAssistant],
        };
      });

      return { previous };
    },

    // Se falhar, reverte
    onError: (_err, _prompt, context) => {
      if (context?.previous) {
        queryClient.setQueryData(messagesKey(chatId), context.previous);
      }
    },

    // Sempre sincroniza com o servidor no final
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: messagesKey(chatId) });
      queryClient.invalidateQueries({ queryKey: CHATS_KEY });
    },
  });
}
