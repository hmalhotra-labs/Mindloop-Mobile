import { useState, useEffect } from 'react';
import { SessionService } from '../services/sessionService';

export interface SessionTimerState {
  remainingTime: number;
  isRunning: boolean;
  isPaused: boolean;
  start: (duration: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

export const useSessionTimer = (): SessionTimerState => {
  const [sessionService] = useState(() => new SessionService());
  const [remainingTime, setRemainingTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && !isPaused && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime(prev => Math.max(0, prev - 1));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused, remainingTime]);

  const start = (duration: number) => {
    sessionService.startSession(duration);
    setRemainingTime(duration);
    setIsRunning(true);
    setIsPaused(false);
  };

  const pause = () => {
    sessionService.pauseSession();
    setIsPaused(true);
  };

  const resume = () => {
    sessionService.resumeSession();
    setIsPaused(false);
  };

  const stop = () => {
    sessionService.stopSession();
    setIsRunning(false);
    setIsPaused(false);
    setRemainingTime(0);
  };

  return {
    remainingTime,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    stop
  };
};