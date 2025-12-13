import React from 'react';
import { AchievementBadge } from '../src/components/progress/AchievementBadge';

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

describe('AchievementBadge', () => {
  test('should accept title, description, icon, and unlocked props', () => {
    const mockProps: AchievementBadgeProps = {
      title: 'First Week',
      description: 'Complete 7 days of meditation',
      icon: '🏆',
      unlocked: true
    };
    
    expect(() => {
      const result = AchievementBadge(mockProps);
      return result;
    }).not.toThrow();
  });

  test('should render with different achievement states', () => {
    const mockProps: AchievementBadgeProps = {
      title: '30 Day Streak',
      description: 'Maintain a 30-day meditation streak',
      icon: '⭐',
      unlocked: false
    };
    
    expect(() => {
      const result = AchievementBadge(mockProps);
      expect(result).toBeDefined();
      return result;
    }).not.toThrow();
  });

  test('should handle locked achievements', () => {
    const mockProps: AchievementBadgeProps = {
      title: 'Meditation Master',
      description: 'Complete 365 days of meditation',
      icon: '🎯',
      unlocked: false
    };
    
    expect(() => {
      const result = AchievementBadge(mockProps);
      expect(result).toBeDefined();
      return result;
    }).not.toThrow();
  });

  test('should be a functional React component', () => {
    const mockProps: AchievementBadgeProps = {
      title: 'Early Bird',
      description: 'Meditate before 7 AM',
      icon: '🌅',
      unlocked: true
    };
    
    const result = AchievementBadge(mockProps);
    expect(result).toBeDefined();
    expect(result.type).toBe('div');
  });
});