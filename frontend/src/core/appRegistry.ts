import type { ComponentType } from 'react';
import { Terminal } from '../apps/Terminal/Terminal';
import { FileExplorer } from '../apps/FileExplorer/FileExplorer';
import { Notepad } from '../apps/Notepad/Notepad';
import { TicTacToe } from '../apps/TicTacToe/TicTacToe';
import { SnakeGame } from '../apps/SnakeGame/SnakeGame';
import { TwentyFortyEight } from '../apps/Game2048/Game2048';

export interface AppDefinition {
    key: string;
    title: string;
    icon: string;
    component: ComponentType<any>;
    route: string;
    defaultSize: { width: number; height: number };
    showOnDesktop: boolean;
    category: 'system' | 'game' | 'utility';
}

export const APP_REGISTRY: Record<string, AppDefinition> = {
    terminal: {
        key: 'terminal',
        title: 'Terminal',
        icon: '💻',
        component: Terminal,
        route: '/os/terminal',
        defaultSize: { width: 700, height: 450 },
        showOnDesktop: true,
        category: 'system',
    },
    fileExplorer: {
        key: 'fileExplorer',
        title: 'File Explorer',
        icon: '📁',
        component: FileExplorer,
        route: '/os/files',
        defaultSize: { width: 750, height: 500 },
        showOnDesktop: true,
        category: 'system',
    },
    notepad: {
        key: 'notepad',
        title: 'Notepad',
        icon: '📝',
        component: Notepad,
        route: '/os/notes',
        defaultSize: { width: 600, height: 450 },
        showOnDesktop: true,
        category: 'utility',
    },
    snake: {
        key: 'snake',
        title: 'Snake',
        icon: '🐍',
        component: SnakeGame,
        route: '/os/games/snake',
        defaultSize: { width: 500, height: 550 },
        showOnDesktop: true,
        category: 'game',
    },
    tictactoe: {
        key: 'tictactoe',
        title: 'Tic Tac Toe',
        icon: '⭕',
        component: TicTacToe,
        route: '/os/games/tictactoe',
        defaultSize: { width: 450, height: 500 },
        showOnDesktop: true,
        category: 'game',
    },
    game2048: {
        key: 'game2048',
        title: '2048',
        icon: '🔢',
        component: TwentyFortyEight,
        route: '/os/games/2048',
        defaultSize: { width: 450, height: 600 },
        showOnDesktop: true,
        category: 'game',
    },
    settings: {
        key: 'settings',
        title: 'Settings',
        icon: '⚙️',
        component: (() => null) as any, // TODO: implement Settings component
        route: '/os/settings',
        defaultSize: { width: 600, height: 450 },
        showOnDesktop: false,
        category: 'system',
    },
};

/**
 * Get list of apps shown on the desktop
 */
export function getDesktopApps(): AppDefinition[] {
    return Object.values(APP_REGISTRY).filter(app => app.showOnDesktop);
}

/**
 * Resolve a URL route path to an app key.
 * e.g. '/os/terminal' → 'terminal'
 * e.g. '/os/games/snake' → 'snake'
 * e.g. '/os/files' → 'fileExplorer'
 * e.g. '/os/notes/123' → 'notepad'
 */
export function resolveRouteToAppKey(pathname: string): string | null {
    // Direct match first
    for (const app of Object.values(APP_REGISTRY)) {
        if (pathname === app.route) {
            return app.key;
        }
    }
    // Prefix match for deep links like /os/notes/123
    for (const app of Object.values(APP_REGISTRY)) {
        if (pathname.startsWith(app.route + '/')) {
            return app.key;
        }
    }
    return null;
}

/**
 * Get the component for an app key.
 * Falls back to a "not found" placeholder.
 */
export function getAppComponent(appKey: string): ComponentType<any> {
    const app = APP_REGISTRY[appKey];
    return app?.component || (() => null);
}
