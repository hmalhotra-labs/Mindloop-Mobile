import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
import { BreathingCircle } from './BreathingCircle';
import { AudioService } from '../../services/audioService';
import { ambientSounds } from '../../data/ambientSounds';

interface BreathingScreenProps {
  onBack?: () => void;
}

export const BreathingScreen: React.FC<BreathingScreenProps> = ({ onBack }) => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [selectedSound, setSelectedSound] = useState(ambientSounds[0].id);
  const [isPlaying, setIsPlaying] = useState(false);

  // Timer for the breathing session
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isBreathing) {
      interval = setInterval(() => {
        setSessionTime(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreathing]);

  // Handle breathing start/stop
  const toggleBreathing = () => {
    const newIsBreathing = !isBreathing;
    setIsBreathing(newIsBreathing);

    // Handle audio playback
    if (newIsBreathing) {
      // Start playing selected ambient sound
      AudioService.play(selectedSound).then(success => {
        if (success) {
          setIsPlaying(true);
        }
      });
    } else {
      // Stop audio playback
      AudioService.stop();
      setIsPlaying(false);
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle sound selection
  const handleSoundSelect = (soundId: string) => {
    setSelectedSound(soundId);
    
    if (isPlaying) {
      // Stop current sound and play new one
      AudioService.stop();
      AudioService.play(soundId).then(success => {
        if (success) {
          setIsPlaying(true);
        }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mindful Breathing</Text>
        <View style={styles.spacer} /> {/* Spacer for alignment */}
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Breathing circle */}
        <View style={styles.circleContainer}>
          <BreathingCircle
            size={200}
            color="#4ade80"
            isBreathing={isBreathing}
          />
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionText}>
            {isBreathing
              ? "Breathe in slowly for 4 seconds, hold for 2, then exhale for 6 seconds"
              : "Tap START to begin breathing exercise"}
          </Text>
        </View>

        {/* Timer */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(sessionTime)}</Text>
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[styles.controlButton, isBreathing ? styles.stopButton : styles.startButton]}
            onPress={toggleBreathing}
          >
            <Text style={styles.controlButtonText}>
              {isBreathing ? 'STOP' : 'START'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sound selector */}
        <View style={styles.soundSelectorContainer}>
          <Text style={styles.soundSelectorTitle}>Ambient Sound</Text>
          <View style={styles.soundOptionsContainer}>
            {ambientSounds.slice(0, 3).map((sound) => (
              <TouchableOpacity
                key={sound.id}
                style={[
                  styles.soundOption,
                  selectedSound === sound.id && styles.selectedSoundOption
                ]}
                onPress={() => handleSoundSelect(sound.id)}
              >
                <Text
                  style={[
                    styles.soundOptionText,
                    selectedSound === sound.id && styles.selectedSoundOptionText
                  ]}
                >
                  {sound.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'android' ? 35 : 20,
    backgroundColor: '#1e293b',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    color: '#e2e8f0',
    fontSize: 18,
    fontWeight: '600',
  },
  spacer: {
    width: 60, // Same width as back button to center the title
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  circleContainer: {
    marginBottom: 40,
  },
  instructionsContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  instructionText: {
    color: '#e2e8f0',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  timerContainer: {
    marginBottom: 30,
  },
  timerText: {
    color: '#94a3b8',
    fontSize: 24,
    fontWeight: '500',
  },
  controlsContainer: {
    marginBottom: 30,
  },
  controlButton: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    minWidth: 120,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4ade80',
  },
  stopButton: {
    backgroundColor: '#f87171',
  },
  controlButtonText: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '600',
  },
  soundSelectorContainer: {
    width: '100%',
    alignItems: 'center',
  },
  soundSelectorTitle: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 15,
  },
  soundOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  soundOption: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#334155',
    marginHorizontal: 5,
  },
  selectedSoundOption: {
    backgroundColor: '#4ade80',
  },
  soundOptionText: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  selectedSoundOptionText: {
    color: '#0f172a',
    fontWeight: '500',
  },
});