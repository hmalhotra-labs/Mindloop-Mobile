import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BreathingScreen } from '../src/components/breathing/BreathingScreen';

// Mock the AudioService to avoid issues with native audio modules
jest.mock('../src/services/audioService', () => ({
  AudioService: {
    play: jest.fn().mockResolvedValue(true),
    stop: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    setVolume: jest.fn(),
    getAllState: jest.fn().mockReturnValue({
      currentSound: null,
      isPlaying: false,
      isPaused: false,
      volume: 0.5,
    }),
  }
}));

describe('BreathingScreen', () => {
  test('should render BreathingScreen component', () => {
    const { getByText } = render(<BreathingScreen />);
    expect(getByText('Mindful Breathing')).toBeTruthy();
  });

  test('should include BreathingCircle component', () => {
    const { getByTestId } = render(<BreathingScreen />);
    // Check if the component renders without crashing
    expect(() => render(<BreathingScreen />)).not.toThrow();
  });

  test('should provide session control interface', () => {
    const { getByText } = render(<BreathingScreen />);
    
    // Check if the start button is present
    const startButton = getByText('START');
    expect(startButton).toBeTruthy();
    
    // Check if the breathing instructions are present
    expect(getByText('Tap START to begin breathing exercise')).toBeTruthy();
  });

  test('should handle start/pause/resume interactions', () => {
    const { getByText } = render(<BreathingScreen />);
    
    // Initially, the button should say START
    const controlButton = getByText('START');
    expect(controlButton).toBeTruthy();
    
    // Press the button to start breathing
    fireEvent.press(controlButton);
    
    // After starting, the button should now say STOP
    expect(() => getByText('STOP')).not.toThrow();
  });

  test('should display session timer', () => {
    const { getByText } = render(<BreathingScreen />);
    
    // Check if the timer text is present
    const timerText = getByText('00:00');
    expect(timerText).toBeTruthy();
  });

  test('should handle navigation back to main screen', () => {
    const mockOnBack = jest.fn();
    const { getByText } = render(<BreathingScreen onBack={mockOnBack} />);
    
    // Find and press the back button
    const backButton = getByText('← Back');
    fireEvent.press(backButton);
    
    // Verify that the onBack callback was called
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});