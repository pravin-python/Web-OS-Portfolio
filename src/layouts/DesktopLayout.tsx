import React from 'react';
import { Desktop } from '../core/desktop/Desktop';
import { Taskbar } from '../core/taskbar/Taskbar';
import { WindowManager } from '../core/windowManager/WindowManager';
import { ContextMenuOverlay } from '../core/contextMenu/ContextMenuOverlay';
import { OSRouter } from '../router/OSRouter';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { OrientationGuard } from '../core/device/OrientationGuard';
import { DesktopViewport } from '../core/device/DesktopViewport';

export const DesktopLayout: React.FC = () => {
  useDocumentTitle();

    return (
        <OrientationGuard>
            <DesktopViewport>
                <div className="relative w-screen h-screen overflow-hidden bg-black text-slate-800 dark:text-slate-100">
                    {/* URL-to-Window bridge — renders nothing, just listens to routes */}
                    <OSRouter />
                    <Desktop />
                    <WindowManager />
                    <Taskbar />
                    <ContextMenuOverlay />
                </div>
            </DesktopViewport>
        </OrientationGuard>
    );
};
