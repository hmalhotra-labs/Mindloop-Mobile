import React from 'react';
import { View, Text, Button } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { AccessibilityProvider, useAccessibility } from '../src/contexts/AccessibilityContext';

describe('Keyboard Navigation', () => {
  it('should track keyboard focus state', () => {
    const TestComponent = () => {
      const { isKeyboardMode, enableKeyboardMode, disableKeyboardMode } = useAccessibility();
      
      return React.createElement(View, null,
        React.createElement(Text, { testID: 'keyboard-mode' }, isKeyboardMode ? 'keyboard' : 'not keyboard'),
        React.createElement(Button, {
          testID: 'toggle-keyboard',
          title: 'Toggle Keyboard Mode',
          onPress: () => isKeyboardMode ? disableKeyboardMode() : enableKeyboardMode()
        })
      );
    };

    const { getByTestId } = render(
      React.createElement(AccessibilityProvider, null,
        React.createElement(TestComponent)
      )
    );

    const keyboardModeText = getByTestId('keyboard-mode');
    expect(keyboardModeText.props.children).toBe('not keyboard');

    const toggleButton = getByTestId('toggle-keyboard');
    fireEvent.press(toggleButton);

    expect(keyboardModeText.props.children).toBe('keyboard');
  });

  it('should provide keyboard navigation utilities', () => {
    const TestComponent = () => {
      const { isKeyboardMode } = useAccessibility();
      
      return React.createElement(View, null,
        React.createElement(Text, { testID: 'keyboard-mode' }, isKeyboardMode ? 'keyboard' : 'not keyboard')
      );
    };

    const { getByTestId } = render(
      React.createElement(AccessibilityProvider, null,
        React.createElement(TestComponent)
      )
    );

    const keyboardModeText = getByTestId('keyboard-mode');
    expect(keyboardModeText.props.children).toBe('not keyboard');
  });
});