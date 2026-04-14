import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '@/lib/api/chat.api';
import { CHATS_KEY } from './use-chats';

export const messagesKey = (chatId: string) => ['messages', chatId] as const;

export function useChatMessages(chatId: string | null) {
  return useQuery({
    queryKey: messagesKey(chatId ?? ''),
    queryFn: () => chatApi.getMessages(chatId!),
    enabled: !!chatId,
  });
}

export function useSendMessage(chatId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (prompt: string) => chatApi.sendMessage(chatId, prompt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messagesKey(chatId) });
      queryClient.invalidateQueries({ queryKey: CHATS_KEY });
    },
  });
}
