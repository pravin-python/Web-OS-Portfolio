import React, { useMemo } from "react";
import { EXPERIENCE_DATA } from "./profile.data";

const COLORS: Record<string, string> = {
  python: "#3b82f6",
  ml: "#a855f7",
  web: "#10b981",
  security: "#f59e0b",
};

const LABELS: Record<string, string> = {
  python: "Python",
  ml: "Machine Learning",
  web: "Web Development",
  security: "Security",
};

const PADDING = { top: 20, right: 30, bottom: 40, left: 45 };
const CHART_W = 600;
const CHART_H = 260;
const INNER_W = CHART_W - PADDING.left - PADDING.right;
const INNER_H = CHART_H - PADDING.top - PADDING.bottom;

function buildPath(
  data: { year: number; value: number }[],
  xScale: (y: number) => number,
  yScale: (v: number) => number,
): string {
  return data
    .map((d, i) => `${i === 0 ? "M" : "L"}${xScale(d.year)},${yScale(d.value)}`)
    .join(" ");
}

export const ExperienceGraph: React.FC = () => {
  const years = EXPERIENCE_DATA.map((d) => d.year);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  const xScale = (year: number) =>
    PADDING.left + ((year - minYear) / (maxYear - minYear)) * INNER_W;
  const yScale = (value: number) =>
    PADDING.top + INNER_H - (value / 100) * INNER_H;

  const series = useMemo(() => {
    const keys = ["python", "ml", "web", "security"] as const;
    return keys.map((key) => ({
      key,
      color: COLORS[key],
      label: LABELS[key],
      path: buildPath(
        EXPERIENCE_DATA.map((d) => ({ year: d.year, value: d[key] })),
        xScale,
        yScale,
      ),
    }));
  }, []);

  // Y-axis ticks
  const yTicks = [0, 25, 50, 75, 100];

  return (
    <div>
      <h2 className="ap-section-title">
        <span className="icon">
          <img
            alt="icon"
            className="profile-svg-icon "
            draggable="false"
            src="/svg/system/dataset.svg"
          />
        </span>{" "}
        Experience Graph
      </h2>
      <div className="ap-graph-container">
        <svg
          className="ap-graph-svg"
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines */}
          {yTicks.map((t) => (
            <line
              key={t}
              x1={PADDING.left}
              y1={yScale(t)}
              x2={CHART_W - PADDING.right}
              y2={yScale(t)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          ))}

          {/* Y-axis labels */}
          {yTicks.map((t) => (
            <text
              key={`yl-${t}`}
              x={PADDING.left - 8}
              y={yScale(t) + 3}
              textAnchor="end"
              fill="#64748b"
              fontSize={10}
            >
              {t}
            </text>
          ))}

          {/* X-axis labels */}
          {years.map((y) => (
            <text
              key={`xl-${y}`}
              x={xScale(y)}
              y={CHART_H - 8}
              textAnchor="middle"
              fill="#64748b"
              fontSize={10}
            >
              {y}
            </text>
          ))}

          {/* Lines */}
          {series.map((s) => (
            <path
              key={s.key}
              className="ap-graph-line"
              d={s.path}
              stroke={s.color}
            />
          ))}

          {/* Dots */}
          {series.map((s) =>
            EXPERIENCE_DATA.map((d, i) => (
              <circle
                key={`${s.key}-${i}`}
                cx={xScale(d.year)}
                cy={yScale(d[s.key as keyof typeof d] as number)}
                r={3}
                fill={s.color}
                opacity={0.8}
              />
            )),
          )}
        </svg>

        <div className="ap-graph-legend">
          {series.map((s) => (
            <div key={s.key} className="ap-legend-item">
              <div className="ap-legend-dot" style={{ background: s.color }} />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
