export interface Session {
  date: string;
  completed: boolean;
}

export class ProgressService {
  calculateCurrentStreak(sessions: Session[]): number {
    if (!sessions || sessions.length === 0) {
      return 0;
    }

    // Sort sessions by date (most recent first)
    const sortedSessions = [...sessions].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;
    
    // Count consecutive completed sessions starting from the most recent
    for (const session of sortedSessions) {
      if (session.completed) {
        streak++;
      } else {
        break; // Stop counting when we hit an incomplete session
      }
    }

    return streak;
  }

  calculateLongestStreak(sessions: Session[]): number {
    if (!sessions || sessions.length === 0) {
      return 0;
    }

    // Sort sessions by date (oldest first to calculate all streaks)
    const sortedSessions = [...sessions].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let maxStreak = 0;
    let currentStreak = 0;

    for (const session of sortedSessions) {
      if (session.completed) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0; // Reset streak on incomplete session
      }
    }

    return maxStreak;
  }
}