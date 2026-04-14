"use client";

import { ChevronDown, Settings2, Upload, Menu } from "lucide-react";

interface ChatHeaderProps {
  onMenuClick: () => void;
}

export function ChatHeader({ onMenuClick }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between px-3 sm:px-6 py-3 border-b border-white/10 bg-[#1a0a2e] shrink-0 gap-2">
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors"
        >
          <Menu size={16} />
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm transition-colors">
          <span>Gemini 2.5 Flash</span>
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm transition-colors">
          <Settings2 size={14} />
          <span>Configuração</span>
        </button>
        <button className="sm:hidden p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors">
          <Settings2 size={14} />
        </button>

        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm transition-colors">
          <Upload size={14} />
          <span>Exportar</span>
        </button>
        <button className="sm:hidden p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors">
          <Upload size={14} />
        </button>
      </div>
    </header>
  );
}
