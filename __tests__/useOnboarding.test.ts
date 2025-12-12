import { useOnboarding } from '../src/hooks/useOnboarding';

describe('useOnboarding', () => {
  beforeEach(() => {
    // Reset state between tests
    const hook = useOnboarding();
    if (hook.currentStep > 0) {
      for (let i = hook.currentStep; i > 0; i--) {
        hook.previousStep();
      }
    }
    if (hook.isOnboardingComplete) {
      // Reset complete state by re-creating the hook
    }
  });

  test('should export useOnboarding hook', () => {
    expect(useOnboarding).toBeDefined();
  });

  test('should return current step state', () => {
    const hook = useOnboarding();
    expect(hook.currentStep).toBe(0);
  });

  test('should return total steps', () => {
    const hook = useOnboarding();
    expect(hook.totalSteps).toBe(3);
  });

  test('should return onboarding complete state', () => {
    const hook = useOnboarding();
    expect(hook.isOnboardingComplete).toBe(false);
  });

  test('should provide nextStep function', () => {
    const hook = useOnboarding();
    expect(typeof hook.nextStep).toBe('function');
  });

  test('should provide previousStep function', () => {
    const hook = useOnboarding();
    expect(typeof hook.previousStep).toBe('function');
  });

  test('should provide skipOnboarding function', () => {
    const hook = useOnboarding();
    expect(typeof hook.skipOnboarding).toBe('function');
  });

  test('should provide completeOnboarding function', () => {
    const hook = useOnboarding();
    expect(typeof hook.completeOnboarding).toBe('function');
  });

  // Behavior-driven tests
  test('should navigate to next step when nextStep is called', () => {
    const hook = useOnboarding();
    expect(hook.currentStep).toBe(0);
    hook.nextStep();
    expect(hook.currentStep).toBe(1);
  });

  test('should navigate back to previous step when previousStep is called', () => {
    const hook = useOnboarding();
    hook.nextStep();
    hook.nextStep();
    expect(hook.currentStep).toBe(2);
    hook.previousStep();
    expect(hook.currentStep).toBe(1);
  });

  test('should complete onboarding when completeOnboarding is called', () => {
    const hook = useOnboarding();
    expect(hook.isOnboardingComplete).toBe(false);
    hook.completeOnboarding();
    expect(hook.isOnboardingComplete).toBe(true);
  });

  test('should skip onboarding when skipOnboarding is called', () => {
    const hook = useOnboarding();
    expect(hook.isOnboardingComplete).toBe(false);
    hook.skipOnboarding();
    expect(hook.isOnboardingComplete).toBe(true);
  });
});
