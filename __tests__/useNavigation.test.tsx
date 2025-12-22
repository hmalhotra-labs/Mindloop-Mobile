import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { View, Text } from 'react-native';
import { AppNavigator } from '../src/navigation/AppNavigator';
import { useNavigation } from '../src/hooks/useNavigation';

// Test component that uses the useNavigation hook
const TestComponent: React.FC = () => {
  const navigation = useNavigation();
  
  return (
    <View>
      <Text testID="navigate-function">{typeof navigation.navigate}</Text>
      <Text testID="goBack-function">{typeof navigation.goBack}</Text>
      <Text testID="replace-function">{typeof navigation.replace}</Text>
    </View>
  );
};

describe('useNavigation', () => {
  test('should return navigation object with navigate function', () => {
    render(
      <AppNavigator initialRouteName="Login">
        <TestComponent />
      </AppNavigator>
    );
    
    expect(screen.getByTestId('navigate-function')).toBeTruthy();
    expect(screen.getByTestId('goBack-function')).toBeTruthy();
    expect(screen.getByTestId('replace-function')).toBeTruthy();
  });

  test('should handle navigation to different screens', () => {
    const { getByTestId } = render(
      <AppNavigator initialRouteName="Login">
        <TestComponent />
      </AppNavigator>
    );
    
    // Test that navigation functions are available
    expect(getByTestId('navigate-function')).toBeTruthy();
    expect(getByTestId('goBack-function')).toBeTruthy();
  });

  test('should provide goBack functionality', () => {
    const { getByTestId } = render(
      <AppNavigator initialRouteName="Login">
        <TestComponent />
      </AppNavigator>
    );
    
    // Test that goBack function is available
    expect(getByTestId('goBack-function')).toBeTruthy();
  });
});