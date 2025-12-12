import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface OnboardingStepProps {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  onButtonPress: () => void;
}

export const OnboardingStep: React.FC<OnboardingStepProps> = ({
  title,
  subtitle,
  description,
  buttonText,
  onButtonPress
}) => {
  return (
    <View>
      <Text>{title}</Text>
      <Text>{subtitle}</Text>
      <Text>{description}</Text>
      <TouchableOpacity onPress={onButtonPress}>
        <Text>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};
