export interface MLAlgorithm {
  id: string;
  category: string;
  subcategory: string;
  title: string;
  concept: string;
  whenToUse: string;
  howItWorks: string[];
  pythonCode: string;
  examples: string[];
  diagram: string;
}

export const ML_CATEGORIES = [
  { key: "all", label: "All" },
  { key: "supervised", label: "Supervised" },
  { key: "unsupervised", label: "Unsupervised" },
  { key: "semi-supervised", label: "Semi-Supervised" },
  { key: "self-supervised", label: "Self-Supervised" },
  { key: "reinforcement", label: "Reinforcement" },
] as const;

export type CategoryKey = (typeof ML_CATEGORIES)[number]["key"];

export const ML_INTRO = {
  whatIsML: `Machine Learning is a branch of Artificial Intelligence that enables systems to learn from data, detect patterns, and make predictions without being explicitly programmed.\n\nInstead of writing rules manually, ML algorithms build mathematical models from training data to make decisions or predictions on new, unseen data.`,
  typesOfML: [
    "Supervised Learning — learns from labeled data (input-output pairs)",
    "Unsupervised Learning — discovers hidden patterns in unlabeled data",
    "Semi-Supervised Learning — combines small labeled data with large unlabeled data",
    "Self-Supervised Learning — generates labels from the data itself",
    "Reinforcement Learning — learns by interacting with an environment and receiving rewards",
  ],
  useCases: [
    "Recommendation systems (Netflix, Spotify)",
    "Spam and fraud detection",
    "Image and speech recognition",
    "Medical diagnosis and drug discovery",
    "Autonomous vehicles",
    "Natural language processing (ChatGPT)",
  ],
};

/* ═══ SVG Diagram Helpers ═══ */
const c = (cx: number, cy: number, r: number, fill: string, label: string) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" opacity="0.85"/><text x="${cx}" y="${cy + 4}" text-anchor="middle" fill="#fff" font-size="10" font-family="monospace">${label}</text>`;
const bx = (
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
  label: string,
) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${fill}" opacity="0.85"/><text x="${x + w / 2}" y="${y + h / 2 + 4}" text-anchor="middle" fill="#fff" font-size="10" font-family="monospace">${label}</text>`;
const ln = (x1: number, y1: number, x2: number, y2: number) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#9999b0" stroke-width="1.5"/>`;

/* ═══ ALGORITHMS ═══ */
export const ML_ALGORITHMS: MLAlgorithm[] = [
  // ── SUPERVISED > CLASSIFICATION ──
  {
    id: "logistic-regression",
    category: "supervised",
    subcategory: "Classification",
    title: "Logistic Regression",
    concept:
      "A linear model for binary classification that uses the sigmoid function to map predicted values to probabilities between 0 and 1. Despite its name, it is used for classification, not regression.",
    whenToUse:
      "Binary classification problems like spam detection, disease prediction, or customer churn. Works best when the decision boundary is approximately linear and features are not highly correlated.",
    howItWorks: [
      "Compute weighted sum of input features: z = w·x + b",
      "Apply sigmoid function: σ(z) = 1 / (1 + e^(-z))",
      "Output probability between 0 and 1",
      "Apply threshold (usually 0.5) for classification",
      "Optimize weights using gradient descent on log-loss",
    ],
    pythonCode: `from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.datasets import load_breast_cancer

# Load dataset
data = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.2, random_state=42
)

# Train model
model = LogisticRegression(max_iter=10000)
model.fit(X_train, y_train)

# Predict
predictions = model.predict(X_test)
accuracy = model.score(X_test, y_test)
print(f"Accuracy: {accuracy:.2%}")`,
    examples: [
      "Email spam detection",
      "Disease diagnosis (malignant vs benign)",
      "Customer churn prediction",
    ],
    diagram: `<svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg">${bx(10, 50, 70, 35, "#3b8beb", "Features")}${ln(80, 67, 110, 67)}${bx(110, 50, 70, 35, "#bf5af2", "Σ w·x+b")}${ln(180, 67, 210, 67)}${bx(210, 50, 70, 35, "#30d158", "σ(z)")}${ln(280, 67, 300, 67)}<text x="305" y="72" fill="#ffd60a" font-size="11" font-family="monospace">0/1</text><text x="160" y="30" text-anchor="middle" fill="#9999b0" font-size="10" font-family="monospace">Sigmoid: 1/(1+e^-z)</text></svg>`,
  },
  {
    id: "knn",
    category: "supervised",
    subcategory: "Classification",
    title: "K-Nearest Neighbors",
    concept:
      "A non-parametric algorithm that classifies data points based on the majority class of their K nearest neighbors in feature space. It stores the entire training dataset and makes predictions by computing distances.",
    whenToUse:
      "Small to medium datasets with clear class boundaries. Good for recommendation systems and pattern recognition. Avoid with high-dimensional or very large datasets.",
    howItWorks: [
      "Store all training data points",
      "For a new point, compute distance to all training points",
      "Select the K nearest neighbors",
      "Majority vote determines the class label",
      "Common distances: Euclidean, Manhattan, Minkowski",
    ],
    pythonCode: `from sklearn.neighbors import KNeighborsClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

data = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.2, random_state=42
)

knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train, y_train)
print(f"Accuracy: {knn.score(X_test, y_test):.2%}")`,
    examples: [
      "Handwriting recognition",
      "Movie recommendation",
      "Medical diagnosis",
    ],
    diagram: `<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">${c(100, 80, 14, "#ffd60a", "?")}${c(70, 50, 10, "#3b8beb", "A")}${c(130, 55, 10, "#3b8beb", "A")}${c(80, 110, 10, "#ff453a", "B")}${c(60, 90, 10, "#3b8beb", "A")}${c(140, 100, 10, "#ff453a", "B")}<circle cx="100" cy="80" r="40" fill="none" stroke="#ffd60a" stroke-width="1" stroke-dasharray="4" opacity="0.6"/><text x="100" y="145" text-anchor="middle" fill="#9999b0" font-size="10" font-family="monospace">K=3 → Class A wins</text></svg>`,
  },
  {
    id: "decision-tree",
    category: "supervised",
    subcategory: "Classification",
    title: "Decision Tree",
    concept:
      "A tree-structured model that makes decisions by splitting data based on feature values. Each internal node tests a feature, each branch represents an outcome, and each leaf node holds a class label or value.",
    whenToUse:
      "When you need interpretable models. Great for feature importance analysis, handling both numerical and categorical data. Prone to overfitting on complex datasets.",
    howItWorks: [
      "Select the best feature to split on (using Gini impurity or entropy)",
      "Split the dataset into subsets based on feature values",
      "Recursively repeat for each subset",
      "Stop when a stopping criterion is met (max depth, min samples)",
      "Assign class label at leaf nodes",
    ],
    pythonCode: `from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

data = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.2, random_state=42
)

tree = DecisionTreeClassifier(max_depth=4, random_state=42)
tree.fit(X_train, y_train)
print(f"Accuracy: {tree.score(X_test, y_test):.2%}")
print(f"Feature importances: {tree.feature_importances_}")`,
    examples: [
      "Loan approval systems",
      "Medical diagnosis flowcharts",
      "Customer segmentation",
    ],
    diagram: `<svg viewBox="0 0 260 150" xmlns="http://www.w3.org/2000/svg">${bx(90, 5, 80, 28, "#ffd60a", "Age>30?")}${ln(130, 33, 60, 55)}${ln(130, 33, 200, 55)}${bx(20, 55, 80, 28, "#3b8beb", "Inc>50k?")}${bx(160, 55, 80, 28, "#30d158", "Yes ✓")}${ln(60, 83, 30, 105)}${ln(60, 83, 90, 105)}${bx(5, 105, 55, 25, "#ff453a", "No")}${bx(65, 105, 55, 25, "#30d158", "Yes")}</svg>`,
  },
  {
    id: "random-forest",
    category: "supervised",
    subcategory: "Classification",
    title: "Random Forest",
    concept:
      "An ensemble method that builds multiple decision trees on random subsets of data and features, then combines their predictions through majority voting. This reduces overfitting and improves generalization.",
    whenToUse:
      "General-purpose classification and regression. Handles high-dimensional data well, robust to outliers and noise. Great default choice when you need high accuracy without much tuning.",
    howItWorks: [
      "Create N bootstrap samples from training data",
      "Build a decision tree for each sample using random feature subsets",
      "Each tree makes an independent prediction",
      "Combine predictions via majority voting (classification) or averaging (regression)",
      "Out-of-bag samples used for validation",
    ],
    pythonCode: `from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split

data = load_wine()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.2, random_state=42
)

rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)
print(f"Accuracy: {rf.score(X_test, y_test):.2%}")`,
    examples: [
      "Credit scoring",
      "Stock market prediction",
      "Disease outbreak prediction",
    ],
    diagram: `<svg viewBox="0 0 300 120" xmlns="http://www.w3.org/2000/svg">${bx(5, 5, 55, 25, "#3b8beb", "Tree 1")}${bx(70, 5, 55, 25, "#bf5af2", "Tree 2")}${bx(135, 5, 55, 25, "#30d158", "Tree 3")}${bx(200, 5, 55, 25, "#ff9f0a", "... N")}${ln(32, 30, 140, 55)}${ln(97, 30, 140, 55)}${ln(162, 30, 140, 55)}${ln(227, 30, 140, 55)}${bx(100, 55, 80, 28, "#ffd60a", "Vote")}${ln(140, 83, 140, 95)}${bx(100, 95, 80, 25, "#30d158", "Result")}</svg>`,
  },
  {
    id: "gradient-boosting",
    category: "supervised",
    subcategory: "Classification",
    title: "Gradient Boosting",
    concept:
      "An ensemble technique that builds trees sequentially, where each new tree corrects the errors of the previous ones. Uses gradient descent to minimize the loss function. XGBoost and LightGBM are popular implementations.",
    whenToUse:
      "Kaggle competitions, structured/tabular data, when you need state-of-the-art accuracy. Handles mixed feature types and missing values. More prone to overfitting than Random Forest if not tuned.",
    howItWorks: [
      "Start with an initial prediction (e.g., mean)",
      "Compute residuals (errors) of current model",
      "Fit a new tree to the residuals",
      "Add the new tree's predictions (scaled by learning rate) to the ensemble",
      "Repeat for N iterations",
    ],
    pythonCode: `from sklearn.ensemble import GradientBoostingClassifier
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split

data = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.2, random_state=42
)

gb = GradientBoostingClassifier(
    n_estimators=100, learning_rate=0.1, max_depth=3
)
gb.fit(X_train, y_train)
print(f"Accuracy: {gb.score(X_test, y_test):.2%}")`,
    examples: [
      "Click-through rate prediction",
      "Fraud detection",
      "Search ranking",
    ],
    diagram: `<svg viewBox="0 0 320 90" xmlns="http://www.w3.org/2000/svg">${bx(5, 30, 60, 30, "#3b8beb", "Model₁")}${ln(65, 45, 80, 45)}${bx(80, 10, 50, 25, "#ff453a", "Error")}${ln(130, 22, 145, 35)}${bx(145, 30, 60, 30, "#bf5af2", "Model₂")}${ln(205, 45, 220, 45)}${bx(220, 10, 50, 25, "#ff453a", "Error")}${ln(270, 22, 275, 35)}<text x="290" y="50" fill="#9999b0" font-size="14" font-family="monospace">...</text></svg>`,
  },
  {
    id: "naive-bayes",
    category: "supervised",
    subcategory: "Classification",
    title: "Naive Bayes",
    concept:
      "A probabilistic classifier based on Bayes' theorem with a 'naive' assumption that features are conditionally independent given the class. Despite this simplification, it performs surprisingly well on many real-world problems.",
    whenToUse:
      "Text classification (spam filtering, sentiment analysis), real-time prediction, when training data is limited. Works well with high-dimensional sparse data.",
    howItWorks: [
      "Calculate prior probability P(class) for each class",
      "For each feature, calculate likelihood P(feature|class)",
      "Apply Bayes theorem: P(class|features) ∝ P(class) × ∏P(feature_i|class)",
      "Select the class with highest posterior probability",
    ],
    pythonCode: `from sklearn.naive_bayes import GaussianNB
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

data = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.2, random_state=42
)

nb = GaussianNB()
nb.fit(X_train, y_train)
print(f"Accuracy: {nb.score(X_test, y_test):.2%}")`,
    examples: [
      "Email spam filtering",
      "Sentiment analysis",
      "Document categorization",
    ],
    diagram: `<svg viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg">${bx(5, 35, 70, 30, "#3b8beb", "P(class)")}${ln(75, 50, 90, 50)}${bx(90, 35, 70, 30, "#bf5af2", "P(x|cls)")}${ln(160, 50, 175, 50)}<text x="180" y="55" fill="#ffd60a" font-size="16" font-family="monospace">×</text>${ln(195, 50, 210, 50)}${bx(210, 35, 80, 30, "#30d158", "P(cls|x)")}</svg>`,
  },
  {
    id: "svm",
    category: "supervised",
    subcategory: "Classification",
    title: "Support Vector Machine",
    concept:
      "SVM finds the optimal hyperplane that maximizes the margin between classes. It can handle non-linear boundaries using kernel functions that map data to higher dimensions.",
    whenToUse:
      "Small to medium datasets, text classification, image recognition. Effective in high-dimensional spaces. Use kernel trick for non-linear decision boundaries.",
    howItWorks: [
      "Find the hyperplane that best separates classes",
      "Maximize the margin between closest points (support vectors)",
      "Use kernel trick (RBF, polynomial) for non-linear boundaries",
      "Soft margin allows some misclassification via C parameter",
    ],
    pythonCode: `from sklearn.svm import SVC
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

data = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.2, random_state=42
)

scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

svm = SVC(kernel='rbf', C=1.0)
svm.fit(X_train, y_train)
print(f"Accuracy: {svm.score(X_test, y_test):.2%}")`,
    examples: [
      "Handwriting recognition",
      "Face detection",
      "Protein classification",
    ],
    diagram: `<svg viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg"><line x1="110" y1="10" x2="110" y2="150" stroke="#ffd60a" stroke-width="2" stroke-dasharray="6"/><line x1="90" y1="10" x2="90" y2="150" stroke="#9999b0" stroke-width="1" stroke-dasharray="3" opacity="0.5"/><line x1="130" y1="10" x2="130" y2="150" stroke="#9999b0" stroke-width="1" stroke-dasharray="3" opacity="0.5"/>${c(50, 40, 8, "#3b8beb", "●")}${c(30, 80, 8, "#3b8beb", "●")}${c(60, 110, 8, "#3b8beb", "●")}${c(90, 70, 8, "#3b8beb", "★")}${c(160, 50, 8, "#ff453a", "●")}${c(180, 90, 8, "#ff453a", "●")}${c(150, 120, 8, "#ff453a", "●")}${c(130, 100, 8, "#ff453a", "★")}<text x="110" y="155" text-anchor="middle" fill="#ffd60a" font-size="9" font-family="monospace">margin</text></svg>`,
  },
  // ── SUPERVISED > REGRESSION ──
  {
    id: "linear-regression",
    category: "supervised",
    subcategory: "Regression",
    title: "Linear Regression",
    concept:
      "Fits a straight line (or hyperplane) to data by minimizing the sum of squared residuals. The simplest and most interpretable regression algorithm. Assumes a linear relationship between features and target.",
    whenToUse:
      "Predicting continuous values when you expect a linear relationship. House price prediction, sales forecasting, trend analysis. Use as a baseline before trying complex models.",
    howItWorks: [
      "Assume y = w₁x₁ + w₂x₂ + ... + b",
      "Compute predictions for all training samples",
      "Calculate Mean Squared Error (MSE) loss",
      "Use gradient descent or normal equation to find optimal weights",
      "Predict on new data using learned weights",
    ],
    pythonCode: `from sklearn.linear_model import LinearRegression
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

data = fetch_california_housing()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.2, random_state=42
)

model = LinearRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)
mse = mean_squared_error(y_test, predictions)
print(f"MSE: {mse:.4f}, R²: {model.score(X_test, y_test):.4f}")`,
    examples: [
      "House price prediction",
      "Sales forecasting",
      "Salary estimation",
    ],
    diagram: `<svg viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg"><line x1="30" y1="120" x2="200" y2="30" stroke="#ffd60a" stroke-width="2"/>${c(45, 105, 5, "#3b8beb", "")}${c(70, 95, 5, "#3b8beb", "")}${c(90, 80, 5, "#3b8beb", "")}${c(120, 70, 5, "#3b8beb", "")}${c(150, 55, 5, "#3b8beb", "")}${c(175, 40, 5, "#3b8beb", "")}${c(60, 110, 5, "#ff453a", "")}${c(110, 60, 5, "#ff453a", "")}${c(140, 65, 5, "#ff453a", "")}<text x="110" y="145" text-anchor="middle" fill="#9999b0" font-size="10" font-family="monospace">y = wx + b</text></svg>`,
  },
  // ── UNSUPERVISED > CLUSTERING ──
  {
    id: "kmeans",
    category: "unsupervised",
    subcategory: "Clustering",
    title: "K-Means Clustering",
    concept:
      "Partitions data into K clusters by iteratively assigning points to the nearest centroid and updating centroids to be the mean of assigned points. Converges when assignments no longer change.",
    whenToUse:
      "Customer segmentation, image compression, anomaly detection. When you want to group similar data points. Need to specify K in advance. Works best with spherical clusters.",
    howItWorks: [
      "Initialize K centroids randomly",
      "Assign each point to the nearest centroid",
      "Recompute centroids as the mean of assigned points",
      "Repeat until convergence (no change in assignments)",
      "Use elbow method or silhouette score to choose K",
    ],
    pythonCode: `from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
import numpy as np

X, _ = make_blobs(n_samples=300, centers=3, random_state=42)

kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
kmeans.fit(X)

labels = kmeans.labels_
centroids = kmeans.cluster_centers_
print(f"Inertia: {kmeans.inertia_:.2f}")
print(f"Centroids:\\n{centroids}")`,
    examples: [
      "Customer segmentation",
      "Image color quantization",
      "Document grouping",
    ],
    diagram: `<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">${c(40, 40, 6, "#3b8beb", "")}${c(55, 55, 6, "#3b8beb", "")}${c(35, 60, 6, "#3b8beb", "")}${c(50, 45, 10, "#3b8beb", "C₁")}${c(150, 40, 6, "#30d158", "")}${c(160, 55, 6, "#30d158", "")}${c(145, 50, 6, "#30d158", "")}${c(155, 45, 10, "#30d158", "C₂")}${c(100, 120, 6, "#bf5af2", "")}${c(90, 130, 6, "#bf5af2", "")}${c(110, 125, 6, "#bf5af2", "")}${c(100, 125, 10, "#bf5af2", "C₃")}</svg>`,
  },
  // ── UNSUPERVISED > DIMENSIONALITY REDUCTION ──
  {
    id: "pca",
    category: "unsupervised",
    subcategory: "Dimensionality Reduction",
    title: "PCA (Principal Component Analysis)",
    concept:
      "Finds orthogonal directions (principal components) that capture the maximum variance in data. Projects high-dimensional data onto fewer dimensions while preserving as much information as possible.",
    whenToUse:
      "Feature reduction before training models, data visualization (2D/3D), noise reduction, when you have many correlated features. Common preprocessing step.",
    howItWorks: [
      "Standardize the data (zero mean, unit variance)",
      "Compute the covariance matrix",
      "Calculate eigenvalues and eigenvectors",
      "Sort eigenvectors by eigenvalue (explained variance)",
      "Project data onto top-k eigenvectors",
    ],
    pythonCode: `from sklearn.decomposition import PCA
from sklearn.datasets import load_iris
from sklearn.preprocessing import StandardScaler

data = load_iris()
X_scaled = StandardScaler().fit_transform(data.data)

pca = PCA(n_components=2)
X_reduced = pca.fit_transform(X_scaled)

print(f"Original shape: {data.data.shape}")
print(f"Reduced shape: {X_reduced.shape}")
print(f"Explained variance: {pca.explained_variance_ratio_}")`,
    examples: [
      "Face recognition (Eigenfaces)",
      "Gene expression analysis",
      "Image compression",
    ],
    diagram: `<svg viewBox="0 0 240 140" xmlns="http://www.w3.org/2000/svg"><line x1="30" y1="110" x2="200" y2="30" stroke="#ffd60a" stroke-width="2"/><line x1="30" y1="30" x2="130" y2="130" stroke="#9999b0" stroke-width="1" stroke-dasharray="4" opacity="0.4"/>${c(60, 95, 4, "#3b8beb", "")}${c(80, 85, 4, "#3b8beb", "")}${c(100, 75, 4, "#3b8beb", "")}${c(120, 65, 4, "#3b8beb", "")}${c(140, 55, 4, "#3b8beb", "")}${c(90, 90, 4, "#30d158", "")}${c(130, 50, 4, "#30d158", "")}${c(110, 80, 4, "#30d158", "")}<text x="195" y="25" fill="#ffd60a" font-size="9" font-family="monospace">PC1</text><text x="125" y="138" fill="#9999b0" font-size="9" font-family="monospace">PC2</text></svg>`,
  },
  // ── SUPERVISED > CLASSIFICATION (continued) ──
  {
    id: "neural-networks",
    category: "supervised",
    subcategory: "Classification",
    title: "Neural Networks (MLP)",
    concept:
      "Multi-layer perceptrons consist of interconnected layers of neurons. Each neuron applies a weighted sum followed by a non-linear activation. Deep networks can learn complex, non-linear decision boundaries.",
    whenToUse:
      "Complex pattern recognition: image classification, NLP, speech recognition. When you have large amounts of data and computational resources. Use CNNs for images, RNNs for sequences.",
    howItWorks: [
      "Input layer receives feature values",
      "Hidden layers apply weights, biases, and activation functions",
      "Forward pass computes predictions",
      "Loss function measures error",
      "Backpropagation updates weights via gradient descent",
    ],
    pythonCode: `from sklearn.neural_network import MLPClassifier
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

data = load_digits()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.2, random_state=42
)
X_train = StandardScaler().fit_transform(X_train)
X_test = StandardScaler().fit_transform(X_test)

mlp = MLPClassifier(hidden_layer_sizes=(128, 64), max_iter=300)
mlp.fit(X_train, y_train)
print(f"Accuracy: {mlp.score(X_test, y_test):.2%}")`,
    examples: [
      "Image classification",
      "Speech recognition",
      "Language translation",
    ],
    diagram: `<svg viewBox="0 0 260 140" xmlns="http://www.w3.org/2000/svg">${c(30, 30, 12, "#3b8beb", "x₁")}${c(30, 70, 12, "#3b8beb", "x₂")}${c(30, 110, 12, "#3b8beb", "x₃")}${c(130, 25, 12, "#bf5af2", "h₁")}${c(130, 65, 12, "#bf5af2", "h₂")}${c(130, 105, 12, "#bf5af2", "h₃")}${c(230, 50, 12, "#30d158", "y₁")}${c(230, 90, 12, "#30d158", "y₂")}${ln(42, 30, 118, 25)}${ln(42, 30, 118, 65)}${ln(42, 70, 118, 25)}${ln(42, 70, 118, 65)}${ln(42, 70, 118, 105)}${ln(42, 110, 118, 65)}${ln(42, 110, 118, 105)}${ln(142, 25, 218, 50)}${ln(142, 25, 218, 90)}${ln(142, 65, 218, 50)}${ln(142, 65, 218, 90)}${ln(142, 105, 218, 50)}${ln(142, 105, 218, 90)}<text x="30" y="138" text-anchor="middle" fill="#9999b0" font-size="8" font-family="monospace">Input</text><text x="130" y="138" text-anchor="middle" fill="#9999b0" font-size="8" font-family="monospace">Hidden</text><text x="230" y="138" text-anchor="middle" fill="#9999b0" font-size="8" font-family="monospace">Output</text></svg>`,
  },
  // ── SUPERVISED > REGRESSION (continued) ──
  {
    id: "polynomial-regression",
    category: "supervised",
    subcategory: "Regression",
    title: "Polynomial Regression",
    concept:
      "Extends linear regression by adding polynomial features (x², x³, etc.) to capture non-linear relationships. The model is still 'linear' in terms of weights, but the feature space is expanded.",
    whenToUse:
      "When the relationship between features and target is non-linear but can be approximated by a polynomial curve. Growth analysis, physics modeling.",
    howItWorks: [
      "Transform features into polynomial features (x → x, x², x³...)",
      "Apply linear regression on the expanded feature set",
      "Higher degree captures more complex curves",
      "Risk of overfitting with high degree — use regularization",
    ],
    pythonCode: `from sklearn.preprocessing import PolumialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import make_pipeline
import numpy as np

X = np.array([1,2,3,4,5]).reshape(-1,1)
y = np.array([1,4,9,16,25])

model = make_pipeline(PolynomialFeatures(degree=2), LinearRegression())
model.fit(X, y)
print(f"Prediction for x=6: {model.predict([[6]])[0]:.1f}")`,
    examples: [
      "Growth curve modeling",
      "Physics trajectory prediction",
      "Economic trend analysis",
    ],
    diagram: `<svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg"><path d="M 20 120 Q 60 100 100 60 Q 140 20 200 15" fill="none" stroke="#ffd60a" stroke-width="2"/>${c(30, 115, 5, "#3b8beb", "")}${c(60, 100, 5, "#3b8beb", "")}${c(100, 58, 5, "#3b8beb", "")}${c(140, 25, 5, "#3b8beb", "")}${c(180, 18, 5, "#3b8beb", "")}<text x="110" y="135" text-anchor="middle" fill="#9999b0" font-size="10" font-family="monospace">y = ax² + bx + c</text></svg>`,
  },
  {
    id: "ridge-regression",
    category: "supervised",
    subcategory: "Regression",
    title: "Ridge Regression",
    concept:
      "Linear regression with L2 regularization that adds a penalty term (α × Σw²) to prevent large weights. This reduces overfitting and handles multicollinearity by shrinking coefficients toward zero.",
    whenToUse:
      "When you have many features, multicollinearity, or risk of overfitting. Keeps all features but with smaller weights. Prefer over plain linear regression when features are correlated.",
    howItWorks: [
      "Standard linear regression objective: minimize MSE",
      "Add L2 penalty: + α × Σ(w²)",
      "Larger α → more regularization → smaller weights",
      "Solve using modified normal equation or gradient descent",
    ],
    pythonCode: `from sklearn.linear_model import Ridge
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split

data = fetch_california_housing()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.2, random_state=42
)

ridge = Ridge(alpha=1.0)
ridge.fit(X_train, y_train)
print(f"R² Score: {ridge.score(X_test, y_test):.4f}")`,
    examples: [
      "House price prediction with many features",
      "Financial modeling",
      "Genomics data analysis",
    ],
    diagram: `<svg viewBox="0 0 280 80" xmlns="http://www.w3.org/2000/svg">${bx(5, 25, 70, 30, "#3b8beb", "MSE Loss")}${ln(75, 40, 95, 40)}<text x="100" y="45" fill="#ffd60a" font-size="16" font-family="monospace">+</text>${ln(115, 40, 130, 40)}${bx(130, 25, 70, 30, "#bf5af2", "α × Σw²")}${ln(200, 40, 215, 40)}${bx(215, 25, 60, 30, "#30d158", "Ridge")}</svg>`,
  },
  {
    id: "lasso-regression",
    category: "supervised",
    subcategory: "Regression",
    title: "Lasso Regression",
    concept:
      "Linear regression with L1 regularization (α × Σ|w|). Unlike Ridge, Lasso can shrink some coefficients to exactly zero, performing automatic feature selection.",
    whenToUse:
      "When you suspect some features are irrelevant and want automatic feature selection. Produces sparse models. Useful for high-dimensional datasets.",
    howItWorks: [
      "Standard linear regression objective: minimize MSE",
      "Add L1 penalty: + α × Σ|w|",
      "L1 penalty drives some weights to exactly zero",
      "Remaining non-zero weights indicate important features",
    ],
    pythonCode: `from sklearn.linear_model import Lasso
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split

data = fetch_california_housing()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.2, random_state=42
)

lasso = Lasso(alpha=0.1)
lasso.fit(X_train, y_train)
print(f"R²: {lasso.score(X_test, y_test):.4f}")
print(f"Non-zero features: {(lasso.coef_ != 0).sum()}/{len(lasso.coef_)}")`,
    examples: [
      "Feature selection in genomics",
      "Sparse signal recovery",
      "Text feature selection",
    ],
    diagram: `<svg viewBox="0 0 280 80" xmlns="http://www.w3.org/2000/svg">${bx(5, 25, 70, 30, "#3b8beb", "MSE Loss")}${ln(75, 40, 95, 40)}<text x="100" y="45" fill="#ffd60a" font-size="16" font-family="monospace">+</text>${ln(115, 40, 130, 40)}${bx(130, 25, 70, 30, "#ff453a", "α × Σ|w|")}${ln(200, 40, 215, 40)}${bx(215, 25, 60, 30, "#30d158", "Lasso")}</svg>`,
  },
  // ── UNSUPERVISED > CLUSTERING (continued) ──
  {
    id: "dbscan",
    category: "unsupervised",
    subcategory: "Clustering",
    title: "DBSCAN",
    concept:
      "Density-Based Spatial Clustering of Applications with Noise. Groups together points in high-density regions and marks points in low-density regions as outliers. Does not require specifying K.",
    whenToUse:
      "When clusters have arbitrary shapes, when you don't know K, when you need to detect outliers. Not suitable for varying density clusters.",
    howItWorks: [
      "For each point, find neighbors within radius ε",
      "Core points have ≥ minPts neighbors",
      "Connect core points that are neighbors",
      "Border points near core points join the cluster",
      "Remaining points are marked as noise/outliers",
    ],
    pythonCode: `from sklearn.cluster import DBSCAN
from sklearn.datasets import make_moons
import numpy as np

X, _ = make_moons(n_samples=200, noise=0.05, random_state=42)
db = DBSCAN(eps=0.3, min_samples=5)
labels = db.fit_predict(X)

n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
n_noise = list(labels).count(-1)
print(f"Clusters: {n_clusters}, Noise points: {n_noise}")`,
    examples: [
      "Geographic clustering",
      "Anomaly detection in network traffic",
      "Customer behavior grouping",
    ],
    diagram: `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">${c(40, 40, 6, "#3b8beb", "")}${c(55, 35, 6, "#3b8beb", "")}${c(45, 55, 6, "#3b8beb", "")}${c(60, 50, 6, "#3b8beb", "")}${c(140, 90, 6, "#30d158", "")}${c(155, 85, 6, "#30d158", "")}${c(145, 105, 6, "#30d158", "")}${c(160, 100, 6, "#30d158", "")}${c(100, 130, 6, "#ff453a", "✕")}<text x="100" y="20" text-anchor="middle" fill="#9999b0" font-size="9" font-family="monospace">★ = noise point</text></svg>`,
  },
  {
    id: "hierarchical-clustering",
    category: "unsupervised",
    subcategory: "Clustering",
    title: "Hierarchical Clustering",
    concept:
      "Builds a tree (dendrogram) of clusters by either merging small clusters (agglomerative) or splitting large clusters (divisive). Cut the dendrogram at a chosen height to get K clusters.",
    whenToUse:
      "When you want to visualize cluster relationships, don't know K in advance, or need hierarchical taxonomy. Small to medium datasets.",
    howItWorks: [
      "Start with each point as its own cluster",
      "Compute pairwise distances between clusters",
      "Merge the two closest clusters",
      "Repeat until one cluster remains",
      "Cut the dendrogram at desired level for K clusters",
    ],
    pythonCode: `from sklearn.cluster import AgglomerativeClustering
from sklearn.datasets import make_blobs

X, _ = make_blobs(n_samples=150, centers=3, random_state=42)

hc = AgglomerativeClustering(n_clusters=3, linkage='ward')
labels = hc.fit_predict(X)
print(f"Cluster sizes: {[list(labels).count(i) for i in range(3)]}")`,
    examples: [
      "Gene expression analysis",
      "Document taxonomy",
      "Social network analysis",
    ],
    diagram: `<svg viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg">${ln(30, 100, 30, 60)}${ln(70, 100, 70, 60)}${ln(30, 60, 70, 60)}${ln(50, 60, 50, 30)}${ln(130, 100, 130, 70)}${ln(170, 100, 170, 70)}${ln(130, 70, 170, 70)}${ln(150, 70, 150, 40)}${ln(50, 30, 150, 30)}${ln(100, 30, 100, 10)}${c(30, 105, 6, "#3b8beb", "A")}${c(70, 105, 6, "#3b8beb", "B")}${c(130, 105, 6, "#30d158", "C")}${c(170, 105, 6, "#30d158", "D")}</svg>`,
  },
  // ── UNSUPERVISED > DIMENSIONALITY REDUCTION (continued) ──
  {
    id: "tsne",
    category: "unsupervised",
    subcategory: "Dimensionality Reduction",
    title: "t-SNE",
    concept:
      "t-Distributed Stochastic Neighbor Embedding preserves local structure when projecting high-dimensional data to 2D/3D. Uses probability distributions to model pairwise similarities.",
    whenToUse:
      "Data visualization and exploration. When you want to see clusters in high-dimensional data. Not suitable for preserving global distances or for new data projection.",
    howItWorks: [
      "Compute pairwise similarities in high-dimensional space (Gaussian)",
      "Initialize low-dimensional embedding randomly",
      "Compute pairwise similarities in low-dimensional space (t-distribution)",
      "Minimize KL divergence between the two distributions",
      "Gradient descent updates point positions",
    ],
    pythonCode: `from sklearn.manifold import TSNE
from sklearn.datasets import load_digits

data = load_digits()
tsne = TSNE(n_components=2, random_state=42, perplexity=30)
X_embedded = tsne.fit_transform(data.data)
print(f"Shape: {X_embedded.shape}")  # (1797, 2)`,
    examples: [
      "Visualizing word embeddings",
      "Single-cell RNA-seq analysis",
      "Image dataset exploration",
    ],
    diagram: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">${bx(5, 40, 70, 35, "#3b8beb", "High-D")}${ln(75, 57, 100, 57)}<text x="88" y="50" fill="#ffd60a" font-size="16" font-family="monospace">→</text>${bx(110, 40, 70, 35, "#30d158", "2D/3D")}<text x="100" y="100" text-anchor="middle" fill="#9999b0" font-size="9" font-family="monospace">Preserve local structure</text></svg>`,
  },
  // ── UNSUPERVISED > ANOMALY DETECTION ──
  {
    id: "isolation-forest",
    category: "unsupervised",
    subcategory: "Anomaly Detection",
    title: "Isolation Forest",
    concept:
      "Detects anomalies by isolating observations. Anomalies are 'few and different,' so they get isolated in fewer random splits than normal points. Builds an ensemble of isolation trees.",
    whenToUse:
      "Fraud detection, network intrusion detection, manufacturing defect detection. Works well with high-dimensional data and without labeled anomalies.",
    howItWorks: [
      "Randomly select a feature and a split value",
      "Recursively partition data until each point is isolated",
      "Anomalies require fewer splits to isolate",
      "Anomaly score based on average path length across trees",
      "Points with short average paths are anomalies",
    ],
    pythonCode: `from sklearn.ensemble import IsolationForest
import numpy as np

np.random.seed(42)
X_normal = np.random.randn(200, 2)
X_anomaly = np.random.uniform(-4, 4, (20, 2))
X = np.vstack([X_normal, X_anomaly])

iso = IsolationForest(contamination=0.1, random_state=42)
predictions = iso.fit_predict(X)
n_anomalies = (predictions == -1).sum()
print(f"Detected anomalies: {n_anomalies}")`,
    examples: [
      "Credit card fraud detection",
      "Network intrusion detection",
      "Manufacturing quality control",
    ],
    diagram: `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">${c(60, 60, 6, "#3b8beb", "")}${c(70, 70, 6, "#3b8beb", "")}${c(55, 75, 6, "#3b8beb", "")}${c(75, 55, 6, "#3b8beb", "")}${c(65, 65, 6, "#3b8beb", "")}${c(170, 25, 10, "#ff453a", "!")}${c(30, 115, 10, "#ff453a", "!")}<text x="100" y="10" text-anchor="middle" fill="#9999b0" font-size="9" font-family="monospace">Red = anomalies (isolated fast)</text></svg>`,
  },
  {
    id: "one-class-svm",
    category: "unsupervised",
    subcategory: "Anomaly Detection",
    title: "One-Class SVM",
    concept:
      "Learns a boundary around normal data in feature space. Points outside this boundary are classified as anomalies. Uses the kernel trick to handle non-linear boundaries.",
    whenToUse:
      "When you only have examples of normal behavior. Novelty detection in controlled environments. Smaller datasets where Isolation Forest may underperform.",
    howItWorks: [
      "Map data to high-dimensional space using a kernel",
      "Find a hyperplane that separates data from the origin",
      "Maximize the margin from the origin",
      "New points falling on the wrong side are anomalies",
    ],
    pythonCode: `from sklearn.svm import OneClassSVM
import numpy as np

X_train = np.random.randn(100, 2)  # Normal data
X_test = np.vstack([np.random.randn(50, 2), np.random.uniform(-4, 4, (10, 2))])

oc_svm = OneClassSVM(kernel='rbf', nu=0.1)
oc_svm.fit(X_train)
predictions = oc_svm.predict(X_test)
print(f"Anomalies: {(predictions == -1).sum()}")`,
    examples: [
      "Server monitoring",
      "Medical device anomaly detection",
      "Industrial sensor analysis",
    ],
    diagram: `<svg viewBox="0 0 180 140" xmlns="http://www.w3.org/2000/svg"><ellipse cx="90" cy="70" rx="55" ry="40" fill="none" stroke="#ffd60a" stroke-width="2" stroke-dasharray="5"/>${c(80, 60, 5, "#3b8beb", "")}${c(95, 75, 5, "#3b8beb", "")}${c(85, 80, 5, "#3b8beb", "")}${c(100, 65, 5, "#3b8beb", "")}${c(20, 30, 7, "#ff453a", "!")}${c(160, 115, 7, "#ff453a", "!")}</svg>`,
  },
  // ── SEMI-SUPERVISED ──
  {
    id: "self-training",
    category: "semi-supervised",
    subcategory: "Semi-Supervised Methods",
    title: "Self Training",
    concept:
      "A wrapper method that trains a classifier on labeled data, then iteratively adds the most confident predictions on unlabeled data to the training set. Simple and effective semi-supervised approach.",
    whenToUse:
      "When you have very few labeled samples but lots of unlabeled data. Quick to implement with any base classifier. Medical imaging, document classification.",
    howItWorks: [
      "Train a classifier on the small labeled dataset",
      "Predict labels for unlabeled data",
      "Select predictions with highest confidence",
      "Add these pseudo-labeled samples to training set",
      "Retrain and repeat until convergence",
    ],
    pythonCode: `from sklearn.semi_supervised import SelfTrainingClassifier
from sklearn.svm import SVC
from sklearn.datasets import load_iris
import numpy as np

data = load_iris()
X, y = data.data, data.target.copy()

# Mask 80% of labels to simulate unlabeled data
rng = np.random.RandomState(42)
mask = rng.rand(len(y)) < 0.8
y[mask] = -1  # -1 = unlabeled

st = SelfTrainingClassifier(SVC(kernel='rbf', probability=True))
st.fit(X, y)
print(f"Labeled samples used: {(st.labeled_iter_ >= 0).sum()}")`,
    examples: [
      "Medical image labeling",
      "Web page classification",
      "Sentiment analysis with few labels",
    ],
    diagram: `<svg viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg">${bx(5, 25, 65, 30, "#3b8beb", "Labeled")}${ln(70, 40, 85, 40)}${bx(85, 25, 60, 30, "#bf5af2", "Train")}${ln(145, 40, 160, 40)}${bx(160, 25, 65, 30, "#30d158", "Predict")}${ln(225, 40, 240, 40)}${bx(240, 25, 55, 30, "#ffd60a", "Add")}<path d="M 267 55 L 267 70 L 115 70 L 115 55" fill="none" stroke="#9999b0" stroke-width="1.5" stroke-dasharray="4"/></svg>`,
  },
  {
    id: "pseudo-labeling",
    category: "semi-supervised",
    subcategory: "Semi-Supervised Methods",
    title: "Pseudo Labeling",
    concept:
      "Trains a model on labeled data, generates 'pseudo labels' for unlabeled data, then retrains on the combined dataset. Popular in deep learning where unlabeled data is abundant.",
    whenToUse:
      "Deep learning with limited labels. Image classification, NLP tasks. When self-training is too slow. Often combined with data augmentation for better results.",
    howItWorks: [
      "Train initial model on labeled data",
      "Generate predictions (pseudo labels) on unlabeled data",
      "Filter by confidence threshold",
      "Combine labeled and pseudo-labeled data",
      "Retrain model on the larger combined dataset",
    ],
    pythonCode: `import numpy as np
from sklearn.ensemble import RandomForestClassifier

# Simulate: 50 labeled + 200 unlabeled
X_labeled = np.random.randn(50, 4)
y_labeled = (X_labeled[:, 0] > 0).astype(int)
X_unlabeled = np.random.randn(200, 4)

# Step 1: Train on labeled
model = RandomForestClassifier(n_estimators=100)
model.fit(X_labeled, y_labeled)

# Step 2: Pseudo-label with confidence threshold
proba = model.predict_proba(X_unlabeled)
confident = proba.max(axis=1) > 0.9
pseudo_labels = model.predict(X_unlabeled[confident])

# Step 3: Retrain on combined
X_combined = np.vstack([X_labeled, X_unlabeled[confident]])
y_combined = np.concatenate([y_labeled, pseudo_labels])
model.fit(X_combined, y_combined)
print(f"Training size: {len(y_labeled)} → {len(y_combined)}")`,
    examples: [
      "Image classification with few labels",
      "NLP text classification",
      "Speech recognition",
    ],
    diagram: `<svg viewBox="0 0 280 80" xmlns="http://www.w3.org/2000/svg">${bx(5, 25, 60, 30, "#3b8beb", "Label")}${ln(65, 40, 80, 40)}${bx(80, 25, 65, 30, "#bf5af2", "Model")}${ln(145, 40, 160, 40)}${bx(160, 25, 60, 30, "#ff9f0a", "Pseudo")}${ln(220, 40, 235, 40)}${bx(235, 25, 40, 30, "#30d158", "++")}</svg>`,
  },
  // ── SELF-SUPERVISED ──
  {
    id: "contrastive-learning",
    category: "self-supervised",
    subcategory: "Self-Supervised Methods",
    title: "Contrastive Learning",
    concept:
      "Learns representations by pulling together augmented views of the same sample (positive pairs) and pushing apart different samples (negative pairs) in embedding space. SimCLR, MoCo, BYOL are key frameworks.",
    whenToUse:
      "Pre-training visual representations without labels. Transfer learning for downstream tasks. When labeled data is scarce but unlabeled data is abundant.",
    howItWorks: [
      "Create two augmented views of each image",
      "Encode both views through a neural network",
      "Project embeddings to a latent space",
      "Maximize similarity of positive pairs (same image)",
      "Minimize similarity of negative pairs (different images)",
    ],
    pythonCode: `# Conceptual SimCLR-style contrastive learning
import numpy as np

def contrastive_loss(z_i, z_j, temperature=0.5):
    """NT-Xent loss for a positive pair (z_i, z_j)"""
    z_i = z_i / np.linalg.norm(z_i)
    z_j = z_j / np.linalg.norm(z_j)
    similarity = np.dot(z_i, z_j) / temperature
    return -np.log(np.exp(similarity) / np.sum(np.exp(similarity)))

# In practice: use PyTorch with augmentation pipeline
# augmented_1 = augment(image)
# augmented_2 = augment(image)
# z1, z2 = encoder(aug1), encoder(aug2)
# loss = nt_xent_loss(z1, z2)`,
    examples: [
      "Pre-training image encoders (SimCLR)",
      "Visual representation learning",
      "Medical imaging without labels",
    ],
    diagram: `<svg viewBox="0 0 260 120" xmlns="http://www.w3.org/2000/svg">${bx(5, 45, 50, 30, "#3b8beb", "Image")}${ln(55, 60, 75, 35)}${ln(55, 60, 75, 85)}${bx(75, 20, 55, 30, "#bf5af2", "Aug 1")}${bx(75, 70, 55, 30, "#30d158", "Aug 2")}${ln(130, 35, 160, 50)}${ln(130, 85, 160, 70)}${bx(160, 40, 50, 30, "#ffd60a", "Pull")}${ln(210, 55, 230, 55)}<text x="245" y="60" fill="#30d158" font-size="11" font-family="monospace">≈</text></svg>`,
  },
  {
    id: "masked-prediction",
    category: "self-supervised",
    subcategory: "Self-Supervised Methods",
    title: "Masked Prediction (BERT)",
    concept:
      "Corrupts input by masking random portions, then trains the model to reconstruct the original. BERT masks tokens in text; MAE masks patches in images. Creates powerful pre-trained representations.",
    whenToUse:
      "NLP pre-training, vision transformers. Foundation model training. When you want bidirectional context understanding.",
    howItWorks: [
      "Randomly mask 15-50% of input tokens/patches",
      "Feed corrupted input through a transformer encoder",
      "Predict the original masked content",
      "Loss = reconstruction error on masked portions only",
      "Fine-tune the pre-trained model on downstream tasks",
    ],
    pythonCode: `# Conceptual BERT-style masked language modeling
# In practice, use HuggingFace Transformers

# from transformers import BertForMaskedLM, BertTokenizer
# tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
# model = BertForMaskedLM.from_pretrained('bert-base-uncased')

# Example: mask prediction concept
sentence = "The cat sat on the [MASK]"
# BERT predicts: "mat" (highest probability)

# Pre-training objective:
# 1. Tokenize: ["The", "cat", "sat", "on", "the", "[MASK]"]
# 2. Encode through transformer layers
# 3. Predict masked token from context
# 4. Loss = CrossEntropy(predicted, actual)`,
    examples: [
      "BERT language model pre-training",
      "GPT next-token prediction",
      "Masked image modeling (MAE)",
    ],
    diagram: `<svg viewBox="0 0 280 90" xmlns="http://www.w3.org/2000/svg">${bx(5, 30, 40, 30, "#3b8beb", "The")}${bx(50, 30, 40, 30, "#3b8beb", "cat")}${bx(95, 30, 40, 30, "#ff453a", "[M]")}${bx(140, 30, 40, 30, "#3b8beb", "on")}${bx(185, 30, 40, 30, "#3b8beb", "the")}${ln(115, 60, 115, 75)}<text x="115" y="85" text-anchor="middle" fill="#30d158" font-size="10" font-family="monospace">→ "sat"</text></svg>`,
  },
  // ── REINFORCEMENT LEARNING ──
  {
    id: "q-learning",
    category: "reinforcement",
    subcategory: "Model-Free",
    title: "Q-Learning",
    concept:
      "A model-free RL algorithm that learns a Q-table mapping (state, action) pairs to expected cumulative rewards. Uses the Bellman equation to iteratively update Q-values based on experience.",
    whenToUse:
      "Discrete state and action spaces. Game playing, robot navigation in grid worlds. Simple and guaranteed to converge for finite MDPs.",
    howItWorks: [
      "Initialize Q-table with zeros for all (state, action) pairs",
      "Choose action using ε-greedy policy (explore vs exploit)",
      "Take action, observe reward and next state",
      "Update: Q(s,a) ← Q(s,a) + α[r + γ·max Q(s',a') - Q(s,a)]",
      "Repeat until convergence",
    ],
    pythonCode: `import numpy as np

# Simple Q-Learning for a grid world
n_states, n_actions = 16, 4  # 4x4 grid, 4 directions
Q = np.zeros((n_states, n_actions))
alpha, gamma, epsilon = 0.1, 0.99, 0.1

for episode in range(1000):
    state = 0  # Start state
    done = False
    while not done:
        # Epsilon-greedy action selection
        if np.random.random() < epsilon:
            action = np.random.randint(n_actions)
        else:
            action = np.argmax(Q[state])
        
        # Simulate environment (simplified)
        next_state = min(state + [1, -1, 4, -4][action], n_states - 1)
        reward = 1.0 if next_state == 15 else -0.01
        done = next_state == 15
        
        # Q-update
        Q[state, action] += alpha * (
            reward + gamma * np.max(Q[next_state]) - Q[state, action]
        )
        state = next_state`,
    examples: ["Grid world navigation", "Taxi problem", "Simple game agents"],
    diagram: `<svg viewBox="0 0 280 100" xmlns="http://www.w3.org/2000/svg">${bx(5, 35, 55, 30, "#3b8beb", "State")}${ln(60, 50, 80, 50)}${bx(80, 35, 60, 30, "#bf5af2", "Action")}${ln(140, 50, 160, 50)}${bx(160, 35, 55, 30, "#30d158", "Reward")}${ln(215, 50, 230, 50)}${bx(230, 35, 45, 30, "#ffd60a", "Q↑")}<path d="M 252 65 L 252 85 L 32 85 L 32 65" fill="none" stroke="#9999b0" stroke-width="1.5" stroke-dasharray="4"/><text x="140" y="20" text-anchor="middle" fill="#9999b0" font-size="9" font-family="monospace">Q(s,a) ← Q + α[r + γ·maxQ - Q]</text></svg>`,
  },
  {
    id: "dqn",
    category: "reinforcement",
    subcategory: "Model-Free",
    title: "Deep Q-Networks (DQN)",
    concept:
      "Replaces the Q-table with a deep neural network that approximates Q-values. Uses experience replay and target networks for stability. Breakthrough: DeepMind's Atari game playing agent.",
    whenToUse:
      "High-dimensional or continuous state spaces (images, sensor readings). When Q-table is too large. Game playing, robotic control.",
    howItWorks: [
      "Neural network takes state as input, outputs Q-value for each action",
      "Store experiences (s, a, r, s') in replay buffer",
      "Sample random mini-batches from buffer (experience replay)",
      "Compute target: y = r + γ · max Q_target(s', a')",
      "Update network weights to minimize (Q(s,a) - y)²",
    ],
    pythonCode: `# Conceptual DQN structure (PyTorch-style)
# import torch.nn as nn

# class DQN(nn.Module):
#     def __init__(self, state_dim, action_dim):
#         super().__init__()
#         self.net = nn.Sequential(
#             nn.Linear(state_dim, 128),
#             nn.ReLU(),
#             nn.Linear(128, 64),
#             nn.ReLU(),
#             nn.Linear(64, action_dim)
#         )
#
#     def forward(self, state):
#         return self.net(state)  # Returns Q-values
#
# Key innovations:
# 1. Experience Replay: store and sample past transitions
# 2. Target Network: separate slowly-updated network
# 3. Epsilon decay: explore early, exploit later`,
    examples: [
      "Atari game playing",
      "Robot navigation",
      "Autonomous driving decisions",
    ],
    diagram: `<svg viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg">${bx(5, 35, 55, 30, "#3b8beb", "State")}${ln(60, 50, 80, 50)}${bx(80, 20, 70, 60, "#bf5af2", "DNN")}${ln(150, 50, 170, 30)}${ln(150, 50, 170, 50)}${ln(150, 50, 170, 70)}${bx(170, 15, 60, 25, "#30d158", "Q(s,a₁)")}${bx(170, 45, 60, 25, "#ffd60a", "Q(s,a₂)")}${bx(170, 75, 60, 25, "#ff453a", "Q(s,a₃)")}</svg>`,
  },
  {
    id: "policy-gradient",
    category: "reinforcement",
    subcategory: "Model-Free",
    title: "Policy Gradient",
    concept:
      "Directly optimizes the policy (mapping from states to action probabilities) using gradient ascent on expected reward. REINFORCE is the simplest variant. Can handle continuous action spaces.",
    whenToUse:
      "Continuous action spaces (robotic arm control), stochastic policies, when you want smooth policy optimization. Better than Q-learning for high-dimensional action spaces.",
    howItWorks: [
      "Parameterize policy π_θ(a|s) with a neural network",
      "Collect a trajectory by following current policy",
      "Compute return (cumulative discounted reward) for each step",
      "Update: θ ← θ + α · ∇ log π_θ(a|s) · G",
      "Higher reward actions get higher probability",
    ],
    pythonCode: `# REINFORCE algorithm (conceptual)
import numpy as np

# Policy: softmax over action logits
def policy(state, weights):
    logits = state @ weights
    exp_logits = np.exp(logits - logits.max())
    return exp_logits / exp_logits.sum()

# Collect trajectory and compute returns
# For each step in trajectory:
#   gradient = log_prob(action) * return
#   weights += learning_rate * gradient

# In PyTorch:
# log_prob = dist.log_prob(action)
# loss = -(log_prob * returns).mean()
# loss.backward()
# optimizer.step()`,
    examples: [
      "Robotic arm control",
      "Game AI strategies",
      "Resource allocation optimization",
    ],
    diagram: `<svg viewBox="0 0 280 80" xmlns="http://www.w3.org/2000/svg">${bx(5, 25, 55, 30, "#3b8beb", "State")}${ln(60, 40, 80, 40)}${bx(80, 25, 65, 30, "#bf5af2", "Policy πθ")}${ln(145, 40, 165, 40)}${bx(165, 25, 55, 30, "#30d158", "Action")}${ln(220, 40, 240, 40)}${bx(240, 25, 35, 30, "#ffd60a", "R")}</svg>`,
  },
  {
    id: "actor-critic",
    category: "reinforcement",
    subcategory: "Model-Free",
    title: "Actor-Critic",
    concept:
      "Combines policy gradient (actor) with value function approximation (critic). The actor selects actions; the critic evaluates them. Reduces variance compared to pure policy gradients.",
    whenToUse:
      "Complex environments requiring both good exploration and stable training. A2C, A3C, PPO, SAC are popular variants. Standard choice for modern RL.",
    howItWorks: [
      "Actor network outputs action probabilities π(a|s)",
      "Critic network estimates state value V(s)",
      "Compute advantage: A = r + γV(s') - V(s)",
      "Update actor using advantage-weighted policy gradient",
      "Update critic to minimize value prediction error",
    ],
    pythonCode: `# Actor-Critic structure (conceptual PyTorch)
# class ActorCritic(nn.Module):
#     def __init__(self, state_dim, action_dim):
#         super().__init__()
#         self.shared = nn.Linear(state_dim, 128)
#         self.actor = nn.Linear(128, action_dim)   # Policy
#         self.critic = nn.Linear(128, 1)            # Value
#
#     def forward(self, state):
#         x = F.relu(self.shared(state))
#         policy = F.softmax(self.actor(x), dim=-1)
#         value = self.critic(x)
#         return policy, value
#
# Training loop:
# policy, value = model(state)
# advantage = reward + gamma * next_value - value
# actor_loss = -(log_prob * advantage.detach()).mean()
# critic_loss = advantage.pow(2).mean()`,
    examples: [
      "OpenAI Gym environments",
      "StarCraft AI",
      "Autonomous navigation",
    ],
    diagram: `<svg viewBox="0 0 260 120" xmlns="http://www.w3.org/2000/svg">${bx(5, 45, 55, 30, "#3b8beb", "State")}${ln(60, 55, 80, 55)}${ln(80, 55, 80, 30)}${ln(80, 55, 80, 80)}${bx(85, 15, 65, 30, "#bf5af2", "Actor π")}${bx(85, 65, 65, 30, "#30d158", "Critic V")}${ln(150, 30, 180, 30)}${bx(180, 15, 65, 30, "#ffd60a", "Action")}${ln(150, 80, 180, 80)}${bx(180, 65, 65, 30, "#ff9f0a", "Value")}</svg>`,
  },
  {
    id: "mcts",
    category: "reinforcement",
    subcategory: "Model-Based",
    title: "Monte Carlo Tree Search",
    concept:
      "Builds a search tree by running simulated playouts from the current state. Balances exploration and exploitation using UCB (Upper Confidence Bound). Core of AlphaGo.",
    whenToUse:
      "Turn-based games (Go, Chess), planning problems. When you have a simulator of the environment. Combines tree search with neural network evaluation.",
    howItWorks: [
      "Selection: traverse tree using UCB to select promising nodes",
      "Expansion: add a new child node for an untried action",
      "Simulation: run a random playout from the new node",
      "Backpropagation: update visit counts and values up the tree",
      "Repeat N times, then select most-visited child as action",
    ],
    pythonCode: `# MCTS conceptual implementation
import numpy as np

class MCTSNode:
    def __init__(self, state, parent=None):
        self.state = state
        self.parent = parent
        self.children = {}
        self.visits = 0
        self.value = 0.0

    def ucb_score(self, c=1.41):
        if self.visits == 0:
            return float('inf')
        exploit = self.value / self.visits
        explore = c * np.sqrt(np.log(self.parent.visits) / self.visits)
        return exploit + explore

# Main loop:
# 1. SELECT: follow UCB scores down tree
# 2. EXPAND: add new child node
# 3. SIMULATE: random playout to terminal state
# 4. BACKPROPAGATE: update value and visits`,
    examples: ["AlphaGo (Go)", "Chess engines", "Planning and scheduling"],
    diagram: `<svg viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg">${c(120, 20, 14, "#ffd60a", "Root")}${ln(120, 34, 60, 55)}${ln(120, 34, 180, 55)}${c(60, 65, 12, "#3b8beb", "N₁")}${c(180, 65, 12, "#30d158", "N₂")}${ln(60, 77, 35, 95)}${ln(60, 77, 85, 95)}${c(35, 105, 10, "#bf5af2", "?")}${c(85, 105, 10, "#3b8beb", "")}<text x="120" y="128" text-anchor="middle" fill="#9999b0" font-size="8" font-family="monospace">Select → Expand → Simulate → Backprop</text></svg>`,
  },
];
