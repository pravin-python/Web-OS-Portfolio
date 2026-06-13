import { useState, useCallback } from "react";

export interface Notification {
  id: number;
  text: string;
  type: "info" | "success" | "warning";
}

let notifId = 0;

export function useTicTacToeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback(
    (text: string, type: Notification["type"] = "info") => {
      const id = ++notifId;
      setNotifications((prev) => [...prev, { id, text, type }]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    [],
  );

  return { notifications, notify };
}
