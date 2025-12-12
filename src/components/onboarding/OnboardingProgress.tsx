import React from 'react';
import { View, Text } from 'react-native';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
  totalSteps
}) => {
  const progress = (currentStep + 1) / totalSteps;

  return (
    <View>
      <Text>Step {currentStep + 1} of {totalSteps}</Text>
      <View style={{ width: progress * 100, height: 4, backgroundColor: 'blue' }} />
    </View>
  );
};
