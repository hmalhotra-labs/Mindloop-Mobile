import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useAccessibility } from '../../contexts/AccessibilityContext';

/**
 * Accessible Button Component
 * Ensures WCAG 2.1 AA compliance with proper labeling, touch targets, and announcements
 */
interface AccessibleButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  title,
  onPress,
  disabled = false,
  style,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { announceForAccessibility, highContrastMode } = useAccessibility();

  const handlePress = () => {
    if (!disabled) {
      // Announce button activation to screen readers
      const label = accessibilityLabel || title;
      announceForAccessibility(`${label} activated`);
      onPress();
    }
  };

  const buttonStyle = [
    styles.button,
    highContrastMode && styles.highContrastButton,
    disabled && styles.disabled,
    style
  ];

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      style={buttonStyle}
      testID={testID}
    >
      <Text style={[
        styles.buttonText,
        disabled && styles.disabledText
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 44, // WCAG 2.1 AA minimum touch target
    minWidth: 44,
    justifyContent: 'center',
  },
  disabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#999999',
  },
  highContrastButton: {
    backgroundColor: '#000000',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  highContrastButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});