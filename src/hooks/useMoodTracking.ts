import { useState, useEffect } from 'react';
import { moodService } from '../services/moodService';
import { MoodOption } from '../data/moodOptions';
import { MoodEntry } from '../services/moodService';

export interface UseMoodTrackingReturn {
  moodEntries: MoodEntry[];
  isLoading: boolean;
  saveMood: (mood: MoodOption | null, sessionId: string) => Promise<void>;
  skipMood: (sessionId: string) => Promise<void>;
  getMoodStats: () => Promise<{
    totalEntries: number;
    positiveCount: number;
    negativeCount: number;
    neutralCount: number;
    positivePercentage: number;
    negativePercentage: number;
    neutralPercentage: number;
  }>;
}

export const useMoodTracking = (): UseMoodTrackingReturn => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoodEntries = async () => {
    setIsLoading(true);
    try {
      const entries = await moodService.getMoodEntries();
      setMoodEntries(entries);
    } catch (error) {
      console.error('Error loading mood entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveMood = async (mood: MoodOption | null, sessionId: string) => {
    try {
      await moodService.saveMoodEntry(mood, sessionId);
      await loadMoodEntries(); // Refresh the list
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };

  const skipMood = async (sessionId: string) => {
    await saveMood(null, sessionId);
  };

  const getMoodStats = async () => {
    return await moodService.getMoodStats();
  };

  useEffect(() => {
    loadMoodEntries();
  }, []);

  return {
    moodEntries,
    isLoading,
    saveMood,
    skipMood,
    getMoodStats
  };
};