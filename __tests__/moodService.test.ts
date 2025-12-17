import { moodService, MoodEntry } from '../src/services/moodService';
import { MoodOption, MoodCategory } from '../src/data/moodOptions';

// Mock AsyncStorage
const mockAsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Replace the mock in the service
jest.mock('../src/services/moodService', () => {
  const originalModule = jest.requireActual('../src/services/moodService');
  return {
    ...originalModule,
    AsyncStorage: mockAsyncStorage,
  };
});

describe('moodService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.setItem.mockResolvedValue(undefined);
  });

  describe('saveMoodEntry', () => {
    test('should save mood entry with timestamp', async () => {
      const mockMood: MoodOption = {
        id: 'good',
        label: 'Good',
        emoji: '😊',
        category: MoodCategory.POSITIVE
      };

      const sessionId = 'session123';
      
      // Mock getItem to return empty array
      mockAsyncStorage.getItem.mockResolvedValueOnce(null);
      
      await moodService.saveMoodEntry(mockMood, sessionId);
      
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'mindloop_mood_entries',
        expect.stringContaining('"moodId":"good"')
      );
    });

    test('should handle null mood gracefully', async () => {
      const sessionId = 'session123';
      
      // Mock getItem to return empty array
      mockAsyncStorage.getItem.mockResolvedValueOnce(null);
      
      await moodService.saveMoodEntry(null, sessionId);
      
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'mindloop_mood_entries',
        expect.stringContaining('"moodId":null')
      );
    });
  });

  describe('getMoodEntries', () => {
    test('should return empty array when no entries exist', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce(null);
      
      const entries = await moodService.getMoodEntries();
      expect(entries).toHaveLength(0);
    });

    test('should return all saved mood entries', async () => {
      const mockEntries = JSON.stringify([
        { id: '1', moodId: 'good', sessionId: 'session1', timestamp: '2023-01-01T00:00:00.000Z' },
        { id: '2', moodId: 'bad', sessionId: 'session2', timestamp: '2023-01-01T00:01:00.000Z' }
      ]);
      
      mockAsyncStorage.getItem.mockResolvedValueOnce(mockEntries);
      
      const entries = await moodService.getMoodEntries();
      expect(entries).toHaveLength(2);
      expect(entries[0].moodId).toBe('good');
      expect(entries[1].moodId).toBe('bad');
    });
  });

  describe('getMoodStats', () => {
    test('should calculate mood statistics correctly', async () => {
      const mockEntries = JSON.stringify([
        { id: '1', moodId: 'good', sessionId: 'session1', timestamp: '2023-01-01T00:00:00.000Z' },
        { id: '2', moodId: 'good', sessionId: 'session2', timestamp: '2023-01-01T00:01:00.000Z' },
        { id: '3', moodId: 'good', sessionId: 'session3', timestamp: '2023-01-01T00:02:00.000Z' },
        { id: '4', moodId: 'bad', sessionId: 'session4', timestamp: '2023-01-01T00:03:00.000Z' },
        { id: '5', moodId: 'bad', sessionId: 'session5', timestamp: '2023-01-01T00:04:00.000Z' }
      ]);
      
      mockAsyncStorage.getItem.mockResolvedValueOnce(mockEntries);
      
      const stats = await moodService.getMoodStats();
      
      expect(stats.totalEntries).toBe(5);
      expect(stats.positiveCount).toBe(3);
      expect(stats.negativeCount).toBe(2);
      expect(stats.neutralCount).toBe(0);
      expect(stats.positivePercentage).toBe(60);
      expect(stats.negativePercentage).toBe(40);
    });
  });
});