import React from 'react';
import { useOnboarding } from '../../hooks/useOnboarding';
import { OnboardingScreen } from './OnboardingScreen';

export const OnboardingFlow: React.FC = () => {
  const {
    currentStep,
    totalSteps,
    isOnboardingComplete,
    nextStep,
    previousStep,
    skipOnboarding,
    completeOnboarding
  } = useOnboarding();

  if (isOnboardingComplete) {
    return null; // Navigate to main app
  }

  // Mock data for each step
  const mockData = [
    { title: 'A 1-minute reset that fits your day', subtitle: 'Quick mindfulness', description: 'Find your moment of calm' },
    { title: 'Breathe with the loop → follow the rhythm', subtitle: 'Guided breathing', description: 'Let the rhythm guide you' },
    { title: 'Track how you feel & keep your streak alive', subtitle: 'Progress tracking', description: 'Build your mindfulness habit' }
  ];

  const currentScreenData = mockData[currentStep];

  if (!currentScreenData) {
    return null;
  }

  return (
    <OnboardingScreen
      currentStep={currentStep}
      totalSteps={totalSteps}
      title={currentScreenData.title}
      subtitle={currentScreenData.subtitle}
      description={currentScreenData.description}
      onNext={nextStep}
      onSkip={skipOnboarding}
    />
  );
};
