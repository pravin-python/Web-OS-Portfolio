import React from "react";
import type { TrainResult } from "./types";

export const ResultsDashboard: React.FC<{ result: TrainResult }> = ({
  result,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="mls-section-title !mb-0">Training Results</h3>
        <div className="flex gap-2">
          <span className="text-[10px] uppercase text-slate-500 font-mono bg-black/30 px-2 py-1 rounded flex items-center">
            Took {result.timeMs}ms
          </span>
          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify(result, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `ml-studio-result-${Date.now()}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 text-[10px] uppercase font-bold px-2 py-1 rounded transition-colors"
            title="Export results as JSON"
          >
            Export JSON
          </button>
        </div>
      </div>

      <MetricsDisplay result={result} />

      {result.type === "classification" && result.confusionMatrix && (
        <div className="bg-black/20 border border-white/5 rounded-lg p-4">
          <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-4 text-center">
            Confusion Matrix
          </h4>
          <div className="overflow-x-auto flex justify-center">
            <ConfusionMatrixHeatmap
              matrix={result.confusionMatrix}
              classes={result.classNames || []}
            />
          </div>
        </div>
      )}

      {result.type === "regression" &&
        result.yTrueSample &&
        result.yPredSample && (
          <div className="bg-black/20 border border-white/5 rounded-lg p-4">
            <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2 text-center">
              Actual vs Predicted (Sample)
            </h4>
            <ScatterPlot
              yTrue={result.yTrueSample}
              yPred={result.yPredSample}
            />
          </div>
        )}

      {result.type === "clustering" && result.plotData && (
        <div className="bg-black/20 border border-white/5 rounded-lg p-4">
          <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2 text-center">
            Cluster Distribution (PCA Reduced)
          </h4>
          <ClusterPlot data={result.plotData} />
        </div>
      )}
    </div>
  );
};

/* ─── Metrics Output ─── */
const MetricsDisplay: React.FC<{ result: TrainResult }> = ({ result }) => {
  if (result.type === "classification") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <MetricBox label="Accuracy" value={result.accuracy} isPercentage />
        <MetricBox label="Precision" value={result.precision} isPercentage />
        <MetricBox label="Recall" value={result.recall} isPercentage />
        <MetricBox label="F1 Score" value={result.f1} isPercentage />
      </div>
    );
  } else if (result.type === "regression") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <MetricBox label="R² Score" value={result.r2} />
        <MetricBox label="RMSE" value={result.rmse} />
        <MetricBox label="MAE" value={result.mae} />
        <MetricBox label="MSE" value={result.mse} />
      </div>
    );
  } else if (result.type === "clustering") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <MetricBox label="Silhouette" value={result.silhouetteScore} />
        <MetricBox label="Inertia" value={result.inertia} />
        <MetricBox
          label="Clusters"
          value={Object.keys(result.clusterSizes || {}).length}
        />
      </div>
    );
  }
  return null;
};

const MetricBox = ({
  label,
  value,
  isPercentage = false,
}: {
  label: string;
  value: number | null | undefined;
  isPercentage?: boolean;
}) => {
  if (value == null) return null;
  const displayVal = isPercentage
    ? (value * 100).toFixed(2) + "%"
    : value.toFixed(4);
  return (
    <div className="bg-black/20 border border-white/5 rounded-lg p-3 text-center">
      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
        {label}
      </div>
      <div className="text-lg font-mono text-green-400 font-bold">
        {displayVal}
      </div>
    </div>
  );
};

/* ─── Heatmap ─── */
const ConfusionMatrixHeatmap: React.FC<{
  matrix: number[][];
  classes: string[];
}> = ({ matrix, classes }) => {
  const maxVal = Math.max(...matrix.flat());

  return (
    <table className="border-collapse text-[10px] sm:text-xs">
      <thead>
        <tr>
          <th className="p-1"></th>
          {classes.map((c, i) => (
            <th
              key={i}
              className="p-2 text-slate-400 font-normal truncate max-w-[60px]"
              title={c}
            >
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {matrix.map((row, i) => (
          <tr key={i}>
            <th
              className="p-2 text-slate-400 font-normal text-right truncate max-w-[60px]"
              title={classes[i]}
            >
              {classes[i]}
            </th>
            {row.map((val, j) => {
              const intensity = maxVal > 0 ? val / maxVal : 0;
              // using a purple scale based on intensity
              const bg = `rgba(191, 90, 242, ${Math.max(0.1, intensity * 0.8)})`;
              return (
                <td
                  key={j}
                  className="p-3 text-center font-mono border border-white/5 min-w-[40px]"
                  style={{ backgroundColor: bg }}
                >
                  {val}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

/* ─── SVG Charts Placeholder for custom visualization (no external library) ─── */
const ScatterPlot: React.FC<{ yTrue: number[]; yPred: number[] }> = ({
  yTrue,
  yPred,
}) => {
  if (!yTrue.length || !yPred.length) return null;

  const minTrue = Math.min(...yTrue);
  const maxTrue = Math.max(...yTrue);
  const minPred = Math.min(...yPred);
  const maxPred = Math.max(...yPred);

  const min = Math.min(minTrue, minPred);
  const max = Math.max(maxTrue, maxPred);
  const range = max - min || 1;

  const width = 300;
  const height = 200;
  const padding = 20;

  const getX = (val: number) =>
    padding + ((val - min) / range) * (width - padding * 2);
  const getY = (val: number) =>
    height - padding - ((val - min) / range) * (height - padding * 2);

  return (
    <div className="w-full flex justify-center">
      <svg
        width="100%"
        height="auto"
        viewBox={`0 0 ${width} ${height}`}
        className="max-w-[400px]"
      >
        {/* Axes */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#333"
          strokeWidth="1"
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#333"
          strokeWidth="1"
        />

        {/* Ideal Line y=x */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={padding}
          stroke="#bf5af2"
          strokeWidth="1"
          strokeDasharray="4"
          opacity="0.5"
        />

        {/* Points */}
        {yTrue.map((v, i) => (
          <circle
            key={i}
            cx={getX(v)}
            cy={getY(yPred[i])}
            r="3"
            fill="#30d158"
            opacity="0.7"
          />
        ))}
        <text
          x={width / 2}
          y={height - 5}
          fill="#666"
          fontSize="10"
          textAnchor="middle"
        >
          Target Value
        </text>
        <text
          x={10}
          y={height / 2}
          fill="#666"
          fontSize="10"
          textAnchor="middle"
          transform={`rotate(-90 10 ${height / 2})`}
        >
          Predicted
        </text>
      </svg>
    </div>
  );
};

const ClusterPlot: React.FC<{
  data: { x: number; y: number; cluster: number }[];
}> = ({ data }) => {
  if (!data.length) return null;

  const xs = data.map((d) => d.x);
  const ys = data.map((d) => d.y);
  const minX = Math.min(...xs),
    maxX = Math.max(...xs),
    rangeX = maxX - minX || 1;
  const minY = Math.min(...ys),
    maxY = Math.max(...ys),
    rangeY = maxY - minY || 1;

  const width = 300;
  const height = 200;
  const padding = 20;

  const getX = (val: number) =>
    padding + ((val - minX) / rangeX) * (width - padding * 2);
  const getY = (val: number) =>
    height - padding - ((val - minY) / rangeY) * (height - padding * 2);

  const colors = [
    "#bf5af2",
    "#30d158",
    "#3b8beb",
    "#ff453a",
    "#f25a95",
    "#ffcc00",
  ];

  return (
    <div className="w-full flex justify-center">
      <svg
        width="100%"
        height="auto"
        viewBox={`0 0 ${width} ${height}`}
        className="max-w-[400px]"
      >
        {data.map((d, i) => (
          <circle
            key={i}
            cx={getX(d.x)}
            cy={getY(d.y)}
            r="3"
            fill={colors[d.cluster % colors.length]}
            opacity="0.8"
          />
        ))}
      </svg>
    </div>
  );
};
