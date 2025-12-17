/**
 * Utility functions for audio processing in the Mindloop mindfulness app
 */

/**
 * Calculate progress percentage based on current time and total duration
 * @param currentTime - Current playback time in seconds
 * @param totalTime - Total duration in seconds
 * @returns Progress percentage (0-100)
 */
export const calculateProgress = (currentTime: number, totalTime: number): number => {
  if (totalTime <= 0) return 0;
  if (currentTime <= 0) return 0;
  if (currentTime >= totalTime) return 100;
  
  return Math.min(100, Math.max(0, (currentTime / totalTime) * 100));
};

/**
 * Format time in seconds to MM:SS format
 * @param seconds - Time in seconds
 * @returns Formatted time string in MM:SS format
 */
export const formatTime = (seconds: number): string => {
  if (seconds < 0) seconds = 0;
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Validate if a URL is a valid audio file URL
 * @param url - URL to validate
 * @returns True if valid audio URL, false otherwise
 */
export const validateAudioUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const parsedUrl = new URL(url);
    const validAudioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'];
    const pathname = parsedUrl.pathname.toLowerCase();
    
    return validAudioExtensions.some(ext => pathname.endsWith(ext));
  } catch (e) {
    // If URL parsing fails, it's not a valid URL
    return false;
  }
};

/**
 * Get the duration of an audio file
 * @param url - URL of the audio file
 * @returns Promise that resolves to the duration in seconds
 */
export const getAudioDuration = (url: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    if (!url || typeof url !== 'string') {
      reject(new Error('Invalid URL provided'));
      return;
    }
    
    // In React Native, we would use a native audio library
    // For this implementation, we'll return 0 as a default
    // In a real app, this would interface with react-native-sound or similar
    try {
      // Simulate async operation with a timeout to mimic real behavior
      setTimeout(() => {
        // For now, return 0 as default, but in a real app this would get actual duration
        resolve(0);
      }, 0);
    } catch (error) {
      reject(error);
    }
  });
};