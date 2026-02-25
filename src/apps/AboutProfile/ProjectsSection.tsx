import React, { useState } from 'react';
import { PROJECTS } from './profile.data';

export const ProjectsSection: React.FC = () => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggle = (id: string) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    return (
        <div>
            <h2 className="ap-section-title">
                <span className="icon">📂</span> Projects
            </h2>
            <div className="ap-projects-grid">
                {PROJECTS.map((proj) => (
                    <div
                        key={proj.id}
                        className={`ap-project-card ${expandedId === proj.id ? 'expanded' : ''}`}
                        onClick={() => toggle(proj.id)}
                    >
                        <div className="ap-project-icon">{proj.icon}</div>
                        <h3 className="ap-project-name">{proj.name}</h3>
                        <p className="ap-project-desc">{proj.description}</p>
                        <div className="ap-project-tech">
                            {proj.tech.map((t, i) => (
                                <span key={i} className="ap-project-tech-pill">{t}</span>
                            ))}
                        </div>

                        {expandedId === proj.id && (
                            <div className="ap-project-detail-section">
                                <div className="ap-project-detail-label">Problem Solved</div>
                                <div className="ap-project-detail-text">{proj.problem}</div>
                                <div className="ap-project-detail-label">What I Learned</div>
                                <div className="ap-project-detail-text">{proj.learned}</div>
                            </div>
                        )}

                        {expandedId !== proj.id && (
                            <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>
                                Click for details ▾
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
