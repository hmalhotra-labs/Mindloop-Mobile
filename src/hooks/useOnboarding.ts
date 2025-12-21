import { useState } from 'react';

export const useOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const totalSteps = 3;

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const skipOnboarding = () => {
    setIsOnboardingComplete(true);
  };

  const completeOnboarding = () => {
    setIsOnboardingComplete(true);
  };

  return {
    currentStep,
    totalSteps,
    isOnboardingComplete,
    nextStep,
    previousStep,
    skipOnboarding,
    completeOnboarding
  };
};
