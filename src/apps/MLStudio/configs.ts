import type { DatasetConfig, AlgorithmConfig } from "./types";

export const DATASETS: DatasetConfig[] = [
  {
    id: "iris",
    name: "Iris Dataset",
    type: "classification",
    description:
      "Classic classification dataset. Predict iris species (3 classes) from sepal/petal dimensions.",
    samples: 150,
    features: 4,
    classes: 3,
  },
  {
    id: "wine",
    name: "Wine Recognition",
    type: "classification",
    description:
      "Chemical analysis of wines grown in Italy. Predict one of 3 cultivators.",
    samples: 178,
    features: 13,
    classes: 3,
  },
  {
    id: "breast_cancer",
    name: "Breast Cancer Wisconsin",
    type: "classification",
    description:
      "Predict whether a tumor is benign or malignant from digitized images of FHAs.",
    samples: 569,
    features: 30,
    classes: 2,
  },
  {
    id: "california_housing",
    name: "California Housing",
    type: "regression",
    description:
      "Predict median house value using 8 features like income, age, rooms, and location.",
    samples: 20640,
    features: 8,
  },
  {
    id: "blobs",
    name: "Synthetic Blobs",
    type: "clustering",
    description:
      "Synthetic dataset with 4 natural, well-separated cluster centers for K-Means/DBSCAN.",
    samples: 300,
    features: 2,
  },
];

export const ALGORITHMS: AlgorithmConfig[] = [
  // Classification
  {
    id: "random_forest_clf",
    name: "Random Forest Classifier",
    type: "classification",
    hyperParams: { n_estimators: 100, max_depth: 0 },
  },
  {
    id: "svm_clf",
    name: "Support Vector Machine (SVM)",
    type: "classification",
    hyperParams: { C: 1.0, kernel: "rbf" },
  },
  {
    id: "logistic_reg",
    name: "Logistic Regression",
    type: "classification",
    hyperParams: { C: 1.0, max_iter: 100 },
  },
  {
    id: "gradient_boosting_clf",
    name: "Gradient Boosting",
    type: "classification",
    hyperParams: { n_estimators: 100, learning_rate: 0.1 },
  },
  {
    id: "knn_clf",
    name: "K-Nearest Neighbors",
    type: "classification",
    hyperParams: { n_neighbors: 5 },
  },
  // Regression
  {
    id: "linear_reg",
    name: "Linear Regression",
    type: "regression",
    hyperParams: { fit_intercept: true },
  },
  {
    id: "random_forest_reg",
    name: "Random Forest Regressor",
    type: "regression",
    hyperParams: { n_estimators: 100 },
  },
  // Clustering
  {
    id: "kmeans",
    name: "K-Means",
    type: "clustering",
    hyperParams: { n_clusters: 3 },
  },
  {
    id: "dbscan",
    name: "DBSCAN",
    type: "clustering",
    hyperParams: { eps: 0.5, min_samples: 5 },
  },
];
