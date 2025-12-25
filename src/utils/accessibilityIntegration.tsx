import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { WCAGComplianceChecker } from './wcagComplianceUtils';
import { createHighContrastStyles } from './highContrastUtils';
import { isKeyboardNavigationActive } from './keyboardNavigationUtils';

/**
 * Comprehensive Accessibility Integration Hook
 * This hook provides all accessibility features in one place
 */
export const useAccessibleComponent = (
  props: {
    accessibilityLabel: string;
    accessibilityRole?: string;
    accessibilityHint?: string;
    accessibilityState?: { [key: string]: boolean };
    testID?: string;
    color?: string;
    backgroundColor?: string;
    fontSize?: number;
    isLargeText?: boolean;
  }
) => {
  const { 
    announceForAccessibility, 
    highContrastMode, 
    screenReaderEnabled 
  } = useAccessibility();

  const {
    accessibilityLabel,
    accessibilityRole,
    accessibilityHint,
    accessibilityState,
    testID,
    color = '#000000',
    backgroundColor = '#FFFFFF',
    fontSize = 16,
    isLargeText = false,
  } = props;

  // Check color contrast
  const contrastResult = WCAGComplianceChecker.checkColorContrast(
    color,
    backgroundColor,
    isLargeText || fontSize >= 18
  );

  // Get high contrast styles
  const highContrastStyles = createHighContrastStyles(highContrastMode, false);

  // Check if focus indicators should be shown
  const showFocusIndicators = isKeyboardNavigationActive();

  // Comprehensive announcement function
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announceForAccessibility(message);
  };

  // Component compliance check
  const complianceResults = WCAGComplianceChecker.checkComponentAccessibility({
    accessible: true,
    accessibilityLabel,
    accessibilityRole,
    accessibilityState,
    accessibilityHint,
    testID,
  });

  return {
    // Accessibility props
    accessible: true,
    accessibilityLabel,
    accessibilityRole,
    accessibilityHint,
    accessibilityState,
    testID,

    // Visual accessibility
    highContrastMode,
    showFocusIndicators,
    screenReaderEnabled,
    
    // Styles
    highContrastStyles,
    contrastResult,
    
    // Utilities
    announce,
    complianceResults,
    
    // Helper functions
    shouldShowFocusIndicator: () => showFocusIndicators,
    hasLowContrast: () => !contrastResult.passed,
    isCompliant: () => complianceResults.every((r: any) => r.passed),
  };
};

/**
 * Accessible Container Component
 * Provides consistent accessibility wrapper for all components
 */
interface AccessibleContainerProps {
  children: React.ReactNode;
  accessibilityLabel: string;
  accessibilityRole?: string;
  testID?: string;
  style?: any;
  isModal?: boolean;
}

export const AccessibleContainer: React.FC<AccessibleContainerProps> = ({
  children,
  accessibilityLabel,
  accessibilityRole,
  testID,
  style,
  isModal = false,
  onFocus,
  onBlur,
}) => {
  const { announceForAccessibility } = useAccessibility();

  const handleFocus = () => {
    announceForAccessibility(`${accessibilityLabel} focused`);
  };

  const containerStyle = [
    {
      minHeight: 44,
      minWidth: 44,
    },
    style,
  ];

  return (
    <View
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      style={containerStyle}
      testID={testID}
    >
      {children}
    </View>
  );
};

/**
 * Accessible Interactive Component
 * Handles all interactive accessibility concerns
 */
interface AccessibleInteractiveProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel: string;
  accessibilityRole?: 'button' | 'link' | 'checkbox' | 'radio' | 'switch';
  accessibilityHint?: string;
  testID?: string;
  style?: any;
  showPressFeedback?: boolean;
}

export const AccessibleInteractive: React.FC<AccessibleInteractiveProps> = ({
  children,
  onPress,
  disabled = false,
  accessibilityLabel,
  accessibilityRole = 'button',
  accessibilityHint,
  testID,
  style,
  showPressFeedback = true,
}) => {
  const { announceForAccessibility, highContrastMode } = useAccessibility();
  const [isPressed, setIsPressed] = React.useState(false);

  const handlePress = () => {
    if (!disabled && onPress) {
      if (showPressFeedback) {
        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 150);
      }
      
      announceForAccessibility(`${accessibilityLabel} activated`);
      onPress();
    }
  };

  const interactiveStyle = [
    {
      minHeight: 44,
      minWidth: 44,
      opacity: disabled ? 0.5 : 1,
      transform: isPressed ? [{ scale: 0.95 }] : [],
    },
    highContrastMode && {
      borderWidth: 2,
      borderColor: '#000000',
    },
    style,
  ];

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      style={interactiveStyle}
      testID={testID}
    >
      {children}
    </TouchableOpacity>
  );
};

/**
 * Accessible Text with Dynamic Contrast
 */
interface AccessibleDynamicTextProps {
  children: React.ReactNode;
  accessibilityLabel?: string;
  style?: any;
  color?: string;
  backgroundColor?: string;
  fontSize?: number;
  isLargeText?: boolean;
  testID?: string;
}

export const AccessibleDynamicText: React.FC<AccessibleDynamicTextProps> = ({
  children,
  accessibilityLabel,
  style,
  color = '#000000',
  backgroundColor = '#FFFFFF',
  fontSize = 16,
  isLargeText = false,
  testID,
}) => {
  const { highContrastMode } = useAccessibility();

  // Check contrast and apply warnings
  const contrastResult = WCAGComplianceChecker.checkColorContrast(
    color,
    backgroundColor,
    isLargeText || fontSize >= 18
  );

  const textStyle = [
    {
      color: highContrastMode ? '#000000' : color,
      backgroundColor: highContrastMode ? '#FFFFFF' : backgroundColor,
      fontSize,
      fontWeight: highContrastMode ? 'bold' : 'normal',
    },
    !contrastResult.passed && {
      borderWidth: 1,
      borderColor: '#FF9500',
      borderRadius: 2,
    },
    style,
  ];

  return (
    <Text
      accessible={!!accessibilityLabel}
      accessibilityLabel={accessibilityLabel}
      style={textStyle}
      testID={testID}
    >
      {children}
    </Text>
  );
};

/**
 * Accessible Form with Error Handling
 */
interface AccessibleFormFieldProps {
  children: React.ReactNode;
  label: string;
  error?: string;
  hint?: string;
  testID?: string;
  style?: any;
}

export const AccessibleFormField: React.FC<AccessibleFormFieldProps> = ({
  children,
  label,
  error,
  hint,
  testID,
  style,
}) => {
  const { announceForAccessibility } = useAccessibility();

  const fieldId = `${testID || 'field'}-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;

  // Announce error changes
  React.useEffect(() => {
    if (error) {
      announceForAccessibility(`Error in ${label}: ${error}`);
    }
  }, [error, label]);

  const formFieldStyle = [
    {
      marginBottom: 16,
    },
    error && {
      borderColor: '#FF3B30',
      borderWidth: 1,
      borderRadius: 4,
      padding: 4,
    },
    style,
  ];

  return (
    <View style={formFieldStyle} testID={testID}>
      <AccessibleDynamicText
        accessibilityLabel={`${label} field`}
        fontSize={14}
        fontWeight="bold"
      >
        {label}
      </AccessibleDynamicText>
      
      {React.cloneElement(children as React.ReactElement, {
        accessibilityLabel: label,
        accessibilityHint: hint,
        accessibilityDescribedBy: `${hintId} ${errorId}`,
        testID: `${testID}-input`,
      })}
      
      {hint && (
        <AccessibleDynamicText
          accessibilityLabel={hint}
          color="#666666"
          fontSize={12}
          testID={hintId}
        >
          {hint}
        </AccessibleDynamicText>
      )}
      
      {error && (
        <AccessibleDynamicText
          accessibilityLabel={error}
          color="#FF3B30"
          fontSize={12}
          testID={errorId}
        >
          {error}
        </AccessibleDynamicText>
      )}
    </View>
  );
};

/**
 * Accessible Loading State Manager
 */
interface AccessibleLoadingStateProps {
  isLoading: boolean;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  testID?: string;
  children: React.ReactNode;
}

export const AccessibleLoadingState: React.FC<AccessibleLoadingStateProps> = ({
  isLoading,
  loadingText = 'Loading content',
  successText,
  errorText,
  testID,
  children,
}) => {
  const { announceForAccessibility } = useAccessibility();

  const [previousLoading, setPreviousLoading] = React.useState(isLoading);

  React.useEffect(() => {
    if (isLoading && !previousLoading) {
      announceForAccessibility(`${loadingText}, please wait`);
    } else if (!isLoading && previousLoading) {
      if (errorText) {
        announceForAccessibility(`Error: ${errorText}`);
      } else if (successText) {
        announceForAccessibility(successText);
      } else {
        announceForAccessibility('Content loaded');
      }
    }
    setPreviousLoading(isLoading);
  }, [isLoading, previousLoading, loadingText, successText, errorText]);

  if (isLoading) {
    return (
      <View style={{ padding: 20, alignItems: 'center' }} testID={testID}>
        <AccessibleDynamicText
          accessibilityLabel={loadingText}
          testID={`${testID}-loading`}
        >
          {loadingText}
        </AccessibleDynamicText>
      </View>
    );
  }

  if (errorText) {
    return (
      <View style={{ padding: 20 }} testID={testID}>
        <AccessibleDynamicText
          accessibilityLabel={`Error: ${errorText}`}
          color="#FF3B30"
          testID={`${testID}-error`}
        >
          {errorText}
        </AccessibleDynamicText>
      </View>
    );
  }

  return (
    <View testID={testID}>
      {children}
    </View>
  );
};

