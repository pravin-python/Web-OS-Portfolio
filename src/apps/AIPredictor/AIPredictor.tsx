import React, { useState, useCallback } from "react";
import {
  simulatePrediction,
  type PredictionResult,
} from "../../services/aiService";
import "./AIPredictor.css";

type Phase = "idle" | "processing" | "result";

export const AIPredictor: React.FC = () => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [stepLabel, setStepLabel] = useState("");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const runPrediction = useCallback(async () => {
    setPhase("processing");
    setProgress(0);
    setStepLabel("Initializing...");

    const prediction = await simulatePrediction((step, pct) => {
      setStepLabel(step);
      setProgress(pct);
    });

    setResult(prediction);
    setPhase("result");
  }, []);

  const handleReset = () => {
    setPhase("idle");
    setResult(null);
    setProgress(0);
  };

  const confidenceClass = (c: number) =>
    c >= 90 ? "high" : c >= 75 ? "medium" : "low";

  return (
    <div className="ai-predictor-root">
      <div className="ai-predictor-header">
        <span style={{ fontSize: 22 }}>🤖</span>
        <h2>AI Predictor</h2>
      </div>

      <div className="ai-predictor-content">
        {phase === "idle" && (
          <>
            <div
              className={`ai-drop-zone ${dragOver ? "dragover" : ""}`}
              onClick={runPrediction}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                runPrediction();
              }}
            >
              <div className="ai-drop-icon">📄</div>
              <div className="ai-drop-text">Drop a document image here</div>
              <div className="ai-drop-sub">
                or click to select &middot; supports Invoice, Receipt, PO
              </div>
            </div>

            <div style={{ color: "#666", fontSize: 12 }}>
              — or try a sample —
            </div>

            <div className="ai-samples">
              <button className="ai-sample-btn" onClick={runPrediction}>
                📋 Invoice Sample
              </button>
              <button className="ai-sample-btn" onClick={runPrediction}>
                🧾 Receipt Sample
              </button>
              <button className="ai-sample-btn" onClick={runPrediction}>
                📦 Purchase Order
              </button>
            </div>
          </>
        )}

        {phase === "processing" && (
          <div className="ai-processing">
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚙️</div>
            <div className="ai-progress-bar-bg">
              <div
                className="ai-progress-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="ai-step-label">{stepLabel}</div>
            <div style={{ fontSize: 11, color: "#555", marginTop: 8 }}>
              {Math.round(progress)}% complete
            </div>
          </div>
        )}

        {phase === "result" && result && (
          <div className="ai-result">
            <div className="ai-result-type">
              <h3>Detected: {result.documentType}</h3>
              <span
                className={`ai-confidence ${confidenceClass(result.confidence)}`}
              >
                {result.confidence}%
              </span>
            </div>
            <div className="ai-result-fields">
              {result.fields.map((f, i) => (
                <div key={i} className="ai-field-row">
                  <span className="ai-field-label">{f.label}</span>
                  <span className="ai-field-value">{f.value}</span>
                </div>
              ))}
            </div>
            <div className="ai-result-actions">
              <button className="ai-reset-btn" onClick={handleReset}>
                ↻ Analyze Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
