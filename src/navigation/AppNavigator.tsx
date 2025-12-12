import React from 'react';

// Simplified testable navigation structure
export interface NavigationScreen {
  name: string;
  component: React.ComponentType;
}

export interface NavigationState {
  currentScreen: string;
  screens: NavigationScreen[];
}

// Simplified AppNavigator for TDD testing
interface AppNavigatorProps {
  initialScreen?: string;
  onScreenChange?: (screenName: string) => void;
}

export const AppNavigator = ({ 
  initialScreen = 'Login',
  onScreenChange 
}: AppNavigatorProps): NavigationState => {
  // Mock screen components for navigation
  const LoginScreen = () => <div>Login Screen</div>;
  const RegisterScreen = () => <div>Register Screen</div>;
  const OnboardingScreen = () => <div>Onboarding Screen</div>;
  const HomeScreen = () => <div>Home Screen</div>;

  const screens: NavigationScreen[] = [
    { name: 'Login', component: LoginScreen },
    { name: 'Register', component: RegisterScreen },
    { name: 'Onboarding', component: OnboardingScreen },
    { name: 'Home', component: HomeScreen }
  ];

  const navigationState: NavigationState = {
    currentScreen: initialScreen,
    screens
  };

  // Call screen change callback if provided
  if (onScreenChange) {
    onScreenChange(navigationState.currentScreen);
  }

  // Return navigation structure for testing
  return navigationState;
};