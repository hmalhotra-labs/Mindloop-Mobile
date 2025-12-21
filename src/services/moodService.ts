import { MoodOption } from '../data/moodOptions';

export interface MoodEntry {
  id: string;
  moodId: string | null;
  sessionId: string;
  timestamp: string;
}

export interface MoodStats {
  totalEntries: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  positivePercentage: number;
  negativePercentage: number;
  neutralPercentage: number;
}

const STORAGE_KEY = 'mindloop_mood_entries';

// Import AsyncStorage from React Native
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define AsyncStorage type for testing
export const AsyncStorageForTesting = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Use actual AsyncStorage in production, mock in tests
export const AsyncStorageToUse = (typeof jest !== 'undefined' && process.env.NODE_ENV === 'test')
  ? AsyncStorageForTesting
  : AsyncStorage;

class MoodService {
  private async getStorageData(): Promise<MoodEntry[]> {
    try {
      const data = await AsyncStorageToUse.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from AsyncStorage:', error);
      return [];
    }
  }

  private async setStorageData(entries: MoodEntry[]): Promise<void> {
    try {
      await AsyncStorageToUse.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error writing to AsyncStorage:', error);
    }
  }

  async saveMoodEntry(mood: MoodOption | null, sessionId: string): Promise<void> {
    const entries = await this.getStorageData();
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      moodId: mood?.id || null,
      sessionId,
      timestamp: new Date().toISOString()
    };
    entries.push(newEntry);
    await this.setStorageData(entries);
  }

  async getMoodEntries(): Promise<MoodEntry[]> {
    return await this.getStorageData();
  }

  async getMoodStats(): Promise<MoodStats> {
    const entries = await this.getStorageData();
    const totalEntries = entries.length;
    
    if (totalEntries === 0) {
      return {
        totalEntries: 0,
        positiveCount: 0,
        negativeCount: 0,
        neutralCount: 0,
        positivePercentage: 0,
        negativePercentage: 0,
        neutralPercentage: 0
      };
    }

    // Count by mood categories
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    entries.forEach(entry => {
      if (entry.moodId === 'good' || entry.moodId === 'okay') {
        positiveCount++;
      } else if (entry.moodId === 'bad') {
        negativeCount++;
      } else if (entry.moodId === 'meh') {
        neutralCount++;
      }
    });

    return {
      totalEntries,
      positiveCount,
      negativeCount,
      neutralCount,
      positivePercentage: Math.round((positiveCount / totalEntries) * 100),
      negativePercentage: Math.round((negativeCount / totalEntries) * 100),
      neutralPercentage: Math.round((neutralCount / totalEntries) * 100)
    };
  }
}

export const moodService = new MoodService();