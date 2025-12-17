import { useState, useEffect, useRef } from 'react';
import { AudioService } from '../services/audioService';
import { AmbientSound, ambientSounds } from '../data/ambientSounds';

interface UseAudioPlayerReturn {
  isPlaying: boolean;
  currentSound?: AmbientSound;
  volume: number;
  currentTime: number;
  duration: number;
  loadSound: (sound: AmbientSound) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  setVolume: (volume: number) => void;
}

const useAudioPlayer = (): UseAudioPlayerReturn => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSound, setCurrentSound] = useState<AmbientSound | undefined>(undefined);
  const [volume, setVolume] = useState<number>(0.5);  // Fixed: Match service default volume
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  
  // Use a ref to track the interval ID to prevent race conditions
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  // Use a ref to track if the component is mounted to prevent state updates on unmounted components
  const isMountedRef = useRef(true);
  // Use a ref to track the current playing state to avoid stale closure in cleanup
  const isPlayingRef = useRef(false);

  // Update the mounted ref when component mounts/unmounts
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadSound = async (sound: AmbientSound): Promise<void> => {
    setCurrentSound(sound);
    setDuration(sound.duration);
    setCurrentTime(0);
    // Use the sound's default volume if available, otherwise use current volume
    setVolume(sound.volume || volume);
  };

  const play = async (): Promise<void> => {
    try {
      // Capture the current sound in a local variable to avoid race conditions
      const soundToPlay = currentSound;
      if (!soundToPlay) return;
      
      const success = await AudioService.play(soundToPlay.id, volume);
      if (success) {
        // Sync with service state immediately after operation using the new getAllState method
        const serviceState = AudioService.getAllState();
        
        // Update all state values together to avoid race conditions
        if (isMountedRef.current) {
          setIsPlaying(serviceState.isPlaying);
          isPlayingRef.current = serviceState.isPlaying; // Update the ref as well
          setVolume(serviceState.volume);
          setCurrentTime(serviceState.currentTime);
          setDuration(serviceState.duration);
          
          // Update current sound if it has changed in the service
          if (serviceState.currentSound) {
            // Find the sound in our ambient sounds data
            const sound = ambientSounds.find(s => s.id === serviceState.currentSound);
            if (sound && isMountedRef.current) {
              setCurrentSound(sound);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const pause = async (): Promise<void> => {
    try {
      const success = AudioService.pause();
      if (success) {
        // Sync with service state immediately after operation using the new getAllState method
        const serviceState = AudioService.getAllState();
        
        // Update all state values together to avoid race conditions
        if (isMountedRef.current) {
          setIsPlaying(serviceState.isPlaying);
          isPlayingRef.current = serviceState.isPlaying; // Update the ref as well
          setVolume(serviceState.volume);
          setCurrentTime(serviceState.currentTime);
          setDuration(serviceState.duration);
          
          // Update current sound if it has changed in the service
          if (serviceState.currentSound) {
            // Find the sound in our ambient sounds data
            const sound = ambientSounds.find(s => s.id === serviceState.currentSound);
            if (sound && isMountedRef.current) {
              setCurrentSound(sound);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error pausing sound:', error);
    }
  };

  const stop = async (): Promise<void> => {
    try {
      const success = AudioService.stop();
      if (success) {
        // Sync with service state immediately after operation using the new getAllState method
        const serviceState = AudioService.getAllState();
        
        // Update all state values together to avoid race conditions
        if (isMountedRef.current) {
          setIsPlaying(serviceState.isPlaying);
          isPlayingRef.current = serviceState.isPlaying; // Update the ref as well
          setVolume(serviceState.volume);
          setCurrentTime(serviceState.currentTime);
          setDuration(serviceState.duration);
          
          // Update current sound if it has changed in the service
          if (serviceState.currentSound) {
            // Find the sound in our ambient sounds data
            const sound = ambientSounds.find(s => s.id === serviceState.currentSound);
            if (sound && isMountedRef.current) {
              setCurrentSound(sound);
            }
          } else {
            // If there's no current sound in the service, clear the current sound in the hook
            if (isMountedRef.current) {
              setCurrentSound(undefined);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error stopping sound:', error);
    }
  };

  const setVolumeHandler = (newVolume: number): void => {
    // Validate volume range
    if (newVolume < 0 || newVolume > 1) {
      console.error('Volume must be between 0 and 1');
      return; // Don't update if invalid
    }
    setVolume(newVolume);
    AudioService.setVolume(newVolume);
  };

  // State sync function
  const syncWithService = () => {
    // Only update state if component is still mounted to prevent memory leaks
    if (!isMountedRef.current) return;
    
    try {
      // Use the new getAllState method to get all values at once to avoid race conditions
      const serviceState = AudioService.getAllState();
      
      // Only update state if component is still mounted to prevent memory leaks
      if (isMountedRef.current) {
        // Update all state values together to avoid race conditions
        setIsPlaying(serviceState.isPlaying);
        isPlayingRef.current = serviceState.isPlaying; // Update the ref as well
        setVolume(serviceState.volume);
        setCurrentTime(serviceState.currentTime);
        setDuration(serviceState.duration);
        
        // Update current sound if it has changed in the service
        if (serviceState.currentSound) {
          // Find the sound in our ambient sounds data
          const sound = ambientSounds.find(s => s.id === serviceState.currentSound);
          if (sound && isMountedRef.current) {
            setCurrentSound(sound);
          }
        } else {
          // If there's no current sound in the service, clear the current sound in the hook
          setCurrentSound(undefined);
        }
      }
    } catch (error) {
      console.error('Error updating audio state:', error);
    }
  };

  // Sync with AudioService state and time
  useEffect(() => {
    const updateState = () => {
      // Only sync when audio is playing to optimize performance
      if (isPlayingRef.current && isMountedRef.current) {
        syncWithService();
      }
    };
    
    // Update every 500ms - more frequent updates for better sync when playing
    intervalIdRef.current = setInterval(updateState, 500);

    // Initialize state from service
    syncWithService();

    // Cleanup function - properly clear the interval
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      // Don't stop the global audio service - it might be used by other components
      // Just mark the component as unmounted to prevent further state updates
      isMountedRef.current = false;
    };
  }, []); // Empty dependency array to run only once

  return {
    isPlaying,
    currentSound,
    volume,
    currentTime,
    duration,
    loadSound,
    play,
    pause,
    stop,
    setVolume: setVolumeHandler,
  };
};

export { useAudioPlayer };