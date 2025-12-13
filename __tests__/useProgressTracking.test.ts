import { useProgressTracking } from '../src/hooks/useProgressTracking';

describe('useProgressTracking', () => {
  test('should return current and longest streak from sessions', () => {
    const mockSessions = [
      { date: '2025-12-13', completed: true },
      { date: '2025-12-12', completed: true },
      { date: '2025-12-11', completed: false }
    ];

    const result = useProgressTracking(mockSessions);
    
    expect(result.currentStreak).toBe(2);
    expect(result.longestStreak).toBe(2);
  });
});