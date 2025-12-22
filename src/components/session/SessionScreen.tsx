import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useSessionTimer } from '../../hooks/useSessionTimer';
import { TimerDisplay } from './TimerDisplay';
import { SessionControls } from './SessionControls';
import { secondsToMinutes } from '../../utils/timeUtils';

interface SessionScreenProps {
  onBack?: () => void;
}

export const SessionScreen: React.FC<SessionScreenProps> = ({ onBack }) => {
  const {
    remainingTime,
    isRunning,
    isPaused,
    isCompleted,
    start,
    pause,
    resume,
    stop
  } = useSessionTimer();

  const [customDuration, setCustomDuration] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [originalDuration, setOriginalDuration] = useState(0); // Track original session duration

  const handleDurationSelect = (duration: number) => {
    if (duration < 1 || duration > 7200) {
      Alert.alert('Invalid Duration', 'Please select a duration between 1 second and 2 hours.');
      return;
    }
    setOriginalDuration(duration); // Store original duration for completion message
    start(duration);
  };

  const handleCustomDuration = () => {
    const duration = parseInt(customDuration, 10);
    if (isNaN(duration) || duration < 1 || duration > 7200) {
      Alert.alert('Invalid Duration', 'Please enter a valid duration between 1 and 7200 seconds.');
      return;
    }
    handleDurationSelect(duration);
    setCustomDuration('');
    setShowCustomInput(false);
  };

  const renderDurationSelection = () => (
    <View style={styles.durationContainer}>
      <Text style={styles.sectionTitle}>Select Duration</Text>
      
      <View style={styles.presetContainer}>
        <TouchableOpacity 
          style={styles.presetButton} 
          onPress={() => handleDurationSelect(60)}
        >
          <Text style={styles.presetButtonText}>1 Minute</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.presetButton} 
          onPress={() => handleDurationSelect(180)}
        >
          <Text style={styles.presetButtonText}>3 Minutes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.presetButton} 
          onPress={() => handleDurationSelect(300)}
        >
          <Text style={styles.presetButtonText}>5 Minutes</Text>
        </TouchableOpacity>
      </View>

      {showCustomInput ? (
        <View style={styles.customContainer}>
          <TextInput
            style={styles.customInput}
            placeholder="Enter seconds (e.g., 420 for 7 minutes)"
            value={customDuration}
            onChangeText={setCustomDuration}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.customButton} onPress={handleCustomDuration}>
            <Text style={styles.customButtonText}>Start Custom</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setShowCustomInput(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.customPresetButton} 
          onPress={() => setShowCustomInput(true)}
        >
          <Text style={styles.customPresetButtonText}>Custom Duration</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSessionActive = () => (
    <View style={styles.sessionContainer}>
      <TimerDisplay remainingTime={remainingTime} />
      <SessionControls 
        onPause={pause}
        onResume={resume}
        onStop={stop}
      />
      {isPaused && (
        <View style={styles.pausedOverlay}>
          <Text style={styles.pausedText}>Session Paused</Text>
        </View>
      )}
    </View>
  );

  const renderSessionComplete = () => {
    // Calculate actual completed duration based on original duration
    // For completed sessions, the duration should be the original duration (in minutes)
    const completedDuration = originalDuration > 0 ? secondsToMinutes(originalDuration) : 1;
    const durationLabel = completedDuration === 1 ? 'minute' : 'minutes';
    
    return (
      <View style={styles.completionContainer}>
        <Text style={styles.completionTitle}>Session Complete!</Text>
        <Text style={styles.completionMessage}>
          Great job! You've completed a {completedDuration} {durationLabel} breathing session.
        </Text>
        <TouchableOpacity style={styles.newSessionButton} onPress={() => {
          // Reset all session state variables for proper cleanup between sessions
          setOriginalDuration(0); // Reset original duration
          setCustomDuration(''); // Reset custom duration input
          setShowCustomInput(false); // Hide custom input
          if (onBack) {
            onBack();
          }
        }}>
          <Text style={styles.newSessionButtonText}>Start New Session</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent = () => {
    // Session completed - check for completed state first
    if (isCompleted) {
      return renderSessionComplete();
    }
    
    if (isRunning || isPaused) {
      return renderSessionActive();
    }
    
    // Not started - show duration selection
    if (remainingTime === 0 && !isRunning && !isPaused && !isCompleted) {
      return renderDurationSelection();
    }
    
    return renderDurationSelection();
  };

  return (
    <View style={styles.container} testID="session-screen">
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} testID="back-button">
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mindful Session</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.content}>
        {renderContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  durationContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333333',
  },
  presetContainer: {
    marginBottom: 20,
  },
  presetButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  presetButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  customPresetButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  customPresetButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  customContainer: {
    marginTop: 20,
  },
  customInput: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  customButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  customButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  sessionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pausedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pausedText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#34C759',
    marginBottom: 16,
    textAlign: 'center',
  },
  completionMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  newSessionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  newSessionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});