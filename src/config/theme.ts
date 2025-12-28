// Mindloop Dark Theme - Design System
// Unified theme constants for the glowing teal/cyan dark design

export const colors = {
  // Backgrounds
  background: '#0a0a0f',
  backgroundSecondary: '#0f0f1a',
  surface: '#1a1a2e',
  surfaceLight: '#2a2a3e',

  // Primary - Teal/Cyan
  primary: '#00d9ff',
  primaryGlow: '#00b4d8',
  primaryDark: '#0077b6',
  primaryMuted: '#00d9ff40',

  // Text
  text: '#ffffff',
  textSecondary: '#8b8b9e',
  textMuted: '#5a5a6e',

  // UI Elements
  buttonBg: '#2a2a3e',
  buttonBorder: '#3a3a4e',
  buttonSelected: '#00d9ff20',

  // Mood Colors
  moodGood: '#4ade80',
  moodOkay: '#60a5fa',
  moodMeh: '#fbbf24',
  moodBad: '#f87171',

  // Gradients (for reference in components)
  gradientTeal: ['#00d9ff', '#00b4d8', '#0077b6'],
  gradientCompletion: ['#ff6b9d', '#c44b6c', '#00d9ff', '#ffd93d'],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  // Font sizes
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 48,

  // Font weights
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const shadows = {
  glow: {
    shadowColor: '#00d9ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  glowLarge: {
    shadowColor: '#00d9ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 20,
  },
};

// Common styles that can be spread into StyleSheets
export const commonStyles = {
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: spacing.lg,
  },
  primaryButton: {
    backgroundColor: colors.surfaceLight,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.buttonBorder,
  },
  primaryButtonText: {
    color: colors.text,
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
};

export default {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
  commonStyles,
};
