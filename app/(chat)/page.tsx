"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon, Presentation, Code2, Lightbulb, FileText } from "lucide-react";
import { useCreateChat } from "@/hooks/use-chats";
import { ChatInput } from "@/components/chat-input";
import { ChatThread } from "@/components/chat-thread";
import type { Message } from "@/types/chat";

interface FeatureCard {
  tag: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

interface QuickPill {
  label: string;
  icon: React.ReactNode;
}

export default function WelcomePage() {
  const router = useRouter();
  const createChat = useCreateChat();
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);

  const hasSent = optimisticMessages.length > 0;

  const featureCards: FeatureCard[] = [
    {
      icon: <ImageIcon size={20} className="text-purple-300" />,
      tag: "Criar Imagem",
      title: "Gerador de Imagens",
      desc: "Crie imagens de alta qualidade instantaneamente a partir de texto.",
    },
    {
      icon: <Presentation size={20} className="text-purple-300" />,
      tag: "Fazer Slides",
      title: "Apresentação IA",
      desc: "Transforme ideias em apresentações profissionais e envolventes.",
    },
    {
      icon: <Code2 size={20} className="text-purple-300" />,
      tag: "Gerar Código",
      title: "Assistente Dev",
      desc: "Gere código limpo e pronto para produção em segundos.",
    },
  ];

  const quickPills: QuickPill[] = [
    { icon: <ImageIcon size={14} />, label: "Criar Imagem" },
    { icon: <Lightbulb size={14} />, label: "Brainstorm" },
    { icon: <FileText size={14} />, label: "Fazer um plano" },
  ];

  async function handleSubmit(prompt: string) {
    setOptimisticMessages([
      {
        id: "opt-user",
        chatId: "",
        role: "user",
        content: prompt,
        createdAt: new Date().toISOString(),
      },
      {
        id: "opt-assistant",
        chatId: "",
        role: "assistant",
        content: "...",
        createdAt: new Date().toISOString(),
      },
    ]);

    try {
      const { chat } = await createChat.mutateAsync(prompt);
      router.push(`/chat/${chat.id}`);
    } catch {
      setOptimisticMessages((prev) =>
        prev.map((m) => ({ ...m, id: m.id.replace("opt-", "failed-") }))
      );
    }
  }

  function handleRetry(prompt: string) {
    setOptimisticMessages([]);
    handleSubmit(prompt);
  }

  return (
    <div className="flex flex-col h-full bg-linear-to-b from-[#1a0a2e] via-[#2d1050] to-[#1a0a2e]">
      {hasSent ? (
        /* Após enviar: thread ocupa tudo + input fixo em baixo */
        <>
          <div className="flex-1 overflow-y-auto">
            <ChatThread messages={optimisticMessages} onRetry={handleRetry} />
          </div>
          <div className="px-4 sm:px-6 pb-4 shrink-0">
            <ChatInput onSubmit={handleSubmit} isPending={createChat.isPending} />
          </div>
        </>
      ) : (
        /* Welcome: tudo centrado verticalmente num bloco coeso */
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 overflow-y-auto">
          <div className="flex flex-col items-center gap-4 w-full max-w-2xl">
            {/* Orb + título + pills */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-linear-to-br from-purple-500 via-blue-500 to-purple-800 shadow-[0_0_40px_rgba(139,92,246,0.5)] animate-pulse" />
            <h1 className="text-white text-xl sm:text-2xl font-semibold text-center">
              Pronto para Criar Algo Novo?
            </h1>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {quickPills.map(({ icon, label }) => (
                <button
                  key={label}
                  onClick={() => handleSubmit(label)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white/80 text-xs transition-colors border border-white/10 whitespace-nowrap"
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>

            {/* Input */}
            <ChatInput onSubmit={handleSubmit} isPending={createChat.isPending} />

            {/* Cards de sugestão */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              {featureCards.map((card) => (
                <button
                  key={card.title}
                  onClick={() => handleSubmit(card.title)}
                  className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-colors text-left"
                >
                  <div className="flex items-center justify-between mb-3">
                    {card.icon}
                    <span className="text-[10px] text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
                      {card.tag}
                    </span>
                  </div>
                  <p className="text-white text-sm font-medium mb-1">{card.title}</p>
                  <p className="text-white/50 text-xs leading-relaxed">{card.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
