"use client";

import {
  Sparkles,
  Paperclip,
  Settings,
  LayoutGrid,
  Mic,
  ArrowUp,
  Image as ImageIcon,
  Presentation,
  Code2,
  ChevronDown,
  Upload,
  Settings2,
  Lightbulb,
  FileText,
} from "lucide-react";
import { useState } from "react";

const featureCards = [
  {
    icon: <ImageIcon size={20} className="text-purple-300" />,
    tag: "Create Image",
    title: "Image Generator",
    desc: "Create high-quality images instantly from text.",
  },
  {
    icon: <Presentation size={20} className="text-purple-300" />,
    tag: "Make Slides",
    title: "AI Presentation",
    desc: "Turn ideas into engaging, professional presentations.",
  },
  {
    icon: <Code2 size={20} className="text-purple-300" />,
    tag: "Generate Code",
    title: "Dev Assistant",
    desc: "Generate clean, production ready code in seconds.",
  },
];

export function ChatMain() {
  const [input, setInput] = useState("");

  return (
    <div className="flex flex-col h-full bg-linear-to-b from-[#1a0a2e] via-[#2d1050] to-[#1a0a2e]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10">
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm transition-colors">
          <span>ChatGPT v4.0</span>
          <ChevronDown size={14} />
        </button>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm transition-colors">
            <Settings2 size={14} />
            <span>Configuration</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm transition-colors">
            <Upload size={14} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6 overflow-y-auto">
        {/* Orb */}
        <div className="w-20 h-20 rounded-full bg-linear-to-br from-purple-500 via-blue-500 to-purple-800 shadow-[0_0_40px_rgba(139,92,246,0.5)]" />

        <h1 className="text-white text-3xl font-semibold text-center">
          Ready to Create Something New?
        </h1>

        {/* Quick action pills */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <QuickPill icon={<ImageIcon size={14} />} label="Create Image" />
          <QuickPill icon={<Lightbulb size={14} />} label="Brainstorm" />
          <QuickPill icon={<FileText size={14} />} label="Make a plan" />
        </div>

        {/* Input box */}
        <div className="w-full max-w-2xl rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-start gap-2 px-4 pt-4 pb-2">
            <Sparkles size={16} className="text-purple-400 mt-0.5 shrink-0" />
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Anything..."
              rows={3}
              className="flex-1 bg-transparent text-white placeholder-white/30 text-sm resize-none outline-none"
            />
          </div>
          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex items-center gap-1">
              <ActionBtn icon={<Paperclip size={14} />} label="Attach" />
              <ActionBtn icon={<Settings size={14} />} label="Settings" />
              <ActionBtn icon={<LayoutGrid size={14} />} label="Options" />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                <Mic size={14} />
              </button>
              <button
                className={`p-2 rounded-full transition-colors ${
                  input.trim()
                    ? "bg-purple-600 hover:bg-purple-500 text-white"
                    : "bg-white/10 text-white/40"
                }`}
              >
                <ArrowUp size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl pb-6">
          {featureCards.map((card) => (
            <div
              key={card.title}
              className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                {card.icon}
                <span className="text-[10px] text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
                  {card.tag}
                </span>
              </div>
              <p className="text-white text-sm font-medium mb-1">{card.title}</p>
              <p className="text-white/50 text-xs leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuickPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white/80 text-xs transition-colors border border-white/10">
      {icon}
      {label}
    </button>
  );
}

function ActionBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 text-xs transition-colors">
      {icon}
      {label}
    </button>
  );
}
