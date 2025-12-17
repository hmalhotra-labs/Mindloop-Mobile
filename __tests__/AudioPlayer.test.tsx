import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { AudioPlayer } from '../src/components/audio/AudioPlayer';

describe('AudioPlayer', () => {
  const defaultProps = {
    soundId: 'rain-forest',
    onPlay: jest.fn(),
    onPause: jest.fn(),
    onStop: jest.fn(),
    isPlaying: false,
    currentTime: 0,
    duration: 1800,
    volume: 0.7,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with all required elements', () => {
    render(<AudioPlayer {...defaultProps} />);
    
    expect(screen.getByTestId('audio-player')).toBeTruthy();
    expect(screen.getByTestId('controls')).toBeTruthy();
  });

  test('renders sound information', () => {
    render(<AudioPlayer {...defaultProps} />);
    
    // Check if the sound ID is displayed
    expect(screen.getByText('Sound: rain-forest')).toBeTruthy();
  });

  test('passes correct props to AudioControls', () => {
    render(<AudioPlayer {...defaultProps} />);
    
    // Verify that the AudioControls component receives the correct props
    expect(screen.getByTestId('play-button')).toBeTruthy();
    expect(screen.getByTestId('play-button')).toBeTruthy();
    expect(screen.getByTestId('stop-button')).toBeTruthy();
  });

  test('displays current time and duration', () => {
    render(<AudioPlayer {...defaultProps} currentTime={300} />);
    
    // Check if time information is displayed
    expect(screen.getByText('05:00')).toBeTruthy();
  });

  test('calls onPlay when play button is pressed', () => {
    render(<AudioPlayer {...defaultProps} />);
    
    const playButton = screen.getByTestId('play-button');
    fireEvent.press(playButton);
    
    expect(defaultProps.onPlay).toHaveBeenCalledTimes(1);
  });

  test('calls onPause when pause button is pressed', () => {
    render(<AudioPlayer {...defaultProps} isPlaying={true} />);
    
    const pauseButton = screen.getByText('Pause');
    fireEvent.press(pauseButton);
    
    expect(defaultProps.onPause).toHaveBeenCalledTimes(1);
  });

  test('calls onStop when stop button is pressed', () => {
    render(<AudioPlayer {...defaultProps} />);
    
    const stopButton = screen.getByTestId('stop-button');
    fireEvent.press(stopButton);
    
    expect(defaultProps.onStop).toHaveBeenCalledTimes(1);
  });

  test('updates display when props change', () => {
    const { rerender } = render(<AudioPlayer {...defaultProps} currentTime={100} />);
    
    expect(screen.getByText('01:40')).toBeTruthy();
    
    rerender(<AudioPlayer {...defaultProps} currentTime={500} />);
    
    expect(screen.getByText('08:20')).toBeTruthy();
  });
});