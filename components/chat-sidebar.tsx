"use client";

import {
  MessageSquarePlus,
  MessageSquare,
  Archive,
  BookOpen,
  FolderPlus,
  Folder,
  Crown,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const workspaces = ["Imagens", "Linux", "Docker"];

export function ChatSidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-[#1a0f2e] border-r border-white/10 transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-linear-to-br from-purple-400 to-blue-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">Z</span>
            </div>
            <span className="text-white font-semibold text-sm">Zyricon</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="text-white/60 hover:text-white transition-colors ml-auto"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* New Chat */}
      <div className="px-3 py-3">
        <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm transition-colors">
          <MessageSquarePlus size={16} />
          {!collapsed && <span>Novo Chat</span>}
        </button>
      </div>

      {/* Features */}
      {!collapsed && (
        <div className="px-3 mb-2">
          <p className="text-white/40 text-xs px-2 mb-1">Funcionalidades</p>
          <NavItem icon={<MessageSquare size={15} />} label="Chat" active />
          <NavItem icon={<Archive size={15} />} label="Arquivados" />
          <NavItem icon={<BookOpen size={15} />} label="Biblioteca" />
        </div>
      )}

      {/* Workspaces */}
      {!collapsed && (
        <div className="px-3 flex-1">
          <p className="text-white/40 text-xs px-2 mb-1">Espaços de Trabalho</p>
          <NavItem icon={<FolderPlus size={15} />} label="Novo Projeto" />
          {workspaces.map((w, i) => (
            <NavItem key={i} icon={<Folder size={15} />} label={w} />
          ))}
        </div>
      )}

      {/* Upgrade */}
      {!collapsed && (
        <div className="m-3 p-3 rounded-xl bg-white/5 border border-white/10 text-center">
          <Crown size={20} className="text-purple-400 mx-auto mb-1" />
          <p className="text-white text-xs font-semibold mb-1">Upgrade para premium</p>
          <p className="text-white/40 text-[10px] mb-2">
            Aumente a produtividade com automação e IA responsiva adaptada às suas necessidades.
          </p>
          <button className="w-full py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition-colors">
            Fazer Upgrade
          </button>
        </div>
      )}
    </aside>
  );
}

function NavItem({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={cn(
        "flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-sm transition-colors",
        active
          ? "bg-white/10 text-white"
          : "text-white/60 hover:text-white hover:bg-white/5"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
