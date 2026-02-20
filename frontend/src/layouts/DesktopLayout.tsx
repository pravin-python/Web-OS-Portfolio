import React from 'react';
import { Desktop } from '../core/desktop/Desktop';
import { Taskbar } from '../core/taskbar/Taskbar';
import { WindowManager } from '../core/windowManager/WindowManager';
import { ContextMenuOverlay } from '../core/contextMenu/ContextMenuOverlay';

export const DesktopLayout: React.FC = () => {
    return (
        <div className="relative w-screen h-screen overflow-hidden bg-black text-slate-800 dark:text-slate-100">
            <Desktop />
            <WindowManager />
            <Taskbar />
            <ContextMenuOverlay />
        </div>
    );
};
