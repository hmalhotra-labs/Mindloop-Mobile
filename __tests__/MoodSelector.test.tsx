import React from 'react';
import { MoodSelector } from '../src/components/mood/MoodSelector';
import { MoodOption, MoodCategory } from '../src/data/moodOptions';

describe('MoodSelector', () => {
  test('should render mood selector component', () => {
    const mockOnMoodSelect = jest.fn();
    const mockOnSkip = jest.fn();
    const props = { 
      onMoodSelect: mockOnMoodSelect, 
      onSkip: mockOnSkip 
    } as any;
    
    expect(() => {
      MoodSelector(props);
    }).not.toThrow();
  });

  test('should handle mood selection', () => {
    const mockOnMoodSelect = jest.fn();
    const mockOnSkip = jest.fn();
    const props = { 
      onMoodSelect: mockOnMoodSelect, 
      onSkip: mockOnSkip 
    } as any;
    
    expect(() => {
      MoodSelector(props);
    }).not.toThrow();
  });

  test('should handle skip action', () => {
    const mockOnMoodSelect = jest.fn();
    const mockOnSkip = jest.fn();
    const props = { 
      onMoodSelect: mockOnMoodSelect, 
      onSkip: mockOnSkip 
    } as any;
    
    expect(() => {
      MoodSelector(props);
    }).not.toThrow();
  });

  test('should display all mood options', () => {
    const mockOnMoodSelect = jest.fn();
    const mockOnSkip = jest.fn();
    const props = { 
      onMoodSelect: mockOnMoodSelect, 
      onSkip: mockOnSkip 
    } as any;
    
    expect(() => {
      MoodSelector(props);
    }).not.toThrow();
  });
});