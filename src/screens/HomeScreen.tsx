import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { announceToScreenReader } from '../utils/screenReaderUtils';
import { GlowingLoop } from '../components/common/GlowingLoop';
import { colors, spacing, typography, borderRadius } from '../config/theme';

interface HomeScreenProps {
  onStartSession?: () => void;
  children?: React.ReactNode;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartSession, children }) => {
  const settings = useAccessibility();

  // Announce screen content when it loads if screen reader is enabled
  useEffect(() => {
    if (settings.screenReaderEnabled) {
      announceToScreenReader('Welcome to Mindloop. Ready to reset?');
    }
  }, [settings.screenReaderEnabled]);

  const handleStartLoop = () => {
    if (settings.screenReaderEnabled) {
      announceToScreenReader('Starting your breathing loop');
    }
    onStartSession?.();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header with Logo */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>≋</Text>
          <Text style={styles.logoText}>MINDLOOP</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Greeting Text */}
        <Text
          style={styles.greeting}
          accessibilityRole="header"
          accessibilityLabel="Ready to reset?"
        >
          Ready to reset?
        </Text>

        {/* Animated Glowing Loop */}
        <View style={styles.loopContainer}>
          <GlowingLoop
            size={220}
            isAnimating={true}
            variant="home"
          />
        </View>

        {/* Start Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartLoop}
          accessibilityLabel="Start your breathing loop"
          accessibilityRole="button"
          accessibilityHint="Begins a guided breathing session"
        >
          <Text style={styles.startButtonText}>Start Your Loop</Text>
        </TouchableOpacity>
      </View>

      {children}
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 24,
    color: colors.primary,
    marginRight: spacing.sm,
  },
  logoText: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
    color: colors.textSecondary,
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  greeting: {
    fontSize: typography.xxl,
    fontWeight: typography.semibold,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  loopContainer: {
    marginBottom: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: colors.surfaceLight,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.buttonBorder,
    marginTop: spacing.xl,
  },
  startButtonText: {
    color: colors.text,
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
});

export default HomeScreen;