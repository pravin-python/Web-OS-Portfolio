import React from "react";

interface Props {
  matrix: number[][];
  classNames: string[];
}

export const ConfusionMatrix: React.FC<Props> = ({ matrix, classNames }) => {
  const maxVal = Math.max(...matrix.flat(), 1);

  return (
    <div className="mlc-cm-wrap">
      <h4 className="mlc-result-subtitle">Confusion Matrix</h4>
      <div className="mlc-cm-container">
        <table className="mlc-cm-table">
          <thead>
            <tr>
              <th className="mlc-cm-corner">
                <span className="mlc-cm-axis-label predicted">Predicted →</span>
                <span className="mlc-cm-axis-label actual">Actual ↓</span>
              </th>
              {classNames.map((name) => (
                <th key={name} className="mlc-cm-header">
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <td className="mlc-cm-row-label">{classNames[i]}</td>
                {row.map((val, j) => {
                  const intensity = val / maxVal;
                  const isDiag = i === j;
                  const bg = isDiag
                    ? `rgba(48, 209, 88, ${0.15 + intensity * 0.55})`
                    : `rgba(255, 69, 58, ${intensity * 0.5})`;
                  return (
                    <td
                      key={j}
                      className="mlc-cm-cell"
                      style={{ background: bg }}
                    >
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
