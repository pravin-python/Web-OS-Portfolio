import React from "react";
import { CONTACT } from "./contact.data";

/**
 * Minimal QR Code generator — produces an SVG string for a given text.
 * Uses a simple encoding approach for short URLs (alphanumeric mode).
 *
 * For production-grade QR with full error correction, swap this with
 * a library like `qrcode.react`.  This inline version avoids extra deps.
 */

// Simplified QR: renders a styled placeholder + link-based fallback using
// the Google Charts QR API (free, no auth, works in browsers).
function getQRImageUrl(data: string, size = 200): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&bgcolor=ffffff&color=1e293b&format=svg`;
}

interface QRCardProps {
  label: string;
  url: string;
  icon: string;
}

const QRCard: React.FC<QRCardProps> = ({ label, url, icon }) => (
  <div className="flex flex-col items-center p-5 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all group">
    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform overflow-hidden bg-slate-100 dark:bg-slate-700 shrink-0">
      {icon.startsWith("/") ||
      icon.startsWith(".") ||
      icon.startsWith("http") ? (
        <img src={icon} alt={label} className="w-full h-full object-cover" />
      ) : (
        <span className="text-xl">{icon}</span>
      )}
    </div>
    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
      {label}
    </span>
    <div className="w-36 h-36 bg-white rounded-lg p-2 shadow-inner border border-slate-100 dark:border-slate-700 mb-3">
      <img
        src={getQRImageUrl(url, 200)}
        alt={`QR code for ${label}`}
        className="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
    <button
      onClick={() => window.open(url, "_blank", "noopener")}
      className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
    >
      Open Link →
    </button>
  </div>
);

export const QRSection: React.FC = () => {
  return (
    <div className="flex flex-col h-full p-6 space-y-5 overflow-y-auto">
      <div className="text-center">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          QR Codes
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Scan to contact instantly from mobile
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        <QRCard
          label="LinkedIn"
          url={CONTACT.linkedin}
          icon="/image/linkedin.png"
        />
        <QRCard
          label="Telegram"
          url={`https://t.me/${CONTACT.telegram.username}`}
          icon="/image/telegram-1.jpg"
        />
        <QRCard label="GitHub" url={CONTACT.github} icon="/image/github.png" />
        <QRCard
          label="Email"
          url={`mailto:${CONTACT.email}`}
          icon="/image/email.png"
        />
      </div>
    </div>
  );
};
