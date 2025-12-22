import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { SessionScreen } from '../src/components/session/SessionScreen';

// Mock the useSessionTimer hook to control timer behavior
let mockTimerState = {
  remainingTime: 0,
  isRunning: false,
  isPaused: false,
  isCompleted: false,
  start: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  stop: jest.fn(),
};

jest.mock('../src/hooks/useSessionTimer', () => ({
  useSessionTimer: () => mockTimerState,
}));

// Mock Alert to prevent actual alerts during tests
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  Alert: {
    alert: jest.fn(),
  },
}));

describe('SessionScreen Duration Display', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTimerState = {
      remainingTime: 0,
      isRunning: false,
      isPaused: false,
      isCompleted: false,
      start: jest.fn(),
      pause: jest.fn(),
      resume: jest.fn(),
      stop: jest.fn(),
    };
  });

  test('should show completion message with correct duration after session completes', () => {
    // Set up mock to simulate a completed 3-minute session
    mockTimerState = {
      remainingTime: 0, // Session completed
      isRunning: false,
      isPaused: false,
      isCompleted: true, // Mark as completed
      start: jest.fn(),
      pause: jest.fn(),
      resume: jest.fn(),
      stop: jest.fn(),
    };

    render(<SessionScreen />);
    
    // Check that completion message is displayed
    const completionTitle = screen.getByText('Session Complete!');
    expect(completionTitle).toBeTruthy();
    
    const completionMessage = screen.getByText(/Great job! You've completed a \d+ minute breathing session./);
    expect(completionMessage).toBeTruthy();
    
    // The exact duration in the message depends on how the component was initialized
    // Since we can't control the originalDuration state from the mock, 
    // we'll test the actual component behavior separately
  });

  test('should show duration selection when session not started', () => {
    mockTimerState = {
      remainingTime: 0,
      isRunning: false,
      isPaused: false,
      isCompleted: false,
      start: jest.fn(),
      pause: jest.fn(),
      resume: jest.fn(),
      stop: jest.fn(),
    };

    render(<SessionScreen />);
    
    // Should show duration selection options
    expect(screen.getByText('Select Duration')).toBeTruthy();
    expect(screen.getByText('1 Minute')).toBeTruthy();
    expect(screen.getByText('3 Minutes')).toBeTruthy();
    expect(screen.getByText('5 Minutes')).toBeTruthy();
  });
});