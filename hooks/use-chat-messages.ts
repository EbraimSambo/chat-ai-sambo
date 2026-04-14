import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '@/lib/api/chat.api';
import { CHATS_KEY } from './use-chats';
import type { Message, PaginatedResponse } from '@/types/chat';

export const messagesKey = (chatId: string) => ['messages', chatId] as const;

export function useChatMessages(chatId: string) {
  return useQuery({
    queryKey: messagesKey(chatId),
    queryFn: () => chatApi.getMessages(chatId),
    staleTime: 1000 * 60,
  });
}

export function useSendMessage(chatId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (prompt: string) => chatApi.sendMessage(chatId, prompt),

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
        return { ...old, data: [...old.data, optimisticUser, optimisticAssistant] };
      });

      return { previous, prompt };
    },

    // Em caso de erro, marca as mensagens otimistas como falhadas (não remove)
    onError: (_err, _prompt, context) => {
      if (!context?.previous) return;

      queryClient.setQueryData<PaginatedResponse<Message>>(messagesKey(chatId), (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((msg) =>
            msg.id.startsWith('optimistic-')
              ? { ...msg, id: msg.id.replace('optimistic-', 'failed-') }
              : msg
          ),
        };
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messagesKey(chatId) });
      queryClient.invalidateQueries({ queryKey: CHATS_KEY });
    },
  });
}
