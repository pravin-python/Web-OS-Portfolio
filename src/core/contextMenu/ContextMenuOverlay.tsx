import React, { useEffect, useRef } from "react";
import { useDesktopStore } from "../state/useDesktopStore";

export const ContextMenuOverlay: React.FC = () => {
  const { contextMenu, closeContextMenu } = useDesktopStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeContextMenu();
      }
    };

    if (contextMenu.isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Optional: Prevent default context menu globally when our menu is open
      const handleGlobalContext = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
          closeContextMenu();
        }
      };
      document.addEventListener("contextmenu", handleGlobalContext);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("contextmenu", handleGlobalContext);
      };
    }
  }, [contextMenu.isOpen, closeContextMenu]);

  if (!contextMenu.isOpen) return null;

  // Keep menu inside viewport
  let x = contextMenu.x;
  let y = contextMenu.y;

  // Approximate width/height of context menu to adjust boundaries.
  // For a more robust solution, use layout effects, but this suffices for base implementation.
  if (x + 200 > window.innerWidth) x = window.innerWidth - 200;
  if (y + 300 > window.innerHeight) y = window.innerHeight - 300;

  return (
    <div
      ref={menuRef}
      className="absolute z-[10000] w-48 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-md shadow-2xl border border-slate-200 dark:border-slate-700 py-1 text-sm select-none"
      style={{ left: x, top: y }}
    >
      {contextMenu.items.map((item, index) => {
        if (item.divider) {
          return (
            <div
              key={index}
              className="h-px bg-slate-200 dark:bg-slate-700 my-1"
            />
          );
        }
        return (
          <button
            key={index}
            className="w-full text-left px-4 py-1.5 hover:bg-blue-500 hover:text-white dark:text-slate-200 dark:hover:bg-blue-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              item.action();
              closeContextMenu();
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
