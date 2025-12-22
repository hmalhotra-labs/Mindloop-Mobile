// Audio service for Mindloop mindfulness app
// Handles ambient sound playback, volume control, and sound mixing
import { ambientSounds } from '../data/ambientSounds';
import { audioFileManager, AudioLoadOptions } from './audioFileManager';

// Constants for audio service configuration
const UPDATE_INTERVAL_MS = 100; // Update every 100ms for more accurate timing
const DEFAULT_VOLUME = 0.5;

// For React Native, we would typically use react-native-track-player or react-native-sound
// For now, we'll create a realistic mock that simulates the actual audio functionality
class AudioServiceInstance {
  private playingSounds: Map<string, { isPlaying: boolean; volume: number; duration: number; currentTime: number }> = new Map();
  private globalVolume: number = DEFAULT_VOLUME;
  private currentSound: string | null = null;
  private intervalId: NodeJS.Timeout | null = null;

  async play(soundId: string, volume: number = DEFAULT_VOLUME, options?: AudioLoadOptions): Promise<boolean> {
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

      // Load audio file using the file manager
      const audioMetadata = await audioFileManager.loadAudioFile(soundId, sound.filePath, options);

      // ISSUE: Previous implementation removed previous sounds, preventing mixing
      // FIX: Add new sound without removing existing ones to support sound mixing
      this.playingSounds.set(soundId, {
        isPlaying: true,
        volume: Math.min(1, Math.max(0, volume)),
        duration: audioMetadata.duration,
        currentTime: 0
      });
      
      // Update currentSound to track the most recently played sound
      // This maintains backward compatibility while enabling multiple sounds
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
      let pausedAny = false;
      
      // Pause all currently playing sounds
      for (const [soundId, data] of this.playingSounds) {
        if (data.isPlaying) {
          this.playingSounds.set(soundId, { ...data, isPlaying: false });
          pausedAny = true;
        }
      }
      
      return pausedAny;
    } catch (error) {
      console.error('Error in AudioService.pause:', error);
      return false;
    }
  }

  stop(): boolean {
    try {
      // For backward compatibility, stop all sounds when stop() is called
      // This maintains the original behavior where stop() would clear all sounds
      this.playingSounds.clear();
      this.currentSound = null;
      
      // Clear the interval if running
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      return true;
    } catch (error) {
      console.error('Error in AudioService.stop:', error);
      return false;
    }
  }
  
  /**
   * Stop a specific sound by ID
   */
  stopSound(soundId: string): boolean {
    try {
      if (this.playingSounds.has(soundId)) {
        this.playingSounds.delete(soundId);
        
        // If we stopped the current sound, update currentSound
        if (this.currentSound === soundId) {
          const remainingSounds = Array.from(this.playingSounds.keys());
          if (remainingSounds.length > 0) {
            // Set currentSound to the first remaining sound
            this.currentSound = remainingSounds[0];
          } else {
            this.currentSound = null;
          }
        }
        
        // Clear the interval if no sounds are playing
        if (this.playingSounds.size === 0 && this.intervalId) {
          clearInterval(this.intervalId);
          this.intervalId = null;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error in AudioService.stopSound:', error);
      return false;
    }
  }
  
  /**
  /**
   * Stop all currently playing sounds
   */
  stopAll(): boolean {
    try {
      // Clear all sounds from the map
      this.playingSounds.clear();
      
      // Reset current sound
      this.currentSound = null;
      
      // Clear the interval if running
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      return true;
    } catch (error) {
      console.error('Error in AudioService.stopAll:', error);
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
      this.globalVolume = DEFAULT_VOLUME; // Reset to default volume
    } catch (error) {
      console.error('Error in AudioService.destroy:', error);
    }
  }

  private updatePlaybackTime(): void {
    try {
      let anyPlaying = false;
      
      // Iterate through the map and update playing sounds directly
      for (const [soundId, data] of this.playingSounds) {
        if (data.isPlaying) {
          anyPlaying = true;
          // Update time based on the interval (100ms = 0.1s)
          const newTime = Math.min(data.currentTime + (UPDATE_INTERVAL_MS / 1000), data.duration);
          if (newTime >= data.duration) {
            // For ambient sounds, we'll loop back to beginning
            this.playingSounds.set(soundId, { ...data, currentTime: 0 });
          } else {
            this.playingSounds.set(soundId, { ...data, currentTime: newTime });
          }
        }
      }
      
      // Clear interval if no sounds are playing
      if (!anyPlaying && this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    } catch (error) {
      console.error('Error in AudioService.updatePlaybackTime:', error);
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
  play: async (soundId: string, volume: number = DEFAULT_VOLUME, options?: AudioLoadOptions): Promise<boolean> => {
    return audioServiceInstance.play(soundId, volume, options);
  },
  pause: (): boolean => {
    return audioServiceInstance.pause();
  },
  stop: (): boolean => {
    return audioServiceInstance.stop();
  },
  stopSound: (soundId: string): boolean => {
    return audioServiceInstance.stopSound(soundId);
  },
  stopAll: (): boolean => {
    return audioServiceInstance.stopAll();
  },
  setVolume: (volume: number): void => {
    audioServiceInstance.setVolume(volume);
  },
  isPlaying: (): boolean => {
    return audioServiceInstance.isPlaying();
  },
  isSoundPlaying: (soundId: string): boolean => {
    return audioServiceInstance.isSoundPlaying(soundId);
  },
  getVolume: (): number => {
    return audioServiceInstance.getVolume();
  },
  getSoundVolume: (soundId: string): number => {
    return audioServiceInstance.getSoundVolume(soundId);
  },
  setSoundVolume: (soundId: string, volume: number): void => {
    audioServiceInstance.setSoundVolume(soundId, volume);
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
  },
  // Audio file management methods
  preloadSounds: async (soundIds: string[], options?: AudioLoadOptions): Promise<void> => {
    const sounds = soundIds.map(id => {
      const sound = ambientSounds.find(s => s.id === id);
      if (!sound) throw new Error(`Sound not found: ${id}`);
      return { id, filePath: sound.filePath };
    });
    await audioFileManager.preloadAudioFiles(sounds, options);
  },
  downloadSound: async (soundId: string, url: string, onProgress?: (progress: any) => void): Promise<string> => {
    return audioFileManager.downloadAudioFile(soundId, url, onProgress);
  },
  getDownloadProgress: (soundId: string) => {
    return audioFileManager.getDownloadProgress(soundId);
  },
  getAudioMetadata: (soundId: string) => {
    return audioFileManager.getAudioMetadata(soundId);
  },
  isSoundCached: (soundId: string): boolean => {
    return audioFileManager.isSoundCached(soundId);
  },
  clearAudioCache: async (): Promise<void> => {
    await audioFileManager.clearCache();
  },
  getCacheStats: () => {
    return audioFileManager.getCacheStats();
  }
};