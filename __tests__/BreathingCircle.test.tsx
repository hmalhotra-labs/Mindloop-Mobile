import React from 'react';
import { render } from '@testing-library/react-native';
import { BreathingCircle } from '../src/components/breathing/BreathingCircle';

describe('BreathingCircle', () => {
  test('should render a breathing circle component', () => {
    const { getByTestId } = render(<BreathingCircle />);
    // Check if the component renders without crashing
    expect(() => render(<BreathingCircle />)).not.toThrow();
  });

  test('should accept breathingPhase prop for inhale/exhale states', () => {
    // Test that the component accepts the breathingPhase prop without crashing
    expect(() => render(<BreathingCircle breathingPhase="inhale" />)).not.toThrow();
    expect(() => render(<BreathingCircle breathingPhase="exhale" />)).not.toThrow();
    expect(() => render(<BreathingCircle breathingPhase="hold" />)).not.toThrow();
  });

  test('should accept isBreathing prop for interaction handling', () => {
    // Test that the component accepts the isBreathing prop without crashing
    expect(() => render(<BreathingCircle isBreathing={true} />)).not.toThrow();
    expect(() => render(<BreathingCircle isBreathing={false} />)).not.toThrow();
  });
});