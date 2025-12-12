export interface BreathingSession {
  phase: 'inhale' | 'exhale';
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  duration: number;
}

export const useBreathingSession = (): BreathingSession => {
  // Simple mock implementation for testing
  return {
    phase: 'inhale',
    start: () => {},
    pause: () => {},
    resume: () => {},
    stop: () => {},
    duration: 0
  };
};