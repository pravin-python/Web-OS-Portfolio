import React, { useMemo } from "react";
import { TECH_STACK } from "./profile.data";

const SIZE = 320;
const CENTER = SIZE / 2;
const RADIUS = 120;
const LEVELS = 4; // concentric rings

export const TechStack: React.FC = () => {
  const n = TECH_STACK.length;

  // Generate polygon points for data
  const dataPoints = useMemo(() => {
    return TECH_STACK.map((axis, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const r = (axis.value / 100) * RADIUS;
      return {
        x: CENTER + Math.cos(angle) * r,
        y: CENTER + Math.sin(angle) * r,
      };
    });
  }, [n]);

  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // Axis lines and labels
  const axes = useMemo(() => {
    return TECH_STACK.map((axis, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      return {
        label: axis.label,
        value: axis.value,
        endX: CENTER + Math.cos(angle) * RADIUS,
        endY: CENTER + Math.sin(angle) * RADIUS,
        labelX: CENTER + Math.cos(angle) * (RADIUS + 24),
        labelY: CENTER + Math.sin(angle) * (RADIUS + 24),
      };
    });
  }, [n]);

  return (
    <div>
      <h2 className="ap-section-title">
        <span className="icon">⚙️</span> Tech Stack Radar
      </h2>
      <div className="ap-radar-container">
        <svg
          className="ap-radar-svg"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Concentric rings */}
          {Array.from({ length: LEVELS }, (_, lvl) => {
            const r = ((lvl + 1) / LEVELS) * RADIUS;
            const points = Array.from({ length: n }, (_, i) => {
              const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
              return `${CENTER + Math.cos(angle) * r},${CENTER + Math.sin(angle) * r}`;
            }).join(" ");
            return (
              <polygon
                key={lvl}
                points={points}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={1}
              />
            );
          })}

          {/* Axis lines */}
          {axes.map((a, i) => (
            <line
              key={i}
              x1={CENTER}
              y1={CENTER}
              x2={a.endX}
              y2={a.endY}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
            />
          ))}

          {/* Data polygon */}
          <polygon
            className="ap-radar-polygon"
            points={dataPolygon}
            fill="rgba(99, 102, 241, 0.2)"
            stroke="#818cf8"
            strokeWidth={2}
          />

          {/* Data dots */}
          {dataPoints.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={4}
              fill="#818cf8"
              stroke="#1a1a3e"
              strokeWidth={2}
            />
          ))}

          {/* Labels */}
          {axes.map((a, i) => (
            <text
              key={i}
              x={a.labelX}
              y={a.labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#94a3b8"
              fontSize={11}
              fontWeight={600}
            >
              {a.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};
