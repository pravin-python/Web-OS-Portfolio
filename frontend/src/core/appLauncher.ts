import { useWindowStore } from './state/useWindowStore';
import { APP_REGISTRY } from './appRegistry';
import type { NavigateFunction } from 'react-router-dom';

/**
 * Launch an app by its registry key.
 * Opens the corresponding window and optionally updates the browser URL.
 *
 * This is a plain function (not a hook) so it can be called from anywhere:
 * Desktop, Taskbar, Terminal, OSRouter, etc.
 */
export function launchApp(
    appKey: string,
    appData?: any,
    navigate?: NavigateFunction
): void {
    const app = APP_REGISTRY[appKey];
    if (!app) {
        console.warn(`launchApp: unknown app key "${appKey}"`);
        return;
    }

    const store = useWindowStore.getState();

    // Check if this app type already has an open window
    const existingWindow = store.windows.find(w => w.appType === appKey);
    if (existingWindow) {
        // Focus the existing window instead of opening a duplicate
        store.focusWindow(existingWindow.id);

        // Update appData if provided (e.g. deep link to a specific file)
        if (appData) {
            store.updateWindowAppData(existingWindow.id, appData);
        }
    } else {
        // Open a new window
        store.openWindow(app.title, appKey, undefined, app.defaultSize, appData);
    }

    // Update browser URL if navigate function is available
    if (navigate && app.route) {
        navigate(app.route, { replace: true });
    }
}

/**
 * Resolve common app name aliases to registry keys.
 * Used by terminal commands like "open files" or "run snake".
 */
const APP_ALIASES: Record<string, string> = {
    files: 'fileExplorer',
    explorer: 'fileExplorer',
    file: 'fileExplorer',
    term: 'terminal',
    terminal: 'terminal',
    notes: 'notepad',
    note: 'notepad',
    notepad: 'notepad',
    snake: 'snake',
    tictactoe: 'tictactoe',
    ttt: 'tictactoe',
    '2048': 'game2048',
    settings: 'settings',
};

export function resolveAppAlias(name: string): string | null {
    const lower = name.toLowerCase();
    return APP_ALIASES[lower] || APP_REGISTRY[lower]?.key || null;
}
