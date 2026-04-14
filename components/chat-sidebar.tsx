"use client";

import {
  MessageSquarePlus,
  MessageSquare,
  Archive,
  BookOpen,
  Crown,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useChats } from "@/hooks/use-chats";
import type { Chat } from "@/types/chat";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onMobileClose: () => void;
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
}

export function ChatSidebar({
  collapsed,
  onToggle,
  onMobileClose,
  activeChatId,
  onSelectChat,
  onNewChat,
}: SidebarProps) {
  const { data, isLoading } = useChats();
  const chats = data?.data ?? [];

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-[#1a0f2e] border-r border-white/10 transition-all duration-300",
        "w-64 md:w-auto",
        collapsed ? "md:w-16" : "md:w-60"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <div className={cn("flex items-center gap-2", collapsed && "md:hidden")}>
          <div className="w-7 h-7 rounded-full bg-linear-to-br from-purple-400 to-blue-500 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">Z</span>
          </div>
          <span className="text-white font-semibold text-sm">Zyricon</span>
        </div>
        <button
          onClick={onToggle}
          className="hidden md:flex text-white/60 hover:text-white transition-colors ml-auto"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
        <button
          onClick={onMobileClose}
          className="md:hidden text-white/60 hover:text-white transition-colors ml-auto"
        >
          <X size={18} />
        </button>
      </div>

      {/* New Chat */}
      <div className="px-3 py-3">
        <button
          onClick={onNewChat}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm transition-colors"
        >
          <MessageSquarePlus size={16} className="shrink-0" />
          <span className={cn(collapsed && "md:hidden")}>Novo Chat</span>
        </button>
      </div>

      {/* Nav */}
      <div className={cn("px-3 mb-2", collapsed && "md:hidden")}>
        <p className="text-white/40 text-xs px-2 mb-1">Funcionalidades</p>
        <NavItem icon={<MessageSquare size={15} />} label="Chat" active />
        <NavItem icon={<Archive size={15} />} label="Arquivados" />
        <NavItem icon={<BookOpen size={15} />} label="Biblioteca" />
      </div>

      {/* Chat history */}
      <div className={cn("px-3 flex-1 overflow-y-auto", collapsed && "md:hidden")}>
        <p className="text-white/40 text-xs px-2 mb-1">Conversas</p>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 size={16} className="text-white/40 animate-spin" />
          </div>
        ) : chats.length === 0 ? (
          <p className="text-white/30 text-xs px-2 py-2">Nenhuma conversa ainda.</p>
        ) : (
          chats.map((chat) => (
            <ChatHistoryItem
              key={chat.id}
              chat={chat}
              active={chat.id === activeChatId}
              onClick={() => onSelectChat(chat.id)}
            />
          ))
        )}
      </div>

      {/* Upgrade */}
      <div className={cn("m-3 p-3 rounded-xl bg-white/5 border border-white/10 text-center", collapsed && "md:hidden")}>
        <Crown size={20} className="text-purple-400 mx-auto mb-1" />
        <p className="text-white text-xs font-semibold mb-1">Upgrade para premium</p>
        <p className="text-white/40 text-[10px] mb-2">
          Aumente a produtividade com automação e IA responsiva.
        </p>
        <button className="w-full py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition-colors">
          Fazer Upgrade
        </button>
      </div>
    </aside>
  );
}

function ChatHistoryItem({
  chat,
  active,
  onClick,
}: {
  chat: Chat;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-sm transition-colors text-left truncate",
        active ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
      )}
    >
      <MessageSquare size={13} className="shrink-0" />
      <span className="truncate text-xs">{chat.title}</span>
    </button>
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
        active ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
