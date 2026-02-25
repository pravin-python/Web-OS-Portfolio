import React, { useState } from 'react';
import { SIDEBAR_TABS, SKILLS, PROJECTS, ACHIEVEMENTS, CAREER_TIMELINE, LEARNING_ROADMAP } from './profile.data';
import type { TabId } from './profile.data';
import { ProfileHeader } from './ProfileHeader';
import { EducationSection } from './EducationSection';
import { CareerTimeline } from './CareerTimeline';
import { ExperienceGraph } from './ExperienceGraph';
import { SkillsSection } from './SkillsSection';
import { TechStack } from './TechStack';
import { ProjectsSection } from './ProjectsSection';
import { AchievementsSection } from './AchievementsSection';
import { LearningRoadmap } from './LearningRoadmap';
import { ResumePanel } from './ResumePanel';
import './styles.css';

/* ─── Overview Dashboard ─── */
const OverviewSection: React.FC<{ onTabChange: (tab: TabId) => void }> = ({ onTabChange }) => {
    const totalSkills = SKILLS.reduce((sum, cat) => sum + cat.skills.length, 0);

    return (
        <div>
            <h2 className="ap-section-title">
                <span className="icon">🏠</span> Overview
            </h2>

            {/* Stat Cards */}
            <div className="ap-overview-grid">
                <div className="ap-overview-stat" onClick={() => onTabChange('skills')} style={{ cursor: 'pointer' }}>
                    <div className="ap-overview-stat-value">{totalSkills}</div>
                    <div className="ap-overview-stat-label">Skills</div>
                </div>
                <div className="ap-overview-stat" onClick={() => onTabChange('projects')} style={{ cursor: 'pointer' }}>
                    <div className="ap-overview-stat-value">{PROJECTS.length}</div>
                    <div className="ap-overview-stat-label">Projects</div>
                </div>
                <div className="ap-overview-stat" onClick={() => onTabChange('achievements')} style={{ cursor: 'pointer' }}>
                    <div className="ap-overview-stat-value">{ACHIEVEMENTS.length}</div>
                    <div className="ap-overview-stat-label">Achievements</div>
                </div>
                <div className="ap-overview-stat" onClick={() => onTabChange('career')} style={{ cursor: 'pointer' }}>
                    <div className="ap-overview-stat-value">{CAREER_TIMELINE.length}</div>
                    <div className="ap-overview-stat-label">Roles</div>
                </div>
            </div>

            {/* Highlight Panels */}
            <div className="ap-overview-highlights">
                <div className="ap-overview-highlight">
                    <h4>🧠 Top Skills</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {SKILLS.flatMap(c => c.skills)
                            .sort((a, b) => b.level - a.level)
                            .slice(0, 5)
                            .map(s => (
                                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontSize: 14 }}>{s.icon}</span>
                                    <span style={{ fontSize: 12, color: '#e2e8f0', flex: 1 }}>{s.name}</span>
                                    <div style={{ width: 80, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.08)' }}>
                                        <div style={{ width: `${s.level}%`, height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
                <div className="ap-overview-highlight">
                    <h4>🚀 Currently Learning</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {LEARNING_ROADMAP.slice(0, 4).map(item => (
                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 14 }}>{item.icon}</span>
                                <span style={{ fontSize: 12, color: '#e2e8f0', flex: 1 }}>{item.topic}</span>
                                <span style={{
                                    fontSize: 9,
                                    fontWeight: 700,
                                    padding: '2px 8px',
                                    borderRadius: 10,
                                    background: item.status === 'In Progress' ? 'rgba(16,185,129,0.15)' : item.status === 'Practicing' ? 'rgba(251,191,36,0.15)' : 'rgba(59,130,246,0.15)',
                                    color: item.status === 'In Progress' ? '#34d399' : item.status === 'Practicing' ? '#fbbf24' : '#60a5fa',
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5,
                                }}>
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── Section Renderer ─── */
const SectionContent: React.FC<{ tab: TabId; onTabChange: (tab: TabId) => void }> = ({ tab, onTabChange }) => {
    switch (tab) {
        case 'overview': return <OverviewSection onTabChange={onTabChange} />;
        case 'education': return <EducationSection />;
        case 'career': return <CareerTimeline />;
        case 'experience': return <ExperienceGraph />;
        case 'skills': return <SkillsSection />;
        case 'techstack': return <TechStack />;
        case 'projects': return <ProjectsSection />;
        case 'achievements': return <AchievementsSection />;
        case 'learning': return <LearningRoadmap />;
        case 'resume': return <ResumePanel />;
        default: return <OverviewSection onTabChange={onTabChange} />;
    }
};

/* ─── Main Component ─── */
export const AboutProfile: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabId>('overview');

    return (
        <div className="ap-root">
            <ProfileHeader onTabChange={setActiveTab} />

            <div className="ap-body">
                {/* Sidebar */}
                <nav className="ap-sidebar">
                    {SIDEBAR_TABS.map(tab => (
                        <button
                            key={tab.id}
                            className={`ap-sidebar-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className="ap-tab-icon">{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Content */}
                <main className="ap-content" key={activeTab}>
                    <SectionContent tab={activeTab} onTabChange={setActiveTab} />
                </main>
            </div>
        </div>
    );
};
