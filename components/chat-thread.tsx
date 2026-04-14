"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Loader2, RotateCcw, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTypewriter } from "@/hooks/use-typewriter";
import type { Message } from "@/types/chat";

interface ChatThreadProps {
  messages: Message[];
  isLoading?: boolean;
  onRetry?: (prompt: string) => void;
  animateId?: string | null;
}

export function ChatThread({ messages, isLoading, onRetry, animateId }: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 size={24} className="text-purple-400 animate-spin" />
      </div>
    );
  }

  const pairs = buildPairs(messages);

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto px-4 sm:px-0 py-6">
      {pairs.map((pair) => (
        <MessagePair
          key={pair.user.id}
          pair={pair}
          onRetry={onRetry}
          animateAssistantId={animateId ?? null}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

interface Pair {
  user: Message;
  assistant: Message | null;
}

function buildPairs(messages: Message[]): Pair[] {
  const pairs: Pair[] = [];
  let i = 0;
  while (i < messages.length) {
    const msg = messages[i];
    if (msg.role === "user") {
      const next = messages[i + 1];
      pairs.push({ user: msg, assistant: next?.role === "assistant" ? next : null });
      i += next?.role === "assistant" ? 2 : 1;
    } else {
      pairs.push({ user: { ...msg, role: "user", content: "" }, assistant: msg });
      i++;
    }
  }
  return pairs;
}

function MessagePair({
  pair,
  onRetry,
  animateAssistantId,
}: {
  pair: Pair;
  onRetry?: (p: string) => void;
  animateAssistantId: string | null;
}) {
  const hasFailed =
    pair.user.id.startsWith("failed-") || pair.assistant?.id.startsWith("failed-");
  const isPending = pair.user.id.startsWith("optimistic-");
  const shouldAnimate = pair.assistant?.id === animateAssistantId;

  return (
    <div className="flex flex-col gap-3">
      {pair.user.content && (
        <div className="flex justify-end">
          <div
            className={cn(
              "max-w-[80%] w-fit rounded-2xl rounded-br-sm px-4 py-3 text-sm transition-opacity",
              hasFailed
                ? "bg-red-900/40 border border-red-500/30 text-white/70"
                : "bg-purple-600 text-white",
              isPending && "opacity-60"
            )}
          >
            <p className="leading-relaxed">{pair.user.content}</p>
          </div>
        </div>
      )}

      {pair.assistant && (
        <div className="flex flex-col gap-1">
          <div
            className={cn(
              "max-w-[80%] w-fit rounded-2xl rounded-bl-sm px-4 py-3 text-sm",
              hasFailed
                ? "bg-red-900/40 border border-red-500/30 text-white/70"
                : "bg-white/10 text-white/90",
              pair.assistant.id.startsWith("optimistic-") && "opacity-60"
            )}
          >
            {pair.assistant.id.startsWith("failed-") ? (
              <span className="flex items-center gap-2 text-red-400 text-xs">
                <AlertCircle size={14} />
                Falha ao obter resposta.
              </span>
            ) : pair.assistant.content === "..." ? (
              <span className="flex gap-1 items-center py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce [animation-delay:300ms]" />
              </span>
            ) : shouldAnimate ? (
              <TypewriterMarkdown content={pair.assistant.content} />
            ) : (
              <MarkdownContent content={pair.assistant.content} />
            )}
          </div>

          {hasFailed && onRetry && pair.user.content && (
            <button
              onClick={() => onRetry(pair.user.content)}
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors px-1 self-start"
            >
              <RotateCcw size={12} />
              Tentar novamente
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Anima o texto caracter a caracter, depois renderiza o markdown completo
function TypewriterMarkdown({ content }: { content: string }) {
  const { displayed, done } = useTypewriter(content);

  return done ? (
    <MarkdownContent content={content} />
  ) : (
    <p className="leading-relaxed whitespace-pre-wrap text-sm">
      {displayed}
      <span className="inline-block w-0.5 h-3.5 bg-white/70 ml-0.5 animate-pulse align-middle" />
    </p>
  );
}

function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        code: ({ children, ...props }) => (
          <code className="bg-white/10 px-1 py-0.5 rounded text-xs font-mono" {...props}>
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="bg-white/10 rounded-lg p-3 overflow-x-auto text-xs my-2">{children}</pre>
        ),
        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
        ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
