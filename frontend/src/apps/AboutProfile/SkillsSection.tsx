import React from 'react';
import { SKILLS } from './profile.data';

export const SkillsSection: React.FC = () => (
    <div>
        <h2 className="ap-section-title">
            <span className="icon">🧠</span> Skills & Technologies
        </h2>
        <div className="ap-skills-grid">
            {SKILLS.map((cat) => (
                <div key={cat.category} className="ap-skill-category">
                    <h3 className="ap-skill-cat-title">
                        <span>{cat.icon}</span> {cat.category}
                    </h3>
                    {cat.skills.map((skill) => (
                        <div key={skill.name} className="ap-skill-row">
                            <span className="ap-skill-icon">{skill.icon}</span>
                            <div className="ap-skill-info">
                                <div className="ap-skill-name-row">
                                    <span className="ap-skill-name">{skill.name}</span>
                                    <span className="ap-skill-years">{skill.years}yr{skill.years !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="ap-skill-bar-bg">
                                    <div
                                        className="ap-skill-bar-fill"
                                        style={{ width: `${skill.level}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    </div>
);
