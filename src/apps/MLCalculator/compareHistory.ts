export interface CompareEntry {
  id: string;
  timestamp: number;
  dataset: string;
  algorithm: string;
  params: string;
  type: "classification" | "regression" | "clustering";
  metrics: Record<string, number>;
}

const STORAGE_KEY = "webos.mlcalculator.history";

export function loadHistory(): CompareEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(entry: CompareEntry) {
  const history = loadHistory();
  history.unshift(entry);
  // Keep last 20 runs
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 20)));
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}
