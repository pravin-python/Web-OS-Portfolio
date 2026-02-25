import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NotificationType = "info" | "success" | "warning" | "error";

export interface OSNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: number;
  appName?: string;
}

interface NotificationState {
  notifications: OSNotification[];
  addNotification: (
    title: string,
    message: string,
    type?: NotificationType,
    appName?: string,
  ) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],

      addNotification: (title, message, type = "info", appName) => {
        const newObj: OSNotification = {
          id: crypto.randomUUID(),
          title,
          message,
          type,
          timestamp: Date.now(),
          appName,
        };

        set((state) => ({
          // Keep the last 50 notifications, latest first
          notifications: [newObj, ...state.notifications].slice(0, 50),
        }));
      },

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearAll: () => set({ notifications: [] }),
    }),
    {
      name: "os-notifications", // localStorage key
    },
  ),
);
