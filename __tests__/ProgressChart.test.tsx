import React from 'react';
import { ProgressChart } from '../src/components/progress/ProgressChart';

interface ProgressChartProps {
  data: Array<{ date: string; completed: boolean; }>;
  type: 'daily' | 'weekly' | 'monthly';
}

describe('ProgressChart', () => {
  test('should accept data and type props', () => {
    const mockProps: ProgressChartProps = {
      data: [
        { date: '2025-12-13', completed: true },
        { date: '2025-12-12', completed: false }
      ],
      type: 'daily'
    };
    
    expect(() => {
      const result = ProgressChart(mockProps);
      return result;
    }).not.toThrow();
  });

  test('should render with different chart types', () => {
    const mockProps: ProgressChartProps = {
      data: [
        { date: '2025-12-13', completed: true },
        { date: '2025-12-12', completed: true }
      ],
      type: 'weekly'
    };
    
    expect(() => {
      const result = ProgressChart(mockProps);
      expect(result).toBeDefined();
      return result;
    }).not.toThrow();
  });

  test('should handle empty data array', () => {
    const mockProps: ProgressChartProps = {
      data: [],
      type: 'monthly'
    };
    
    expect(() => {
      const result = ProgressChart(mockProps);
      expect(result).toBeDefined();
      return result;
    }).not.toThrow();
  });

  test('should be a functional React component', () => {
    const mockProps: ProgressChartProps = {
      data: [{ date: '2025-12-13', completed: true }],
      type: 'daily'
    };
    
    const result = ProgressChart(mockProps);
    expect(result).toBeDefined();
    expect(result.type).toBe('div');
  });
});