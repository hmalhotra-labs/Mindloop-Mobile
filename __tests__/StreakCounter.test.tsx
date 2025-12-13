import React from 'react';
import { StreakCounter } from '../src/components/progress/StreakCounter';

describe('StreakCounter', () => {
  test('should accept currentStreak and longestStreak props', () => {
    const mockProps = {
      currentStreak: 5,
      longestStreak: 10
    };
    
    expect(() => {
      const result = StreakCounter(mockProps);
      return result;
    }).not.toThrow();
  });

  test('should render with different streak values', () => {
    const mockProps = {
      currentStreak: 3,
      longestStreak: 7
    };
    
    expect(() => {
      const result = StreakCounter(mockProps);
      expect(result).toBeDefined();
      return result;
    }).not.toThrow();
  });

  test('should handle zero streaks', () => {
    const mockProps = {
      currentStreak: 0,
      longestStreak: 0
    };
    
    expect(() => {
      const result = StreakCounter(mockProps);
      expect(result).toBeDefined();
      return result;
    }).not.toThrow();
  });

  test('should be a functional React component', () => {
    const mockProps = {
      currentStreak: 1,
      longestStreak: 1
    };
    
    const result = StreakCounter(mockProps);
    expect(result).toBeDefined();
    expect(result.type).toBe('div');
  });
});