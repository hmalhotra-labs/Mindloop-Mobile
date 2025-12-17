import { renderHook, act } from '@testing-library/react-native';
import { waitFor } from '@testing-library/react-native';
import { useMoodTracking } from '../src/hooks/useMoodTracking';
import { moodService } from '../src/services/moodService';
import { MoodOption, MoodCategory } from '../src/data/moodOptions';

// Mock the moodService
jest.mock('../src/services/moodService');

describe('useMoodTracking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with empty mood entries', async () => {
    const mockGetMoodEntries = jest.fn().mockResolvedValue([]);
    (moodService.getMoodEntries as jest.Mock) = mockGetMoodEntries;
    
    const { result } = renderHook(() => useMoodTracking());
    
    await waitFor(() => {
      expect(result.current.moodEntries).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });
  });

  test('should load mood entries on mount', async () => {
    const mockEntries = [
      {
        id: '1',
        moodId: 'good',
        sessionId: 'session1',
        timestamp: '2023-01-01T00:00:00.000Z'
      }
    ];
    
    const mockGetMoodEntries = jest.fn().mockResolvedValue(mockEntries);
    (moodService.getMoodEntries as jest.Mock) = mockGetMoodEntries;
    
    const { result } = renderHook(() => useMoodTracking());
    
    await waitFor(() => {
      expect(result.current.moodEntries).toEqual(mockEntries);
      expect(mockGetMoodEntries).toHaveBeenCalledTimes(1);
    });
  });

  test('should save mood entry when selected', async () => {
    const mockSaveMoodEntry = jest.fn().mockResolvedValue(undefined);
    (moodService.saveMoodEntry as jest.Mock) = mockSaveMoodEntry;
    
    const mockGetMoodEntries = jest.fn()
      .mockResolvedValueOnce([]) // Initial call
      .mockResolvedValueOnce([{
        id: '1',
        moodId: 'good',
        sessionId: 'session1',
        timestamp: '2023-01-01T00:00:00.000Z'
      }]); // After save
    
    (moodService.getMoodEntries as jest.Mock) = mockGetMoodEntries;
    
    const { result } = renderHook(() => useMoodTracking());
    
    await waitFor(() => {
      expect(result.current.moodEntries).toEqual([]);
    });
    
    const mockMood: MoodOption = {
      id: 'good',
      label: 'Good',
      emoji: '😊',
      category: MoodCategory.POSITIVE
    };
    
    await act(async () => {
      await result.current.saveMood(mockMood, 'session1');
    });
    
    await waitFor(() => {
      expect(mockSaveMoodEntry).toHaveBeenCalledWith(mockMood, 'session1');
      expect(result.current.moodEntries).toHaveLength(1);
    });
  });

  test('should skip mood when requested', async () => {
    const mockSaveMoodEntry = jest.fn().mockResolvedValue(undefined);
    (moodService.saveMoodEntry as jest.Mock) = mockSaveMoodEntry;
    
    const mockGetMoodEntries = jest.fn()
      .mockResolvedValueOnce([]) // Initial call
      .mockResolvedValueOnce([{
        id: '1',
        moodId: null,
        sessionId: 'session1',
        timestamp: '2023-01-01T00:00:00.000Z'
      }]); // After skip
    
    (moodService.getMoodEntries as jest.Mock) = mockGetMoodEntries;
    
    const { result } = renderHook(() => useMoodTracking());
    
    await waitFor(() => {
      expect(result.current.moodEntries).toEqual([]);
    });
    
    await act(async () => {
      await result.current.skipMood('session1');
    });
    
    await waitFor(() => {
      expect(mockSaveMoodEntry).toHaveBeenCalledWith(null, 'session1');
      expect(result.current.moodEntries).toHaveLength(1);
      expect(result.current.moodEntries[0].moodId).toBeNull();
    });
  });
});