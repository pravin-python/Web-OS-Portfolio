import React, { useState } from "react";
import { CONTACT_METHODS } from "./contact.data";
import { EmailPanel } from "./EmailPanel";
import { TelegramBotPanel } from "./TelegramBotPanel";
import { SocialLinksPanel } from "./SocialLinksPanel";
import { QRSection } from "./QRSection";
import { CONTACT } from "./contact.data";
import { MessageSquare } from "lucide-react";
import { Icon } from "../../components/Icon";

/** Inline Telegram direct-chat panel */
const TelegramDirectPanel: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full p-6 space-y-6">
    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-500/20 to-blue-400/20 flex items-center justify-center">
      <MessageSquare className="w-10 h-10 text-sky-500" />
    </div>
    <div className="text-center space-y-1">
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
        Telegram Direct
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        @{CONTACT.telegram.username}
      </p>
    </div>
    <div className="w-full max-w-sm bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50">
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs text-slate-600 dark:text-slate-400">
          Usually replies within 24 hours
        </span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        Open a direct Telegram conversation. Preferred for quick discussions
        about projects, collaborations, or opportunities.
      </p>
    </div>
    <button
      onClick={() =>
        window.open(
          `https://t.me/${CONTACT.telegram.username}`,
          "_blank",
          "noopener",
        )
      }
      className="w-full max-w-sm py-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition-all active:scale-[0.98] shadow-sm flex items-center justify-center space-x-2"
    >
      <span>Open Telegram Chat</span>
    </button>
  </div>
);

/** Map method IDs to their panel components */
const PANEL_MAP: Record<string, React.FC> = {
  email: EmailPanel,
  telegram: TelegramDirectPanel,
  bot: TelegramBotPanel,
  social: SocialLinksPanel,
  qr: QRSection,
};

export const ContactCenter: React.FC = () => {
  const [activeId, setActiveId] = useState("email");
  const ActivePanel = PANEL_MAP[activeId] ?? EmailPanel;

  return (
    <div className="flex h-full w-full bg-white/30 dark:bg-slate-900/30 overflow-hidden select-none">
      {/* ─── Left Sidebar ─── */}
      <aside className="w-full md:w-52 shrink-0 bg-slate-50/80 dark:bg-slate-900/60 border-r border-slate-200/50 dark:border-slate-700/50 flex-col py-3 overflow-y-auto hidden md:flex">
        <div className="px-4 pb-3 border-b border-slate-200/50 dark:border-slate-700/50 mb-2">
          <h1 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
            Contact Center
          </h1>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            Choose a method
          </p>
        </div>
        {CONTACT_METHODS.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveId(m.id)}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 text-left transition-all ${
              activeId === m.id
                ? "bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500"
                : "hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
            }`}
          >
            <span className="shrink-0 flex items-center justify-center w-6">
              <Icon name={m.icon} size={22} />
            </span>
            <div className="min-w-0">
              <span className="text-xs font-semibold block truncate">
                {m.title}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">
                {m.description}
              </span>
            </div>
          </button>
        ))}
      </aside>

      {/* ─── Right Panel ─── */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <ActivePanel />
      </main>
    </div>
  );
};
