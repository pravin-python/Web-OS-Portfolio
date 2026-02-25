import React, { useState } from "react";
import { CAREER_TIMELINE } from "./profile.data";

export const CareerTimeline: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      <h2 className="ap-section-title">
        <span className="icon">📈</span> Career Timeline
      </h2>
      <div className="ap-career-timeline">
        {CAREER_TIMELINE.map((entry) => (
          <div
            key={entry.id}
            className={`ap-career-card ${expandedId === entry.id ? "expanded" : ""}`}
            onClick={() => toggle(entry.id)}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 20 }}>{entry.icon}</span>
              <h3 className="ap-career-role">{entry.role}</h3>
            </div>
            <p className="ap-career-company">{entry.company}</p>
            <span className="ap-career-duration">{entry.duration}</span>

            <div className="ap-career-details">
              <ul className="ap-career-resp">
                {entry.responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              <div className="ap-career-tools">
                {entry.tools.map((t, i) => (
                  <span key={i} className="ap-tool-pill">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {expandedId !== entry.id && (
              <div style={{ fontSize: 10, color: "#64748b", marginTop: 6 }}>
                Click to expand ▾
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
