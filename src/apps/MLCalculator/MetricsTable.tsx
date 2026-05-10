import React from "react";

interface MetricRow {
  label: string;
  value: number;
  format?: "percent" | "number";
}

interface Props {
  metrics: MetricRow[];
  title: string;
}

export const MetricsTable: React.FC<Props> = ({ metrics, title }) => (
  <div className="mlc-metrics-wrap">
    <h4 className="mlc-result-subtitle">{title}</h4>
    <table className="mlc-metrics-table">
      <thead>
        <tr>
          <th>Metric</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {metrics.map(({ label, value, format }) => (
          <tr key={label}>
            <td className="mlc-metric-label">{label}</td>
            <td className="mlc-metric-value">
              {format === "percent"
                ? `${(value * 100).toFixed(2)}%`
                : value.toFixed(4)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
