import React, { useMemo } from "react";
import { readByPath } from "../../services/filesystem";
import "./ModelLogs.css";

interface EpochData {
  epoch: number;
  train_loss: number;
  val_loss: number;
  train_acc: number;
  val_acc: number;
}

interface TrainingData {
  model: string;
  framework: string;
  architecture: string;
  dataset_size: number;
  epochs: EpochData[];
  final_metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
  };
}

export const ModelLogs: React.FC = () => {
  const data = useMemo<TrainingData | null>(() => {
    const raw = readByPath("/home/researcher/ai_lab/training_history.json");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  if (!data)
    return (
      <div className="ml-root">
        <p>Failed to load training data.</p>
      </div>
    );

  const m = data.final_metrics;
  const maxAcc = Math.max(...data.epochs.map((e) => e.val_acc));

  return (
    <div className="ml-root">
      <div className="ml-header">
        <span style={{ fontSize: 20 }}>🧠</span>
        <h2>Model Training Logs</h2>
      </div>

      {/* Model Info Card */}
      <div className="ml-info-card">
        <div className="ml-model-name">{data.model}</div>
        <div className="ml-info-grid">
          <div className="ml-info-item">
            <span className="ml-info-label">Framework</span>
            <span className="ml-info-value">{data.framework}</span>
          </div>
          <div className="ml-info-item">
            <span className="ml-info-label">Architecture</span>
            <span className="ml-info-value">{data.architecture}</span>
          </div>
          <div className="ml-info-item">
            <span className="ml-info-label">Dataset</span>
            <span className="ml-info-value">
              {data.dataset_size.toLocaleString()} samples
            </span>
          </div>
          <div className="ml-info-item">
            <span className="ml-info-label">Epochs</span>
            <span className="ml-info-value">{data.epochs.length}</span>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="ml-metrics">
        {[
          { label: "Accuracy", value: m.accuracy, color: "#00c853" },
          { label: "Precision", value: m.precision, color: "#00b0ff" },
          { label: "Recall", value: m.recall, color: "#ff9100" },
          { label: "F1-Score", value: m.f1, color: "#e040fb" },
        ].map((metric) => (
          <div key={metric.label} className="ml-metric-card">
            <div className="ml-metric-value" style={{ color: metric.color }}>
              {metric.value}%
            </div>
            <div className="ml-metric-label">{metric.label}</div>
            <div className="ml-metric-bar-bg">
              <div
                className="ml-metric-bar-fill"
                style={{ width: `${metric.value}%`, background: metric.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Training Chart (CSS Bar Chart) */}
      <div className="ml-chart-section">
        <h3 className="ml-section-title">
          Training Progress — Validation Accuracy
        </h3>
        <div className="ml-chart">
          {data.epochs.map((ep) => (
            <div key={ep.epoch} className="ml-bar-col">
              <div
                className="ml-bar"
                style={{
                  height: `${(ep.val_acc / maxAcc) * 100}%`,
                  background:
                    ep.val_acc >= 90
                      ? "linear-gradient(to top, #00c853, #69f0ae)"
                      : ep.val_acc >= 70
                        ? "linear-gradient(to top, #ff9100, #ffab40)"
                        : "linear-gradient(to top, #ff5252, #ff8a80)",
                }}
                title={`Epoch ${ep.epoch}: ${ep.val_acc}%`}
              />
              <span className="ml-bar-label">E{ep.epoch}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Loss Chart */}
      <div className="ml-chart-section">
        <h3 className="ml-section-title">Training Loss</h3>
        <div className="ml-chart">
          {data.epochs.map((ep) => {
            const maxLoss = data.epochs[0].train_loss;
            return (
              <div key={ep.epoch} className="ml-bar-col">
                <div
                  className="ml-bar loss"
                  style={{
                    height: `${(ep.train_loss / maxLoss) * 100}%`,
                  }}
                  title={`Epoch ${ep.epoch}: ${ep.train_loss}`}
                />
                <span className="ml-bar-label">E{ep.epoch}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Epoch Table */}
      <div className="ml-table-section">
        <h3 className="ml-section-title">Epoch History</h3>
        <table className="ml-table">
          <thead>
            <tr>
              <th>Epoch</th>
              <th>Train Loss</th>
              <th>Val Loss</th>
              <th>Train Acc</th>
              <th>Val Acc</th>
            </tr>
          </thead>
          <tbody>
            {data.epochs.map((ep) => (
              <tr key={ep.epoch}>
                <td>{ep.epoch}</td>
                <td>{ep.train_loss.toFixed(3)}</td>
                <td>{ep.val_loss.toFixed(3)}</td>
                <td>{ep.train_acc.toFixed(1)}%</td>
                <td style={{ color: ep.val_acc >= 90 ? "#00c853" : "#e0e0e0" }}>
                  {ep.val_acc.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
