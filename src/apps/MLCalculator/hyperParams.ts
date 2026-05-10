export interface HyperParams {
  // KNN
  k: number;
  // Logistic Regression
  learningRate: number;
  epochs: number;
  // Linear Regression
  fitIntercept: boolean;
  // KMeans
  kClusters: number;
}

export const DEFAULT_PARAMS: HyperParams = {
  k: 5,
  learningRate: 0.1,
  epochs: 100,
  fitIntercept: true,
  kClusters: 4,
};
