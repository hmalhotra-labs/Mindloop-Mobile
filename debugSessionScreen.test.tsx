import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { SessionScreen } from './src/components/session/SessionScreen';

// Mock the useSessionTimer hook
jest.mock('./src/hooks/useSessionTimer', () => ({
  useSessionTimer: () => ({
    remainingTime: 0,
    isRunning: false,
    isPaused: false,
    isCompleted: true, // Force completed state
    start: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    stop: jest.fn(),
  }),
}));

// Mock child components
jest.mock('./src/components/session/TimerDisplay', () => 'TimerDisplay');
jest.mock('./src/components/session/SessionControls', () => 'SessionControls');

// Mock Alert to prevent actual alerts during tests
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  Alert: {
    alert: jest.fn(),
  },
}));

describe('Debug SessionScreen', () => {
  test('should show completion screen when isCompleted is true', () => {
    render(<SessionScreen />);
    
    console.log('Available text elements:');
    const allTexts = screen.queryAllByText(/.*/);
    allTexts.forEach((text, index) => {
      console.log(`${index}: "${text.props.children}"`);
    });
    
    console.log('Available test IDs:');
    const sessionScreen = screen.queryByTestId('session-screen');
    console.log('Session screen found:', !!sessionScreen);
    
    // Check for completion screen elements
    const completionTitle = screen.queryByText('Session Complete!');
    console.log('Completion title found:', !!completionTitle, completionTitle?.props.children);
    
    const completionMessage = screen.queryByText(/Great job!/);
    console.log('Completion message found:', !!completionMessage, completionMessage?.props.children);
    
    // If no completion screen, what is being shown?
    if (!completionTitle) {
      console.log('Duration selection found:', !!screen.queryByText('Select Duration'));
      console.log('Session active found:', !!screen.queryByText(/Session Paused/));
    }
  });
});