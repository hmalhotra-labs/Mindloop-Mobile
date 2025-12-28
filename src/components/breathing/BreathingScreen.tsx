import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { OrganicBlob } from './OrganicBlob';
import { AudioService } from '../../services/audioService';
import { colors, spacing, typography, borderRadius } from '../../config/theme';

interface BreathingScreenProps {
  duration?: number; // in seconds
  onComplete?: () => void;
  onBack?: () => void;
}

type BreathingPhase = 'inhale' | 'hold' | 'exhale';

export const BreathingScreen: React.FC<BreathingScreenProps> = ({
  duration = 60,
  onComplete,
  onBack
}) => {
  const [isBreathing, setIsBreathing] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(duration);
  const [breathingPhase, setBreathingPhase] = useState<BreathingPhase>('inhale');
  const [phaseTimer, setPhaseTimer] = useState(0);

  // Breathing phase cycle: inhale (4s) → hold (2s) → exhale (6s) → hold (2s) = 14s total
  const INHALE_DURATION = 4;
  const HOLD_DURATION = 2;
  const EXHALE_DURATION = 6;
  const CYCLE_DURATION = INHALE_DURATION + HOLD_DURATION + EXHALE_DURATION + HOLD_DURATION;

  // Timer effect
  useEffect(() => {
    if (!isBreathing || isPaused) return;

    const interval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          setIsBreathing(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });

      // Update breathing phase
      setPhaseTimer(prev => {
        const newTimer = (prev + 1) % CYCLE_DURATION;

        if (newTimer < INHALE_DURATION) {
          setBreathingPhase('inhale');
        } else if (newTimer < INHALE_DURATION + HOLD_DURATION) {
          setBreathingPhase('hold');
        } else if (newTimer < INHALE_DURATION + HOLD_DURATION + EXHALE_DURATION) {
          setBreathingPhase('exhale');
        } else {
          setBreathingPhase('hold');
        }

        return newTimer;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathing, isPaused, onComplete]);

  const handlePauseResume = useCallback(() => {
    setIsPaused(prev => !prev);
    if (isPaused) {
      AudioService.play('ocean-waves', 0.5);
    } else {
      AudioService.pause();
    }
  }, [isPaused]);

  const getPhaseText = (): string => {
    switch (breathingPhase) {
      case 'inhale':
        return 'Inhale';
      case 'exhale':
        return 'Exhale';
      case 'hold':
        return 'Hold';
      default:
        return 'Breathe';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Breathing Phase Text */}
        <Text
          style={styles.phaseText}
          accessibilityLiveRegion="polite"
          accessibilityLabel={`${getPhaseText()}`}
        >
          {getPhaseText()}
        </Text>

        {/* Organic Blob Animation */}
        <View style={styles.blobContainer}>
          <OrganicBlob
            size={220}
            isBreathing={isBreathing && !isPaused}
            breathingPhase={breathingPhase}
          />
        </View>

        {/* Timer Display */}
        <Text
          style={styles.timer}
          accessibilityLabel={`${remainingTime} seconds remaining`}
        >
          {remainingTime}
        </Text>

        {/* Pause/Play Button */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handlePauseResume}
          accessibilityLabel={isPaused ? 'Resume breathing' : 'Pause breathing'}
          accessibilityRole="button"
        >
          <Text style={styles.controlButtonText}>
            {isPaused ? '▶' : '⏸'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 32,
    color: colors.textSecondary,
    fontWeight: typography.regular,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  phaseText: {
    fontSize: typography.xxl,
    fontWeight: typography.semibold,
    color: colors.primary,
    marginBottom: spacing.xxl,
  },
  blobContainer: {
    marginBottom: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timer: {
    fontSize: 48,
    fontWeight: typography.regular,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.buttonBorder,
  },
  controlButtonText: {
    fontSize: 24,
    color: colors.text,
  },
});

export default BreathingScreen;