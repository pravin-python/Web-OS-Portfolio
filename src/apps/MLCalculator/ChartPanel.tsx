import React from "react";
import type { TrainResult } from "./types";

interface Props {
  result: TrainResult;
}

const COLORS = [
  "#3b8beb",
  "#30d158",
  "#ff9f0a",
  "#bf5af2",
  "#ff453a",
  "#64d2ff",
  "#ffd60a",
  "#ac8e68",
  "#ff6482",
  "#5e5ce6",
];

const SVG_W = 360;
const SVG_H = 260;
const PAD = 40;

export const ChartPanel: React.FC<Props> = ({ result }) => {
  if (result.type === "classification" && result.yTrue && result.yPred) {
    return (
      <ClassDistChart
        yTrue={result.yTrue}
        yPred={result.yPred}
        classNames={result.classNames ?? []}
      />
    );
  }

  if (result.type === "regression" && result.yTrue && result.yPred) {
    return <ScatterChart yTrue={result.yTrue} yPred={result.yPred} />;
  }

  if (result.type === "clustering" && result.clusterData) {
    return (
      <ClusterChart
        data={result.clusterData}
        labels={result.clusterLabels ?? []}
      />
    );
  }

  return null;
};

/* ─── Classification: Prediction Distribution ─── */
const ClassDistChart: React.FC<{
  yTrue: number[];
  yPred: number[];
  classNames: string[];
}> = ({ yTrue, yPred, classNames }) => {
  const classes = [...new Set([...yTrue, ...yPred])].sort((a, b) => a - b);
  const countTrue = classes.map((c) => yTrue.filter((y) => y === c).length);
  const countPred = classes.map((c) => yPred.filter((y) => y === c).length);
  const maxVal = Math.max(...countTrue, ...countPred, 1);

  const barW = 24;
  const gap = 16;
  const groupW = barW * 2 + gap;
  const chartW = classes.length * groupW + (classes.length - 1) * 20 + PAD * 2;

  return (
    <div className="mlc-chart-wrap">
      <h4 className="mlc-result-subtitle">📊 Prediction Distribution</h4>
      <svg
        viewBox={`0 0 ${Math.max(chartW, SVG_W)} ${SVG_H}`}
        className="mlc-chart-svg"
      >
        {/* Y axis */}
        <line
          x1={PAD}
          y1={PAD - 10}
          x2={PAD}
          y2={SVG_H - PAD}
          stroke="rgba(255,255,255,0.15)"
        />
        {/* X axis */}
        <line
          x1={PAD}
          y1={SVG_H - PAD}
          x2={Math.max(chartW, SVG_W) - 10}
          y2={SVG_H - PAD}
          stroke="rgba(255,255,255,0.15)"
        />

        {classes.map((c, i) => {
          const x = PAD + 20 + i * (groupW + 20);
          const hTrue = (countTrue[i] / maxVal) * (SVG_H - PAD * 2);
          const hPred = (countPred[i] / maxVal) * (SVG_H - PAD * 2);
          const name = classNames[c] ?? `Class ${c}`;
          return (
            <g key={c}>
              {/* True bar */}
              <rect
                x={x}
                y={SVG_H - PAD - hTrue}
                width={barW}
                height={hTrue}
                fill={COLORS[i % COLORS.length]}
                opacity={0.7}
                rx={3}
              />
              <text
                x={x + barW / 2}
                y={SVG_H - PAD - hTrue - 4}
                textAnchor="middle"
                fontSize={9}
                fill="#aaa"
              >
                {countTrue[i]}
              </text>
              {/* Pred bar */}
              <rect
                x={x + barW + 4}
                y={SVG_H - PAD - hPred}
                width={barW}
                height={hPred}
                fill={COLORS[i % COLORS.length]}
                opacity={0.35}
                rx={3}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={1}
              />
              <text
                x={x + barW + 4 + barW / 2}
                y={SVG_H - PAD - hPred - 4}
                textAnchor="middle"
                fontSize={9}
                fill="#aaa"
              >
                {countPred[i]}
              </text>
              {/* Label */}
              <text
                x={x + groupW / 2}
                y={SVG_H - PAD + 14}
                textAnchor="middle"
                fontSize={10}
                fill="#9999b0"
              >
                {name}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <rect
          x={PAD + 5}
          y={8}
          width={10}
          height={10}
          fill={COLORS[0]}
          opacity={0.7}
          rx={2}
        />
        <text x={PAD + 20} y={17} fontSize={9} fill="#9999b0">
          Actual
        </text>
        <rect
          x={PAD + 65}
          y={8}
          width={10}
          height={10}
          fill={COLORS[0]}
          opacity={0.35}
          rx={2}
          stroke={COLORS[0]}
          strokeWidth={1}
        />
        <text x={PAD + 80} y={17} fontSize={9} fill="#9999b0">
          Predicted
        </text>
      </svg>
    </div>
  );
};

/* ─── Regression: Actual vs Predicted Scatter ─── */
const ScatterChart: React.FC<{ yTrue: number[]; yPred: number[] }> = ({
  yTrue,
  yPred,
}) => {
  const allVals = [...yTrue, ...yPred];
  const minV = Math.min(...allVals);
  const maxV = Math.max(...allVals);
  const range = maxV - minV || 1;

  const toX = (v: number) => PAD + ((v - minV) / range) * (SVG_W - PAD * 2);
  const toY = (v: number) =>
    SVG_H - PAD - ((v - minV) / range) * (SVG_H - PAD * 2);

  return (
    <div className="mlc-chart-wrap">
      <h4 className="mlc-result-subtitle">📈 Actual vs Predicted</h4>
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="mlc-chart-svg">
        {/* Perfect prediction line */}
        <line
          x1={toX(minV)}
          y1={toY(minV)}
          x2={toX(maxV)}
          y2={toY(maxV)}
          stroke="rgba(59,139,235,0.3)"
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />

        {/* Axes */}
        <line
          x1={PAD}
          y1={PAD - 5}
          x2={PAD}
          y2={SVG_H - PAD}
          stroke="rgba(255,255,255,0.15)"
        />
        <line
          x1={PAD}
          y1={SVG_H - PAD}
          x2={SVG_W - 10}
          y2={SVG_H - PAD}
          stroke="rgba(255,255,255,0.15)"
        />

        {/* Tick labels */}
        <text x={PAD - 4} y={PAD} textAnchor="end" fontSize={8} fill="#666">
          {maxV.toFixed(0)}
        </text>
        <text
          x={PAD - 4}
          y={SVG_H - PAD}
          textAnchor="end"
          fontSize={8}
          fill="#666"
        >
          {minV.toFixed(0)}
        </text>
        <text
          x={PAD}
          y={SVG_H - PAD + 14}
          textAnchor="start"
          fontSize={8}
          fill="#666"
        >
          {minV.toFixed(0)}
        </text>
        <text
          x={SVG_W - PAD}
          y={SVG_H - PAD + 14}
          textAnchor="end"
          fontSize={8}
          fill="#666"
        >
          {maxV.toFixed(0)}
        </text>

        {/* Axis labels */}
        <text
          x={SVG_W / 2}
          y={SVG_H - 6}
          textAnchor="middle"
          fontSize={9}
          fill="#9999b0"
        >
          Actual
        </text>
        <text
          x={10}
          y={SVG_H / 2}
          textAnchor="middle"
          fontSize={9}
          fill="#9999b0"
          transform={`rotate(-90,10,${SVG_H / 2})`}
        >
          Predicted
        </text>

        {/* Points */}
        {yTrue.map((yt, i) => (
          <circle
            key={i}
            cx={toX(yt)}
            cy={toY(yPred[i])}
            r={3.5}
            fill="#30d158"
            opacity={0.7}
          />
        ))}
      </svg>
    </div>
  );
};

/* ─── Clustering: 2D Scatter ─── */
const ClusterChart: React.FC<{
  data: number[][];
  labels: number[];
}> = ({ data, labels }) => {
  const xs = data.map((d) => d[0]);
  const ys = data.map((d) => d[1]);
  const minX = Math.min(...xs),
    maxX = Math.max(...xs);
  const minY = Math.min(...ys),
    maxY = Math.max(...ys);
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  const toX = (v: number) => PAD + ((v - minX) / rangeX) * (SVG_W - PAD * 2);
  const toY = (v: number) =>
    SVG_H - PAD - ((v - minY) / rangeY) * (SVG_H - PAD * 2);

  return (
    <div className="mlc-chart-wrap">
      <h4 className="mlc-result-subtitle">🔬 Cluster Visualization</h4>
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="mlc-chart-svg">
        {/* Axes */}
        <line
          x1={PAD}
          y1={PAD - 5}
          x2={PAD}
          y2={SVG_H - PAD}
          stroke="rgba(255,255,255,0.15)"
        />
        <line
          x1={PAD}
          y1={SVG_H - PAD}
          x2={SVG_W - 10}
          y2={SVG_H - PAD}
          stroke="rgba(255,255,255,0.15)"
        />

        {/* Points */}
        {data.map((pt, i) => (
          <circle
            key={i}
            cx={toX(pt[0])}
            cy={toY(pt[1])}
            r={4}
            fill={COLORS[labels[i] % COLORS.length]}
            opacity={0.75}
          />
        ))}

        {/* Legend */}
        {[...new Set(labels)]
          .sort((a, b) => a - b)
          .map((cl, i) => (
            <g key={cl}>
              <circle
                cx={PAD + 10 + i * 70}
                cy={14}
                r={4}
                fill={COLORS[cl % COLORS.length]}
              />
              <text x={PAD + 18 + i * 70} y={17} fontSize={9} fill="#9999b0">
                Cluster {cl}
              </text>
            </g>
          ))}
      </svg>
    </div>
  );
};
