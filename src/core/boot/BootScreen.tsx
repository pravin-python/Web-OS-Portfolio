import React, { useState, useEffect, useRef } from "react";

const BOOT_LINES = [
  "Initializing kernel...",
  "Loading AI modules...",
  "Mounting /home/dev...",
  "Starting session...",
];

export const BootScreen: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [booted, setBooted] = useState(() => {
    return sessionStorage.getItem("devos-booted") === "true";
  });
  const [fadingOut, setFadingOut] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [barDone, setBarDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (booted) return;

    // Show boot lines sequentially
    BOOT_LINES.forEach((_, i) => {
      const t = setTimeout(() => setVisibleLines(i + 1), 400 + i * 300);
      timerRef.current.push(t);
    });

    // Mark bar complete
    const barTimer = setTimeout(() => setBarDone(true), 2000);
    timerRef.current.push(barTimer);

    // Start fade out
    const fadeTimer = setTimeout(() => setFadingOut(true), 2400);
    timerRef.current.push(fadeTimer);

    // Complete boot
    const doneTimer = setTimeout(() => {
      sessionStorage.setItem("devos-booted", "true");
      setBooted(true);
    }, 2900);
    timerRef.current.push(doneTimer);

    const timers = timerRef.current;
    return () => timers.forEach(clearTimeout);
  }, [booted]);

  if (booted) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Boot screen overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          background: "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-system)",
          opacity: fadingOut ? 0 : 1,
          transition: "opacity 500ms ease-out",
        }}
      >
        {/* Logo — abstract circuit/brain SVG */}
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          style={{ marginBottom: 16 }}
        >
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="#3b8beb"
            strokeWidth="2"
            opacity="0.5"
          />
          <circle
            cx="32"
            cy="32"
            r="18"
            stroke="#3b8beb"
            strokeWidth="1.5"
            opacity="0.3"
          />
          {/* Brain-like paths */}
          <path
            d="M24 22 C24 18, 28 16, 32 16 C36 16, 40 18, 40 22"
            stroke="#3b8beb"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M22 32 C18 32, 18 26, 24 24"
            stroke="#3b8beb"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M42 32 C46 32, 46 26, 40 24"
            stroke="#3b8beb"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M24 42 C24 46, 28 48, 32 48 C36 48, 40 46, 40 42"
            stroke="#3b8beb"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M22 32 C18 32, 18 38, 24 40"
            stroke="#3b8beb"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M42 32 C46 32, 46 38, 40 40"
            stroke="#3b8beb"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Circuit nodes */}
          <circle cx="32" cy="26" r="2" fill="#3b8beb" />
          <circle cx="26" cy="32" r="2" fill="#3b8beb" />
          <circle cx="38" cy="32" r="2" fill="#3b8beb" />
          <circle cx="32" cy="38" r="2" fill="#3b8beb" />
          <circle cx="32" cy="32" r="3" fill="#3b8beb" opacity="0.8" />
          {/* Circuit lines */}
          <line
            x1="32"
            y1="26"
            x2="32"
            y2="32"
            stroke="#3b8beb"
            strokeWidth="1"
            opacity="0.5"
          />
          <line
            x1="26"
            y1="32"
            x2="32"
            y2="32"
            stroke="#3b8beb"
            strokeWidth="1"
            opacity="0.5"
          />
          <line
            x1="38"
            y1="32"
            x2="32"
            y2="32"
            stroke="#3b8beb"
            strokeWidth="1"
            opacity="0.5"
          />
          <line
            x1="32"
            y1="38"
            x2="32"
            y2="32"
            stroke="#3b8beb"
            strokeWidth="1"
            opacity="0.5"
          />
        </svg>

        {/* OS Name */}
        <div
          style={{
            fontSize: "var(--text-2xl)",
            fontWeight: 300,
            color: "#f0f0f5",
            letterSpacing: "0.05em",
            marginBottom: 4,
          }}
        >
          DevOS 1.0
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "var(--text-sm)",
            color: "#9999b0",
            marginBottom: 32,
          }}
        >
          AI &amp; Systems Portfolio
        </div>

        {/* Loading bar */}
        <div
          style={{
            width: 280,
            height: 3,
            background: "rgba(255,255,255,0.08)",
            borderRadius: 2,
            overflow: "hidden",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              height: "100%",
              background: "#3b8beb",
              borderRadius: 2,
              width: barDone ? "100%" : "0%",
              transition: "width 1.8s ease-out",
            }}
          />
        </div>

        {/* Boot log lines */}
        <div
          style={{
            fontFamily: "var(--font-terminal)",
            fontSize: "var(--text-xs)",
            color: "#55556a",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            minHeight: 80,
          }}
        >
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              style={{
                animation: "bootLineAppear 200ms ease-out both",
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
