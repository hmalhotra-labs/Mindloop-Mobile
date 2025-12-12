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

    // Use service's state instead of local state for running/paused checks
    if (sessionService.getState() === 'running') {
      interval = setInterval(() => {
        // CRITICAL FIX: Call service.tick() instead of duplicate logic
        sessionService.tick();
        
        // Sync state from service getters instead of local state
        setRemainingTime(sessionService.getRemainingTime());
        setIsRunning(sessionService.getState() === 'running');
        setIsPaused(sessionService.getState() === 'paused');
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionService]); // Re-run when service instance changes

  const start = (duration: number) => {
    sessionService.startSession(duration);
    // Sync initial state from service
    setRemainingTime(sessionService.getRemainingTime());
    setIsRunning(sessionService.getState() === 'running');
    setIsPaused(sessionService.getState() === 'paused');
  };

  const pause = () => {
    sessionService.pauseSession();
    // Sync state from service
    setRemainingTime(sessionService.getRemainingTime());
    setIsRunning(sessionService.getState() === 'running');
    setIsPaused(sessionService.getState() === 'paused');
  };

  const resume = () => {
    sessionService.resumeSession();
    // Sync state from service
    setRemainingTime(sessionService.getRemainingTime());
    setIsRunning(sessionService.getState() === 'running');
    setIsPaused(sessionService.getState() === 'paused');
  };

  const stop = () => {
    sessionService.stopSession();
    // Sync state from service
    setRemainingTime(sessionService.getRemainingTime());
    setIsRunning(sessionService.getState() === 'running');
    setIsPaused(sessionService.getState() === 'paused');
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