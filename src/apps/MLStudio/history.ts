import type { CompareEntry } from "./types";

const STORAGE_KEY = "webos.mlstudio.history";

export const getHistory = (): CompareEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveHistory = (entry: CompareEntry) => {
  const current = getHistory();
  // Keep last 50 runs to avoid bloated localStorage
  const updated = [entry, ...current].slice(0, 50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};
