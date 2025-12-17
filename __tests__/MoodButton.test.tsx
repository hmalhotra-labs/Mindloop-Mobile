import React from 'react';
import { MoodButton } from '../src/components/mood/MoodButton';
import { MoodOption, MoodCategory } from '../src/data/moodOptions';

describe('MoodButton', () => {
  test('should render mood button component', () => {
    const mockMood: MoodOption = {
      id: 'good',
      label: 'Good',
      emoji: '😊',
      category: MoodCategory.POSITIVE
    };
    
    const mockOnPress = jest.fn();
    const props = { mood: mockMood, onPress: mockOnPress } as any;
    
    expect(() => {
      MoodButton(props);
    }).not.toThrow();
  });

  test('should handle isSelected prop', () => {
    const mockMood: MoodOption = {
      id: 'good',
      label: 'Good',
      emoji: '😊',
      category: MoodCategory.POSITIVE
    };
    
    const mockOnPress = jest.fn();
    const props = { mood: mockMood, onPress: mockOnPress, isSelected: true } as any;
    
    expect(() => {
      MoodButton(props);
    }).not.toThrow();
  });

  test('should handle different mood categories', () => {
    const mockOnPress = jest.fn();
    
    // Test positive mood
    const positiveMood: MoodOption = {
      id: 'good',
      label: 'Good',
      emoji: '😊',
      category: MoodCategory.POSITIVE
    };
    let props = { mood: positiveMood, onPress: mockOnPress } as any;
    expect(() => MoodButton(props)).not.toThrow();
    
    // Test neutral mood
    const neutralMood: MoodOption = {
      id: 'meh',
      label: 'Meh',
      emoji: '😐',
      category: MoodCategory.NEUTRAL
    };
    props = { mood: neutralMood, onPress: mockOnPress } as any;
    expect(() => MoodButton(props)).not.toThrow();
    
    // Test negative mood
    const negativeMood: MoodOption = {
      id: 'bad',
      label: 'Bad',
      emoji: '😔',
      category: MoodCategory.NEGATIVE
    };
    props = { mood: negativeMood, onPress: mockOnPress } as any;
    expect(() => MoodButton(props)).not.toThrow();
  });
});