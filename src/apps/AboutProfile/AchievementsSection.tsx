import React from "react";
import { ACHIEVEMENTS } from "./profile.data";
import { ProfileIcon } from "./ProfileIcon";

export const AchievementsSection: React.FC = () => (
  <div>
    <h2 className="ap-section-title">
      <span className="icon">🏆</span> Achievements
    </h2>
    <div className="ap-achievements-grid">
      {ACHIEVEMENTS.map((ach) => (
        <div key={ach.id} className="ap-achievement-card">
          <div className="ap-achievement-icon">
            <ProfileIcon icon={ach.icon} />
          </div>
          <h3 className="ap-achievement-title">{ach.title}</h3>
          <p className="ap-achievement-desc">{ach.description}</p>
        </div>
      ))}
    </div>
  </div>
);
