import React from "react";
import {
  PROFILE_INFO,
  EDUCATION,
  CAREER_TIMELINE,
  SKILLS,
  PROJECTS,
} from "./profile.data";

export const ResumePanel: React.FC = () => {
  const p = PROFILE_INFO;

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = import.meta.env.BASE_URL + "Pravin_Prajapati_Resume.pdf";
    a.download = "Pravin_Prajapati_Resume.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      <h2 className="ap-section-title">
        <span className="icon">📄</span> Resume
      </h2>
      <div className="ap-resume-panel">
        {/* Quick Summary */}
        <div className="ap-resume-summary">
          <h3>{p.name}</h3>
          <p>
            {p.titles.join(" · ")} — {p.tagline}
          </p>
        </div>

        {/* Education */}
        <div className="ap-resume-section">
          <h4>Education</h4>
          {EDUCATION.map((e) => (
            <div key={e.id} className="ap-resume-entry">
              <div className="ap-resume-entry-title">{e.degree}</div>
              <div className="ap-resume-entry-sub">
                {e.institute} — {e.years}
              </div>
            </div>
          ))}
        </div>

        {/* Experience */}
        <div className="ap-resume-section">
          <h4>Experience</h4>
          {CAREER_TIMELINE.map((c) => (
            <div key={c.id} className="ap-resume-entry">
              <div className="ap-resume-entry-title">{c.role}</div>
              <div className="ap-resume-entry-sub">
                {c.company} — {c.duration}
              </div>
              <div className="ap-resume-entry-desc">
                {c.responsibilities.join(" · ")}
              </div>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="ap-resume-section">
          <h4>Skills</h4>
          {SKILLS.map((cat) => (
            <div key={cat.category} className="ap-resume-entry">
              <div className="ap-resume-entry-title">{cat.category}</div>
              <div className="ap-resume-entry-desc">
                {cat.skills.map((s) => s.name).join(", ")}
              </div>
            </div>
          ))}
        </div>

        {/* Projects */}
        <div className="ap-resume-section">
          <h4>Key Projects</h4>
          {PROJECTS.slice(0, 3).map((proj) => (
            <div key={proj.id} className="ap-resume-entry">
              <div className="ap-resume-entry-title">{proj.name}</div>
              <div className="ap-resume-entry-desc">{proj.description}</div>
            </div>
          ))}
        </div>

        <button className="ap-resume-download" onClick={handleDownload}>
          📥 Download Resume
        </button>
      </div>
    </div>
  );
};
