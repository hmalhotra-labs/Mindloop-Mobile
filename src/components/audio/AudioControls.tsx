// AudioControls component for Mindloop mindfulness app
// Provides audio playback controls (play, pause, stop, volume)

import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, PanResponder, LayoutChangeEvent } from 'react-native';

interface AudioControlsProps {
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onVolumeChange: (volume: number) => void;
  isPlaying: boolean;
  volume: number;
  disabled?: boolean;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  onPlay,
  onPause,
  onStop,
  onVolumeChange,
  isPlaying,
  volume,
  disabled = false,
}) => {
  const [sliderWidth, setSliderWidth] = React.useState<number>(100); // Default width
  
  // Create a pan responder for the volume slider, with safety check for test environment
  const volumeSliderPanResponder = useRef(
    typeof PanResponder !== 'undefined'
      ? PanResponder.create({
          onStartShouldSetPanResponder: () => !disabled,
          onMoveShouldSetPanResponder: () => !disabled,
          onPanResponderMove: (evt, gestureState) => {
            // Calculate the new volume based on the gesture state and actual slider width
            // Use moveX for current position instead of x0 (initial touch position)
            if (sliderWidth > 0) {  // Check for zero division
              const newVolume = Math.min(1, Math.max(0, gestureState.moveX / sliderWidth));
              handleVolumeChange(newVolume);
            }
          },
          onPanResponderRelease: (evt, gestureState) => {
            // Finalize the volume change when the user releases
            // Use moveX for current position instead of x0 (initial touch position)
            if (sliderWidth > 0) {  // Check for zero division
              const newVolume = Math.min(1, Math.max(0, gestureState.moveX / sliderWidth));
              handleVolumeChange(newVolume);
            }
          },
        })
      : null
  );

  const handleSliderLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setSliderWidth(width);
  };

  // No specific cleanup needed for PanResponder since it's created with useRef
  // PanResponder doesn't require cleanup as it's not a subscription or timer
  
  const handlePlay = () => {
    try {
      if (!disabled) {
        onPlay();
      }
    } catch (error) {
      console.error('Error in play handler:', error);
      // In a real app, you might want to show a user-facing error message
      // For example: setError('Failed to play audio. Please try again.');
    }
  };

  const handlePause = () => {
    try {
      if (!disabled) {
        onPause();
      }
    } catch (error) {
      console.error('Error in pause handler:', error);
      // In a real app, you might want to show a user-facing error message
      // For example: setError('Failed to pause audio. Please try again.');
    }
  };

  const handleStop = () => {
    try {
      if (!disabled) {
        onStop();
      }
    } catch (error) {
      console.error('Error in stop handler:', error);
      // In a real app, you might want to show a user-facing error message
      // For example: setError('Failed to stop audio. Please try again.');
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    try {
      // Validate volume range
      const clampedVolume = Math.min(1, Math.max(0, newVolume));
      onVolumeChange(clampedVolume);
    } catch (error) {
      console.error('Error in volume change handler:', error);
    }
  };

  return (
    <View testID="audio-controls" style={styles.container}>
      <View testID="playback-controls" style={styles.playbackControls}>
        <TouchableOpacity
          testID="play-button"
          onPress={handlePlay}
          disabled={disabled || isPlaying}
          style={[styles.button, (disabled || isPlaying) && styles.disabledButton]}
        >
          <Text style={styles.buttonText}>Play</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          testID="pause-button"
          onPress={handlePause}
          disabled={disabled || !isPlaying}
          style={[styles.button, (disabled || !isPlaying) && styles.disabledButton]}
        >
          <Text style={styles.buttonText}>Pause</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          testID="stop-button"
          onPress={handleStop}
          disabled={disabled}
          style={[styles.button, disabled && styles.disabledButton]}
        >
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      </View>
      
      <View testID="volume-control" style={styles.volumeControl}>
        <Text style={styles.label}>Volume:</Text>
        <View
          testID="volume-slider"
          style={styles.volumeSlider}
          onLayout={handleSliderLayout}
          {...(volumeSliderPanResponder.current ? volumeSliderPanResponder.current.panHandlers : {})}
        >
          <View style={[styles.volumeFill, { width: `${volume * 100}%` }]} />
        </View>
        <Text style={styles.label}>{Math.round(volume * 100)}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  playbackControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    minWidth: 60,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  volumeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
  },
  volumeSlider: {
    flex: 1,
    height: 20,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  volumeFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
});