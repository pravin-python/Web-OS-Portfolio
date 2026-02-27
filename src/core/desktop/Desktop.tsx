import React, { useRef, useCallback } from "react";
import { useDesktopStore, WALLPAPER_PRESETS } from "../state/useDesktopStore";
import { useNavigate } from "react-router-dom";
import { getDesktopApps } from "../appRegistry";
import { launchApp } from "../appLauncher";
import { Icon } from "../../components/Icon";
import { isTouchDevice } from "../device/deviceDetector";

export const Desktop: React.FC = () => {
  const {
    wallpaperIndex,
    openContextMenu,
    closeContextMenu,
    clearSelection,
    cycleWallpaper,
  } = useDesktopStore();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const isTouch = isTouchDevice();

  // Long-press state for context menu on touch
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressFired = useRef(false);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openContextMenu(e.clientX, e.clientY, [
      {
        label: "New Note",
        action: () => launchApp("notepad", undefined, navigate),
      },
      { label: "Change Wallpaper", action: () => cycleWallpaper() },
      {
        label: "About DevOS",
        action: () => launchApp("aboutProfile", undefined, navigate),
      },
      { divider: true },
      { label: "Refresh", action: () => window.location.reload() },
    ]);
  };

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      closeContextMenu();
      clearSelection();

      if (isTouch) {
        longPressFired.current = false;
        longPressTimer.current = setTimeout(() => {
          longPressFired.current = true;
          openContextMenu(e.clientX, e.clientY, [
            {
              label: "New Note",
              action: () => launchApp("notepad", undefined, navigate),
            },
            { label: "Change Wallpaper", action: () => cycleWallpaper() },
            {
              label: "About DevOS",
              action: () => launchApp("aboutProfile", undefined, navigate),
            },
            { divider: true },
            { label: "Refresh", action: () => window.location.reload() },
          ]);
        }, 500);
      }
    },
    [
      isTouch,
      closeContextMenu,
      clearSelection,
      openContextMenu,
      navigate,
      cycleWallpaper,
    ],
  );

  const handlePointerUp = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const desktopApps = getDesktopApps();
  const currentWallpaper =
    WALLPAPER_PRESETS[wallpaperIndex] || WALLPAPER_PRESETS[0];

  return (
    <div
      ref={containerRef}
      role="main"
      aria-label="Desktop — Pravin Prajapati Interactive Portfolio"
      style={{
        position: "absolute",
        inset: 0,
        background: currentWallpaper,
        overflow: "hidden",
      }}
      onContextMenu={handleContextMenu}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* ─── Animated Floating Orbs ─── */}
      <div
        className="desktop-orb"
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,139,235,0.12) 0%, transparent 70%)",
          top: "15%",
          left: "20%",
          animation: "orbFloat1 20s ease-in-out infinite",
          pointerEvents: "none",
          filter: "blur(40px)",
        }}
      />
      <div
        className="desktop-orb"
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(191,90,242,0.10) 0%, transparent 70%)",
          top: "50%",
          right: "15%",
          animation: "orbFloat2 25s ease-in-out infinite",
          pointerEvents: "none",
          filter: "blur(50px)",
        }}
      />
      <div
        className="desktop-orb"
        style={{
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(48,209,88,0.08) 0%, transparent 70%)",
          bottom: "20%",
          left: "40%",
          animation: "orbFloat3 18s ease-in-out infinite",
          pointerEvents: "none",
          filter: "blur(45px)",
        }}
      />

      {/* ─── Desktop overlay ─── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--desktop-overlay)",
          pointerEvents: "none",
        }}
      />

      {/* ─── Desktop Icons — CSS Auto-Fill Grid ─── */}
      <div
        className="desktop-icon-grid"
        style={{
          position: "absolute",
          top: 28 /* below menubar */,
          left: 0,
          right: 0,
        }}
      >
        {desktopApps.map((app) => (
          <div
            key={app.key}
            style={{
              width: 80,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--sp-1)",
              padding: "var(--sp-2)",
              borderRadius: 8,
              cursor: "pointer",
              userSelect: "none",
              transition: "background 100ms",
            }}
            role="button"
            aria-label={`Open ${app.title}`}
            title={`Open ${app.title}`}
            tabIndex={0}
            onClick={
              isTouch
                ? (e) => {
                    e.stopPropagation();
                    if (!longPressFired.current) {
                      launchApp(app.key, undefined, navigate);
                    }
                  }
                : undefined
            }
            onDoubleClick={
              !isTouch
                ? (e) => {
                    e.stopPropagation();
                    launchApp(app.key, undefined, navigate);
                  }
                : undefined
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") launchApp(app.key, undefined, navigate);
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))",
                pointerEvents: "none",
              }}
            >
              <Icon name={app.icon} size={48} />
            </div>
            <span
              style={{
                fontFamily: "var(--font-system)",
                fontWeight: 500,
                fontSize: "var(--text-xs)",
                color: "var(--text-primary)",
                textAlign: "center",
                textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                lineHeight: 1.3,
                maxWidth: 76,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                pointerEvents: "none",
              }}
            >
              {app.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
