import React from 'react';
import { StreakCounter } from './StreakCounter';
import { ProgressChart } from './ProgressChart';
import { ProgressIndicator } from './ProgressIndicator';
import { AchievementBadge } from './AchievementBadge';
import { useProgressTracking } from '../../hooks/useProgressTracking';

interface ProgressScreenProps {
  sessions: Array<{ date: string; completed: boolean; }>;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ sessions }) => {
  const progressData = useProgressTracking(sessions);
  
  return (
    <div>
      <h1>Progress Overview</h1>
      <StreakCounter
        currentStreak={progressData.currentStreak}
        longestStreak={progressData.longestStreak}
      />
      <ProgressChart
        data={sessions}
        type="daily"
      />
      <ProgressIndicator
        progress={sessions.filter(s => s.completed).length}
        total={sessions.length}
        label="Sessions Completed"
      />
      <AchievementBadge
        title="First Steps"
        description="Complete your first meditation session"
        icon="🎯"
        unlocked={sessions.some(s => s.completed)}
      />
    </div>
  );
};