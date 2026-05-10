import React, { useState } from "react";
import type { CompareEntry } from "./types";

const STORAGE_KEY = "webos.mlstudio.history";

// eslint-disable-next-line react-refresh/only-export-components
export const getHistory = (): CompareEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// eslint-disable-next-line react-refresh/only-export-components
export const saveHistory = (entry: CompareEntry) => {
  const current = getHistory();
  // Keep last 50 runs to avoid bloated localStorage
  const updated = [entry, ...current].slice(0, 50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

// eslint-disable-next-line react-refresh/only-export-components
export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const ComparisonView: React.FC = () => {
  const [history, setHistory] = useState<CompareEntry[]>(getHistory);

  const handleClear = () => {
    if (confirm("Clear all training history?")) {
      clearHistory();
      setHistory([]);
    }
  };

  if (history.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400">
        No training history found. Train some models first.
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="mls-section-title !mb-0">
          Training History & Comparison
        </h2>
        <button
          onClick={handleClear}
          className="bg-red-500/20 hover:bg-red-500/40 text-red-300 text-xs px-3 py-1.5 rounded transition-colors"
        >
          Clear History
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-slate-300">
          <thead>
            <tr className="border-b border-white/5 uppercase tracking-wider text-[10px] text-slate-400">
              <th className="p-3">Time</th>
              <th className="p-3">Dataset</th>
              <th className="p-3">Algorithm</th>
              <th className="p-3">Primary Metric</th>
              <th className="p-3">Test Size</th>
              <th className="p-3">Params</th>
              <th className="p-3">Duration</th>
            </tr>
          </thead>
          <tbody>
            {history.map((run) => {
              // Determine best metric to show
              let primeMetric = "-";
              if (run.metrics.accuracy != null)
                primeMetric = `Acc: ${(run.metrics.accuracy * 100).toFixed(1)}%`;
              else if (run.metrics.r2 != null)
                primeMetric = `R²: ${run.metrics.r2.toFixed(3)}`;
              else if (run.metrics.silhouette != null)
                primeMetric = `Silh: ${run.metrics.silhouette.toFixed(3)}`;

              return (
                <tr
                  key={run.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-3 text-xs text-slate-500">
                    {new Date(run.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-3 font-medium text-purple-300">
                    {run.datasetName}
                  </td>
                  <td className="p-3 text-slate-200">{run.algorithmName}</td>
                  <td className="p-3 font-mono text-green-400 font-bold">
                    {primeMetric}
                  </td>
                  <td className="p-3 text-slate-400">
                    {(run.testSize * 100).toFixed(0)}%
                  </td>
                  <td
                    className="p-3 font-mono text-[10px] text-slate-500 max-w-[200px] truncate"
                    title={JSON.stringify(run.params)}
                  >
                    {JSON.stringify(run.params).replace(/[{""}]/g, "")}
                  </td>
                  <td className="p-3 font-mono text-[10px] text-slate-500">
                    {run.timeMs}ms
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
