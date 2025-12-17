// Audio service for Mindloop mindfulness app
// Handles ambient sound playback, volume control, and sound mixing
import { ambientSounds } from '../data/ambientSounds';

// Constants for audio service configuration
const UPDATE_INTERVAL_MS = 100; // Update every 100ms for more accurate timing
const DEFAULT_VOLUME = 0.5;

// For React Native, we would typically use react-native-sound or react-native-track-player
// For now, we'll create a more realistic mock that simulates the actual audio functionality
class AudioServiceInstance {
  private playingSounds: Map<string, { isPlaying: boolean; volume: number; duration: number; currentTime: number }> = new Map();
  private globalVolume: number = DEFAULT_VOLUME;
  private currentSound: string | null = null;
  private intervalId: NodeJS.Timeout | null = null;
  private isUpdating: boolean = false; // Flag to prevent race conditions during updates

  async play(soundId: string, volume: number = DEFAULT_VOLUME): Promise<boolean> {
    try {
      // Validate volume parameter
      if (volume < 0 || volume > 1) {
        throw new Error('Volume must be between 0 and 1');
      }

      // Validate against actual ambient sounds data
      const sound = ambientSounds.find(s => s.id === soundId);
      if (!sound) {
        return false;
      }

      // Simulate loading an audio file and setting its properties
      const duration = sound.duration; // Use actual duration from sound data
      this.playingSounds.set(soundId, {
        isPlaying: true,
        volume: Math.min(1, Math.max(0, volume)),
        duration,
        currentTime: 0
      });
      this.currentSound = soundId;
      
      // Start a timer to simulate audio playback progress if not already running
      if (!this.intervalId) {
        this.intervalId = setInterval(() => {
          this.updatePlaybackTime();
        }, UPDATE_INTERVAL_MS);
      }
      
      return true;
    } catch (error) {
      console.error('Error in AudioService.play:', error);
      throw error;
    }
  }

  pause(): boolean {
    try {
      if (this.currentSound) {
        const soundData = this.playingSounds.get(this.currentSound);
        if (soundData) {
          this.playingSounds.set(this.currentSound, { ...soundData, isPlaying: false });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error in AudioService.pause:', error);
      return false;
    }
  }

  stop(): boolean {
    try {
      if (this.currentSound) {
        this.playingSounds.delete(this.currentSound);
        this.currentSound = null;
        
        // Clear the interval if no sounds are playing
        if (this.playingSounds.size === 0 && this.intervalId) {
          clearInterval(this.intervalId);
          this.intervalId = null;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error in AudioService.stop:', error);
      return false;
    }
  }

  // Add a method to properly clean up the service
  destroy(): void {
    try {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      this.playingSounds.clear();
      this.currentSound = null;
    } catch (error) {
      console.error('Error in AudioService.destroy:', error);
    }
  }

  private updatePlaybackTime(): void {
    // Use a flag to prevent race conditions during updates
    if (this.isUpdating) {
      return; // Skip this update if already updating
    }
    
    try {
      this.isUpdating = true;
      
      // Collect all updates in an array to avoid modifying the map during iteration
      const updates: Array<{ soundId: string; newData: { isPlaying: boolean; volume: number; duration: number; currentTime: number } }> = [];
      let anyPlaying = false;
      
      // Iterate through the map without modifying it during iteration
      for (const [soundId, data] of this.playingSounds) {
        if (data.isPlaying) {
          anyPlaying = true;
          // Update time based on the interval (100ms = 0.1s)
          const newTime = Math.min(data.currentTime + (UPDATE_INTERVAL_MS / 1000), data.duration);
          if (newTime >= data.duration) {
            // For ambient sounds, we'll loop back to beginning
            updates.push({ soundId, newData: { ...data, currentTime: 0 } });
          } else {
            updates.push({ soundId, newData: { ...data, currentTime: newTime } });
          }
        }
      }
      
      // Apply all updates atomically after the iteration is complete
      for (const update of updates) {
        this.playingSounds.set(update.soundId, update.newData);
      }
      
      // Clear interval if no sounds are playing - check again after processing all sounds
      if (!anyPlaying && this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    } catch (error) {
      console.error('Error in AudioService.updatePlaybackTime:', error);
    } finally {
      this.isUpdating = false;
    }
  }

  isPlaying(): boolean {
    try {
      for (const [_, data] of this.playingSounds) {
        if (data.isPlaying) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error in AudioService.isPlaying:', error);
      return false;
    }
  }

  isSoundPlaying(soundId: string): boolean {
    try {
      const soundData = this.playingSounds.get(soundId);
      return soundData ? soundData.isPlaying : false;
    } catch (error) {
      console.error('Error in AudioService.isSoundPlaying:', error);
      return false;
    }
  }

  setVolume(volume: number): void {
    try {
      if (volume < 0 || volume > 1) {
        throw new Error('Volume must be between 0 and 1');
      }
      this.globalVolume = volume;
      
      // Update volume for all currently playing sounds
      this.playingSounds.forEach((data, soundId) => {
        this.playingSounds.set(soundId, { ...data, volume: Math.min(1, Math.max(0, volume)) });
      });
    } catch (error) {
      console.error('Error in AudioService.setVolume:', error);
      throw error;
    }
  }

  setSoundVolume(soundId: string, volume: number): void {
    try {
      if (volume < 0 || volume > 1) {
        throw new Error('Volume must be between 0 and 1');
      }
      
      const soundData = this.playingSounds.get(soundId);
      if (soundData) {
        this.playingSounds.set(soundId, { ...soundData, volume: Math.min(1, Math.max(0, volume)) });
      }
    } catch (error) {
      console.error('Error in AudioService.setSoundVolume:', error);
      throw error;
    }
  }

  getVolume(): number {
    try {
      return this.globalVolume;
    } catch (error) {
      console.error('Error in AudioService.getVolume:', error);
      return DEFAULT_VOLUME;
    }
  }

  getSoundVolume(soundId: string): number {
    try {
      const soundData = this.playingSounds.get(soundId);
      return soundData ? soundData.volume : 0;
    } catch (error) {
      console.error('Error in AudioService.getSoundVolume:', error);
      return 0;
    }
  }

  getCurrentSound(): string | null {
    try {
      return this.currentSound;
    } catch (error) {
      console.error('Error in AudioService.getCurrentSound:', error);
      return null;
    }
  }

  getCurrentTime(): number {
    try {
      const currentSound = this.getCurrentSound();
      if (currentSound) {
        const timeData = this.getSoundTime(currentSound);
        return timeData ? timeData.currentTime : 0;
      }
      return 0;
    } catch (error) {
      console.error('Error in AudioService.getCurrentTime:', error);
      return 0;
    }
  }

  getDuration(): number {
    try {
      const currentSound = this.getCurrentSound();
      if (currentSound) {
        const timeData = this.getSoundTime(currentSound);
        return timeData ? timeData.duration : 0;
      }
      return 0;
    } catch (error) {
      console.error('Error in AudioService.getDuration:', error);
      return 0;
    }
  }

  getSoundTime(soundId: string): { currentTime: number; duration: number } | null {
    try {
      const soundData = this.playingSounds.get(soundId);
      if (soundData) {
        return { currentTime: soundData.currentTime, duration: soundData.duration };
      }
      return null;
    } catch (error) {
      console.error('Error in AudioService.getSoundTime:', error);
      return null;
    }
  }

  getActiveSounds(): string[] {
    try {
      return Array.from(this.playingSounds.keys());
    } catch (error) {
      console.error('Error in AudioService.getActiveSounds:', error);
      return [];
    }
  }

  // Add a method to get all current state at once to prevent race conditions
  getAllState(): {
    isPlaying: boolean;
    currentSound: string | null;
    currentTime: number;
    duration: number;
    volume: number;
    activeSounds: string[];
  } {
    try {
      return {
        isPlaying: this.isPlaying(),
        currentSound: this.getCurrentSound(),
        currentTime: this.getCurrentTime(),
        duration: this.getDuration(),
        volume: this.getVolume(),
        activeSounds: this.getActiveSounds()
      };
    } catch (error) {
      console.error('Error in AudioService.getAllState:', error);
      return {
        isPlaying: false,
        currentSound: null,
        currentTime: 0,
        duration: 0,
        volume: DEFAULT_VOLUME,
        activeSounds: []
      };
    }
  }
}

// Create a singleton instance
const audioServiceInstance = new AudioServiceInstance();

// Export static methods that match the test expectations
export const AudioService = {
  play: async (soundId: string, volume: number = DEFAULT_VOLUME): Promise<boolean> => {
    return audioServiceInstance.play(soundId, volume);
  },
  pause: (): boolean => {
    return audioServiceInstance.pause();
  },
  stop: (): boolean => {
    return audioServiceInstance.stop();
  },
  setVolume: (volume: number): void => {
    audioServiceInstance.setVolume(volume);
  },
  isPlaying: (): boolean => {
    return audioServiceInstance.isPlaying();
  },
  getVolume: (): number => {
    return audioServiceInstance.getVolume();
  },
  getCurrentSound: (): string | null => {
    return audioServiceInstance.getCurrentSound();
  },
  getCurrentTime: (): number => {
    return audioServiceInstance.getCurrentTime();
  },
  getDuration: (): number => {
    return audioServiceInstance.getDuration();
  },
  // Add destroy method to allow proper cleanup
  destroy: (): void => {
    audioServiceInstance.destroy();
  },
  // Add method to get all state at once to prevent race conditions
  getAllState: (): {
    isPlaying: boolean;
    currentSound: string | null;
    currentTime: number;
    duration: number;
    volume: number;
    activeSounds: string[];
  } => {
    return audioServiceInstance.getAllState();
  }
};