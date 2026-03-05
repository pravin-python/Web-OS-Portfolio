import React from "react";
import type { AlgorithmConfig } from "./types";

interface HyperParamEditorProps {
  algorithm: AlgorithmConfig;
  params: Record<string, number | string | boolean>;
  onChange: (newParams: Record<string, number | string | boolean>) => void;
}

export const HyperParamEditor: React.FC<HyperParamEditorProps> = ({
  algorithm,
  params,
  onChange,
}) => {
  const updateParam = (key: string, val: number | string | boolean) => {
    onChange({ ...params, [key]: val });
  };

  const currentParams = params;

  return (
    <div className="mb-4">
      <div className="mls-section-title">3. Hyperparameters</div>
      <div className="bg-black/20 border border-white/5 rounded-lg p-3 flex flex-col gap-3">
        {algorithm.id === "random_forest_clf" ||
        algorithm.id === "random_forest_reg" ||
        algorithm.id === "gradient_boosting_clf" ? (
          <RangeParam
            label="Estimators (Trees)"
            min={10}
            max={500}
            step={10}
            val={currentParams.n_estimators as number}
            onSet={(v) => updateParam("n_estimators", v)}
          />
        ) : null}

        {algorithm.id === "random_forest_clf" ||
        algorithm.id === "random_forest_reg" ? (
          <RangeParam
            label="Max Depth (0=None)"
            min={0}
            max={50}
            step={1}
            val={(currentParams.max_depth as number) ?? 0}
            onSet={(v) => updateParam("max_depth", v)}
          />
        ) : null}

        {algorithm.id === "svm_clf" || algorithm.id === "logistic_reg" ? (
          <RangeParam
            label="Regularization (C)"
            min={0.1}
            max={10.0}
            step={0.1}
            val={currentParams.C as number}
            onSet={(v) => updateParam("C", v)}
          />
        ) : null}

        {algorithm.id === "svm_clf" ? (
          <div className="flex justify-between items-center">
            <label className="text-xs text-slate-400">Kernel</label>
            <select
              className="bg-black/40 border border-white/10 text-xs text-purple-400 rounded px-2 py-1 outline-none"
              value={currentParams.kernel as string}
              onChange={(e) => updateParam("kernel", e.target.value)}
            >
              <option value="linear">Linear</option>
              <option value="poly">Polynomial</option>
              <option value="rbf">RBF</option>
              <option value="sigmoid">Sigmoid</option>
            </select>
          </div>
        ) : null}

        {algorithm.id === "logistic_reg" ? (
          <RangeParam
            label="Max Iterations"
            min={50}
            max={1000}
            step={50}
            val={currentParams.max_iter as number}
            onSet={(v) => updateParam("max_iter", v)}
          />
        ) : null}

        {algorithm.id === "gradient_boosting_clf" ? (
          <RangeParam
            label="Learning Rate"
            min={0.01}
            max={1.0}
            step={0.01}
            val={currentParams.learning_rate as number}
            onSet={(v) => updateParam("learning_rate", v)}
          />
        ) : null}

        {algorithm.id === "knn_clf" ? (
          <RangeParam
            label="Neighbors (K)"
            min={1}
            max={50}
            step={1}
            val={currentParams.n_neighbors as number}
            onSet={(v) => updateParam("n_neighbors", v)}
          />
        ) : null}

        {algorithm.id === "linear_reg" ? (
          <ToggleParam
            label="Fit Intercept"
            checked={currentParams.fit_intercept as boolean}
            onToggle={(v) => updateParam("fit_intercept", v)}
          />
        ) : null}

        {algorithm.id === "kmeans" ? (
          <RangeParam
            label="Clusters (K)"
            min={2}
            max={20}
            step={1}
            val={currentParams.n_clusters as number}
            onSet={(v) => updateParam("n_clusters", v)}
          />
        ) : null}

        {algorithm.id === "dbscan" ? (
          <>
            <RangeParam
              label="Epsilon (eps)"
              min={0.1}
              max={5.0}
              step={0.1}
              val={currentParams.eps as number}
              onSet={(v) => updateParam("eps", v)}
            />
            <RangeParam
              label="Min Samples"
              min={2}
              max={20}
              step={1}
              val={currentParams.min_samples as number}
              onSet={(v) => updateParam("min_samples", v)}
            />
          </>
        ) : null}
      </div>
    </div>
  );
};

/* ─── UI Helpers ─── */
const RangeParam = ({
  label,
  min,
  max,
  step,
  val,
  onSet,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  val: number;
  onSet: (v: number) => void;
}) => (
  <div className="flex flex-col gap-1">
    <div className="flex justify-between">
      <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
        {label}
      </label>
      <span className="text-xs font-mono text-purple-400 font-bold">{val}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={val}
      onChange={(e) => onSet(parseFloat(e.target.value))}
      className="w-full accent-purple-500"
    />
  </div>
);

const ToggleParam = ({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: (v: boolean) => void;
}) => (
  <div className="flex justify-between items-center">
    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
      {label}
    </label>
    <button
      className={`w-8 h-4 rounded-full relative transition-colors ${checked ? "bg-purple-500" : "bg-white/10"}`}
      onClick={() => onToggle(!checked)}
    >
      <div
        className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all ${checked ? "left-4.5" : "left-0.5"}`}
      />
    </button>
  </div>
);
