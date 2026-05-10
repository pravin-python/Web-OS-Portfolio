import React from "react";
import type { Dataset } from "./datasets/iris";

interface Props {
  datasets: Dataset[];
  selected: Dataset | null;
  onSelect: (ds: Dataset) => void;
}

const TYPE_BADGE: Record<string, { label: string; color: string }> = {
  classification: { label: "Classification", color: "#30d158" },
  regression: { label: "Regression", color: "#ff9f0a" },
  clustering: { label: "Clustering", color: "#bf5af2" },
};

export const DatasetSelector: React.FC<Props> = ({
  datasets,
  selected,
  onSelect,
}) => (
  <div className="mlc-section">
    <h3 className="mlc-section-title">📦 Dataset</h3>
    <div className="mlc-dataset-list">
      {datasets.map((ds) => {
        const badge = TYPE_BADGE[ds.type];
        const isActive = selected?.name === ds.name;
        return (
          <button
            key={ds.name}
            className={`mlc-dataset-card ${isActive ? "active" : ""}`}
            onClick={() => onSelect(ds)}
          >
            <div className="mlc-dataset-header">
              <span className="mlc-dataset-name">{ds.name}</span>
              <span
                className="mlc-type-badge"
                style={{
                  background: `${badge.color}22`,
                  color: badge.color,
                }}
              >
                {badge.label}
              </span>
            </div>
            <div className="mlc-dataset-meta">
              {ds.samples} samples · {ds.featureNames.length} features
            </div>
          </button>
        );
      })}
    </div>
  </div>
);
