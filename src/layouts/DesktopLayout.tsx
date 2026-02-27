import React from "react";
import { Desktop } from "../core/desktop/Desktop";
import { WindowManager } from "../core/windowManager/WindowManager";
import { ContextMenuOverlay } from "../core/contextMenu/ContextMenuOverlay";
import { OSRouter } from "../router/OSRouter";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { OrientationGuard } from "../core/device/OrientationGuard";
import { DesktopViewport } from "../core/device/DesktopViewport";
import { BootScreen } from "../core/boot/BootScreen";
import { Menubar } from "../core/menubar/Menubar";
import { Dock } from "../core/dock/Dock";

export const DesktopLayout: React.FC = () => {
  useDocumentTitle();

  return (
    <BootScreen>
      <OrientationGuard>
        <DesktopViewport>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              overflow: "hidden",
              background: "#0d0d1a",
              color: "var(--text-primary)",
            }}
          >
            {/* URL-to-Window bridge — renders nothing, just listens to routes */}
            <OSRouter />
            <Desktop />
            <WindowManager />
            <Menubar />
            <Dock />
            <ContextMenuOverlay />
          </div>
        </DesktopViewport>
      </OrientationGuard>
    </BootScreen>
  );
};
