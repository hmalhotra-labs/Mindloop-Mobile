import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react-native';
import { SessionScreen } from '../src/components/session/SessionScreen';

// Mock the useSessionTimer hook
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

// Mock child components
jest.mock('../src/components/session/TimerDisplay', () => 'TimerDisplay');
jest.mock('../src/components/session/SessionControls', () => 'SessionControls');

// Mock Alert to prevent actual alerts during tests
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  Alert: {
    alert: jest.fn(),
  },
}));

describe('SessionScreen Duration Fix - TDD Approach', () => {
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

  test('should show correct 1-minute duration in completion message after session completes', async () => {
    const { rerender } = render(<SessionScreen />);
    
    // Step 1: Select 1-minute duration (this should set originalDuration to 60)
    fireEvent.press(screen.getByText('1 Minute'));
    
    // Step 2: Simulate session completion by setting timer state to completed
    await act(async () => {
      mockTimerState.remainingTime = 0;
      mockTimerState.isCompleted = true;
      mockTimerState.isRunning = false;
      mockTimerState.isPaused = false;
      rerender(<SessionScreen />);
    });
    
    // Step 3: Check that completion message shows correct duration
    const completionMessage = screen.getByText(/Great job! You've completed a .+ minute[s]? breathing session./);
    expect(completionMessage).toBeTruthy();
    
    // Verify it contains "1 minute" (not hardcoded 5 minutes)
    const messageText = completionMessage.props.children.join('');
    expect(messageText).toContain('1');
    expect(messageText).not.toContain('5'); // Should NOT be hardcoded to 5
  });

  test('should show correct 3-minute duration in completion message after session completes', async () => {
    const { rerender } = render(<SessionScreen />);
    
    // Step 1: Select 3-minute duration (this should set originalDuration to 180)
    fireEvent.press(screen.getByText('3 Minutes'));
    
    // Step 2: Simulate session completion
    await act(async () => {
      mockTimerState.remainingTime = 0;
      mockTimerState.isCompleted = true;
      mockTimerState.isRunning = false;
      mockTimerState.isPaused = false;
      rerender(<SessionScreen />);
    });
    
    // Step 3: Check that completion message shows correct duration
    const completionMessage = screen.getByText(/Great job! You've completed a .+ minute[s]? breathing session./);
    expect(completionMessage).toBeTruthy();
    
    // Verify it contains "3" (not hardcoded 5)
    const messageText = completionMessage.props.children.join('');
    expect(messageText).toContain('3');
    expect(messageText).not.toContain('5'); // Should NOT be hardcoded to 5
  });

  test('should show correct 5-minute duration in completion message after session completes', async () => {
    const { rerender } = render(<SessionScreen />);
    
    // Step 1: Select 5-minute duration (this should set originalDuration to 300)
    fireEvent.press(screen.getByText('5 Minutes'));
    
    // Step 2: Simulate session completion
    await act(async () => {
      mockTimerState.remainingTime = 0;
      mockTimerState.isCompleted = true;
      mockTimerState.isRunning = false;
      mockTimerState.isPaused = false;
      rerender(<SessionScreen />);
    });
    
    // Step 3: Check that completion message shows correct duration
    const completionMessage = screen.getByText(/Great job! You've completed a .+ minute[s]? breathing session./);
    expect(completionMessage).toBeTruthy();
    
    // Verify it contains "5" (this was the hardcoded value before)
    const messageText = completionMessage.props.children.join('');
    expect(messageText).toContain('5');
  });

  test('should show correct custom duration in completion message after session completes', async () => {
    const { rerender } = render(<SessionScreen />);
    
    // Step 1: Select custom duration
    fireEvent.press(screen.getByText('Custom Duration'));
    const customInput = screen.getByPlaceholderText('Enter seconds (e.g., 420 for 7 minutes)');
    fireEvent.changeText(customInput, '600'); // 10 minutes
    fireEvent.press(screen.getByText('Start Custom'));
    
    // Step 2: Simulate session completion
    await act(async () => {
      mockTimerState.remainingTime = 0;
      mockTimerState.isCompleted = true;
      mockTimerState.isRunning = false;
      mockTimerState.isPaused = false;
      rerender(<SessionScreen />);
    });
    
    // Step 3: Check that completion message shows correct duration
    const completionMessage = screen.getByText(/Great job! You've completed a .+ minute[s]? breathing session./);
    expect(completionMessage).toBeTruthy();
    
    // Verify it contains "10" for 600-second custom session
    const messageText = completionMessage.props.children.join('');
    expect(messageText).toContain('10');
    expect(messageText).not.toContain('5'); // Should NOT be hardcoded to 5
  });
});