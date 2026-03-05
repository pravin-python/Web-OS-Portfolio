import React from "react";
import type { HyperParams } from "./hyperParams";

interface Props {
  algorithmId: string | null;
  params: HyperParams;
  onChange: (p: HyperParams) => void;
}

export const HyperParamsPanel: React.FC<Props> = ({
  algorithmId,
  params,
  onChange,
}) => {
  if (!algorithmId) return null;

  return (
    <div className="mlc-section">
      <h3 className="mlc-section-title">⚙️ Hyperparameters</h3>

      {algorithmId === "knn" && (
        <div className="mlc-param-group">
          <label className="mlc-param-label">
            k (neighbors)
            <span className="mlc-param-value">{params.k}</span>
          </label>
          <input
            type="range"
            min={1}
            max={20}
            value={params.k}
            className="mlc-slider"
            onChange={(e) =>
              onChange({ ...params, k: parseInt(e.target.value) })
            }
          />
          <div className="mlc-param-range">
            <span>1</span>
            <span>20</span>
          </div>
        </div>
      )}

      {algorithmId === "logistic" && (
        <>
          <div className="mlc-param-group">
            <label className="mlc-param-label">
              Learning Rate
              <span className="mlc-param-value">{params.learningRate}</span>
            </label>
            <input
              type="range"
              min={0.001}
              max={1}
              step={0.001}
              value={params.learningRate}
              className="mlc-slider"
              onChange={(e) =>
                onChange({
                  ...params,
                  learningRate: parseFloat(e.target.value),
                })
              }
            />
            <div className="mlc-param-range">
              <span>0.001</span>
              <span>1.0</span>
            </div>
          </div>
          <div className="mlc-param-group">
            <label className="mlc-param-label">
              Epochs
              <span className="mlc-param-value">{params.epochs}</span>
            </label>
            <input
              type="range"
              min={10}
              max={500}
              step={10}
              value={params.epochs}
              className="mlc-slider"
              onChange={(e) =>
                onChange({ ...params, epochs: parseInt(e.target.value) })
              }
            />
            <div className="mlc-param-range">
              <span>10</span>
              <span>500</span>
            </div>
          </div>
        </>
      )}

      {algorithmId === "linear" && (
        <div className="mlc-param-group">
          <label className="mlc-toggle-row">
            <span>Fit Intercept</span>
            <button
              className={`mlc-toggle ${params.fitIntercept ? "on" : ""}`}
              onClick={() =>
                onChange({ ...params, fitIntercept: !params.fitIntercept })
              }
            >
              <span className="mlc-toggle-thumb" />
            </button>
          </label>
        </div>
      )}

      {algorithmId === "kmeans" && (
        <div className="mlc-param-group">
          <label className="mlc-param-label">
            k (clusters)
            <span className="mlc-param-value">{params.kClusters}</span>
          </label>
          <input
            type="range"
            min={2}
            max={10}
            value={params.kClusters}
            className="mlc-slider"
            onChange={(e) =>
              onChange({ ...params, kClusters: parseInt(e.target.value) })
            }
          />
          <div className="mlc-param-range">
            <span>2</span>
            <span>10</span>
          </div>
        </div>
      )}
    </div>
  );
};
