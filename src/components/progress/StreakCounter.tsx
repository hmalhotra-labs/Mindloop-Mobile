import React from 'react';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ currentStreak, longestStreak }) => {
  return (
    <div>
      <div>Current Streak: {currentStreak}</div>
      <div>Longest Streak: {longestStreak}</div>
    </div>
  );
};