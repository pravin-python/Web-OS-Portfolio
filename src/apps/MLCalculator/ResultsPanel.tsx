import React from "react";
import { ConfusionMatrix } from "./ConfusionMatrix";
import { MetricsTable } from "./MetricsTable";
import type { TrainResult } from "./types";

interface Props {
  result: TrainResult;
}

export const ResultsPanel: React.FC<Props> = ({ result }) => {
  if (result.type === "classification") {
    const metrics = [
      {
        label: "Accuracy",
        value: result.accuracy!,
        format: "percent" as const,
      },
      {
        label: "Precision (macro)",
        value: result.precision!,
        format: "percent" as const,
      },
      {
        label: "Recall (macro)",
        value: result.recall!,
        format: "percent" as const,
      },
      { label: "F1 Score", value: result.f1!, format: "percent" as const },
    ];
    return (
      <div className="mlc-results-inner mlc-animate-in">
        <MetricsTable metrics={metrics} title="Classification Metrics" />
        {result.confusionMatrix && result.classNames && (
          <ConfusionMatrix
            matrix={result.confusionMatrix}
            classNames={result.classNames}
          />
        )}
      </div>
    );
  }

  if (result.type === "regression") {
    const metrics = [
      { label: "MAE", value: result.mae!, format: "number" as const },
      { label: "MSE", value: result.mse!, format: "number" as const },
      { label: "RMSE", value: result.rmse!, format: "number" as const },
      { label: "R² Score", value: result.r2!, format: "number" as const },
    ];
    return (
      <div className="mlc-results-inner mlc-animate-in">
        <MetricsTable metrics={metrics} title="Regression Metrics" />
      </div>
    );
  }

  if (result.type === "clustering") {
    const sizeMetrics = Array.from(result.clusterSizesMap?.entries() ?? []).map(
      ([k, v]) => ({
        label: `Cluster ${k} size`,
        value: v,
        format: "number" as const,
      }),
    );
    const overallMetrics = [
      {
        label: "Inertia (SSE)",
        value: result.inertiaVal!,
        format: "number" as const,
      },
      ...(result.silhouette != null
        ? [
            {
              label: "Silhouette Score",
              value: result.silhouette,
              format: "number" as const,
            },
          ]
        : []),
    ];
    return (
      <div className="mlc-results-inner mlc-animate-in">
        <MetricsTable metrics={overallMetrics} title="Clustering Metrics" />
        <MetricsTable metrics={sizeMetrics} title="Cluster Sizes" />
      </div>
    );
  }

  return null;
};
