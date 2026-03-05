import React from "react";

interface Props {
  splitRatio: number;
  onSplitChange: (r: number) => void;
  doNormalize: boolean;
  onNormalizeChange: (v: boolean) => void;
  featureNames: string[];
  selectedFeatures: number[];
  onFeaturesChange: (indices: number[]) => void;
  canTrain: boolean;
  isTraining: boolean;
  progress: number;
  progressLabel: string;
  onTrain: () => void;
}

export const TrainPanel: React.FC<Props> = ({
  splitRatio,
  onSplitChange,
  doNormalize,
  onNormalizeChange,
  featureNames,
  selectedFeatures,
  onFeaturesChange,
  canTrain,
  isTraining,
  progress,
  progressLabel,
  onTrain,
}) => {
  const toggleFeature = (idx: number) => {
    if (selectedFeatures.includes(idx)) {
      if (selectedFeatures.length > 1) {
        onFeaturesChange(selectedFeatures.filter((i) => i !== idx));
      }
    } else {
      onFeaturesChange([...selectedFeatures, idx].sort((a, b) => a - b));
    }
  };

  return (
    <div className="mlc-train-panel">
      {/* Preprocessing controls */}
      <div className="mlc-preprocess-row">
        <div className="mlc-preprocess-control">
          <label className="mlc-param-label">
            Train / Test Split
            <span className="mlc-param-value">
              {Math.round((1 - splitRatio) * 100)}/
              {Math.round(splitRatio * 100)}
            </span>
          </label>
          <div className="mlc-split-btns">
            {[0.2, 0.3, 0.4].map((r) => (
              <button
                key={r}
                className={`mlc-split-btn ${splitRatio === r ? "active" : ""}`}
                onClick={() => onSplitChange(r)}
              >
                {Math.round((1 - r) * 100)}/{Math.round(r * 100)}
              </button>
            ))}
          </div>
        </div>

        <div className="mlc-preprocess-control">
          <label className="mlc-toggle-row">
            <span>Normalize Features</span>
            <button
              className={`mlc-toggle ${doNormalize ? "on" : ""}`}
              onClick={() => onNormalizeChange(!doNormalize)}
            >
              <span className="mlc-toggle-thumb" />
            </button>
          </label>
        </div>
      </div>

      {/* Feature selection */}
      {featureNames.length > 0 && (
        <div className="mlc-feature-select">
          <label className="mlc-param-label" style={{ marginBottom: 6 }}>
            Features
          </label>
          <div className="mlc-feature-chips">
            {featureNames.map((name, i) => (
              <button
                key={i}
                className={`mlc-feature-chip ${selectedFeatures.includes(i) ? "active" : ""}`}
                onClick={() => toggleFeature(i)}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Train button */}
      <button
        className="mlc-train-btn"
        disabled={!canTrain || isTraining}
        onClick={onTrain}
      >
        {isTraining ? "Training…" : "🚀 Train Model"}
      </button>

      {/* Progress */}
      {isTraining && (
        <div className="mlc-progress-section">
          <div className="mlc-progress-bar-bg">
            <div
              className="mlc-progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mlc-progress-label">{progressLabel}</div>
        </div>
      )}
    </div>
  );
};
