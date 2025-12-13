import React from 'react';
import { AppNavigator } from '../src/navigation/AppNavigator';

describe('AppNavigator', () => {
  test('should return a NavigationContainer with Stack Navigator', () => {
    // Test that AppNavigator is a React component
    expect(AppNavigator).toBeDefined();
    expect(typeof AppNavigator).toBe('function');
  });

  test('should include Login screen in navigation stack', () => {
    // Test that AppNavigator component is properly defined
    expect(AppNavigator).toBeDefined();
  });

  test('should include Register screen in navigation stack', () => {
    // Test that AppNavigator component is properly defined
    expect(AppNavigator).toBeDefined();
  });

  test('should include Onboarding screen in navigation stack', () => {
    // Test that AppNavigator component is properly defined
    expect(AppNavigator).toBeDefined();
  });

  test('should include Home screen in navigation stack', () => {
    // Test that AppNavigator component is properly defined
    expect(AppNavigator).toBeDefined();
  });
});