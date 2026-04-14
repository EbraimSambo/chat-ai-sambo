"use client";

import { use } from "react";
import { ChatThread } from "@/components/chat-thread";
import { ChatInput } from "@/components/chat-input";
import { useChatMessages, useSendMessage } from "@/hooks/use-chat-messages";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const { id } = use(params);
  const { data, isLoading } = useChatMessages(id);
  const sendMessage = useSendMessage(id);

  const messages = data?.data ?? [];

  return (
    <div className="flex flex-col h-full bg-linear-to-b from-[#1a0a2e] via-[#2d1050] to-[#1a0a2e]">
      <ScrollArea className="flex-1 overflow-y-auto">
        <ChatThread messages={messages} isLoading={isLoading} />
      </ScrollArea>

      <div className="px-4 sm:px-6 pb-4 shrink-0">
        <ChatInput
          onSubmit={(prompt) => sendMessage.mutate(prompt)}
          isPending={sendMessage.isPending}
        />
      </div>
    </div>
  );
}
