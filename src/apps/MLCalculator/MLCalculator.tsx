import React, { useState, useCallback, useMemo } from "react";
import type { Dataset } from "./datasets/iris";
import { IRIS_DATASET } from "./datasets/iris";
import { HOUSE_PRICES_DATASET } from "./datasets/house_prices";
import { CUSTOMER_CLUSTERS_DATASET } from "./datasets/customer_clusters";
import { DatasetSelector } from "./DatasetSelector";
import { AlgorithmSelector } from "./AlgorithmSelector";
import type { AlgorithmDef } from "./algorithms";
import { HyperParamsPanel } from "./HyperParamsPanel";
import { DEFAULT_PARAMS } from "./hyperParams";
import type { HyperParams } from "./hyperParams";
import { TrainPanel } from "./TrainPanel";
import { ResultsPanel } from "./ResultsPanel";
import { ChartPanel } from "./ChartPanel";
import { ComparePanel } from "./ComparePanel";
import {
  loadHistory,
  saveToHistory,
  clearHistory,
  type CompareEntry,
} from "./compareHistory";
import type { TrainResult } from "./types";
import {
  trainTestSplit,
  normalize,
  applyNormalize,
  selectFeatures,
} from "./utils/preprocessing";
import * as metrics from "./utils/metrics";
import {
  trainKNN,
  trainLogisticRegression,
  trainLinearRegression,
  trainKMeans,
} from "./mlCalculator.service";
import "./styles.css";

/* ─── Datasets ─── */
const ALL_DATASETS: Dataset[] = [
  IRIS_DATASET,
  HOUSE_PRICES_DATASET,
  CUSTOMER_CLUSTERS_DATASET,
];

/* ═══════════════════════════════════════════════════
   MLCalculator — Main Component
   ═══════════════════════════════════════════════════ */
export const MLCalculator: React.FC = () => {
  /* ─── State ─── */
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [algorithm, setAlgorithm] = useState<AlgorithmDef | null>(null);
  const [params, setParams] = useState<HyperParams>(DEFAULT_PARAMS);
  const [splitRatio, setSplitRatio] = useState(0.2);
  const [doNormalize, setDoNormalize] = useState(true);
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [result, setResult] = useState<TrainResult | null>(null);
  const [activeTab, setActiveTab] = useState<"train" | "compare">("train");
  const [history, setHistory] = useState<CompareEntry[]>(loadHistory);

  /* ─── Derived ─── */
  const canTrain = !!dataset && !!algorithm && selectedFeatures.length > 0;
  const featureNames = useMemo(() => dataset?.featureNames ?? [], [dataset]);

  /* ─── Handlers ─── */
  const handleSelectDataset = useCallback((ds: Dataset) => {
    setDataset(ds);
    setAlgorithm(null);
    setResult(null);
    setSelectedFeatures(ds.featureNames.map((_, i) => i));
  }, []);

  const handleSelectAlgorithm = useCallback((a: AlgorithmDef) => {
    setAlgorithm(a);
    setResult(null);
  }, []);

  const handleTrain = useCallback(async () => {
    if (!dataset || !algorithm) return;
    setIsTraining(true);
    setProgress(0);
    setProgressLabel("Preparing data…");
    setResult(null);

    const onProgress = (step: string, pct: number) => {
      setProgressLabel(step);
      setProgress(pct);
    };

    try {
      // Small delay so the UI can render the progress bar
      await new Promise((r) => setTimeout(r, 100));

      const X = selectFeatures(dataset.features, selectedFeatures);
      const y = dataset.labels ?? [];
      let trainResult: TrainResult;

      if (algorithm.id === "kmeans") {
        /* ─── Clustering ─── */
        onProgress("Normalizing data…", 5);
        let clusterData = X;
        if (doNormalize) {
          const { data } = normalize(X);
          clusterData = data;
        }

        const { labels, centroids } = await trainKMeans(
          clusterData,
          params.kClusters,
          100,
          onProgress,
        );

        const sizesMap = metrics.clusterSizes(labels);
        const inertiaVal = metrics.inertia(clusterData, labels, centroids);
        const silhouette = metrics.silhouetteScore(clusterData, labels);

        trainResult = {
          type: "clustering",
          clusterSizesMap: sizesMap,
          inertiaVal,
          silhouette,
          clusterData: X, // use original coordinates for visualization
          clusterLabels: labels,
        };
      } else {
        /* ─── Classification / Regression ─── */
        onProgress("Splitting data…", 5);
        const isClassification = dataset.type === "classification";
        const { xTrain, xTest, yTrain, yTest } = trainTestSplit(
          X,
          y,
          splitRatio,
          isClassification,
        );

        let xTrainNorm = xTrain;
        let xTestNorm = xTest;
        if (doNormalize) {
          onProgress("Normalizing features…", 8);
          const { data: trainNorm, params: normParams } = normalize(xTrain);
          xTrainNorm = trainNorm;
          xTestNorm = applyNormalize(xTest, normParams);
        }

        if (algorithm.id === "knn") {
          const predictions = await trainKNN(
            xTrainNorm,
            yTrain,
            xTestNorm,
            params.k,
            onProgress,
          );
          const cm = metrics.confusionMatrix(yTest, predictions);
          trainResult = {
            type: "classification",
            accuracy: metrics.accuracy(yTest, predictions),
            precision: metrics.precision(yTest, predictions),
            recall: metrics.recall(yTest, predictions),
            f1: metrics.f1Score(yTest, predictions),
            confusionMatrix: cm,
            classNames:
              dataset.targetNames ??
              [...new Set(y)].sort((a, b) => a - b).map(String),
            yTrue: yTest,
            yPred: predictions,
          };
        } else if (algorithm.id === "logistic") {
          const predictions = await trainLogisticRegression(
            xTrainNorm,
            yTrain,
            xTestNorm,
            params.learningRate,
            params.epochs,
            onProgress,
          );
          const cm = metrics.confusionMatrix(yTest, predictions);
          trainResult = {
            type: "classification",
            accuracy: metrics.accuracy(yTest, predictions),
            precision: metrics.precision(yTest, predictions),
            recall: metrics.recall(yTest, predictions),
            f1: metrics.f1Score(yTest, predictions),
            confusionMatrix: cm,
            classNames:
              dataset.targetNames ??
              [...new Set(y)].sort((a, b) => a - b).map(String),
            yTrue: yTest,
            yPred: predictions,
          };
        } else {
          // Linear Regression
          const { predictions } = await trainLinearRegression(
            xTrainNorm,
            yTrain,
            xTestNorm,
            params.fitIntercept,
            onProgress,
          );
          trainResult = {
            type: "regression",
            mae: metrics.mae(yTest, predictions),
            mse: metrics.mse(yTest, predictions),
            rmse: metrics.rmse(yTest, predictions),
            r2: metrics.r2Score(yTest, predictions),
            yTrue: yTest,
            yPred: predictions,
          };
        }
      }

      setResult(trainResult);

      // Save to history for comparison
      const metricsMap: Record<string, number> = {};
      if (trainResult.accuracy != null)
        metricsMap["Accuracy"] = trainResult.accuracy;
      if (trainResult.precision != null)
        metricsMap["Precision"] = trainResult.precision;
      if (trainResult.recall != null) metricsMap["Recall"] = trainResult.recall;
      if (trainResult.f1 != null) metricsMap["F1"] = trainResult.f1;
      if (trainResult.mae != null) metricsMap["MAE"] = trainResult.mae;
      if (trainResult.rmse != null) metricsMap["RMSE"] = trainResult.rmse;
      if (trainResult.r2 != null) metricsMap["R²"] = trainResult.r2;
      if (trainResult.inertiaVal != null)
        metricsMap["Inertia"] = trainResult.inertiaVal;
      if (trainResult.silhouette != null)
        metricsMap["Silhouette"] = trainResult.silhouette;

      const paramStr =
        algorithm.id === "knn"
          ? `k=${params.k}`
          : algorithm.id === "logistic"
            ? `lr=${params.learningRate}, ep=${params.epochs}`
            : algorithm.id === "linear"
              ? `intercept=${params.fitIntercept}`
              : `k=${params.kClusters}`;

      const entry: CompareEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: Date.now(),
        dataset: dataset.name,
        algorithm: algorithm.name,
        params: paramStr,
        type: trainResult.type,
        metrics: metricsMap,
      };
      saveToHistory(entry);
      setHistory(loadHistory());
    } catch (err) {
      console.error("Training error:", err);
      setProgressLabel("Error during training");
    } finally {
      setIsTraining(false);
    }
  }, [dataset, algorithm, params, splitRatio, doNormalize, selectedFeatures]);

  const handleClearHistory = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  const handleExport = useCallback(() => {
    const json = JSON.stringify(history, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ml-calculator-history.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [history]);

  return (
    <div className="mlc-root">
      {/* ─── Header ─── */}
      <div className="mlc-header">
        <div className="mlc-header-left">
          <span className="mlc-logo">🧮</span>
          <h2 className="mlc-title">ML Calculator</h2>
          <span className="mlc-subtitle">Mini Trainer & Metrics Estimator</span>
        </div>
        <div className="mlc-tabs">
          <button
            className={`mlc-tab ${activeTab === "train" ? "active" : ""}`}
            onClick={() => setActiveTab("train")}
          >
            🚀 Train
          </button>
          <button
            className={`mlc-tab ${activeTab === "compare" ? "active" : ""}`}
            onClick={() => setActiveTab("compare")}
          >
            🆚 Compare{history.length > 0 ? ` (${history.length})` : ""}
          </button>
        </div>
      </div>

      {/* ─── Body ─── */}
      <div className="mlc-body">
        {activeTab === "train" ? (
          <>
            {/* Left sidebar */}
            <div className="mlc-sidebar">
              <DatasetSelector
                datasets={ALL_DATASETS}
                selected={dataset}
                onSelect={handleSelectDataset}
              />
              <AlgorithmSelector
                datasetType={dataset?.type ?? null}
                selected={algorithm}
                onSelect={handleSelectAlgorithm}
              />
              <HyperParamsPanel
                algorithmId={algorithm?.id ?? null}
                params={params}
                onChange={setParams}
              />
            </div>

            {/* Center */}
            <div className="mlc-center">
              <TrainPanel
                splitRatio={splitRatio}
                onSplitChange={setSplitRatio}
                doNormalize={doNormalize}
                onNormalizeChange={setDoNormalize}
                featureNames={featureNames}
                selectedFeatures={selectedFeatures}
                onFeaturesChange={setSelectedFeatures}
                canTrain={canTrain}
                isTraining={isTraining}
                progress={progress}
                progressLabel={progressLabel}
                onTrain={handleTrain}
              />
              {result && <ResultsPanel result={result} />}
            </div>

            {/* Right — Charts */}
            <div className="mlc-right">
              {result ? (
                <ChartPanel result={result} />
              ) : (
                <div className="mlc-chart-placeholder">
                  <div className="mlc-placeholder-icon">📊</div>
                  <p>Charts will appear after training</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="mlc-compare-full">
            <ComparePanel
              history={history}
              onClear={handleClearHistory}
              onExport={handleExport}
            />
          </div>
        )}
      </div>
    </div>
  );
};
