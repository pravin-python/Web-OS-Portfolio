import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { VIRTUAL_WIDTH, VIRTUAL_HEIGHT } from "../device/deviceDetector";

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
  preMaxPosition?: Position;
  preMaxSize?: Size;
  minimizeTarget?: { x: number; y: number } | null;
  zIndex: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  appData?: any;
}

interface WindowState {
  windows: WindowInstance[];
  focusedWindowId: string | null;
  openWindow: (
    title: string,
    appType: string,
    position?: Position,
    size?: Size,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    appData?: any,
  ) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: Position) => void;
  updateWindowSize: (id: string, size: Size) => void;
  minimizeAllWindows: () => void;
  repositionAllWindows: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateWindowAppData: (id: string, appData: any) => void;
}

const TASKBAR_HEIGHT = 28; // menubar
const DOCK_HEIGHT = 76; // dock + spacing
const MAXIMIZED_BOUNDS = {
  x: 0,
  y: TASKBAR_HEIGHT,
  width: VIRTUAL_WIDTH,
  height: VIRTUAL_HEIGHT - TASKBAR_HEIGHT - DOCK_HEIGHT,
};

function clampWindow(win: WindowInstance): WindowInstance {
  return {
    ...win,
    size: {
      width: Math.min(win.size.width, VIRTUAL_WIDTH),
      height: Math.min(win.size.height, VIRTUAL_HEIGHT - TASKBAR_HEIGHT),
    },
    position: {
      x: Math.max(
        0,
        Math.min(
          win.position.x,
          VIRTUAL_WIDTH - Math.min(win.size.width, VIRTUAL_WIDTH),
        ),
      ),
      y: Math.max(
        TASKBAR_HEIGHT,
        Math.min(
          win.position.y,
          VIRTUAL_HEIGHT -
            DOCK_HEIGHT -
            Math.min(win.size.height, VIRTUAL_HEIGHT - TASKBAR_HEIGHT),
        ),
      ),
    },
  };
}

function getWindowSpawnPosition(
  appType: string,
  windowWidth: number,
  windowHeight: number,
) {
  const store = useWindowStore.getState();
  const existing = store.windows.filter((w) => w.appType === appType);

  if (existing.length > 0) {
    // Cascade offset from the most recently opened instance of this app type
    const lastWin = existing[existing.length - 1];
    let newX = lastWin.position.x + 30;
    let newY = lastWin.position.y + 30;

    // Clamp to canvas bounds
    if (newX + windowWidth > VIRTUAL_WIDTH)
      newX = VIRTUAL_WIDTH - windowWidth - 20;
    if (newY + windowHeight > VIRTUAL_HEIGHT - DOCK_HEIGHT)
      newY = TASKBAR_HEIGHT + 20; // Wrap around to top
    newX = Math.max(0, newX);
    newY = Math.max(TASKBAR_HEIGHT, newY);

    return { x: newX, y: newY };
  }

  const CANVAS_W = VIRTUAL_WIDTH;
  const CANVAS_H = VIRTUAL_HEIGHT;
  const MENUBAR_H = TASKBAR_HEIGHT;
  const DOCK_H = DOCK_HEIGHT;

  const availableH = CANVAS_H - MENUBAR_H - DOCK_H;

  // Base center position
  const baseX = (CANVAS_W - windowWidth) / 2;
  const baseY = MENUBAR_H + (availableH - windowHeight) / 2;

  // Random cascade offset for *first* instance so different apps don't perfectly stack
  const offsetX = (Math.random() - 0.5) * 120; // ±60px
  const offsetY = (Math.random() - 0.5) * 80; // ±40px

  // Clamp so window never goes off-screen
  const x = Math.max(0, Math.min(baseX + offsetX, CANVAS_W - windowWidth));
  const y = Math.max(
    MENUBAR_H,
    Math.min(baseY + offsetY, CANVAS_H - DOCK_H - windowHeight),
  );

  return { x, y };
}

let nextZIndex = 100;

export const useWindowStore = create<WindowState>()(
  persist(
    (set, get) => ({
      windows: [],
      focusedWindowId: null,

      openWindow: (
        title,
        appType,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _position = { x: 80, y: 40 },
        size = { width: 600, height: 400 },
        appData,
      ) => {
        const id = `win-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        nextZIndex++;

        const { x, y } = getWindowSpawnPosition(
          appType,
          size.width,
          size.height,
        );
        const initialPos = { x, y };

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
          windows: [...state.windows, clampWindow(newWindow)],
          focusedWindowId: id,
        }));
      },

      closeWindow: (id) => {
        set((state) => ({
          windows: state.windows.filter((win) => win.id !== id),
          focusedWindowId:
            state.focusedWindowId === id ? null : state.focusedWindowId,
        }));
      },

      minimizeWindow: (id) => {
        set((state) => {
          let scale = 1;
          const root = document.getElementById("os-root");
          if (root) {
            scale = root.getBoundingClientRect().width / VIRTUAL_WIDTH;
          }

          return {
            windows: state.windows.map((win) => {
              if (win.id === id) {
                const dockEl = document.querySelector(
                  `[data-dock-app="${win.appType}"]`,
                );
                const dockRect = dockEl?.getBoundingClientRect();

                return {
                  ...win,
                  isMinimized: true,
                  minimizeTarget: dockRect
                    ? { x: dockRect.left / scale, y: dockRect.top / scale }
                    : null,
                };
              }
              return win;
            }),
            focusedWindowId:
              state.focusedWindowId === id ? null : state.focusedWindowId,
          };
        });
      },

      minimizeAllWindows: () => {
        set((state) => {
          let scale = 1;
          const root = document.getElementById("os-root");
          if (root) {
            scale = root.getBoundingClientRect().width / VIRTUAL_WIDTH;
          }

          return {
            windows: state.windows.map((win) => {
              if (win.isMinimized) return win;

              const dockEl = document.querySelector(
                `[data-dock-app="${win.appType}"]`,
              );
              const dockRect = dockEl?.getBoundingClientRect();

              return {
                ...win,
                isMinimized: true,
                minimizeTarget: dockRect
                  ? { x: dockRect.left / scale, y: dockRect.top / scale }
                  : null,
              };
            }),
            focusedWindowId: null,
          };
        });
      },

      maximizeWindow: (id) => {
        set((state) => {
          nextZIndex++;
          return {
            windows: state.windows.map((win) => {
              if (win.id === id) {
                if (win.isMaximized) {
                  // Restore if somehow called when already max
                  return {
                    ...win,
                    isMaximized: false,
                    position: win.preMaxPosition ?? win.position,
                    size: win.preMaxSize ?? win.size,
                    zIndex: nextZIndex,
                  };
                } else {
                  // Save current bounds, then maximize
                  return {
                    ...win,
                    isMaximized: true,
                    preMaxPosition: win.position,
                    preMaxSize: win.size,
                    zIndex: nextZIndex,
                    position: { x: MAXIMIZED_BOUNDS.x, y: MAXIMIZED_BOUNDS.y },
                    size: {
                      width: MAXIMIZED_BOUNDS.width,
                      height: MAXIMIZED_BOUNDS.height,
                    },
                  };
                }
              }
              return win;
            }),
            focusedWindowId: id,
          };
        });
      },

      restoreWindow: (id) => {
        set((state) => {
          nextZIndex++;
          return {
            windows: state.windows.map((win) =>
              win.id === id
                ? {
                    ...win,
                    isMaximized: false,
                    isMinimized: false,
                    position: win.preMaxPosition ?? win.position,
                    size: win.preMaxSize ?? win.size,
                    zIndex: nextZIndex,
                  }
                : win,
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
              win.id === id
                ? { ...win, zIndex: nextZIndex, isMinimized: false }
                : win,
            ),
            focusedWindowId: id,
          };
        });
      },

      updateWindowPosition: (id, position) => {
        set((state) => ({
          windows: state.windows.map((win) =>
            win.id === id ? clampWindow({ ...win, position }) : win,
          ),
        }));
      },

      updateWindowSize: (id, size) => {
        set((state) => ({
          windows: state.windows.map((win) =>
            win.id === id ? clampWindow({ ...win, size }) : win,
          ),
        }));
      },

      repositionAllWindows: () => {
        set((state) => ({
          windows: state.windows.map((win) => clampWindow({ ...win })),
        }));
      },

      updateWindowAppData: (id, appData) => {
        set((state) => ({
          windows: state.windows.map((win) =>
            win.id === id
              ? { ...win, appData: { ...win.appData, ...appData } }
              : win,
          ),
        }));
      },
    }),
    {
      name: "webos-window-store", // key in local storage
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
