import React, { useState, useEffect } from 'react';
import { useWindowStore } from '../../core/state/useWindowStore';
import { twMerge } from 'tailwind-merge';
import { ChevronUp } from 'lucide-react'; // Placeholder icons

export const Taskbar: React.FC = () => {
    const windows = useWindowStore((state) => state.windows);
    const focusedWindowId = useWindowStore((state) => state.focusedWindowId);
    const focusWindow = useWindowStore((state) => state.focusWindow);
    const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
    const restoreWindow = useWindowStore((state) => state.restoreWindow);

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
        <div className="absolute overflow-visible bottom-0 left-0 right-0 h-12 bg-white/60 dark:bg-slate-900/80 backdrop-blur-xl border-t border-white/20 shadow-2xl flex items-center px-2 z-[9999]">
            <button className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-md active:scale-95 mr-2">
                <div className="w-4 h-4 bg-white rounded-sm opacity-80" />
                <span>Start</span>
            </button>

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

            <div className="flex items-center space-x-4 px-3 text-sm text-slate-800 dark:text-slate-200 select-none">
                <ChevronUp size={16} className="cursor-pointer hover:text-blue-500 transition-colors" />
                <div className="flex flex-col items-end leading-tight cursor-default">
                    <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-xs opacity-80">{time.toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
};
