import { create } from "zustand";
import { storage } from "../../services/storage";

interface DesktopState {
  wallpaper: string | null;
  selectedIcons: string[];
  contextMenu: {
    x: number;
    y: number;
    isOpen: boolean;
    targetId: string | null;
    items: any[];
  };

  setWallpaper: (url: string) => void;
  selectIcon: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  openContextMenu: (
    x: number,
    y: number,
    items: any[],
    targetId?: string,
  ) => void;
  closeContextMenu: () => void;
}

export const useDesktopStore = create<DesktopState>((set) => ({
  wallpaper: storage.get<string>("wallpaper") ?? null,
  selectedIcons: [],
  contextMenu: { x: 0, y: 0, isOpen: false, targetId: null, items: [] },

  setWallpaper: (url) => {
    storage.set("wallpaper", url);
    set({ wallpaper: url });
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
