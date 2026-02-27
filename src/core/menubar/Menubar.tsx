import React, { useState, useEffect } from "react";
import { useWindowStore } from "../state/useWindowStore";
import { APP_REGISTRY } from "../appRegistry";

export const Menubar: React.FC = () => {
  const focusedWindowId = useWindowStore((s) => s.focusedWindowId);
  const windows = useWindowStore((s) => s.windows);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Get active window title
  const activeWindow = windows.find((w) => w.id === focusedWindowId);
  const activeAppTitle = activeWindow
    ? APP_REGISTRY[activeWindow.appType]?.title || activeWindow.title
    : "Finder";

  const timeStr = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const dateStr = time.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        height: "var(--menubar-height)",
        background: "var(--menubar-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--menubar-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 12px",
        zIndex: 10000,
        fontFamily: "var(--font-system)",
        fontSize: "var(--text-sm)",
        color: "var(--text-primary)",
        userSelect: "none",
      }}
    >
      {/* ─── Left Section ─── */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Apple-style logo */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="currentColor"
          style={{ opacity: 0.9 }}
        >
          <path d="M7 0.5C3.41 0.5 0.5 3.41 0.5 7C0.5 10.59 3.41 13.5 7 13.5C10.59 13.5 13.5 10.59 13.5 7C13.5 3.41 10.59 0.5 7 0.5ZM7 3.5C7.55 3.5 8 3.95 8 4.5V6H9.5C10.05 6 10.5 6.45 10.5 7C10.5 7.55 10.05 8 9.5 8H8V9.5C8 10.05 7.55 10.5 7 10.5C6.45 10.5 6 10.05 6 9.5V8H4.5C3.95 8 3.5 7.55 3.5 7C3.5 6.45 3.95 6 4.5 6H6V4.5C6 3.95 6.45 3.5 7 3.5Z" />
        </svg>

        {/* OS Name */}
        <span style={{ fontWeight: 600, letterSpacing: "0.02em" }}>DevOS</span>

        {/* Active App Name */}
        <span style={{ fontWeight: 500, color: "var(--text-secondary)" }}>
          {activeAppTitle}
        </span>
      </div>

      {/* ─── Right Section ─── */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* WiFi icon */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.8 }}
        >
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <circle cx="12" cy="20" r="1" fill="currentColor" />
        </svg>

        {/* Battery */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            opacity: 0.8,
          }}
        >
          <svg
            width="20"
            height="10"
            viewBox="0 0 20 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <rect x="0.5" y="0.5" width="16" height="9" rx="2" />
            <rect
              x="2"
              y="2"
              width="11"
              height="6"
              rx="1"
              fill="var(--accent-green)"
              stroke="none"
            />
            <rect
              x="17"
              y="3"
              width="2.5"
              height="4"
              rx="0.5"
              fill="currentColor"
            />
          </svg>
          <span style={{ fontSize: 10, fontWeight: 400 }}>87%</span>
        </div>

        {/* Date & Time */}
        <span style={{ fontWeight: 400, fontSize: "var(--text-xs)" }}>
          {dateStr} {timeStr}
        </span>

        {/* User Monogram Pill */}
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            background:
              "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
            fontWeight: 600,
            color: "#fff",
            lineHeight: 1,
          }}
        >
          PP
        </div>
      </div>
    </div>
  );
};
