import { useState } from 'react';
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
  // ID da mensagem do assistant que acabou de chegar — usada para o typewriter
  const [newAssistantId, setNewAssistantId] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (prompt: string) => chatApi.sendMessage(chatId, prompt),

    onMutate: async (prompt: string) => {
      setNewAssistantId(null);
      await queryClient.cancelQueries({ queryKey: messagesKey(chatId) });
      const previous = queryClient.getQueryData<PaginatedResponse<Message>>(messagesKey(chatId));

      queryClient.setQueryData<PaginatedResponse<Message>>(messagesKey(chatId), (old) => {
        if (!old) return old;
        return {
          ...old,
          data: [
            ...old.data,
            { id: `optimistic-user-${Date.now()}`, chatId, role: 'user', content: prompt, createdAt: new Date().toISOString() },
            { id: `optimistic-assistant-${Date.now()}`, chatId, role: 'assistant', content: '...', createdAt: new Date().toISOString() },
          ],
        };
      });

      return { previous };
    },

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

    onSuccess: (data) => {
      // Guarda o id real da mensagem do assistant para o typewriter
      const assistantMsg = data.messages.find((m) => m.role === 'assistant');
      if (assistantMsg) setNewAssistantId(assistantMsg.id);

      queryClient.invalidateQueries({ queryKey: messagesKey(chatId) });
      queryClient.invalidateQueries({ queryKey: CHATS_KEY });
    },
  });

  return { ...mutation, newAssistantId };
}
