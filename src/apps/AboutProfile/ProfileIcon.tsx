import React from "react";

interface ProfileIconProps {
  icon: string;
  className?: string;
}

export const ProfileIcon: React.FC<ProfileIconProps> = ({
  icon,
  className = "",
}) => {
  const isImage =
    icon.endsWith(".svg") ||
    icon.endsWith(".png") ||
    icon.endsWith(".jpg") ||
    icon.endsWith(".jpeg");

  if (isImage) {
    return (
      <img
        src={icon}
        alt="icon"
        className={`profile-svg-icon ${className}`}
        draggable={false}
      />
    );
  }

  return <span className={className}>{icon}</span>;
};
