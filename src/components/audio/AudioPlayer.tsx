// AudioPlayer component for Mindloop mindfulness app
// Handles ambient sound playback with play/pause controls

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface AudioPlayerProps {
  soundId: string;
  onPlay: (soundId: string) => void;
  onPause: (soundId: string) => void;
  onStop: (soundId: string) => void;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume?: number;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  soundId,
  onPlay,
  onPause,
  onStop,
  isPlaying,
  currentTime,
  duration,
  volume = 0.5,
}) => {
  const handlePlay = () => {
    if (!isPlaying) {
      onPlay(soundId);
    }
  };

  const handlePause = () => {
    if (isPlaying) {
      onPause(soundId);
    }
  };

  const handleStop = () => {
    onStop(soundId);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <View testID="audio-player" style={styles.container}>
      <View testID="sound-info" style={styles.infoContainer}>
        <Text>Sound: {soundId}</Text>
        <Text>Volume: {Math.round(volume * 100)}%</Text>
      </View>
      
      <View testID="time-display" style={styles.timeContainer}>
        <Text>{formatTime(currentTime)}</Text>
        <Text>/</Text>
        <Text>{formatTime(duration)}</Text>
      </View>
      
      <View testID="progress-bar-container" style={styles.progressBarContainer}>
        <View
          testID="progress-bar"
          style={[styles.progressBar, { width: `${progress}%` }]}
        />
      </View>
      
      <View testID="controls" style={styles.controlsContainer}>
        <TouchableOpacity
          testID="play-button"
          onPress={isPlaying ? handlePause : handlePlay}
          style={styles.button}
        >
          <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          testID="stop-button"
          onPress={handleStop}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      </View>
      
      <View testID="volume-control" style={styles.volumeContainer}>
        <Text>Volume: {Math.round(volume * 100)}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  controlsContainer: {
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
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  volumeContainer: {
    alignItems: 'center',
  },
});