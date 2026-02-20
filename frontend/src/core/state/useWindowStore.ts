import { create } from 'zustand';

export interface Position {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

export interface WindowInstance {
    id: string;
    title: string;
    appType: string;
    isMinimized: boolean;
    isMaximized: boolean;
    position: Position;
    size: Size;
    zIndex: number;
    appData?: any;
}

interface WindowState {
    windows: WindowInstance[];
    focusedWindowId: string | null;
    openWindow: (title: string, appType: string, position?: Position, size?: Size, appData?: any) => void;
    closeWindow: (id: string) => void;
    minimizeWindow: (id: string) => void;
    maximizeWindow: (id: string) => void;
    restoreWindow: (id: string) => void;
    focusWindow: (id: string) => void;
    updateWindowPosition: (id: string, position: Position) => void;
    updateWindowSize: (id: string, size: Size) => void;
}

let nextZIndex = 100;
let nextWindowId = 1;

export const useWindowStore = create<WindowState>((set, get) => ({
    windows: [],
    focusedWindowId: null,

    openWindow: (title, appType, position = { x: 50, y: 50 }, size = { width: 600, height: 400 }, appData) => {
        const id = `win-${nextWindowId++}`;
        nextZIndex++;

        // Position cascade for overlap
        const currentWindows = get().windows;
        const offset = currentWindows.length * 20 + 50;
        const initialPos = { x: offset, y: offset };

        const newWindow: WindowInstance = {
            id,
            title,
            appType,
            isMinimized: false,
            isMaximized: false,
            position: initialPos,
            size,
            zIndex: nextZIndex,
            appData,
        };

        set((state) => ({
            windows: [...state.windows, newWindow],
            focusedWindowId: id,
        }));
    },

    closeWindow: (id) => {
        set((state) => ({
            windows: state.windows.filter((win) => win.id !== id),
            focusedWindowId: state.focusedWindowId === id ? null : state.focusedWindowId,
        }));
    },

    minimizeWindow: (id) => {
        set((state) => ({
            windows: state.windows.map((win) =>
                win.id === id ? { ...win, isMinimized: true } : win
            ),
            focusedWindowId: state.focusedWindowId === id ? null : state.focusedWindowId,
        }));
    },

    maximizeWindow: (id) => {
        set((state) => {
            nextZIndex++;
            return {
                windows: state.windows.map((win) =>
                    win.id === id ? { ...win, isMaximized: true, zIndex: nextZIndex } : win
                ),
                focusedWindowId: id,
            };
        });
    },

    restoreWindow: (id) => {
        set((state) => {
            nextZIndex++;
            return {
                windows: state.windows.map((win) =>
                    win.id === id ? { ...win, isMaximized: false, isMinimized: false, zIndex: nextZIndex } : win
                ),
                focusedWindowId: id,
            };
        });
    },

    focusWindow: (id) => {
        if (get().focusedWindowId === id) return;
        set((state) => {
            nextZIndex++;
            return {
                windows: state.windows.map((win) =>
                    win.id === id ? { ...win, zIndex: nextZIndex, isMinimized: false } : win
                ),
                focusedWindowId: id,
            };
        });
    },

    updateWindowPosition: (id, position) => {
        set((state) => ({
            windows: state.windows.map((win) =>
                win.id === id ? { ...win, position } : win
            ),
        }));
    },

    updateWindowSize: (id, size) => {
        set((state) => ({
            windows: state.windows.map((win) =>
                win.id === id ? { ...win, size } : win
            ),
        }));
    },
}));
