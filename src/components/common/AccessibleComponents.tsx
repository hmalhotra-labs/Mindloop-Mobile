import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  View, 
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle
} from 'react-native';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { WCAGComplianceChecker } from '../../utils/wcagComplianceUtils';

/**
 * Accessible TouchableOpacity component that ensures WCAG 2.1 AA compliance
 */
interface AccessibleTouchableOpacityProps {
  children?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel: string;
  accessibilityRole?: 'button' | 'link' | 'checkbox' | 'radio' | 'switch';
  accessibilityState?: { [key: string]: boolean };
  accessibilityHint?: string;
  testID?: string;
}

export const AccessibleTouchableOpacity: React.FC<AccessibleTouchableOpacityProps> = ({
  children,
  onPress,
  disabled = false,
  style,
  accessibilityLabel,
  accessibilityRole = 'button',
  accessibilityState,
  accessibilityHint,
  testID,
}) => {
  const { announceForAccessibility } = useAccessibility();

  const handlePress = () => {
    if (!disabled && onPress) {
      // Announce button press to screen readers
      announceForAccessibility(`${accessibilityLabel} activated`);
      onPress();
    }
  };

  // WCAG compliance check
  const complianceResults = WCAGComplianceChecker.checkComponentAccessibility({
    accessible: true,
    accessibilityLabel,
    accessibilityRole,
    accessibilityState,
    accessibilityHint,
    focusable: !disabled
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      accessibilityHint={accessibilityHint}
      style={[
        styles.touchableOpacity,
        disabled && styles.disabled,
        style
      ]}
      testID={testID}
    >
      {children}
    </TouchableOpacity>
  );
};

/**
 * Accessible Text component with proper contrast ratio validation
 */
interface AccessibleTextProps {
  children: React.ReactNode;
  style?: TextStyle;
  accessibilityLabel?: string;
  accessibilityRole?: 'header';
  accessibilityHint?: string;
  testID?: string;
  color?: string;
  backgroundColor?: string;
  fontSize?: number;
  isLargeText?: boolean;
}

export const AccessibleText: React.FC<AccessibleTextProps> = ({
  children,
  style,
  accessibilityLabel,
  accessibilityRole,
  accessibilityHint,
  testID,
  color = '#000000',
  backgroundColor = '#FFFFFF',
  fontSize = 16,
  isLargeText = false,
}) => {
  // Check color contrast compliance
  const contrastResult = WCAGComplianceChecker.checkColorContrast(
    color,
    backgroundColor,
    isLargeText || fontSize >= 18
  );

  const textStyle: TextStyle = {
    color,
    backgroundColor,
    fontSize,
    ...style
  };

  return (
    <Text
      accessible={!!accessibilityLabel}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessibilityHint={accessibilityHint}
      style={[
        textStyle,
        !contrastResult.passed && styles.lowContrast
      ]}
      testID={testID}
    >
      {children}
    </Text>
  );
};

/**
 * Accessible TextInput component with proper labeling and error handling
 */
interface AccessibleTextInputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  accessibilityLabel: string;
  accessibilityHint?: string;
  errorMessage?: string;
  hasError?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  testID?: string;
  editable?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

export const AccessibleTextInput: React.FC<AccessibleTextInputProps> = ({
  value,
  onChangeText,
  placeholder,
  accessibilityLabel,
  accessibilityHint,
  errorMessage,
  hasError = false,
  style,
  inputStyle,
  testID,
  editable = true,
  keyboardType = 'default',
}) => {
  const { announceForAccessibility } = useAccessibility();

  const handleChangeText = (text: string) => {
    onChangeText?.(text);
    
    // Announce changes for screen readers
    if (hasError && errorMessage) {
      announceForAccessibility(`${accessibilityLabel} updated. ${errorMessage}`);
    } else {
      announceForAccessibility(`${accessibilityLabel} updated`);
    }
  };

  // Check form element labeling
  const labelingResult = WCAGComplianceChecker.checkFormElementLabeling(
    accessibilityLabel,
    'text input'
  );

  const inputContainerStyle = [
    styles.textInputContainer,
    hasError && styles.error,
    style
  ];

  return (
    <View style={inputContainerStyle} testID={testID}>
      <TextInput
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        editable={editable}
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ 
          ...(hasError && { error: true }),
          ...(!editable && { disabled: true })
        }}
        keyboardType={keyboardType}
        style={[
          styles.textInput,
          hasError && styles.errorText,
          !editable && styles.disabledText,
          inputStyle
        ]}
        testID={`${testID}-input`}
      />
      {hasError && errorMessage && (
        <AccessibleText
          color="#FF3B30"
          style={styles.errorText}
          testID={`${testID}-error`}
        >
          {errorMessage}
        </AccessibleText>
      )}
    </View>
  );
};

/**
 * Accessible Modal component with focus management
 */
interface AccessibleModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  testID?: string;
  accessibilityLabel?: string;
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  visible,
  onClose,
  title,
  children,
  testID,
  accessibilityLabel,
}) => {
  const { announceForAccessibility } = useAccessibility();

  React.useEffect(() => {
    if (visible) {
      announceForAccessibility(`${title} modal opened`);
    } else {
      announceForAccessibility(`${title} modal closed`);
    }
  }, [visible, title]);

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay} testID={testID}>
      <View style={styles.modalContent}>
        <AccessibleTouchableOpacity
          accessibilityLabel="Close modal"
          accessibilityRole="button"
          onPress={onClose}
          style={styles.closeButton}
          testID="modal-close-button"
        >
          <AccessibleText>×</AccessibleText>
        </AccessibleTouchableOpacity>
        
        <AccessibleText
          accessibilityLabel={accessibilityLabel || title}
          style={styles.modalTitle}
          fontSize={20}
          isLargeText={true}
        >
          {title}
        </AccessibleText>
        
        <View style={styles.modalBody}>
          {children}
        </View>
      </View>
    </View>
  );
};

/**
 * Loading indicator with screen reader announcements
 */
interface AccessibleLoadingProps {
  isLoading: boolean;
  loadingText?: string;
  testID?: string;
}

export const AccessibleLoading: React.FC<AccessibleLoadingProps> = ({
  isLoading,
  loadingText = 'Loading content',
  testID,
}) => {
  const { announceForAccessibility } = useAccessibility();

  React.useEffect(() => {
    if (isLoading) {
      announceForAccessibility(`${loadingText}, please wait`);
    }
  }, [isLoading, loadingText]);

  if (!isLoading) return null;

  return (
    <View style={styles.loadingContainer} testID={testID}>
      <AccessibleText
        accessibilityLabel={loadingText}
        style={styles.loadingText}
      >
        {loadingText}
      </AccessibleText>
    </View>
  );
};

/**
 * Accessible form with proper error handling
 */
interface AccessibleFormProps {
  children: React.ReactNode;
  onSubmit?: () => void;
  testID?: string;
}

export const AccessibleForm: React.FC<AccessibleFormProps> = ({
  children,
  onSubmit,
  testID,
}) => {
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <View style={styles.form} testID={testID}>
      {children}
      <AccessibleTouchableOpacity
        accessibilityLabel="Submit form"
        accessibilityRole="button"
        onPress={handleSubmit}
        style={styles.submitButton}
        testID="form-submit"
      >
        <AccessibleText style={styles.submitButtonText}>Submit</AccessibleText>
      </AccessibleTouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  touchableOpacity: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  lowContrast: {
    borderWidth: 1,
    borderColor: '#FF9500',
    borderRadius: 4,
  },
  textInputContainer: {
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    minHeight: 44,
  },
  error: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    marginTop: 4,
    fontSize: 14,
  },
  disabledText: {
    color: '#999999',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    maxWidth: 300,
    width: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingRight: 30,
  },
  modalBody: {
    marginTop: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    padding: 16,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    minHeight: 44,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});