import React, { useRef, useEffect } from 'react';
import { APP_REGISTRY } from '../appRegistry';
import { launchApp } from '../appLauncher';
import { useNavigate } from 'react-router-dom';
import { Search, Power, Settings, User } from 'lucide-react';
import { Icon } from '../../components/Icon';

interface StartMenuProps {
    onClose: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ onClose }) => {
    const navigate = useNavigate();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                // Ensure we don't close if clicking the start button
                const target = event.target as HTMLElement;
                if (!target.closest('#start-button')) {
                    onClose();
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleAppLaunch = (appKey: string) => {
        launchApp(appKey, undefined, navigate);
        onClose();
    };

    const apps = Object.values(APP_REGISTRY);

    return (
        <div
            ref={menuRef}
            className="absolute bottom-14 left-2 w-80 bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden flex flex-col z-[10000] animate-in slide-in-from-bottom-5 duration-200"
        >
            {/* Search Bar */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700/50">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search apps, files, settings..."
                        className="w-full bg-slate-100 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 rounded-md py-2 pl-9 pr-4 outline-none focus:ring-2 focus:ring-blue-500/50 text-sm transition-all"
                    />
                </div>
            </div>

            {/* Apps Grid */}
            <div className="flex-1 p-4 overflow-y-auto max-h-[350px]">
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-1">
                    All Apps
                </h3>
                <div className="grid grid-cols-4 gap-2">
                    {apps.map((app) => (
                        <button
                            key={app.key}
                            onClick={() => handleAppLaunch(app.key)}
                            className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-colors group"
                        >
                            <span className="drop-shadow-sm group-hover:scale-110 transition-transform inline-flex">
                                <Icon name={app.icon} size={28} />
                            </span>
                            <span className="text-[10px] text-slate-700 dark:text-slate-300 mt-1 truncate w-full text-center">
                                {app.title}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50/80 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700/50 flex justify-between items-center">
                <button
                    onClick={() => handleAppLaunch('aboutMe')}
                    className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 px-3 py-1.5 rounded-md transition-colors"
                >
                    <User className="w-4 h-4" />
                    <span className="font-medium">Admin</span>
                </button>
                <div className="flex items-center space-x-1">
                    <button
                        onClick={() => handleAppLaunch('settings')}
                        className="p-2 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-md text-slate-600 dark:text-slate-400 transition-colors"
                    >
                        <Settings className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-md text-slate-600 dark:text-slate-400 transition-colors">
                        <Power className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
