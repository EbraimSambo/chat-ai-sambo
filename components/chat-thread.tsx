"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "@/types/chat";

interface ChatThreadProps {
  messages: Message[];
  isLoading?: boolean;
}

export function ChatThread({ messages, isLoading }: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 size={24} className="text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto px-4 sm:px-0 py-6">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const isPending = message.id.startsWith("optimistic-");

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm transition-opacity",
          isUser ? "bg-purple-600 text-white rounded-br-sm" : "bg-white/10 text-white/90 rounded-bl-sm",
          isPending && "opacity-60"
        )}
      >
        {isUser ? (
          <p className="leading-relaxed">{message.content}</p>
        ) : message.content === "..." ? (
          <span className="flex gap-1 items-center py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce [animation-delay:300ms]" />
          </span>
        ) : (
          <ReactMarkdown
            components={{
              code: ({ children, ...props }) => (
                <code className="bg-white/10 px-1 py-0.5 rounded text-xs font-mono" {...props}>{children}</code>
              ),
              pre: ({ children }) => (
                <pre className="bg-white/10 rounded-lg p-3 overflow-x-auto text-xs my-2">{children}</pre>
              ),
              p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
