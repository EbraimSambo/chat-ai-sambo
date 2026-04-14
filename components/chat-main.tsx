"use client";

import {
  Sparkles, Paperclip, Settings, LayoutGrid, Mic, ArrowUp,
  Image as ImageIcon, Presentation, Code2, ChevronDown,
  Upload, Settings2, Lightbulb, FileText, Menu, Loader2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useCreateChat } from "@/hooks/use-chats";
import { useChatMessages, useSendMessage } from "@/hooks/use-chat-messages";
import { cn } from "@/lib/utils";
import type { Message } from "@/types/chat";

const featureCards = [
  { icon: <ImageIcon size={20} className="text-purple-300" />, tag: "Criar Imagem", title: "Gerador de Imagens", desc: "Crie imagens de alta qualidade instantaneamente a partir de texto." },
  { icon: <Presentation size={20} className="text-purple-300" />, tag: "Fazer Slides", title: "Apresentação IA", desc: "Transforme ideias em apresentações profissionais e envolventes." },
  { icon: <Code2 size={20} className="text-purple-300" />, tag: "Gerar Código", title: "Assistente Dev", desc: "Gere código limpo e pronto para produção em segundos." },
];

interface ChatMainProps {
  onMenuClick: () => void;
  activeChatId: string | null;
  onChatCreated: (id: string) => void;
}

export function ChatMain({ onMenuClick, activeChatId, onChatCreated }: ChatMainProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const createChat = useCreateChat();
  const sendMessage = useSendMessage(activeChatId ?? "");
  const { data: messagesData, isLoading: loadingMessages } = useChatMessages(activeChatId);

  const messages = messagesData?.data ?? [];
  const isPending = createChat.isPending || sendMessage.isPending;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit() {
    const prompt = input.trim();
    if (!prompt || isPending) return;
    setInput("");

    if (!activeChatId) {
      const res = await createChat.mutateAsync(prompt);
      onChatCreated(res.chat.id);
    } else {
      await sendMessage.mutateAsync(prompt);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex flex-col h-full bg-linear-to-b from-[#1a0a2e] via-[#2d1050] to-[#1a0a2e]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-3 border-b border-white/10 gap-2">
        <div className="flex items-center gap-2">
          <button onClick={onMenuClick} className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors">
            <Menu size={16} />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm transition-colors">
            <span>Gemini 2.5 Flash</span>
            <ChevronDown size={14} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm transition-colors">
            <Settings2 size={14} /><span>Configuração</span>
          </button>
          <button className="sm:hidden p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors">
            <Settings2 size={14} />
          </button>
          <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm transition-colors">
            <Upload size={14} /><span>Exportar</span>
          </button>
          <button className="sm:hidden p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors">
            <Upload size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        {!activeChatId ? (
          <WelcomeScreen onPillClick={(label) => setInput(label)} />
        ) : loadingMessages ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 size={24} className="text-purple-400 animate-spin" />
          </div>
        ) : (
          <MessageList messages={messages} />
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 sm:px-6 pb-4">
        <div className="w-full max-w-2xl mx-auto rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-start gap-2 px-3 sm:px-4 pt-3 pb-2">
            <Sparkles size={16} className="text-purple-400 mt-0.5 shrink-0" />
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte qualquer coisa..."
              rows={3}
              className="flex-1 bg-transparent text-white placeholder-white/30 text-sm resize-none outline-none"
            />
          </div>
          <div className="flex items-center justify-between px-3 sm:px-4 pb-3 gap-2">
            <div className="flex items-center gap-0.5 sm:gap-1">
              <ActionBtn icon={<Paperclip size={14} />} label="Anexar" />
              <ActionBtn icon={<Settings size={14} />} label="Definições" hideLabel />
              <ActionBtn icon={<LayoutGrid size={14} />} label="Opções" hideLabel />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                <Mic size={14} />
              </button>
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || isPending}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  input.trim() && !isPending
                    ? "bg-purple-600 hover:bg-purple-500 text-white"
                    : "bg-white/10 text-white/40 cursor-not-allowed"
                )}
              >
                {isPending ? <Loader2 size={14} className="animate-spin" /> : <ArrowUp size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function WelcomeScreen({ onPillClick }: { onPillClick: (label: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 sm:gap-6">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-br from-purple-500 via-blue-500 to-purple-800 shadow-[0_0_40px_rgba(139,92,246,0.5)]" />
      <h1 className="text-white text-xl sm:text-3xl font-semibold text-center px-4">
        Pronto para Criar Algo Novo?
      </h1>
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <QuickPill icon={<ImageIcon size={14} />} label="Criar Imagem" onClick={onPillClick} />
        <QuickPill icon={<Lightbulb size={14} />} label="Brainstorm" onClick={onPillClick} />
        <QuickPill icon={<FileText size={14} />} label="Fazer um plano" onClick={onPillClick} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-2xl">
        {featureCards.map((card) => (
          <div key={card.title} className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              {card.icon}
              <span className="text-[10px] text-white/60 bg-white/10 px-2 py-0.5 rounded-full">{card.tag}</span>
            </div>
            <p className="text-white text-sm font-medium mb-1">{card.title}</p>
            <p className="text-white/50 text-xs leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      {messages.map((msg) => (
        <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
          <div
            className={cn(
              "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
              msg.role === "user"
                ? "bg-purple-600 text-white rounded-br-sm"
                : "bg-white/10 text-white/90 rounded-bl-sm"
            )}
          >
            {msg.role === "assistant" ? (
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
                {msg.content}
              </ReactMarkdown>
            ) : (
              <p className="leading-relaxed">{msg.content}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function QuickPill({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: (l: string) => void }) {
  return (
    <button
      onClick={() => onClick(label)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white/80 text-xs transition-colors border border-white/10 whitespace-nowrap"
    >
      {icon}{label}
    </button>
  );
}

function ActionBtn({ icon, label, hideLabel }: { icon: React.ReactNode; label: string; hideLabel?: boolean }) {
  return (
    <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 text-xs transition-colors whitespace-nowrap">
      {icon}
      <span className={hideLabel ? "hidden sm:inline" : undefined}>{label}</span>
    </button>
  );
}
