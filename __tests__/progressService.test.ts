import { ProgressService } from '../src/services/progressService';

describe('ProgressService', () => {
  test('should calculate current streak from consecutive completed sessions', async () => {
    const progressService = new ProgressService();
    const mockSessions = [
      { date: '2025-12-13', completed: true },
      { date: '2025-12-12', completed: true },
      { date: '2025-12-11', completed: true },
      { date: '2025-12-10', completed: false }
    ];
    
    const currentStreak = progressService.calculateCurrentStreak(mockSessions);
    expect(currentStreak).toBe(3);
  });

  test('should return 0 when no sessions completed', async () => {
    const progressService = new ProgressService();
    const mockSessions = [
      { date: '2025-12-13', completed: false },
      { date: '2025-12-12', completed: false }
    ];
    
    const currentStreak = progressService.calculateCurrentStreak(mockSessions);
    expect(currentStreak).toBe(0);
  });

  test('should return 1 when only latest session completed', async () => {
    const progressService = new ProgressService();
    const mockSessions = [
      { date: '2025-12-13', completed: true },
      { date: '2025-12-12', completed: false }
    ];
    
    const currentStreak = progressService.calculateCurrentStreak(mockSessions);
    expect(currentStreak).toBe(1);
  });

  test('should calculate longest streak from all sessions', async () => {
    const progressService = new ProgressService();
    const mockSessions = [
      { date: '2025-12-13', completed: true },  // Current streak: 1
      { date: '2025-12-12', completed: true },  // Current streak: 2
      { date: '2025-12-11', completed: false }, // Break
      { date: '2025-12-10', completed: true },  // Previous streak: 1
      { date: '2025-12-09', completed: true },  // Previous streak: 2
      { date: '2025-12-08', completed: true },  // Previous streak: 3
      { date: '2025-12-07', completed: false }  // Break
    ];
    
    const longestStreak = progressService.calculateLongestStreak(mockSessions);
    expect(longestStreak).toBe(3);
  });

  test('should return 5 when longest streak is 5 sessions', async () => {
    const progressService = new ProgressService();
    const mockSessions = [
      { date: '2025-12-13', completed: true },
      { date: '2025-12-12', completed: true },
      { date: '2025-12-11', completed: true },
      { date: '2025-12-10', completed: true },
      { date: '2025-12-09', completed: true },  // Longest streak: 5
      { date: '2025-12-08', completed: false }
    ];
    
    const longestStreak = progressService.calculateLongestStreak(mockSessions);
    expect(longestStreak).toBe(5);
  });
});