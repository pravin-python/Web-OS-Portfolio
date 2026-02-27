import React, { useState, useCallback } from "react";
import { useWindowStore } from "../state/useWindowStore";
import { useNavigate } from "react-router-dom";
import { launchApp } from "../appLauncher";
import { Icon } from "../../components/Icon";
import { APP_REGISTRY } from "../appRegistry";
import { isMobile } from "../device/isMobile";

const PINNED_DOCK_APPS = [
  { id: "terminal", icon: "system/terminal", label: "Terminal" },
  { id: "modelLogs", icon: "apps/model-logs", label: "AI Lab" },
  { id: "securityToolkit", icon: "system/security", label: "Security" },
  { id: "snake", icon: "apps/snake", label: "Games" },
  { id: "aboutProfile", icon: "system/about", label: "About" },
];

export const Dock: React.FC = () => {
  const navigate = useNavigate();
  const windows = useWindowStore((s) => s.windows);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const restoreWindow = useWindowStore((s) => s.restoreWindow);
  const [bouncingApp, setBouncingApp] = useState<string | null>(null);

  // Compute dynamic dock apps
  const openWindowTypes = windows.map((w) => w.appType);

  const dockApps = PINNED_DOCK_APPS.map((app) => ({
    ...app,
    isOpen: openWindowTypes.includes(app.id),
    pinned: true,
  }));

  // Add any open windows NOT in pinned list
  windows.forEach((win) => {
    const alreadyInDock = dockApps.find((d) => d.id === win.appType);
    if (!alreadyInDock) {
      dockApps.push({
        id: win.appType,
        label: win.title,
        icon: APP_REGISTRY[win.appType]?.icon || "system/app",
        isOpen: true,
        pinned: false,
      });
    }
  });

  const handleClick = useCallback(
    (appKey: string) => {
      const existingWindow = windows.find((w) => w.appType === appKey);
      if (!existingWindow) {
        // Bounce animation + open
        setBouncingApp(appKey);
        setTimeout(() => setBouncingApp(null), 600);
        launchApp(appKey, undefined, navigate);
      } else if (existingWindow.isMinimized) {
        restoreWindow(existingWindow.id);
      } else {
        focusWindow(existingWindow.id);
      }
    },
    [windows, focusWindow, restoreWindow, navigate],
  );

  return (
    <div
      className="dock"
      style={{
        position: "fixed",
        bottom: 8,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "flex-end",
        gap: 6,
        padding: "8px 12px",
        background: "var(--dock-bg)",
        border: "1px solid var(--dock-border)",
        borderRadius: 18,
        backdropFilter: "blur(24px) saturate(160%)",
        WebkitBackdropFilter: "blur(24px) saturate(160%)",
        boxShadow: "var(--shadow-dock)",
        zIndex: 9999,
      }}
    >
      {dockApps.map((app) => {
        const isBouncing = bouncingApp === app.id;

        return (
          <div
            key={app.id}
            data-dock-app={app.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            <button
              onClick={() => handleClick(app.id)}
              aria-label={`Open ${app.label}`}
              title={app.label}
              style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                cursor: "pointer",
                border: "none",
                background: "transparent",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 200ms cubic-bezier(.34,1.56,.64,1)",
                animation: isBouncing
                  ? "dockBounce 600ms ease-in-out"
                  : undefined,
              }}
              onMouseEnter={(e) => {
                if (!isMobile()) {
                  (e.currentTarget as HTMLElement).style.transform =
                    "scale(1.38) translateY(-8px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile()) {
                  (e.currentTarget as HTMLElement).style.transform =
                    "scale(1) translateY(0)";
                }
              }}
            >
              <Icon name={app.icon} size={42} />
            </button>

            {/* Active indicator dot */}
            {app.isOpen && (
              <div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "var(--accent-blue)",
                  position: "absolute",
                  bottom: -6,
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
