import React from 'react';
import { PROFILE_INFO } from './profile.data';
import type { TabId } from './profile.data';

interface Props {
    onTabChange: (tab: TabId) => void;
}

export const ProfileHeader: React.FC<Props> = ({ onTabChange }) => {
    const p = PROFILE_INFO;

    return (
        <div className="ap-header">
            <div className="ap-header-photo">
                {p.photoUrl ? (
                    <img src={p.photoUrl} alt={p.name} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : null}
                <span style={{ position: 'absolute' }}>👨‍💻</span>
            </div>

            <div className="ap-header-info">
                <h1 className="ap-header-name">{p.name}</h1>
                <div className="ap-header-titles">
                    {p.titles.map((t, i) => (
                        <span key={i} className="ap-header-title-tag">{t}</span>
                    ))}
                </div>
                <p className="ap-header-tagline">"{p.tagline}"</p>
            </div>

            <div className="ap-header-actions">
                <button className="ap-action-btn primary" onClick={() => onTabChange('resume')}>
                    📄 Resume
                </button>
                <a href={p.github} target="_blank" rel="noopener noreferrer" className="ap-action-btn secondary">
                    🔗 GitHub
                </a>
                <a href={`mailto:${p.email}`} className="ap-action-btn secondary">
                    ✉️ Contact
                </a>
            </div>
        </div>
    );
};
