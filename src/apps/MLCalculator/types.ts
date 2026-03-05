/* ─── Result type (shared across components) ─── */
export interface TrainResult {
  type: "classification" | "regression" | "clustering";
  // classification
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1?: number;
  confusionMatrix?: number[][];
  classNames?: string[];
  yTrue?: number[];
  yPred?: number[];
  // regression
  mae?: number;
  mse?: number;
  rmse?: number;
  r2?: number;
  // clustering
  clusterSizesMap?: Map<number, number>;
  inertiaVal?: number;
  silhouette?: number;
  clusterData?: number[][];
  clusterLabels?: number[];
}
