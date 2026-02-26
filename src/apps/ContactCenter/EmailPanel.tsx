import React, { useState } from "react";
import { Mail, Copy, ExternalLink, CheckCircle2 } from "lucide-react";
import { CONTACT } from "./contact.data";

export const EmailPanel: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = CONTACT.email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenMailClient = () => {
    const subject = encodeURIComponent("Portfolio Contact");
    const body = encodeURIComponent(
      "Hello Pravin,\n\nI came across your portfolio and would like to connect.\n\n",
    );
    window.open(
      `mailto:${CONTACT.email}?subject=${subject}&body=${body}`,
      "_self",
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 space-y-6">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
        <Mail className="w-10 h-10 text-blue-500" />
      </div>

      <div className="text-center space-y-1">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Email Contact
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Typically responds within 24 hours
        </p>
      </div>

      {/* Email display */}
      <div className="w-full max-w-sm bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 text-center">
        <span className="font-mono text-sm text-slate-700 dark:text-slate-300 select-all">
          {CONTACT.email}
        </span>
      </div>

      {/* Actions */}
      <div className="flex space-x-3 w-full max-w-sm">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all active:scale-[0.98]"
        >
          {copied ? (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span>{copied ? "Copied!" : "Copy Email"}</span>
        </button>
        <button
          onClick={handleOpenMailClient}
          className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all active:scale-[0.98] shadow-sm"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Open Mail Client</span>
        </button>
      </div>

      {/* Toast */}
      {copied && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg z-[20000] animate-bounce">
          ✓ Copied to clipboard
        </div>
      )}
    </div>
  );
};
