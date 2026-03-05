import React, { useState, useCallback, useEffect } from "react";
import { pyodideService, type PyodideStatus } from "./pyodide.service";
import { DATASETS, ALGORITHMS } from "./configs";
import type { DatasetConfig, AlgorithmConfig, TrainResult } from "./types";
import { ResultsDashboard } from "./ResultsDashboard";
import { HyperParamEditor } from "./HyperParamEditor";
import { ComparisonView, saveHistory } from "./ComparisonView";
import "./styles.css";

/* ═══════════════════════════════════════════════════
   ML Studio — Main Container
   ═══════════════════════════════════════════════════ */
export const MLStudio: React.FC = () => {
  /* ─── State ─── */
  const [pyStatus, setPyStatus] = useState<PyodideStatus>("loading");
  const [dataset, setDataset] = useState<DatasetConfig | null>(null);
  const [algorithm, setAlgorithm] = useState<AlgorithmConfig | null>(null);
  const [params, setParams] = useState<
    Record<string, number | string | boolean>
  >({});
  const [testSize, setTestSize] = useState(0.2);
  const [isTraining, setIsTraining] = useState(false);
  const [result, setResult] = useState<TrainResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"train" | "compare">("train");

  /* ─── Derived ─── */
  const canTrain = !!dataset && !!algorithm && pyStatus === "ready";
  const compatibleAlgorithms = ALGORITHMS.filter(
    (a) => a.type === dataset?.type,
  );

  /* ─── Pyodide Subscription ─── */
  useEffect(() => {
    const unsub = pyodideService.subscribe((status) => {
      setPyStatus(status);
    });
    return unsub;
  }, []);

  /* ─── Handlers ─── */
  const handleSelectDataset = useCallback((ds: DatasetConfig) => {
    setDataset(ds);
    setAlgorithm(null);
    setResult(null);
    setErrorMsg(null);
  }, []);

  const handleSelectAlgorithm = useCallback((a: AlgorithmConfig) => {
    setAlgorithm(a);
    setParams({ ...a.hyperParams }); // reset params to defaults
    setResult(null);
    setErrorMsg(null);
  }, []);

  const handleTrain = useCallback(async () => {
    if (!dataset || !algorithm) return;
    setIsTraining(true);
    setResult(null);
    setErrorMsg(null);

    try {
      const res = await pyodideService.runTask({
        dataset_id: dataset.id,
        task_type: dataset.type,
        algo_id: algorithm.id,
        hyperparams: params,
        test_size: testSize,
      });
      setResult(res);

      // Save run to local history
      saveHistory({
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
        datasetName: dataset.name,
        algorithmName: algorithm.name,
        taskType: dataset.type,
        params,
        testSize,
        metrics: {
          accuracy: res.type === "classification" ? res.accuracy : undefined,
          f1: res.type === "classification" ? res.f1 : undefined,
          rmse: res.type === "regression" ? res.rmse : undefined,
          r2: res.type === "regression" ? res.r2 : undefined,
          silhouette:
            res.type === "clustering"
              ? res.silhouetteScore || undefined
              : undefined,
        },
        timeMs: res.timeMs,
      });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unknown error occurred during training");
    } finally {
      setIsTraining(false);
    }
  }, [dataset, algorithm, params, testSize]);

  return (
    <div className="mls-root">
      {/* ─── Header ─── */}
      <div className="mls-header">
        <div className="mls-header-left">
          <span className="mls-logo">🔬</span>
          <h2 className="mls-title">ML Studio</h2>
          <span className="mls-subtitle">SciKit-Learn via Pyodide</span>
          {pyStatus === "loading" && (
            <span className="mls-badge loading ml-2">Loading Python...</span>
          )}
          {pyStatus === "ready" && (
            <span className="mls-badge success ml-2">Python Engine Ready</span>
          )}
          {pyStatus === "error" && (
            <span className="mls-badge error ml-2">Engine Error</span>
          )}
        </div>
        <div className="mls-tabs">
          <button
            className={`mls-tab ${activeTab === "train" ? "active" : ""}`}
            onClick={() => setActiveTab("train")}
          >
            🚀 Studio
          </button>
          <button
            className={`mls-tab ${activeTab === "compare" ? "active" : ""}`}
            onClick={() => setActiveTab("compare")}
          >
            🆚 History
          </button>
        </div>
      </div>

      {/* ─── Body ─── */}
      <div className="mls-body">
        {activeTab === "train" ? (
          <>
            {/* Left sidebar */}
            <div className="mls-sidebar">
              <div className="mls-section-title">1. Dataset</div>
              <div className="flex flex-col gap-2 mb-6">
                {DATASETS.map((ds) => (
                  <button
                    key={ds.id}
                    className={`mls-card-btn ${dataset?.id === ds.id ? "active" : ""}`}
                    onClick={() => handleSelectDataset(ds)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm">{ds.name}</span>
                      <span className="text-[10px] uppercase text-slate-400 font-bold">
                        {ds.type.substring(0, 3)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {dataset && (
                <>
                  <div className="mls-section-title">2. Algorithm</div>
                  <div className="flex flex-col gap-2 mb-6">
                    {compatibleAlgorithms.map((algo) => (
                      <button
                        key={algo.id}
                        className={`mls-card-btn ${algorithm?.id === algo.id ? "active" : ""}`}
                        onClick={() => handleSelectAlgorithm(algo)}
                      >
                        <span className="font-semibold text-sm">
                          {algo.name}
                        </span>
                      </button>
                    ))}
                    {compatibleAlgorithms.length === 0 && (
                      <div className="text-xs text-slate-400 italic">
                        No compatible algorithms found.
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Center + Right */}
            <div className="mls-main">
              <div className="mls-controls p-4 border-b border-white/5">
                {/* Hyperparameters */}
                {algorithm && (
                  <>
                    <HyperParamEditor
                      algorithm={algorithm}
                      params={params}
                      onChange={setParams}
                    />
                    <div className="flex items-center gap-2 mb-3">
                      <label className="text-xs text-slate-400 w-24">
                        Test Size ({(testSize * 100).toFixed(0)}%)
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="0.5"
                        step="0.05"
                        value={testSize}
                        onChange={(e) =>
                          setTestSize(parseFloat(e.target.value))
                        }
                        className="flex-1 accent-purple-500"
                      />
                    </div>
                  </>
                )}

                <button
                  className="mls-train-btn"
                  disabled={!canTrain || isTraining}
                  onClick={handleTrain}
                >
                  {isTraining ? "Training via SciKit-Learn..." : "Train Model"}
                </button>
                {errorMsg && (
                  <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 text-red-300 rounded text-sm">
                    {errorMsg}
                  </div>
                )}
              </div>

              <div className="mls-results p-4 overflow-y-auto">
                {/* Results */}
                {result ? (
                  <ResultsDashboard result={result} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                    <span className="text-4xl mb-4 opacity-30">📊</span>
                    <p className="text-sm">
                      Configure and train a model to see results
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="mls-history-wrapper flex-1 overflow-y-auto">
            <ComparisonView />
          </div>
        )}
      </div>
    </div>
  );
};
