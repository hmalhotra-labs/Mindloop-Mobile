import React from 'react';

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ title, description, icon, unlocked }) => {
  return (
    <div>
      <div>{icon} {title}</div>
      <div>{description}</div>
      <div>Status: {unlocked ? 'Unlocked' : 'Locked'}</div>
    </div>
  );
};