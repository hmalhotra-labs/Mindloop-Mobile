export const useOnboarding = () => {
  // Simple mock implementation to match project testing patterns
  return {
    currentStep: 0,
    totalSteps: 3,
    isOnboardingComplete: false,
    nextStep: () => {},
    previousStep: () => {},
    skipOnboarding: () => {},
    completeOnboarding: () => {}
  };
};
