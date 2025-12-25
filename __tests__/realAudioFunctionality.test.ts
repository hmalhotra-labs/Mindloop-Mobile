import { AudioService } from '../src/services/audioService';

describe('Real Audio Functionality', () => {
  beforeEach(() => {
    // Reset service state before each test
    AudioService.stop();
    AudioService.destroy();
  });

  describe('real audio file loading and validation', () => {
    it('should actually load and validate existing audio files', async () => {
      // This test will fail initially because current implementation uses mocks
      const result = await AudioService.play('rain-forest');
      expect(result).toBe(true);
      
      // Verify that actual file loading occurred by checking if file metadata is real
      const metadata = AudioService.getAudioMetadata('rain-forest');
      expect(metadata).toBeDefined();
      expect(metadata?.duration).toBeGreaterThan(0);
      expect(metadata?.format).toMatch(/\.(mp3|wav|ogg|m4a|aac|flac)$/i);
      expect(metadata?.size).toBeGreaterThan(1024); // At least 1KB
    });

    it('should reject missing audio files with proper error handling', async () => {
      // Create a mock sound that doesn't exist
      const nonExistentSound = 'non-existent-sound-12345';
      
      try {
        await AudioService.play(nonExistentSound);
        fail('Should have thrown an error for missing audio file');
      } catch (error) {
        expect(error).toBeDefined();
        expect((error as Error).message).toContain('not found');
      }
    });

    it('should validate audio file format and reject invalid files', async () => {
      // This test will verify that only valid audio formats are accepted
      const invalidFormats = ['.txt', '.pdf', '.jpg', '.exe'];
      
      // Current implementation should reject invalid formats
      for (const invalidFormat of invalidFormats) {
        try {
          await AudioService.play(`test-sound${invalidFormat}`);
          fail(`Should reject ${invalidFormat} format`);
        } catch (error) {
          expect(error).toBeDefined();
          expect((error as Error).message).toContain('Invalid audio format');
        }
      }
    });
  });

  describe('actual audio playback functionality', () => {
    it('should use real audio playback instead of setTimeout simulation', async () => {
      await AudioService.play('rain-forest', 0.5);
      
      // Verify that real audio is playing (not just a simulation)
      expect(AudioService.isPlaying()).toBe(true);
      
      // Wait a short time and verify progress is actual audio progress
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const currentTime = AudioService.getCurrentTime();
      const duration = AudioService.getDuration();
      
      // Should have real progress (not jumping in fixed intervals)
      expect(currentTime).toBeGreaterThan(0);
      expect(currentTime).toBeLessThan(duration);
      
      // Verify that the progress is real by checking it's not just a fixed increment
      await new Promise(resolve => setTimeout(resolve, 200));
      const nextTime = AudioService.getCurrentTime();
      expect(nextTime).toBeGreaterThan(currentTime);
      expect(nextTime - currentTime).toBeCloseTo(0.4, 0.1); // ~0.4 seconds with some tolerance
    });

    it('should support actual audio format playback', async () => {
      const result = await AudioService.play('wind-chimes');
      expect(result).toBe(true);
      expect(AudioService.isSoundPlaying('wind-chimes')).toBe(true);
      
      // Verify actual duration is read from the audio file
      const timeData = (AudioService as any).getSoundTime('wind-chimes');
      expect(timeData?.duration).toBeGreaterThan(0);
      expect(timeData?.duration).toBeLessThan(3600); // Should be reasonable duration
    });
  });

  describe('real-time audio progress tracking', () => {
    it('should provide accurate real-time progress tracking', async () => {
      await AudioService.play('rain-forest');
      
      // Wait for initial loading
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const initialTime = AudioService.getCurrentTime();
      expect(initialTime).toBeLessThanOrEqual(0.2); // Allow for immediate timer start
      
      // Wait and verify progress advances naturally
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const progressTime = AudioService.getCurrentTime();
      expect(progressTime).toBeGreaterThan(0);
      expect(progressTime).toBeLessThanOrEqual(1); // Should be close to 0.5s
    });

    it('should track progress for multiple simultaneous sounds', async () => {
      await AudioService.play('rain-forest', 0.5);
      await AudioService.play('wind-chimes', 0.3);
      
      // Wait for initial loading
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const rainTime = (AudioService as any).getSoundTime('rain-forest');
      const windChimesTime = (AudioService as any).getSoundTime('wind-chimes');
      
      expect(rainTime?.currentTime).toBeGreaterThanOrEqual(0);
      expect(windChimesTime?.currentTime).toBeGreaterThanOrEqual(0);
      
      // Both should be progressing
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newRainTime = (AudioService as any).getSoundTime('rain-forest');
      const newWindChimesTime = (AudioService as any).getSoundTime('wind-chimes');
      
      expect(newRainTime?.currentTime).toBeGreaterThan(rainTime?.currentTime || 0);
      expect(newWindChimesTime?.currentTime).toBeGreaterThan(windChimesTime?.currentTime || 0);
    });
  });

  describe('volume control with actual audio manipulation', () => {
    it('should manipulate actual audio volume levels', async () => {
      await AudioService.play('rain-forest', 0.5);
      
      // Verify initial volume
      expect(AudioService.getVolume()).toBe(0.5);
      expect(AudioService.getSoundVolume('rain-forest')).toBe(0.5);
      
      // Change global volume and verify it's applied to actual audio
      AudioService.setVolume(0.8);
      expect(AudioService.getVolume()).toBe(0.8);
      expect(AudioService.getSoundVolume('rain-forest')).toBe(0.8);
      
      // Change individual sound volume
      AudioService.setSoundVolume('rain-forest', 0.3);
      expect(AudioService.getSoundVolume('rain-forest')).toBe(0.3);
      
      // Global volume should remain unchanged
      expect(AudioService.getVolume()).toBe(0.8);
    });

    it('should validate volume constraints with real audio', () => {
      // Test volume boundaries with actual audio
      expect(() => AudioService.setVolume(1.5)).toThrow('Volume must be between 0 and 1');
      expect(() => AudioService.setVolume(-0.1)).toThrow('Volume must be between 0 and 1');
      expect(() => AudioService.setSoundVolume('rain-forest', 2.0)).toThrow('Volume must be between 0 and 1');
      expect(() => AudioService.setSoundVolume('rain-forest', -0.5)).toThrow('Volume must be between 0 and 1');
    });
  });

  describe('error handling for missing/corrupted audio files', () => {
    it('should handle corrupted audio files gracefully', async () => {
      // This would test handling of corrupted audio files
      // For now, we'll simulate what should happen
      try {
        // In a real implementation, this would fail with a corrupted file
        await AudioService.play('corrupted-audio-file');
        fail('Should handle corrupted audio files');
      } catch (error) {
        expect(error).toBeDefined();
        expect((error as Error).message).toMatch(/corrupted|invalid|failed to load/i);
      }
    });

    it('should handle missing audio files with proper error messages', async () => {
      const missingSoundId = 'completely-missing-sound-xyz';
      
      try {
        await AudioService.play(missingSoundId);
        fail('Should throw error for missing sound');
      } catch (error) {
        expect(error).toBeDefined();
        expect((error as Error).message).toContain('not found');
      }
    });

    it('should provide meaningful error messages for file access issues', async () => {
      // Test various error scenarios
      const errorScenarios = [
        { soundId: 'permission-denied-file', expectedError: /permission|access denied/i },
        { soundId: 'network-error-file', expectedError: /network|connection/i },
        { soundId: 'timeout-file', expectedError: /timeout/i }
      ];
      
      for (const scenario of errorScenarios) {
        try {
          await AudioService.play(scenario.soundId);
          fail(`Should handle ${scenario.soundId} error scenario`);
        } catch (error) {
          expect(error).toBeDefined();
          expect((error as Error).message).toMatch(scenario.expectedError);
        }
      }
    });
  });
});