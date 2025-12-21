import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { announceToScreenReader } from '../utils/screenReaderUtils';
import { applyHighContrastStyles } from '../utils/highContrastUtils';

// Simplified HomeScreen component for TDD testing
interface HomeScreenProps {
  children?: React.ReactNode;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ children }) => {
  const settings = useAccessibility();
  const [sessionCount, setSessionCount] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  
  // Apply high contrast styles based on accessibility settings
  const containerStyle = applyHighContrastStyles(
    [styles.container, settings.highContrastMode && styles.highContrastContainer],
    settings.highContrastMode
  );
  
  const buttonStyle = applyHighContrastStyles(
    [styles.button, settings.highContrastMode && styles.highContrastButton],
    settings.highContrastMode
  );
  
  const textStyle = applyHighContrastStyles(
    [styles.text, settings.highContrastMode && styles.highContrastText],
    settings.highContrastMode
  );

  // Announce screen content when it loads if screen reader is enabled
  useEffect(() => {
    if (settings.screenReaderEnabled) {
      announceToScreenReader('Welcome to Mindloop Home Screen');
    }
  }, [settings.screenReaderEnabled]);

  const handleStartSession = () => {
    setSessionCount(prev => prev + 1);
    if (settings.screenReaderEnabled) {
      announceToScreenReader(`Session started. Total sessions: ${sessionCount + 1}`);
    }
  };

  const handleCheckProgress = () => {
    setStreakCount(prev => prev + 1);
    if (settings.screenReaderEnabled) {
      announceToScreenReader(`Checking progress. Current streak: ${streakCount + 1} days`);
    }
  };

  const handleAccessibilityInfo = () => {
    const info = `Accessibility settings: Reduce motion ${settings.reduceMotion ? 'on' : 'off'}, ` +
                 `Screen reader ${settings.screenReaderEnabled ? 'on' : 'off'}, ` +
                 `High contrast ${settings.highContrastMode ? 'on' : 'off'}`;
    
    if (settings.screenReaderEnabled) {
      announceToScreenReader(info);
    } else {
      Alert.alert('Accessibility Info', info);
    }
  };

  return (
    <ScrollView style={containerStyle}>
      <View style={styles.content}>
        <Text
          style={textStyle}
          accessibilityLabel="Mindloop Home Screen"
          accessibilityRole="header"
        >
          Mindloop
        </Text>
        
        <TouchableOpacity
          style={buttonStyle}
          onPress={handleStartSession}
          accessibilityLabel="Start a new mindfulness session"
          accessibilityRole="button"
        >
          <Text
            style={[styles.buttonText, settings.highContrastMode && styles.highContrastButtonText]}
            accessibilityLabel="Start Session Button"
          >
            Start Session
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={buttonStyle}
          onPress={handleCheckProgress}
          accessibilityLabel="Check your progress and streak"
          accessibilityRole="button"
        >
          <Text
            style={[styles.buttonText, settings.highContrastMode && styles.highContrastButtonText]}
            accessibilityLabel="Check Progress Button"
          >
            Check Progress
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={buttonStyle}
          onPress={handleAccessibilityInfo}
          accessibilityLabel="Get accessibility information"
          accessibilityRole="button"
        >
          <Text
            style={[styles.buttonText, settings.highContrastMode && styles.highContrastButtonText]}
            accessibilityLabel="Accessibility Info Button"
          >
            Accessibility Info
          </Text>
        </TouchableOpacity>
        
        <Text
          style={textStyle}
          accessibilityLabel={`Current session count: ${sessionCount}, Streak count: ${streakCount}`}
        >
          Sessions: {sessionCount} | Streak: {streakCount} days
        </Text>
      </View>
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  highContrastContainer: {
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  highContrastText: {
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#4a6fa5',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  highContrastButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  highContrastButtonText: {
    color: '#000000',
  },
});