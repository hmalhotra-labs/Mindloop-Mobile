import { AudioService } from '../src/services/audioService';

describe('AudioService', () => {
  beforeEach(() => {
    // Reset any state before each test
    AudioService.stop();
  });
  
  afterEach(() => {
    // Clean up the interval after each test
    AudioService.destroy();
  });

  describe('basic functionality', () => {
    it('should be able to play ambient sounds', async () => {
      const result = await AudioService.play('rain-forest');
      expect(result).toBe(true);
    });

    it('should be able to pause sound playback', () => {
      AudioService.pause();
      expect(AudioService.isPlaying()).toBe(false);
    });

    it('should be able to stop sound playback', () => {
      AudioService.stop();
      expect(AudioService.isPlaying()).toBe(false);
    });

    it('should be able to set volume level', () => {
      AudioService.setVolume(0.7);
      expect(AudioService.getVolume()).toBe(0.7);
    });

    it('should track current playing sound', () => {
      expect(AudioService.getCurrentSound()).toBeNull();
    });
  });

  describe('sound mixing', () => {
    it('should support playing multiple sounds simultaneously', async () => {
      const result1 = await AudioService.play('rain-forest', 0.5);
      const result2 = await AudioService.play('wind-chimes', 0.3);
      
      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(AudioService.isPlaying()).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should handle invalid sound IDs gracefully', async () => {
      const result = await AudioService.play('invalid-sound');
      expect(result).toBe(false);
    });

    it('should handle invalid volume levels', () => {
      expect(() => AudioService.setVolume(1.5)).toThrow();
      expect(() => AudioService.setVolume(-0.1)).toThrow();
    });
  });
});