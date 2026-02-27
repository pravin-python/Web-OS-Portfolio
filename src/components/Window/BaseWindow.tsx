import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { useWindowStore } from "../../core/state/useWindowStore";
import type { WindowInstance } from "../../core/state/useWindowStore";
import { useNavigate, useLocation } from "react-router-dom";
import { APP_REGISTRY } from "../../core/appRegistry";
import {
  VIRTUAL_WIDTH,
  VIRTUAL_HEIGHT,
} from "../../core/device/deviceDetector";
import { getScale } from "../../core/device/DesktopViewport";
import { isMobile } from "../../core/device/isMobile";
import { useDraggable } from "../../hooks/useDraggable";

interface BaseWindowProps {
  window: WindowInstance;
  children: React.ReactNode;
}

export const BaseWindow: React.FC<BaseWindowProps> = ({ window, children }) => {
  const {
    focusedWindowId,
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    updateWindowPosition,
    updateWindowSize,
  } = useWindowStore();

  const navigate = useNavigate();
  const location = useLocation();

  const [scale, setScale] = useState(getScale());
  const { handlePointerDown } = useDraggable(window.id);

  useEffect(() => {
    const handleResize = () => setScale(getScale());
    globalThis.window.addEventListener("resize", handleResize);
    globalThis.window.addEventListener("orientationchange", handleResize);
    return () => {
      globalThis.window.removeEventListener("resize", handleResize);
      globalThis.window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  const isFocused = focusedWindowId === window.id;

  const handleResizeStop = (
    _e: unknown,
    _direction: unknown,
    ref: HTMLElement,
    _delta: unknown,
    position: { x: number; y: number },
  ) => {
    updateWindowSize(window.id, {
      width: parseInt(ref.style.width, 10),
      height: parseInt(ref.style.height, 10),
    });
    updateWindowPosition(window.id, position);
  };

  const toggleMaximize = () => {
    if (window.isMaximized) {
      restoreWindow(window.id);
    } else {
      maximizeWindow(window.id);
    }
  };

  const handleClose = () => {
    closeWindow(window.id);
    const appDef = APP_REGISTRY[window.appType];
    if (appDef && location.pathname.startsWith(appDef.route)) {
      navigate("/os/desktop", { replace: true });
    }
  };

  const maxWidth = VIRTUAL_WIDTH;
  const maxHeight = VIRTUAL_HEIGHT - 28 - 76; // canvas minus menubar minus dock
  const isMobileView = isMobile();

  return (
    <Rnd
      scale={scale}
      size={
        window.isMaximized || isMobileView
          ? { width: maxWidth, height: maxHeight }
          : window.size
      }
      position={
        window.isMaximized || isMobileView ? { x: 0, y: 28 } : window.position
      }
      onResizeStop={handleResizeStop}
      disableDragging={isMobileView ? true : false}
      enableResizing={
        isMobileView ? false : !window.isMaximized && scale >= 0.65
      }
      minWidth={320}
      minHeight={200}
      bounds="parent"
      dragHandleClassName="window-titlebar"
      onMouseDown={() => focusWindow(window.id)}
      onTouchStart={() => focusWindow(window.id)}
      style={{
        zIndex: window.zIndex,
        display: window.isMinimized ? "none" : "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="window"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "var(--window-bg)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          border: "1px solid var(--window-border)",
          borderRadius: window.isMaximized ? 0 : 12,
          boxShadow: window.isMaximized ? "none" : "var(--shadow-window)",
          overflow: "hidden",
          opacity: isFocused ? 1 : 0.92,
          transition: "opacity 150ms ease",
          animation: "windowOpen 180ms ease-out both",
        }}
      >
        {/* ─── macOS Title Bar ─── */}
        <div
          className="window-titlebar"
          style={{
            height: 40,
            background: "var(--window-titlebar)",
            borderBottom: "1px solid var(--window-border)",
            display: "flex",
            alignItems: "center",
            padding: "0 var(--sp-4)",
            cursor: "grab",
            userSelect: "none",
            position: "relative",
            flexShrink: 0,
            touchAction: "none", // prevent browser native drag/scroll
          }}
          onPointerDown={handlePointerDown}
          onDoubleClick={toggleMaximize}
        >
          {/* Traffic Light Buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              zIndex: 1,
            }}
            className="traffic-lights"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onMouseEnter={(e) => {
              e.currentTarget
                .querySelectorAll<HTMLElement>(".tl-icon")
                .forEach((el) => (el.style.opacity = "1"));
            }}
            onMouseLeave={(e) => {
              e.currentTarget
                .querySelectorAll<HTMLElement>(".tl-icon")
                .forEach((el) => (el.style.opacity = "0"));
            }}
          >
            {/* Close */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: isFocused ? "var(--tl-close)" : "#555",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "box-shadow 150ms, background 150ms",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (isFocused) {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 0 6px var(--tl-close-hover)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
              aria-label="Close window"
            >
              <span
                className="tl-icon"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 100ms",
                  width: "100%",
                  height: "100%",
                }}
              >
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  stroke="rgba(0,0,0,0.7)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                >
                  <path d="M1.5 1.5L6.5 6.5" />
                  <path d="M1.5 6.5L6.5 1.5" />
                </svg>
              </span>
            </button>
            {/* Minimize */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                minimizeWindow(window.id);
              }}
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: isFocused ? "var(--tl-minimize)" : "#555",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "box-shadow 150ms, background 150ms",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (isFocused) {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 0 6px var(--tl-minimize-hover)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
              aria-label="Minimize window"
            >
              <span
                className="tl-icon"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 100ms",
                  width: "100%",
                  height: "100%",
                }}
              >
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  stroke="rgba(0,0,0,0.7)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M1.5 4H6.5" />
                </svg>
              </span>
            </button>
            {/* Maximize */}
            {!isMobileView && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMaximize();
                }}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: isFocused ? "var(--tl-maximize)" : "#555",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "box-shadow 150ms, background 150ms",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (isFocused) {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 0 6px var(--tl-maximize-hover)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
                aria-label="Maximize window"
              >
                <span
                  className="tl-icon"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 100ms",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {window.isMaximized ? (
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="rgba(0,0,0,0.7)"
                    >
                      <path d="M3.5 3.5 L1 3.5 L3.5 1 Z" />
                      <path d="M4.5 4.5 L7 4.5 L4.5 7 Z" />
                    </svg>
                  ) : (
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="rgba(0,0,0,0.7)"
                    >
                      <path d="M0.5 0.5 L3.5 0.5 L0.5 3.5 Z" />
                      <path d="M7.5 7.5 L4.5 7.5 L7.5 4.5 Z" />
                    </svg>
                  )}
                </span>
              </button>
            )}
          </div>

          {/* Centered Window Title */}
          <div
            style={{
              position: "absolute",
              left: 80,
              right: 80,
              textAlign: "center",
              fontSize: "var(--text-sm)",
              fontWeight: 500,
              color: isFocused
                ? "var(--text-primary)"
                : "var(--text-secondary)",
              pointerEvents: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {window.title}
          </div>
        </div>

        {/* ─── Window Content ─── */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            minWidth: 0,
            overflow: "auto",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            background: "rgba(20, 20, 28, 0.85)",
          }}
        >
          {children}
        </div>
      </div>
    </Rnd>
  );
};
