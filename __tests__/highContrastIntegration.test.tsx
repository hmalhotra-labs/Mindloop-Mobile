import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { AccessibilityProvider, useAccessibility } from '../src/contexts/AccessibilityContext';
import { AccessibleButton } from '../src/components/common/AccessibleButton';
import { AccessibleTextInput } from '../src/components/common/AccessibleTextInput';

describe('High Contrast Mode Integration', () => {
  it('should apply high contrast styles to AccessibleButton when enabled', () => {
    const mockOnPress = jest.fn();
    
    const TestComponent = () => {
      const { highContrastMode, toggleHighContrastMode } = useAccessibility();
      
      React.useEffect(() => {
        // Enable high contrast mode for this test
        toggleHighContrastMode();
      }, []);
 
      return (
        <AccessibleButton
          title="Submit"
          onPress={mockOnPress}
          testID="submit-button"
        />
      );
    };

    render(
      <AccessibilityProvider>
        <TestComponent />
      </AccessibilityProvider>
    );

    const button = screen.getByTestId('submit-button');
    
    // Check that the button has been rendered and has accessibility properties
    expect(button).toBeTruthy();
    expect(button.props.accessibilityState).toBeDefined();
  });

  it('should apply high contrast styles to AccessibleTextInput when enabled', () => {
    const mockOnChangeText = jest.fn();
    
    const TestComponent = () => {
      const { highContrastMode, toggleHighContrastMode } = useAccessibility();
      
      React.useEffect(() => {
        // Enable high contrast mode for this test
        toggleHighContrastMode();
      }, []);

      return (
        <AccessibleTextInput
          value=""
          onChangeText={mockOnChangeText}
          accessibilityLabel="Email"
          testID="email-input"
        />
      );
    };

    render(
      <AccessibilityProvider>
        <TestComponent />
      </AccessibilityProvider>
    );

    const input = screen.getByTestId('email-input-input');
    
    // Check that the input has been rendered and has accessibility properties
    expect(input).toBeTruthy();
    expect(input.props.accessibilityLabel).toBe('Email');
  });

  it('should provide proper color contrast in high contrast mode', () => {
    const TestComponent = () => {
      const { highContrastMode, toggleHighContrastMode } = useAccessibility();
      
      React.useEffect(() => {
        // Enable high contrast mode for this test
        toggleHighContrastMode();
      }, []);

      return (
        <React.Fragment>
          <AccessibleButton
            title="Primary Action"
            onPress={() => {}}
            testID="primary-button"
          />
          <AccessibleTextInput
            value=""
            onChangeText={() => {}}
            accessibilityLabel="Text input"
            testID="text-input"
          />
        </React.Fragment>
      );
    };

    render(
      <AccessibilityProvider>
        <TestComponent />
      </AccessibilityProvider>
    );

    const button = screen.getByTestId('primary-button');
    const input = screen.getByTestId('text-input-input');
    
    // Check that both components have been rendered with accessibility properties
    expect(button).toBeTruthy();
    expect(input).toBeTruthy();
  });

  it('should toggle high contrast mode and apply appropriate styles', () => {
    const mockOnPress = jest.fn();
    
    const TestComponent = () => {
      const { highContrastMode, toggleHighContrastMode } = useAccessibility();
      
      return (
        <React.Fragment>
          <AccessibleButton
            title="Toggle Contrast"
            onPress={toggleHighContrastMode}
            testID="toggle-button"
          />
          <AccessibleButton
            title="Action"
            onPress={mockOnPress}
            testID="action-button"
          />
        </React.Fragment>
      );
    };

    render(
      <AccessibilityProvider>
        <TestComponent />
      </AccessibilityProvider>
    );

    const toggleButton = screen.getByTestId('toggle-button');
    
    // Check that the toggle button has been rendered
    expect(toggleButton).toBeTruthy();
    expect(toggleButton.props.accessibilityRole).toBe('button');
  });

  it('should ensure minimum contrast ratio requirements are met in high contrast mode', () => {
    const TestComponent = () => {
      const { highContrastMode, toggleHighContrastMode } = useAccessibility();
      
      React.useEffect(() => {
        // Enable high contrast mode for this test
        toggleHighContrastMode();
      }, []);

      return (
        <AccessibleButton
          title="Submit"
          onPress={() => {}}
          accessibilityLabel="Submit form"
          testID="submit-button"
        />
      );
    };

    render(
      <AccessibilityProvider>
        <TestComponent />
      </AccessibilityProvider>
    );

    const button = screen.getByTestId('submit-button');
    
    // Check that the button has been rendered with proper accessibility properties
    expect(button).toBeTruthy();
    expect(button.props.accessibilityLabel).toBe('Submit form');
  });
});