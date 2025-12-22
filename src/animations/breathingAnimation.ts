import { Animated, Easing } from 'react-native';

export interface BreathingAnimationConfig {
  inhaleDuration: number;
  exhaleDuration: number;
  holdDuration?: number;
}

export interface BreathingAnimation {
  inhaleDuration: number;
  exhaleDuration: number;
  holdDuration: number;
  easing: (t: number) => number;
  start: (animatedValue: Animated.Value) => void;
  stop: (animatedValue: Animated.Value) => void;
}

export const BreathingAnimation = (config: BreathingAnimationConfig): BreathingAnimation => {
  return {
    inhaleDuration: config.inhaleDuration,
    exhaleDuration: config.exhaleDuration,
    holdDuration: config.holdDuration || 2000,
    easing: (t: number) => t, // Simple linear easing for now
    start: (animatedValue: Animated.Value) => {
      // Create the animation sequence
      const anim = Animated.loop(
        Animated.sequence([
          // Inhale phase
          Animated.timing(animatedValue, {
            toValue: 1.5, // Scale up
            duration: config.inhaleDuration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          // Hold at top
          Animated.delay(config.holdDuration || 2000),
          // Exhale phase
          Animated.timing(animatedValue, {
            toValue: 0.8, // Scale down
            duration: config.exhaleDuration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          // Hold at bottom
          Animated.delay(config.holdDuration || 2000),
        ])
      );
      
      anim.start();
    },
    stop: (animatedValue: Animated.Value) => {
      // Stop the animation by resetting the value
      animatedValue.stopAnimation();
      animatedValue.setValue(1); // Reset to default scale
    }
  };
};