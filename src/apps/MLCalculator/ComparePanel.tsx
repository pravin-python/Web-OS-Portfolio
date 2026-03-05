import React from "react";
import type { CompareEntry } from "./compareHistory";

interface Props {
  history: CompareEntry[];
  onClear: () => void;
  onExport: () => void;
}

export const ComparePanel: React.FC<Props> = ({
  history,
  onClear,
  onExport,
}) => {
  if (history.length === 0) {
    return (
      <div className="mlc-compare-empty">
        <div className="mlc-compare-icon">🆚</div>
        <p>No runs yet. Train models to compare results here.</p>
      </div>
    );
  }

  // Group common metric keys
  const allMetricKeys = [
    ...new Set(history.flatMap((h) => Object.keys(h.metrics))),
  ];

  return (
    <div className="mlc-compare-wrap">
      <div className="mlc-compare-header">
        <h4 className="mlc-result-subtitle">🆚 Comparison Table</h4>
        <div className="mlc-compare-actions">
          <button
            className="mlc-action-btn"
            onClick={onExport}
            title="Export JSON"
          >
            📥 Export
          </button>
          <button
            className="mlc-action-btn danger"
            onClick={onClear}
            title="Clear all"
          >
            🗑 Clear
          </button>
        </div>
      </div>
      <div className="mlc-compare-scroll">
        <table className="mlc-compare-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Dataset</th>
              <th>Algorithm</th>
              <th>Params</th>
              {allMetricKeys.map((k) => (
                <th key={k}>{k}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((entry, i) => (
              <tr key={entry.id}>
                <td className="mlc-compare-num">{i + 1}</td>
                <td>{entry.dataset}</td>
                <td>{entry.algorithm}</td>
                <td className="mlc-compare-params">{entry.params}</td>
                {allMetricKeys.map((k) => (
                  <td key={k} className="mlc-compare-val">
                    {entry.metrics[k] != null
                      ? entry.metrics[k].toFixed(4)
                      : "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
