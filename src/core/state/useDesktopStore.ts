import { create } from "zustand";
import { storage } from "../../services/storage";

/** Three gradient wallpaper presets */
export const WALLPAPER_PRESETS = [
  // Deep ocean
  "radial-gradient(ellipse at 30% 40%, #1a2a4a 0%, #0d0d1a 50%, #0a1628 100%)",
  // Aurora
  "radial-gradient(ellipse at 60% 30%, #1a3a2a 0%, #0d1a1a 40%, #0a1828 100%)",
  // Nebula
  "radial-gradient(ellipse at 40% 60%, #2a1a3a 0%, #1a0d1a 45%, #160a28 100%)",
];

export interface ContextMenuItem {
  label?: string;
  action?: () => void;
  divider?: boolean;
}

interface DesktopState {
  wallpaperIndex: number;
  selectedIcons: string[];
  contextMenu: {
    x: number;
    y: number;
    isOpen: boolean;
    targetId: string | null;
    items: ContextMenuItem[];
  };

  cycleWallpaper: () => void;
  setWallpaper: (url: string) => void;
  selectIcon: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  openContextMenu: (
    x: number,
    y: number,
    items: ContextMenuItem[],
    targetId?: string,
  ) => void;
  closeContextMenu: () => void;
}

export const useDesktopStore = create<DesktopState>((set) => ({
  wallpaperIndex: storage.get<number>("wallpaperIndex") ?? 0,
  selectedIcons: [],
  contextMenu: { x: 0, y: 0, isOpen: false, targetId: null, items: [] },

  cycleWallpaper: () =>
    set((state) => {
      const next = (state.wallpaperIndex + 1) % WALLPAPER_PRESETS.length;
      storage.set("wallpaperIndex", next);
      return { wallpaperIndex: next };
    }),

  // Keep the old API for backward compatibility with any callers
  setWallpaper: () => {
    // No-op — wallpaper is now index-based gradients
  },

  selectIcon: (id, multi = false) =>
    set((state) => ({
      selectedIcons: multi ? [...state.selectedIcons, id] : [id],
    })),

  clearSelection: () => set({ selectedIcons: [] }),

  openContextMenu: (x, y, items, targetId) =>
    set({
      contextMenu: { x, y, isOpen: true, targetId: targetId ?? null, items },
    }),

  closeContextMenu: () =>
    set((state) => ({
      contextMenu: { ...state.contextMenu, isOpen: false },
    })),
}));
