import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { useOnboarding } from '../src/hooks/useOnboarding';

describe('useOnboarding', () => {
  test('should export useOnboarding hook', () => {
    expect(useOnboarding).toBeDefined();
  });

  test('should return current step state', () => {
    const { result } = renderHook(() => useOnboarding());
    expect(result.current.currentStep).toBe(0);
  });

  test('should return total steps', () => {
    const { result } = renderHook(() => useOnboarding());
    expect(result.current.totalSteps).toBe(3);
  });

  test('should return onboarding complete state', () => {
    const { result } = renderHook(() => useOnboarding());
    expect(result.current.isOnboardingComplete).toBe(false);
  });

  test('should provide nextStep function', () => {
    const { result } = renderHook(() => useOnboarding());
    expect(typeof result.current.nextStep).toBe('function');
  });

  test('should provide previousStep function', () => {
    const { result } = renderHook(() => useOnboarding());
    expect(typeof result.current.previousStep).toBe('function');
  });

  test('should provide skipOnboarding function', () => {
    const { result } = renderHook(() => useOnboarding());
    expect(typeof result.current.skipOnboarding).toBe('function');
  });

  test('should provide completeOnboarding function', () => {
    const { result } = renderHook(() => useOnboarding());
    expect(typeof result.current.completeOnboarding).toBe('function');
  });

  // Behavior-driven tests
  test('should navigate to next step when nextStep is called', async () => {
    const { result } = renderHook(() => useOnboarding());
    expect(result.current.currentStep).toBe(0);
    await act(async () => {
      result.current.nextStep();
    });
    expect(result.current.currentStep).toBe(1);
  });

  test('should navigate back to previous step when previousStep is called', async () => {
    const { result } = renderHook(() => useOnboarding());
    await act(async () => {
      result.current.nextStep();
      result.current.nextStep();
    });
    expect(result.current.currentStep).toBe(2);
    await act(async () => {
      result.current.previousStep();
    });
    expect(result.current.currentStep).toBe(1);
  });

  test('should complete onboarding when completeOnboarding is called', async () => {
    const { result } = renderHook(() => useOnboarding());
    expect(result.current.isOnboardingComplete).toBe(false);
    await act(async () => {
      result.current.completeOnboarding();
    });
    expect(result.current.isOnboardingComplete).toBe(true);
  });

  test('should skip onboarding when skipOnboarding is called', async () => {
    const { result } = renderHook(() => useOnboarding());
    expect(result.current.isOnboardingComplete).toBe(false);
    await act(async () => {
      result.current.skipOnboarding();
    });
    expect(result.current.isOnboardingComplete).toBe(true);
  });
});
