import React from "react";
import { PROFILE_INFO } from "./profile.data";
import type { TabId } from "./profile.data";
import { useWindowStore } from "../../core/state/useWindowStore";
import { APP_REGISTRY } from "../../core/appRegistry";

interface Props {
  onTabChange: (tab: TabId) => void;
}

export const ProfileHeader: React.FC<Props> = ({ onTabChange }) => {
  const p = PROFILE_INFO;
  const { openWindow } = useWindowStore();

  const handleContactClick = () => {
    const appInfo = APP_REGISTRY.contactCenter;
    openWindow(appInfo.title, appInfo.key, undefined, appInfo.defaultSize);
  };

  return (
    <div className="ap-header">
      <div className="ap-header-photo">
        {p.photoUrl ? (
          <img
            src={p.photoUrl}
            alt={p.name}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : null}
      </div>

      <div className="ap-header-info">
        <h1 className="ap-header-name">{p.name}</h1>
        <div className="ap-header-titles">
          {p.titles.map((t, i) => (
            <span key={i} className="ap-header-title-tag">
              {t}
            </span>
          ))}
        </div>
        <p className="ap-header-tagline">"{p.tagline}"</p>
      </div>

      <div className="ap-header-actions">
        <button
          className="ap-action-btn primary"
          onClick={() => onTabChange("resume")}
        >
          📄 Resume
        </button>
        <a
          href={p.github}
          target="_blank"
          rel="noopener noreferrer"
          className="ap-action-btn secondary"
        >
          🔗 GitHub
        </a>
        <button
          onClick={handleContactClick}
          className="ap-action-btn secondary"
        >
          ✉️ Contact
        </button>
      </div>
    </div>
  );
};
