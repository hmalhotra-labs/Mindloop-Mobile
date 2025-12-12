export interface OnboardingStepData {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
}

export const onboardingData: OnboardingStepData[] = [
  {
    title: "A 1-minute reset that fits your day",
    subtitle: "Quick mindfulness",
    description: "Find your moment of calm in just 60 seconds",
    buttonText: "Next"
  },
  {
    title: "Breathe with the loop → follow the rhythm",
    subtitle: "Guided breathing", 
    description: "Let the rhythm guide you to deeper relaxation",
    buttonText: "Next"
  },
  {
    title: "Track how you feel & keep your streak alive",
    subtitle: "Progress tracking",
    description: "Build your mindfulness habit one day at a time",
    buttonText: "Get Started"
  }
];
