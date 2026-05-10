import json
import time
import numpy as np
import pandas as pd

from sklearn.datasets import (
    load_iris,
    load_wine,
    load_breast_cancer,
    fetch_california_housing,
    make_blobs,
)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    mean_squared_error,
    mean_absolute_error,
    r2_score,
    silhouette_score,
)
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, GradientBoostingClassifier
from sklearn.svm import SVC, SVR
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.cluster import KMeans, DBSCAN
from sklearn.decomposition import PCA

# Global data cache to avoid reloading
_DATASET_CACHE = {}

def get_dataset(dataset_id: str):
    if dataset_id in _DATASET_CACHE:
        return _DATASET_CACHE[dataset_id]

    if dataset_id == "iris":
        data = load_iris()
        result = (data.data, data.target, list(data.target_names))
    elif dataset_id == "wine":
        data = load_wine()
        result = (data.data, data.target, list(data.target_names))
    elif dataset_id == "breast_cancer":
        data = load_breast_cancer()
        result = (data.data, data.target, list(data.target_names))
    elif dataset_id == "california_housing":
        data = fetch_california_housing()
        result = (data.data, data.target, None)
    elif dataset_id == "blobs":
        X, y = make_blobs(n_samples=300, centers=4, cluster_std=0.60, random_state=42)
        result = (X, y, None)
    else:
        raise ValueError(f"Unknown dataset: {dataset_id}")

    _DATASET_CACHE[dataset_id] = result
    return result

def instantiate_model(algo_id: str, params: dict):
    # Mapping JS algo_id to Scikit-Learn classes and wrapping params
    if algo_id == "random_forest_clf":
        return RandomForestClassifier(
            n_estimators=int(params.get("n_estimators", 100)),
            max_depth=int(params.get("max_depth", 0)) if params.get("max_depth", 0) > 0 else None,
            random_state=42
        )
    elif algo_id == "svm_clf":
        return SVC(
            C=float(params.get("C", 1.0)),
            kernel=str(params.get("kernel", "rbf")),
            random_state=42
        )
    elif algo_id == "logistic_reg":
        return LogisticRegression(
            C=float(params.get("C", 1.0)),
            max_iter=int(params.get("max_iter", 100)),
            random_state=42
        )
    elif algo_id == "gradient_boosting_clf":
        return GradientBoostingClassifier(
            n_estimators=int(params.get("n_estimators", 100)),
            learning_rate=float(params.get("learning_rate", 0.1)),
            random_state=42
        )
    elif algo_id == "knn_clf":
        return KNeighborsClassifier(
            n_neighbors=int(params.get("n_neighbors", 5))
        )
    elif algo_id == "linear_reg":
        return LinearRegression(
            fit_intercept=bool(params.get("fit_intercept", True))
        )
    elif algo_id == "random_forest_reg":
        return RandomForestRegressor(
            n_estimators=int(params.get("n_estimators", 100)),
            random_state=42
        )
    elif algo_id == "kmeans":
        return KMeans(
            n_clusters=int(params.get("n_clusters", 3)),
            n_init=10,
            random_state=42
        )
    elif algo_id == "dbscan":
        return DBSCAN(
            eps=float(params.get("eps", 0.5)),
            min_samples=int(params.get("min_samples", 5))
        )
    else:
        raise ValueError(f"Unknown algorithm: {algo_id}")

def run_ml_task(config_json_str: str) -> str:
    """
    Main entrypoint called by JS.
    Expects a JSON string:
    {
      "dataset_id": "iris",
      "task_type": "classification",
      "algo_id": "random_forest_clf",
      "hyperparams": {"n_estimators": 50},
      "test_size": 0.2
    }
    Returns a JSON string with the results.
    """
    start_time = time.time()
    try:
        config = json.loads(config_json_str)
        dataset_id = config["dataset_id"]
        task_type = config["task_type"]
        algo_id = config["algo_id"]
        hyperparams = config.get("hyperparams", {})
        test_size = float(config.get("test_size", 0.2))

        X, y, target_names = get_dataset(dataset_id)

        model = instantiate_model(algo_id, hyperparams)

        if task_type in ["classification", "regression"]:
            # Splitting and scaling
            is_classification = task_type == "classification"
            stratify = y if is_classification else None
            
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=test_size, random_state=42, stratify=stratify
            )

            scaler = StandardScaler()
            X_train = scaler.fit_transform(X_train)
            X_test = scaler.transform(X_test)

            # Train
            model.fit(X_train, y_train)

            # Predict
            y_pred = model.predict(X_test)

            time_ms = int((time.time() - start_time) * 1000)

            if task_type == "classification":
                acc = float(accuracy_score(y_test, y_pred))
                prec = float(precision_score(y_test, y_pred, average="macro", zero_division=0))
                rec = float(recall_score(y_test, y_pred, average="macro", zero_division=0))
                f1 = float(f1_score(y_test, y_pred, average="macro", zero_division=0))
                cm = confusion_matrix(y_test, y_pred).tolist()

                class_names = target_names if target_names else [str(c) for c in np.unique(y)]

                return json.dumps({
                    "type": "classification",
                    "timeMs": time_ms,
                    "accuracy": acc,
                    "precision": prec,
                    "recall": rec,
                    "f1": f1,
                    "confusionMatrix": cm,
                    "classNames": class_names
                })

            else:  # regression
                mse = float(mean_squared_error(y_test, y_pred))
                mae = float(mean_absolute_error(y_test, y_pred))
                rmse = float(np.sqrt(mse))
                r2 = float(r2_score(y_test, y_pred))

                # For plotting, return a subset (max 100 points)
                limit = min(100, len(y_test))
                y_true_sample = y_test[:limit].tolist()
                y_pred_sample = y_pred[:limit].tolist()

                return json.dumps({
                    "type": "regression",
                    "timeMs": time_ms,
                    "mse": mse,
                    "mae": mae,
                    "rmse": rmse,
                    "r2": r2,
                    "yTrueSample": y_true_sample,
                    "yPredSample": y_pred_sample
                })

        elif task_type == "clustering":
            # For clustering, we use the whole dataset and Standardize
            scaler = StandardScaler()
            X_scaled = scaler.fit_transform(X)

            if algo_id == "kmeans":
                model.fit(X_scaled)
                labels = model.labels_
                inertia = float(model.inertia_)
            else: # dbscan
                labels = model.fit_predict(X_scaled)
                inertia = None

            # Calculate silhouette (only valid if > 1 clusters and not strictly noise)
            n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
            if n_clusters > 1:
                sil_score = float(silhouette_score(X_scaled, labels))
            else:
                sil_score = None

            # Count cluster sizes
            unique, counts = np.unique(labels, return_counts=True)
            sizes = {str(k): int(v) for k, v in zip(unique, counts)}

            # For 2D plotting, use PCA
            pca = PCA(n_components=2)
            X_2d = pca.fit_transform(X_scaled)

            limit = min(300, len(X_2d)) # Limit points for UI perf
            plot_data = [
                {"x": float(X_2d[i, 0]), "y": float(X_2d[i, 1]), "cluster": int(labels[i])}
                for i in range(limit)
            ]

            time_ms = int((time.time() - start_time) * 1000)

            return json.dumps({
                "type": "clustering",
                "timeMs": time_ms,
                "silhouetteScore": sil_score,
                "inertia": inertia,
                "clusterSizes": sizes,
                "plotData": plot_data
            })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return json.dumps({"error": str(e)})

print("ml_engine.py loaded successfully")
