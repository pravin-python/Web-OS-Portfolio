import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { useWindowStore } from "../../core/state/useWindowStore";
import type { WindowInstance } from "../../core/state/useWindowStore";
import { X, Minus, Square, Copy } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useNavigate, useLocation } from "react-router-dom";
import { APP_REGISTRY } from "../../core/appRegistry";
import { Icon } from "../Icon";

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

  const [viewportSize, setViewportSize] = useState({
    width:
      typeof globalThis.window !== "undefined"
        ? globalThis.window.innerWidth
        : 1920,
    height:
      typeof globalThis.window !== "undefined"
        ? globalThis.window.innerHeight
        : 1080,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: globalThis.window.innerWidth,
        height: globalThis.window.innerHeight,
      });
    };
    globalThis.window.addEventListener("resize", handleResize);
    return () => globalThis.window.removeEventListener("resize", handleResize);
  }, []);

  const isFocused = focusedWindowId === window.id;

  if (window.isMinimized) {
    return null; // Don't render if minimized
  }

  const handleDragStop = (_e: any, d: { x: number; y: number }) => {
    updateWindowPosition(window.id, { x: d.x, y: d.y });
  };

  const handleResizeStop = (
    _e: any,
    _direction: any,
    ref: any,
    _delta: any,
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

    // If the URL matches the app we're closing, redirect to desktop
    const appDef = APP_REGISTRY[window.appType];
    if (appDef && location.pathname.startsWith(appDef.route)) {
      navigate("/os/desktop", { replace: true });
    }
  };

  // Compute actual pixel dimensions for maximized state
  const maxWidth = viewportSize.width;
  const maxHeight = viewportSize.height - 48; // Taskbar height is 48px

  return (
    <Rnd
      size={
        window.isMaximized
          ? { width: maxWidth, height: maxHeight }
          : window.size
      }
      position={window.isMaximized ? { x: 0, y: 0 } : window.position}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      disableDragging={window.isMaximized}
      enableResizing={!window.isMaximized}
      minWidth={300}
      minHeight={200}
      bounds="parent"
      dragHandleClassName="window-titlebar"
      onMouseDown={() => focusWindow(window.id)}
      className={twMerge(
        "absolute overflow-hidden flex flex-col rounded-xl border border-white/20 shadow-2xl transition-all duration-200",
        window.isMaximized ? "rounded-none border-none" : "",
        isFocused
          ? "ring-2 ring-blue-500/50"
          : "ring-1 ring-black/5 opacity-95",
        window.isMaximized && "transition-none",
      )}
      style={{
        zIndex: window.zIndex,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      {/* Glassmorphism Background layer */}
      <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/60 backdrop-blur-3xl -z-10" />

      {/* Header bar */}
      <div
        className={twMerge(
          "window-titlebar flex items-center justify-between px-3 py-2 cursor-grab active:cursor-grabbing border-b border-white/10 select-none",
          isFocused
            ? "bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white"
            : "bg-gradient-to-r from-slate-400/50 to-slate-500/50 text-slate-800 dark:text-slate-300",
        )}
        onDoubleClick={toggleMaximize}
      >
        <div className="flex items-center space-x-2">
          {APP_REGISTRY[window.appType]?.icon && (
            <Icon name={APP_REGISTRY[window.appType].icon} size={16} />
          )}
          <span className="font-semibold text-sm drop-shadow-sm">
            {window.title}
          </span>
        </div>

        {/* Window Controls */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => minimizeWindow(window.id)}
            className="p-1 hover:bg-white/20 rounded-md transition-colors"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={toggleMaximize}
            className="p-1 hover:bg-white/20 rounded-md transition-colors"
          >
            {window.isMaximized ? <Copy size={14} /> : <Square size={14} />}
          </button>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-red-500 hover:text-white rounded-md transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 min-w-0 overflow-auto relative bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex flex-col w-full">
        {children}
      </div>
    </Rnd>
  );
};
