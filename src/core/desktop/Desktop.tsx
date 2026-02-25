import React, { useRef } from "react";
import { useDesktopStore } from "../state/useDesktopStore";
import { useNavigate } from "react-router-dom";
import { getDesktopApps } from "../appRegistry";
import { launchApp } from "../appLauncher";
import { twMerge } from "tailwind-merge";
import { Icon } from "../../components/Icon";

export const Desktop: React.FC = () => {
  const { wallpaper, openContextMenu, closeContextMenu, clearSelection } =
    useDesktopStore();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openContextMenu(e.clientX, e.clientY, [
      { label: "View", action: () => console.log("View") },
      { label: "Sort by", action: () => console.log("Sort by") },
      { label: "Refresh", action: () => window.location.reload() },
      { divider: true },
      {
        label: "Personalize",
        action: () => launchApp("settings", undefined, navigate),
      },
    ]);
  };

  const handlePointerDown = () => {
    closeContextMenu();
    clearSelection();
  };

  // Get apps from the registry instead of hardcoded list
  const desktopApps = getDesktopApps();

  return (
    <div
      ref={containerRef}
      role="main"
      aria-label="Desktop — Pravin Prajapati Interactive Portfolio"
      className={twMerge(
        "absolute inset-0 p-4 flex flex-col items-start content-start flex-wrap gap-4 overflow-hidden",
        !wallpaper ? "bg-gradient-to-br from-[#008080] to-[#004040]" : "",
      )}
      style={
        wallpaper
          ? {
              backgroundImage: `url(${wallpaper})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}
      }
      onContextMenu={handleContextMenu}
      onPointerDown={handlePointerDown}
    >
      {desktopApps.map((app) => (
        <div
          key={app.key}
          className="w-20 group flex flex-col items-center justify-center p-2 rounded-lg hover:bg-white/20 active:bg-blue-500/40 transition-colors cursor-pointer select-none"
          role="button"
          aria-label={`Open ${app.title}`}
          title={`Open ${app.title}`}
          tabIndex={0}
          onDoubleClick={(e) => {
            e.stopPropagation();
            launchApp(app.key, undefined, navigate);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") launchApp(app.key, undefined, navigate);
          }}
        >
          <div
            className="drop-shadow-lg mb-1 group-hover:scale-110 transition-transform pointer-events-none"
            aria-hidden="true"
          >
            <Icon name={app.icon} size={48} />
          </div>
          <span className="text-white text-xs text-center drop-shadow-md font-medium leading-tight line-clamp-2 pointer-events-none">
            {app.title}
          </span>
        </div>
      ))}
    </div>
  );
};
