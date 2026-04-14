import { api } from '@/config/axios.config';
import type {
  Chat,
  Message,
  PaginatedResponse,
  CreateChatResponse,
  SendMessageResponse,
} from '@/types/chat';

export const chatApi = {
  list: (page = 1, limit = 20) =>
    api.get<PaginatedResponse<Chat>>('/chats', { params: { page, limit } }).then((r) => r.data),

  create: (prompt: string) =>
    api.post<CreateChatResponse>('/chats', { prompt }).then((r) => r.data),

  getMessages: (chatId: string, page = 1, limit = 50) =>
    api
      .get<PaginatedResponse<Message>>(`/chats/${chatId}/messages`, { params: { page, limit } })
      .then((r) => r.data),

  sendMessage: (chatId: string, prompt: string) =>
    api
      .post<SendMessageResponse>(`/chats/${chatId}/messages`, { prompt })
      .then((r) => r.data),
};
