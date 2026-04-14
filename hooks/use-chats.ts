import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '@/lib/api/chat.api';

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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CHATS_KEY }),
  });
}
