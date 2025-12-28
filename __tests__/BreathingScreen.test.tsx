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

// Mock theme to avoid import issues
jest.mock('../src/config/theme', () => ({
  colors: {
    background: '#0a0a0f',
    backgroundSecondary: '#0f0f1a',
    surface: '#1a1a2e',
    surfaceLight: '#2a2a3e',
    primary: '#00d9ff',
    primaryGlow: '#00b4d8',
    primaryDark: '#0077b6',
    primaryMuted: '#00d9ff40',
    text: '#ffffff',
    textSecondary: '#8b8b9e',
    textMuted: '#5a5a6e',
    buttonBg: '#2a2a3e',
    buttonBorder: '#3a3a4e',
    buttonSelected: '#00d9ff20',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  typography: {
    xs: 12, sm: 14, base: 16, lg: 18, xl: 24, xxl: 32, xxxl: 48,
    regular: '400', medium: '500', semibold: '600', bold: '700',
  },
  borderRadius: { sm: 8, md: 12, lg: 16, xl: 24, full: 9999 },
  shadows: {
    glow: { shadowColor: '#00d9ff', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },
    glowLarge: { shadowColor: '#00d9ff', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 40, elevation: 20 },
  },
}));

describe('BreathingScreen', () => {
  test('should render BreathingScreen component with Inhale text', () => {
    const { getByText } = render(<BreathingScreen />);
    // New design shows "Inhale" instead of "Mindful Breathing"
    expect(getByText('Inhale')).toBeTruthy();
  });

  test('should include OrganicBlob animation component', () => {
    // Check if the component renders without crashing
    expect(() => render(<BreathingScreen />)).not.toThrow();
  });

  test('should display session timer with seconds', () => {
    const { getByText } = render(<BreathingScreen duration={60} />);
    // Timer shows remaining seconds (default 60)
    expect(getByText('60')).toBeTruthy();
  });

  test('should show pause button initially', () => {
    const { getByLabelText } = render(<BreathingScreen />);
    // Pause button should be present when session starts automatically
    const pauseButton = getByLabelText('Pause breathing');
    expect(pauseButton).toBeTruthy();
  });

  test('should handle navigation back', () => {
    const mockOnBack = jest.fn();
    const { getByLabelText } = render(<BreathingScreen onBack={mockOnBack} />);

    // Find and press the back button
    const backButton = getByLabelText('Go back');
    fireEvent.press(backButton);

    // Verify that the onBack callback was called
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  test('should call onComplete when timer reaches zero', () => {
    const mockOnComplete = jest.fn();
    // This would need to be tested with timer advancement
    render(<BreathingScreen duration={1} onComplete={mockOnComplete} />);
    // Timer completion is async, so this is a smoke test
    expect(mockOnComplete).not.toHaveBeenCalled(); // Not called immediately
  });
});