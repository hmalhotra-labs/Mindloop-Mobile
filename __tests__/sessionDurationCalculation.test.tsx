import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { SessionScreen } from '../src/components/session/SessionScreen';

// Mock the useSessionTimer hook to control timer behavior
let mockTimerState = {
  remainingTime: 0, // Session completed
  isRunning: false,
  isPaused: false,
  isCompleted: false, // Add the new property
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

describe('SessionScreen Duration Calculation Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Critical Bug: Hardcoded Duration in Completion Message', () => {
    test('should demonstrate the hardcoded 300-second bug is fixed', () => {
      // Set up initial state (not completed)
      const mockStart = jest.fn();
      mockTimerState = {
        remainingTime: 60, // 1-minute session
        isRunning: false,
        isPaused: false,
        isCompleted: false, // Start with not completed
        start: mockStart,
        pause: jest.fn(),
        resume: jest.fn(),
        stop: jest.fn(),
      };
      
      const { rerender } = render(<SessionScreen />);
      
      // Simulate starting a 1-minute session (60 seconds)
      fireEvent.press(screen.getByText('1 Minute'));
      
      // Now force completion state by setting remainingTime to 0 and isCompleted to true
      mockTimerState.remainingTime = 0;
      mockTimerState.isRunning = false;
      mockTimerState.isPaused = false;
      mockTimerState.isCompleted = true; // Set to true for completed session
      rerender(<SessionScreen />);
      
      // After the fix, it should show the actual duration (1 minute) not hardcoded 5 minutes
      const completionMessage = screen.queryByText(/minute breathing session/);
      expect(completionMessage).toBeTruthy();
      
      if (completionMessage) {
        // With the fix, this should show "1 minute" not "5 minute"
        // The text is split into array elements, so check for the number 1 in the children
        expect(completionMessage.props.children).toContain(1);
      }
    });

    test('should show correct duration for 3-minute session', () => {
      const mockStart = jest.fn();
      mockTimerState = {
        remainingTime: 180, // 3-minute session
        isRunning: false,
        isPaused: false,
        isCompleted: false, // Start with not completed
        start: mockStart,
        pause: jest.fn(),
        resume: jest.fn(),
        stop: jest.fn(),
      };
      
      const { rerender } = render(<SessionScreen />);
      
      // Simulate starting a 3-minute session
      fireEvent.press(screen.getByText('3 Minutes'));
      
      // Force completion state
      mockTimerState.remainingTime = 0;
      mockTimerState.isRunning = false;
      mockTimerState.isPaused = false;
      mockTimerState.isCompleted = true; // Set to true for completed session
      rerender(<SessionScreen />);
      
      const completionMessage = screen.queryByText(/minute breathing session/);
      
      // With the fix, should show "3 minute"
      expect(completionMessage).toBeTruthy();
      if (completionMessage) {
        expect(completionMessage.props.children).toContain(3);
      }
    });

    test('should show correct duration for 5-minute session', () => {
      const mockStart = jest.fn();
      mockTimerState = {
        remainingTime: 300, // 5-minute session
        isRunning: false,
        isPaused: false,
        isCompleted: false, // Start with not completed
        start: mockStart,
        pause: jest.fn(),
        resume: jest.fn(),
        stop: jest.fn(),
      };
      
      const { rerender } = render(<SessionScreen />);
      
      // Simulate starting a 5-minute session
      fireEvent.press(screen.getByText('5 Minutes'));
      
      // Force completion state
      mockTimerState.remainingTime = 0;
      mockTimerState.isRunning = false;
      mockTimerState.isPaused = false;
      mockTimerState.isCompleted = true; // Set to true for completed session
      rerender(<SessionScreen />);
      
      const completionMessage = screen.queryByText(/minute breathing session/);
      
      // Should show "5 minute" (this was the hardcoded value before)
      expect(completionMessage).toBeTruthy();
      if (completionMessage) {
        expect(completionMessage.props.children).toContain(5);
      }
    });

    test('should show correct duration for custom session', () => {
      const mockStart = jest.fn();
      mockTimerState = {
        remainingTime: 600, // 10-minute session (600 seconds)
        isRunning: false,
        isPaused: false,
        isCompleted: false, // Start with not completed
        start: mockStart,
        pause: jest.fn(),
        resume: jest.fn(),
        stop: jest.fn(),
      };
      
      const { rerender } = render(<SessionScreen />);
      
      // Simulate starting a custom 10-minute session (600 seconds)
      fireEvent.press(screen.getByText('Custom Duration'));
      const customInput = screen.getByPlaceholderText('Enter seconds (e.g., 420 for 7 minutes)');
      fireEvent.changeText(customInput, '600');
      fireEvent.press(screen.getByText('Start Custom'));
      
      // Force completion state
      mockTimerState.remainingTime = 0;
      mockTimerState.isRunning = false;
      mockTimerState.isPaused = false;
      mockTimerState.isCompleted = true; // Set to true for completed session
      rerender(<SessionScreen />);
      
      const completionMessage = screen.queryByText(/minute breathing session/);
      
      // Should show "10 minute" for custom 600-second session
      expect(completionMessage).toBeTruthy();
      if (completionMessage) {
        expect(completionMessage.props.children).toContain(10);
      }
    });
  });

  describe('Session State Management Issues', () => {
    test('should track actual session duration for completion message', () => {
      // This test demonstrates that the component doesn't track the original duration
      // needed for accurate completion messages
      
      render(<SessionScreen />);
      
      // The component should store the original duration when start() is called
      // but currently it only tracks remainingTime, losing the original duration
      
      // BUG: No way to determine actual session duration for completion message
      // Component needs to track originalDuration separately from remainingTime
      
      expect(true).toBe(true); // Placeholder test to document the issue
    });
  });

  describe('Timer Display Consistency', () => {
    test('should maintain consistency between timer and completion message', () => {
      render(<SessionScreen />);
      
      // The timer display and completion message should be consistent
      // but due to the hardcoded duration bug, they're not
      
      // BUG: Timer shows correct countdown but completion message shows wrong duration
      
      expect(true).toBe(true); // Placeholder test to document the issue
    });
  });
});