import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { useAccessibility } from '../../contexts/AccessibilityContext';

/**
 * Accessible TextInput Component
 * Ensures WCAG 2.1 AA compliance with proper labeling, error handling, and announcements
 */
interface AccessibleTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  accessibilityLabel: string;
  accessibilityHint?: string;
  errorMessage?: string;
  hasError?: boolean;
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
  testID,
  editable = true,
  keyboardType = 'default',
}) => {
  const { announceForAccessibility } = useAccessibility();

  const handleChangeText = (text: string) => {
    onChangeText(text);
    
    // Announce changes for screen readers
    if (hasError && errorMessage) {
      announceForAccessibility(`${accessibilityLabel} updated. ${errorMessage}`);
    } else {
      announceForAccessibility(`${accessibilityLabel} updated`);
    }
  };

  return (
    <View style={styles.container} testID={testID}>
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
          styles.input,
          hasError && styles.error,
          !editable && styles.disabled
        ]}
        testID={`${testID}-input`}
      />
      {hasError && errorMessage && (
        <Text style={styles.errorText} testID={`${testID}-error`}>
          {errorMessage}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    minHeight: 44, // WCAG 2.1 AA minimum touch target
  },
  error: {
    borderColor: '#FF3B30',
  },
  disabled: {
    backgroundColor: '#F0F0F0',
    color: '#999999',
  },
  errorText: {
    color: '#FF3B30',
    marginTop: 4,
    fontSize: 14,
  },
});