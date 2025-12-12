import React from 'react';
import { View, Text } from 'react-native';

interface OnboardingScreenProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  description: string;
  onNext: () => void;
  onSkip: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  currentStep,
  totalSteps,
  title,
  subtitle,
  description,
  onNext,
  onSkip
}) => {
  return (
    <View>
      <Text>Step {currentStep + 1} of {totalSteps}</Text>
      <Text>{title}</Text>
      <Text>{subtitle}</Text>
      <Text>{description}</Text>
      <Text onPress={onNext}>Next</Text>
      <Text onPress={onSkip}>Skip</Text>
    </View>
  );
};
