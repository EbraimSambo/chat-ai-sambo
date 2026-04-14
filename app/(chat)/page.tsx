"use client";

import { useRouter } from "next/navigation";
import { Image as ImageIcon, Presentation, Code2, Lightbulb, FileText } from "lucide-react";
import { useCreateChat } from "@/hooks/use-chats";
import { ChatInput } from "@/components/chat-input";

const featureCards = [
  { icon: <ImageIcon size={20} className="text-purple-300" />, tag: "Criar Imagem", title: "Gerador de Imagens", desc: "Crie imagens de alta qualidade instantaneamente a partir de texto." },
  { icon: <Presentation size={20} className="text-purple-300" />, tag: "Fazer Slides", title: "Apresentação IA", desc: "Transforme ideias em apresentações profissionais e envolventes." },
  { icon: <Code2 size={20} className="text-purple-300" />, tag: "Gerar Código", title: "Assistente Dev", desc: "Gere código limpo e pronto para produção em segundos." },
];

export default function WelcomePage() {
  const router = useRouter();
  const createChat = useCreateChat();

  async function handleSubmit(prompt: string) {
    const { chat } = await createChat.mutateAsync(prompt);
    router.push(`/chat/${chat.id}`);
  }

  return (
    <div className="flex flex-col h-full bg-linear-to-b from-[#1a0a2e] via-[#2d1050] to-[#1a0a2e]">
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 gap-4 sm:gap-6 overflow-y-auto py-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-br from-purple-500 via-blue-500 to-purple-800 shadow-[0_0_40px_rgba(139,92,246,0.5)]" />

        <h1 className="text-white text-xl sm:text-3xl font-semibold text-center px-4">
          Pronto para Criar Algo Novo?
        </h1>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          {[
            { icon: <ImageIcon size={14} />, label: "Criar Imagem" },
            { icon: <Lightbulb size={14} />, label: "Brainstorm" },
            { icon: <FileText size={14} />, label: "Fazer um plano" },
          ].map(({ icon, label }) => (
            <button
              key={label}
              onClick={() => handleSubmit(label)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white/80 text-xs transition-colors border border-white/10 whitespace-nowrap"
            >
              {icon}{label}
            </button>
          ))}
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

      <div className="px-4 sm:px-6 pb-4">
        <ChatInput onSubmit={handleSubmit} isPending={createChat.isPending} />
      </div>
    </div>
  );
}
