import React from "react";
import { ALGORITHMS, type AlgorithmDef } from "./algorithms";

interface Props {
  datasetType: "classification" | "regression" | "clustering" | null;
  selected: AlgorithmDef | null;
  onSelect: (a: AlgorithmDef) => void;
}

export const AlgorithmSelector: React.FC<Props> = ({
  datasetType,
  selected,
  onSelect,
}) => {
  const available = datasetType
    ? ALGORITHMS.filter((a) => a.type === datasetType)
    : [];

  if (!datasetType) {
    return (
      <div className="mlc-section">
        <h3 className="mlc-section-title">🧠 Algorithm</h3>
        <div className="mlc-hint">Select a dataset first</div>
      </div>
    );
  }

  return (
    <div className="mlc-section">
      <h3 className="mlc-section-title">🧠 Algorithm</h3>
      <div className="mlc-algo-list">
        {available.map((algo) => (
          <button
            key={algo.id}
            className={`mlc-algo-card ${selected?.id === algo.id ? "active" : ""}`}
            onClick={() => onSelect(algo)}
          >
            <span className="mlc-algo-icon">{algo.icon}</span>
            <div>
              <div className="mlc-algo-name">{algo.name}</div>
              <div className="mlc-algo-desc">{algo.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
