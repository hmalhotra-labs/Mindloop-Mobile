import { ProgressService, Session } from '../services/progressService';

export interface ProgressData {
  currentStreak: number;
  longestStreak: number;
}

export const useProgressTracking = (sessions: Session[]): ProgressData => {
  const progressService = new ProgressService();
  
  return {
    currentStreak: progressService.calculateCurrentStreak(sessions),
    longestStreak: progressService.calculateLongestStreak(sessions)
  };
};