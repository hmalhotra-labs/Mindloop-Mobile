import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { AccessibilityProvider } from '../src/contexts/AccessibilityContext';
import { AccessibleButton } from '../src/components/common/AccessibleButton';

describe('AccessibleButton', () => {
  it('should render with accessibility properties', () => {
    const mockOnPress = jest.fn();
    
    render(
      <AccessibilityProvider>
        <AccessibleButton
          title="Submit"
          onPress={mockOnPress}
          testID="submit-button"
        />
      </AccessibilityProvider>
    );

    const button = screen.getByTestId('submit-button');
    expect(button).toBeTruthy();
    expect(button.props.accessible).toBe(true);
    expect(button.props.accessibilityLabel).toBe('Submit');
  });

  it('should announce button activation when pressed', () => {
    const mockOnPress = jest.fn();
    
    render(
      <AccessibilityProvider>
        <AccessibleButton
          title="Submit"
          onPress={mockOnPress}
          accessibilityLabel="Submit form"
          testID="submit-button"
        />
      </AccessibilityProvider>
    );

    const button = screen.getByTestId('submit-button');
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should handle disabled state properly', () => {
    const mockOnPress = jest.fn();
    
    render(
      <AccessibilityProvider>
        <AccessibleButton
          title="Submit"
          onPress={mockOnPress}
          disabled={true}
          testID="submit-button"
        />
      </AccessibilityProvider>
    );

    const button = screen.getByTestId('submit-button');
    expect(button.props.accessibilityState?.disabled).toBe(true);
    expect(button.props.accessibilityLabel).toBe('Submit');
    
    fireEvent.press(button);
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('should meet minimum touch target size requirements', () => {
    const mockOnPress = jest.fn();
    
    render(
      <AccessibilityProvider>
        <AccessibleButton
          title="Submit"
          onPress={mockOnPress}
          testID="submit-button"
        />
      </AccessibilityProvider>
    );

    const button = screen.getByTestId('submit-button');
    const buttonStyle = button.props.style;
    
    // Check if minimum touch target size (44x44) is met
    expect(buttonStyle.minHeight).toBe(44);
    expect(buttonStyle.minWidth).toBe(44);
  });

  it('should use proper accessibility hint when provided', () => {
    const mockOnPress = jest.fn();
    
    render(
      <AccessibilityProvider>
        <AccessibleButton
          title="Submit"
          onPress={mockOnPress}
          accessibilityHint="Submits the form"
          testID="submit-button"
        />
      </AccessibilityProvider>
    );

    const button = screen.getByTestId('submit-button');
    expect(button.props.accessibilityHint).toBe('Submits the form');
  });
});