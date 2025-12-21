import React from 'react';

// Import existing screen components
import { LoginScreen } from '../components/auth/LoginScreen';
import { RegisterScreen } from '../components/auth/RegisterScreen';
import { OnboardingFlow } from '../components/onboarding/OnboardingFlow';
import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

export interface NavigationScreen {
  name: string;
  component: React.ComponentType;
}

export interface AppNavigatorProps {
  initialRouteName?: string;
  children?: React.ReactNode;
}

// Mock navigation component for testing
export const AppNavigator: React.FC<AppNavigatorProps> = ({
  initialRouteName = 'Login',
  children
}) => {
  // Define navigation screens
  const screens: NavigationScreen[] = [
    { name: 'Login', component: LoginScreen },
    { name: 'Register', component: RegisterScreen },
    { name: 'Onboarding', component: OnboardingFlow },
    { name: 'Home', component: HomeScreen },
    { name: 'Settings', component: SettingsScreen },
    { name: 'History', component: HistoryScreen },
    { name: 'Profile', component: ProfileScreen }
  ];

  // Return navigation structure (simulating NavigationContainer)
  return (
    <div data-testid="navigation-container" data-initial-route={initialRouteName}>
      {children || <div data-testid="navigation-stack">App Navigator Ready</div>}
    </div>
  );
};