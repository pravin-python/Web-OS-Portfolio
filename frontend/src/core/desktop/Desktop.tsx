import React, { useRef } from 'react';
import { useDesktopStore } from '../state/useDesktopStore';
import { useWindowStore } from '../state/useWindowStore';
import { twMerge } from 'tailwind-merge';

export const Desktop: React.FC = () => {
    const { wallpaper, openContextMenu, closeContextMenu, clearSelection } = useDesktopStore();
    const openWindow = useWindowStore(state => state.openWindow);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        openContextMenu(e.clientX, e.clientY, [
            { label: 'View', action: () => console.log('View') },
            { label: 'Sort by', action: () => console.log('Sort by') },
            { label: 'Refresh', action: () => console.log('Refresh') },
            { divider: true },
            { label: 'Personalize', action: () => openWindow('Settings', 'settings') },
        ]);
    };

    const handlePointerDown = () => {
        closeContextMenu();
        clearSelection();
    };

    // Mock icons for the desktop
    const desktopApps = [
        { id: '1', title: 'File Explorer', type: 'fileExplorer', icon: '📁' },
        { id: '2', title: 'Terminal', type: 'terminal', icon: '💻' },
        { id: '3', title: 'Notepad', type: 'notepad', icon: '📝' },
        { id: '4', title: 'Snake', type: 'snake', icon: '🐍' },
    ];

    return (
        <div
            ref={containerRef}
            className={twMerge(
                "absolute inset-0 p-4 flex flex-col items-start content-start flex-wrap gap-4 overflow-hidden",
                !wallpaper ? "bg-gradient-to-br from-[#008080] to-[#004040]" : ""
            )}
            style={wallpaper ? { backgroundImage: `url(${wallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            onContextMenu={handleContextMenu}
            onPointerDown={handlePointerDown}
        >
            {desktopApps.map(app => (
                <div
                    key={app.id}
                    className="w-20 group flex flex-col items-center justify-center p-2 rounded-lg hover:bg-white/20 active:bg-blue-500/40 transition-colors cursor-pointer select-none"
                    onDoubleClick={(e) => {
                        e.stopPropagation();
                        openWindow(app.title, app.type);
                    }}
                >
                    <div className="text-4xl drop-shadow-lg mb-1">{app.icon}</div>
                    <span className="text-white text-xs text-center drop-shadow-md font-medium leading-tight line-clamp-2">
                        {app.title}
                    </span>
                </div>
            ))}
        </div>
    );
};
