import React, { useState, useEffect } from 'react';
import { useWindowStore } from '../../core/state/useWindowStore';
import { twMerge } from 'tailwind-merge';
import { ChevronUp, Cpu } from 'lucide-react';
import { StartMenu } from './StartMenu';
import { SystemTray } from './SystemTray';

export const Taskbar: React.FC = () => {
    const windows = useWindowStore((state) => state.windows);
    const focusedWindowId = useWindowStore((state) => state.focusedWindowId);
    const focusWindow = useWindowStore((state) => state.focusWindow);
    const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
    const restoreWindow = useWindowStore((state) => state.restoreWindow);

    const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
    const [isSystemTrayOpen, setIsSystemTrayOpen] = useState(false);

    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleTaskbarItemClick = (id: string, isMinimized: boolean) => {
        if (isMinimized) {
            restoreWindow(id);
            focusWindow(id);
        } else {
            if (focusedWindowId === id) {
                minimizeWindow(id);
            } else {
                focusWindow(id);
            }
        }
    };

    return (
        <>
            {/* Overlay Menus */}
            {isStartMenuOpen && <StartMenu onClose={() => setIsStartMenuOpen(false)} />}
            {isSystemTrayOpen && <SystemTray onClose={() => setIsSystemTrayOpen(false)} />}

            {/* Taskbar Bar */}
            <div className="absolute overflow-visible bottom-0 left-0 right-0 h-12 bg-white/60 dark:bg-slate-900/80 backdrop-blur-xl border-t border-white/20 shadow-2xl flex items-center px-2 z-[9999]">
                {/* Start Button */}
                <button
                    id="start-button"
                    onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
                    className={twMerge(
                        "flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all shadow-md active:scale-95 mr-2",
                        isStartMenuOpen
                            ? "bg-blue-700 text-white"
                            : "bg-blue-600 hover:bg-blue-500 text-white"
                    )}
                >
                    <Cpu className="w-5 h-5 drop-shadow-sm" />
                    <span>Start</span>
                </button>

                {/* Running Apps */}
                <div className="flex-1 flex items-center space-x-1 overflow-x-auto px-2">
                    {windows.map((win) => {
                        const isActive = focusedWindowId === win.id && !win.isMinimized;
                        return (
                            <button
                                key={win.id}
                                onClick={() => handleTaskbarItemClick(win.id, win.isMinimized)}
                                className={twMerge(
                                    "flex items-center space-x-2 max-w-[150px] px-3 py-2 rounded-md transition-all truncate text-sm select-none",
                                    isActive
                                        ? "bg-white/40 dark:bg-white/10 shadow-inner font-medium text-blue-900 dark:text-blue-100"
                                        : "hover:bg-white/20 text-slate-700 dark:text-slate-300"
                                )}
                            >
                                <span className="truncate">{win.title}</span>
                            </button>
                        );
                    })}
                </div>

                {/* System Tray Area */}
                <div className="flex items-center space-x-4 px-3 h-full text-sm text-slate-800 dark:text-slate-200 select-none">
                    <button
                        id="system-tray-toggle"
                        onClick={() => setIsSystemTrayOpen(!isSystemTrayOpen)}
                        className={twMerge(
                            "flex items-center justify-center p-1.5 rounded-md transition-all active:scale-95",
                            isSystemTrayOpen
                                ? "bg-white/30 dark:bg-white/20 text-blue-600 dark:text-blue-400"
                                : "hover:bg-white/20 text-slate-600 dark:text-slate-400"
                        )}
                    >
                        <ChevronUp size={16} className="transition-transform duration-300" style={{ transform: isSystemTrayOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                    </button>

                    <div className="flex flex-col items-end leading-tight cursor-default">
                        <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="text-xs opacity-80">{time.toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </>
    );
};
