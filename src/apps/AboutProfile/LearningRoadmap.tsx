import React from "react";
import { LEARNING_ROADMAP } from "./profile.data";
import { ProfileIcon } from "./ProfileIcon";

export const LearningRoadmap: React.FC = () => (
  <div>
    <h2 className="ap-section-title">
      <span className="icon">
        <img
          alt="icon"
          className="profile-svg-icon "
          draggable="false"
          src="/svg/apps/experiments.svg"
        />
      </span>{" "}
      Learning Roadmap
    </h2>
    <div className="ap-learning-list">
      {LEARNING_ROADMAP.map((item) => {
        const statusClass =
          item.status === "In Progress"
            ? "in-progress"
            : item.status === "Practicing"
              ? "practicing"
              : "researching";

        return (
          <div key={item.id} className="ap-learning-card">
            <div className="ap-learning-icon">
              <ProfileIcon icon={item.icon} />
            </div>
            <div className="ap-learning-info">
              <h3 className="ap-learning-topic">{item.topic}</h3>
              <div className="ap-learning-bar-bg">
                <div
                  className="ap-learning-bar-fill"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
            <span className={`ap-learning-status ${statusClass}`}>
              {item.status}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);
