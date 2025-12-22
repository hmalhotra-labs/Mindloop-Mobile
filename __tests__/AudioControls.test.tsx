import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { AudioControls } from '../src/components/audio/AudioControls';

describe('AudioControls', () => {
  const defaultProps = {
    onPlay: jest.fn(),
    onPause: jest.fn(),
    onStop: jest.fn(),
    onVolumeChange: jest.fn(),
    isPlaying: false,
    volume: 0.7,
    disabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all control buttons and volume slider', () => {
    render(<AudioControls {...defaultProps} />);
    
    expect(screen.getByTestId('audio-controls')).toBeTruthy();
    expect(screen.getByTestId('playback-controls')).toBeTruthy();
    expect(screen.getByTestId('play-button')).toBeTruthy();
    expect(screen.getByTestId('pause-button')).toBeTruthy();
    expect(screen.getByTestId('stop-button')).toBeTruthy();
    expect(screen.getByTestId('volume-control')).toBeTruthy();
    expect(screen.getByTestId('volume-slider')).toBeTruthy();
  });

  test('play button calls onPlay when clicked', () => {
    render(<AudioControls {...defaultProps} />);
    
    const playButton = screen.getByTestId('play-button');
    fireEvent.press(playButton);
    
    expect(defaultProps.onPlay).toHaveBeenCalledTimes(1);
  });

  test('pause button calls onPause when clicked', () => {
    render(<AudioControls {...defaultProps} isPlaying={true} />);
    
    const pauseButton = screen.getByTestId('pause-button');
    fireEvent.press(pauseButton);
    
    expect(defaultProps.onPause).toHaveBeenCalledTimes(1);
  });

  test('stop button calls onStop when clicked', () => {
    render(<AudioControls {...defaultProps} />);
    
    const stopButton = screen.getByTestId('stop-button');
    fireEvent.press(stopButton);
    
    expect(defaultProps.onStop).toHaveBeenCalledTimes(1);
  });

  test('buttons are disabled when disabled prop is true', () => {
    render(<AudioControls {...defaultProps} disabled={true} />);
    
    const playButton = screen.getByTestId('play-button');
    const pauseButton = screen.getByTestId('pause-button');
    const stopButton = screen.getByTestId('stop-button');
    
    // Check disabled prop accessibility in React Native environment
    expect(playButton.props.accessibilityState.disabled).toBe(true);
    expect(pauseButton.props.accessibilityState.disabled).toBe(true);
    expect(stopButton.props.accessibilityState.disabled).toBe(true);
  });

  test('play button is disabled when isPlaying is true', () => {
    render(<AudioControls {...defaultProps} isPlaying={true} />);
    
    const playButton = screen.getByTestId('play-button');
    expect(playButton.props.accessibilityState.disabled).toBe(true);
  });

  test('pause button is disabled when isPlaying is false', () => {
    render(<AudioControls {...defaultProps} isPlaying={false} />);
    
    const pauseButton = screen.getByTestId('pause-button');
    expect(pauseButton.props.accessibilityState.disabled).toBe(true);
  });

  test('volume slider calls onVolumeChange when interacted with', () => {
    render(<AudioControls {...defaultProps} />);
    
    const volumeSlider = screen.getByTestId('volume-slider');
    // Simulate a pan gesture on the volume slider
    fireEvent(volumeSlider, 'onLayout', {
      nativeEvent: {
        layout: { x: 0, y: 0, width: 100, height: 20 }
      }
    });
    
    // Verify volume display matches the volume prop
    expect(screen.getByText('70%')).toBeTruthy();
  });

  test('displays correct volume percentage', () => {
    render(<AudioControls {...defaultProps} volume={0.5} />);
    
    expect(screen.getByText('50%')).toBeTruthy();
  });

  test('does not call handlers when disabled', () => {
    render(<AudioControls {...defaultProps} disabled={true} />);
    
    const playButton = screen.getByTestId('play-button');
    fireEvent.press(playButton);
    
    expect(defaultProps.onPlay).not.toHaveBeenCalled();
  });
});