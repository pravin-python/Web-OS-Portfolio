import { useState, useCallback } from "react";
import type { Notification } from "./useTicTacToeNotifications";

export interface Scores {
  x: number;
  o: number;
  draws: number;
}

const STORAGE_KEY = "webos.tictactoe.score";

function loadScores(): Scores {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { x: 0, o: 0, draws: 0 };
}

function saveScores(s: Scores) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export function useTicTacToeScores(
  notify: (text: string, type?: Notification["type"]) => void
) {
  const [scores, setScores] = useState<Scores>(loadScores);

  const updateScores = useCallback((key: "x" | "o" | "draws") => {
    setScores((prev) => {
      const next = { ...prev, [key]: prev[key] + 1 };
      saveScores(next);
      return next;
    });
  }, []);

  const resetScore = useCallback(() => {
    const empty = { x: 0, o: 0, draws: 0 };
    setScores(empty);
    saveScores(empty);
    notify("Scores Reset 🔄", "info");
  }, [notify]);

  return { scores, updateScores, resetScore };
}
