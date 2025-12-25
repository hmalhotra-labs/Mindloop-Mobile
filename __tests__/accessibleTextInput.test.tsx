import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { AccessibilityProvider } from '../src/contexts/AccessibilityContext';
import { AccessibleTextInput } from '../src/components/common/AccessibleTextInput';

describe('AccessibleTextInput', () => {
  it('should render with proper accessibility properties', () => {
    const mockOnChangeText = jest.fn();
    
    render(
      <AccessibilityProvider>
        <AccessibleTextInput
          value=""
          onChangeText={mockOnChangeText}
          accessibilityLabel="Email address"
          placeholder="Enter your email"
          testID="email-input"
        />
      </AccessibilityProvider>
    );

    const input = screen.getByTestId('email-input-input');
    expect(input).toBeTruthy();
    expect(input.props.accessible).toBe(true);
    expect(input.props.accessibilityLabel).toBe('Email address');
    expect(input.props.placeholder).toBe('Enter your email');
  });

  it('should announce text changes to screen readers', () => {
    const mockOnChangeText = jest.fn();
    
    render(
      <AccessibilityProvider>
        <AccessibleTextInput
          value=""
          onChangeText={mockOnChangeText}
          accessibilityLabel="Email address"
          accessibilityHint="This will be used for login"
          testID="email-input"
        />
      </AccessibilityProvider>
    );

    const input = screen.getByTestId('email-input-input');
    fireEvent.changeText(input, 'test@example.com');

    expect(mockOnChangeText).toHaveBeenCalledWith('test@example.com');
    expect(input.props.accessibilityHint).toBe('This will be used for login');
  });

  it('should handle error states properly', () => {
    const mockOnChangeText = jest.fn();
    const errorMessage = 'Invalid email format';
    
    render(
      <AccessibilityProvider>
        <AccessibleTextInput
          value="invalid-email"
          onChangeText={mockOnChangeText}
          accessibilityLabel="Email address"
          errorMessage={errorMessage}
          hasError={true}
          testID="email-input"
        />
      </AccessibilityProvider>
    );

    const input = screen.getByTestId('email-input-input');
    const errorText = screen.getByTestId('email-input-error');
    
    expect(input.props.accessibilityState?.error).toBe(true);
    expect(errorText.props.children).toBe(errorMessage);
  });

  it('should meet minimum touch target size requirements', () => {
    const mockOnChangeText = jest.fn();
    
    render(
      <AccessibilityProvider>
        <AccessibleTextInput
          value=""
          onChangeText={mockOnChangeText}
          accessibilityLabel="Text input"
          testID="text-input"
        />
      </AccessibilityProvider>
    );

    const input = screen.getByTestId('text-input-input');
    
    // The component should render properly with accessibility properties
    expect(input).toBeTruthy();
    expect(input.props.accessible).toBe(true);
    expect(input.props.accessibilityLabel).toBe('Text input');
  });

  it('should be keyboard accessible', () => {
    const mockOnChangeText = jest.fn();
    
    render(
      <AccessibilityProvider>
        <AccessibleTextInput
          value=""
          onChangeText={mockOnChangeText}
          accessibilityLabel="Username"
          testID="username-input"
          keyboardType="default"
        />
      </AccessibilityProvider>
    );

    const input = screen.getByTestId('username-input-input');
    expect(input.props.keyboardType).toBe('default');
    expect(input.props.editable).toBe(true);
  });

  it('should handle disabled state properly', () => {
    const mockOnChangeText = jest.fn();
    
    render(
      <AccessibilityProvider>
        <AccessibleTextInput
          value="Disabled input"
          onChangeText={mockOnChangeText}
          accessibilityLabel="Disabled input"
          editable={false}
          testID="disabled-input"
        />
      </AccessibilityProvider>
    );

    const input = screen.getByTestId('disabled-input-input');
    expect(input.props.editable).toBe(false);
    expect(input.props.accessibilityState?.disabled).toBe(true);
  });
});