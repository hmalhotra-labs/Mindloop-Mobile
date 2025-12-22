/**
 * Utility functions for time formatting and duration calculations
 */

/**
 * Format seconds to MM:SS format (e.g., 125 seconds -> "02:05")
 */
export const formatTimeMMSS = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Convert seconds to minutes (rounded up)
 */
export const secondsToMinutes = (seconds: number): number => {
  return Math.ceil(seconds / 60);
};

/**
 * Convert seconds to minutes and seconds object
 */
export const secondsToMinutesAndSeconds = (seconds: number): { minutes: number; seconds: number } => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return { minutes, seconds: remainingSeconds };
};

/**
 * Format duration in a human-readable format
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} seconds`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (remainingSeconds === 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  return `${minutes} minute${minutes !== 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
};