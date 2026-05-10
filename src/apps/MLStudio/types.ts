// ml_studio_types

/** Supported ML task types */
export type MLTaskType = "classification" | "regression" | "clustering";

/** Standard structure for datasets */
export interface DatasetConfig {
  id: string;
  name: string;
  type: MLTaskType;
  description: string;
  samples: number;
  features: number;
  classes?: number; // Only for classification
}

/** Structure telling python what algorithm and params to use */
export interface AlgorithmConfig {
  id: string;
  name: string;
  type: MLTaskType;
  hyperParams: Record<string, number | string | boolean>;
}

/** Result shape returned from Python */
export interface BaseResult {
  type: MLTaskType;
  timeMs: number;
}

export interface ClassificationResult extends BaseResult {
  type: "classification";
  accuracy: number;
  precision: number; // macro
  recall: number; // macro
  f1: number; // macro
  confusionMatrix: number[][]; // N x N
  classNames: string[];
}

export interface RegressionResult extends BaseResult {
  type: "regression";
  mse: number;
  mae: number;
  rmse: number;
  r2: number;
  // subset of actual vs predicted for scatter plot (first 100 max)
  yTrueSample: number[];
  yPredSample: number[];
}

export interface ClusteringResult extends BaseResult {
  type: "clustering";
  silhouetteScore: number | null;
  inertia: number | null;
  clusterSizes: Record<string, number>;
  // For 2D plotting of clusters (first 200 max)
  plotData: { x: number; y: number; cluster: number }[];
}

export type TrainResult =
  | ClassificationResult
  | RegressionResult
  | ClusteringResult;

export interface CompareEntry {
  id: string;
  timestamp: number;
  datasetName: string;
  algorithmName: string;
  taskType: MLTaskType;
  params: Record<string, number | string | boolean>;
  testSize: number;
  metrics: {
    accuracy?: number;
    f1?: number;
    rmse?: number;
    r2?: number;
    silhouette?: number;
  };
  timeMs: number;
}
