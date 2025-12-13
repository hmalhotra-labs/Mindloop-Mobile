import React from 'react';
import { ProgressIndicator } from '../src/components/progress/ProgressIndicator';

interface ProgressIndicatorProps {
  progress: number;
  total: number;
  label: string;
}

describe('ProgressIndicator', () => {
  test('should accept progress, total, and label props', () => {
    const mockProps: ProgressIndicatorProps = {
      progress: 5,
      total: 10,
      label: 'Sessions Completed'
    };
    
    expect(() => {
      const result = ProgressIndicator(mockProps);
      return result;
    }).not.toThrow();
  });

  test('should render with different progress values', () => {
    const mockProps: ProgressIndicatorProps = {
      progress: 3,
      total: 7,
      label: 'Weekly Goal'
    };
    
    expect(() => {
      const result = ProgressIndicator(mockProps);
      expect(result).toBeDefined();
      return result;
    }).not.toThrow();
  });

  test('should handle zero progress', () => {
    const mockProps: ProgressIndicatorProps = {
      progress: 0,
      total: 10,
      label: 'Daily Progress'
    };
    
    expect(() => {
      const result = ProgressIndicator(mockProps);
      expect(result).toBeDefined();
      return result;
    }).not.toThrow();
  });

  test('should be a functional React component', () => {
    const mockProps: ProgressIndicatorProps = {
      progress: 10,
      total: 10,
      label: 'Complete'
    };
    
    const result = ProgressIndicator(mockProps);
    expect(result).toBeDefined();
    expect(result.type).toBe('div');
  });
});