import React from 'react';
import {
    PROFILE_INFO,
    EDUCATION,
    CAREER_TIMELINE,
    SKILLS,
    PROJECTS,
} from './profile.data';

export const ResumePanel: React.FC = () => {
    const p = PROFILE_INFO;

    const handleDownload = () => {
        const lines: string[] = [];
        lines.push(p.name);
        lines.push(p.titles.join(' | '));
        lines.push(p.tagline);
        lines.push(`Email: ${p.email}  |  GitHub: ${p.github}  |  LinkedIn: ${p.linkedin}`);
        lines.push('');
        lines.push('=== EDUCATION ===');
        EDUCATION.forEach(e => {
            lines.push(`${e.degree} — ${e.institute} (${e.years})`);
            lines.push(`  Subjects: ${e.subjects.join(', ')}`);
            lines.push('');
        });
        lines.push('=== EXPERIENCE ===');
        CAREER_TIMELINE.forEach(c => {
            lines.push(`${c.role} — ${c.company} (${c.duration})`);
            c.responsibilities.forEach(r => lines.push(`  • ${r}`));
            lines.push(`  Tools: ${c.tools.join(', ')}`);
            lines.push('');
        });
        lines.push('=== SKILLS ===');
        SKILLS.forEach(cat => {
            lines.push(`${cat.category}: ${cat.skills.map(s => s.name).join(', ')}`);
        });
        lines.push('');
        lines.push('=== PROJECTS ===');
        PROJECTS.forEach(proj => {
            lines.push(`${proj.name}`);
            lines.push(`  ${proj.description}`);
            lines.push(`  Tech: ${proj.tech.join(', ')}`);
            lines.push('');
        });

        const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${p.name.replace(/\s+/g, '_')}_Resume.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
                        {p.titles.join(' · ')} — {p.tagline}
                    </p>
                </div>

                {/* Education */}
                <div className="ap-resume-section">
                    <h4>Education</h4>
                    {EDUCATION.map(e => (
                        <div key={e.id} className="ap-resume-entry">
                            <div className="ap-resume-entry-title">{e.degree}</div>
                            <div className="ap-resume-entry-sub">{e.institute} — {e.years}</div>
                        </div>
                    ))}
                </div>

                {/* Experience */}
                <div className="ap-resume-section">
                    <h4>Experience</h4>
                    {CAREER_TIMELINE.map(c => (
                        <div key={c.id} className="ap-resume-entry">
                            <div className="ap-resume-entry-title">{c.role}</div>
                            <div className="ap-resume-entry-sub">{c.company} — {c.duration}</div>
                            <div className="ap-resume-entry-desc">
                                {c.responsibilities.join(' · ')}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Skills */}
                <div className="ap-resume-section">
                    <h4>Skills</h4>
                    {SKILLS.map(cat => (
                        <div key={cat.category} className="ap-resume-entry">
                            <div className="ap-resume-entry-title">{cat.category}</div>
                            <div className="ap-resume-entry-desc">
                                {cat.skills.map(s => s.name).join(', ')}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Projects */}
                <div className="ap-resume-section">
                    <h4>Key Projects</h4>
                    {PROJECTS.slice(0, 3).map(proj => (
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
