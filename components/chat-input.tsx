"use client";

import { useState } from "react";
import { Sparkles, Paperclip, Settings, LayoutGrid, Mic, ArrowUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSubmit: (prompt: string) => void | Promise<void>;
  isPending?: boolean;
}

export function ChatInput({ onSubmit, isPending }: ChatInputProps) {
  const [input, setInput] = useState("");

  async function handleSubmit() {
    const prompt = input.trim();
    if (!prompt || isPending) return;
    setInput("");
    await onSubmit(prompt);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
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
