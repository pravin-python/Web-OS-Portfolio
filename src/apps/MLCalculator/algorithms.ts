export interface AlgorithmDef {
  id: string;
  name: string;
  type: "classification" | "regression" | "clustering";
  description: string;
  icon: string;
}

export const ALGORITHMS: AlgorithmDef[] = [
  {
    id: "knn",
    name: "K-Nearest Neighbors",
    type: "classification",
    description: "Classifies by majority vote of k nearest training samples",
    icon: "🎯",
  },
  {
    id: "logistic",
    name: "Logistic Regression",
    type: "classification",
    description: "Gradient descent on sigmoid — linear decision boundary",
    icon: "📈",
  },
  {
    id: "linear",
    name: "Linear Regression",
    type: "regression",
    description: "Normal equation — fits a linear model to numeric targets",
    icon: "📐",
  },
  {
    id: "kmeans",
    name: "K-Means",
    type: "clustering",
    description: "Partitions data into k clusters by minimizing inertia",
    icon: "🔬",
  },
];
