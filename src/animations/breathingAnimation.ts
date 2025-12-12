export interface BreathingAnimationConfig {
  inhaleDuration: number;
  exhaleDuration: number;
}

export interface BreathingAnimation {
  inhaleDuration: number;
  exhaleDuration: number;
  easing: (t: number) => number;
  start: () => void;
  stop: () => void;
}

export const BreathingAnimation = (config: BreathingAnimationConfig): BreathingAnimation => {
  return {
    inhaleDuration: config.inhaleDuration,
    exhaleDuration: config.exhaleDuration,
    easing: (t: number) => t, // Simple linear easing for now
    start: () => {},
    stop: () => {}
  };
};