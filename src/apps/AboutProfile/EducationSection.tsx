import React from "react";
import { EDUCATION } from "./profile.data";
import { ProfileIcon } from "./ProfileIcon";

export const EducationSection: React.FC = () => (
  <div>
    <h2 className="ap-section-title">
      <span className="icon">🎓</span> Education
    </h2>
    <div className="ap-edu-timeline">
      {EDUCATION.map((entry) => (
        <div key={entry.id} className="ap-edu-card">
          <div className="ap-edu-icon">
            <ProfileIcon icon={entry.icon} />
          </div>
          <h3 className="ap-edu-institute">{entry.institute}</h3>
          <p className="ap-edu-degree">{entry.degree}</p>
          <span className="ap-edu-years">{entry.years}</span>
          <div className="ap-edu-subjects">
            {entry.subjects.map((s, i) => (
              <span key={i} className="ap-edu-subject-pill">
                {s}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
