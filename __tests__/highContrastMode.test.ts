import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { AccessibilityProvider, useAccessibility } from '../src/contexts/AccessibilityContext';

describe('High Contrast Mode', () => {
  it('should provide high contrast mode functionality', () => {
    const TestComponent = () => {
      const { highContrastMode, toggleHighContrastMode } = useAccessibility();
      
      return React.createElement(View, null,
        React.createElement(Text, { testID: 'high-contrast-status' }, highContrastMode ? 'high contrast' : 'normal contrast')
      );
    };

    const { getByTestId } = render(
      React.createElement(AccessibilityProvider, null,
        React.createElement(TestComponent)
      )
    );

    const statusText = getByTestId('high-contrast-status');
    expect(statusText.props.children).toBe('normal contrast');
  });

  it('should toggle high contrast mode', () => {
    const TestComponent = () => {
      const { highContrastMode, toggleHighContrastMode } = useAccessibility();
      
      return React.createElement(View, null,
        React.createElement(Text, { testID: 'high-contrast-status' }, highContrastMode ? 'high contrast' : 'normal contrast'),
        React.createElement(TouchableOpacity, {
          testID: 'toggle',
          onPress: toggleHighContrastMode,
        }, React.createElement(Text, null, 'Toggle'))
      );
    };

    const { getByTestId } = render(
      React.createElement(AccessibilityProvider, null,
        React.createElement(TestComponent)
      )
    );

    let statusText = getByTestId('high-contrast-status');
    expect(statusText.props.children).toBe('normal contrast');
    
    const toggleButton = getByTestId('toggle');
    fireEvent.press(toggleButton);
    
    // Re-query to get the updated element
    statusText = getByTestId('high-contrast-status');
    expect(statusText.props.children).toBe('high contrast');
  });
  
  it('should have high contrast mode disabled by default', () => {
    const TestComponent = () => {
      const { highContrastMode } = useAccessibility();
      
      return React.createElement(View, null,
        React.createElement(Text, { testID: 'high-contrast-status' }, highContrastMode ? 'enabled' : 'disabled')
      );
    };

    const { getByTestId } = render(
      React.createElement(AccessibilityProvider, null,
        React.createElement(TestComponent)
      )
    );

    const statusText = getByTestId('high-contrast-status');
    expect(statusText.props.children).toBe('disabled');
  });
});