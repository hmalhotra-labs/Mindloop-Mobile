import { useState, useEffect } from 'react';
import { SessionService } from '../services/sessionService';

export interface SessionTimerState {
  remainingTime: number;
  isRunning: boolean;
  isPaused: boolean;
  isCompleted: boolean;  // Add completed state
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
  const [isCompleted, setIsCompleted] = useState(false);

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
        setIsCompleted(sessionService.getState() === 'completed');
      }, 1000);
    } else {
      // Sync state when not running as well (for completed/paused states)
      setRemainingTime(sessionService.getRemainingTime());
      setIsRunning(sessionService.getState() === 'running');
      setIsPaused(sessionService.getState() === 'paused');
      setIsCompleted(sessionService.getState() === 'completed');
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
    setIsCompleted(sessionService.getState() === 'completed');
  };

  const pause = () => {
    sessionService.pauseSession();
    // Sync state from service
    setRemainingTime(sessionService.getRemainingTime());
    setIsRunning(sessionService.getState() === 'running');
    setIsPaused(sessionService.getState() === 'paused');
    setIsCompleted(sessionService.getState() === 'completed');
  };

  const resume = () => {
    sessionService.resumeSession();
    // Sync state from service
    setRemainingTime(sessionService.getRemainingTime());
    setIsRunning(sessionService.getState() === 'running');
    setIsPaused(sessionService.getState() === 'paused');
    setIsCompleted(sessionService.getState() === 'completed');
  };

  const stop = () => {
    sessionService.stopSession();
    // Sync state from service
    setRemainingTime(sessionService.getRemainingTime());
    setIsRunning(sessionService.getState() === 'running');
    setIsPaused(sessionService.getState() === 'paused');
    setIsCompleted(sessionService.getState() === 'completed');
  };

  return {
    remainingTime,
    isRunning,
    isPaused,
    isCompleted,
    start,
    pause,
    resume,
    stop
  };
};