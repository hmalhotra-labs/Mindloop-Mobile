/**
 * Memory Leak Fix Verification Tests for AudioService
 *
 * These tests verify that memory leaks have been fixed in the AudioService implementation:
 * 1. Map cleanup when sounds are stopped
 * 2. Proper resource cleanup for multiple simultaneous sounds
 * 3. Timer management issues resolved
 */

import { AudioService } from '../src/services/audioService';
import { ambientSounds } from '../src/data/ambientSounds';

describe('Memory Leak Fixes in AudioService', () => {
  beforeEach(() => {
    // Reset AudioService state before each test
    AudioService.destroy();
  });

  afterEach(() => {
    // Clean up AudioService after each test
    AudioService.destroy();
  });

  describe('Map Memory Leak Fixes - Core Issue', () => {
    test('should properly clean up sounds when stopped', async () => {
      // Start with empty map
      let state = AudioService.getAllState();
      expect(state.activeSounds.length).toBe(0);
      
      // Play first sound
      await AudioService.play('rain-forest');
      state = AudioService.getAllState();
      expect(state.activeSounds.length).toBe(1);
      expect(state.activeSounds).toContain('rain-forest');
      
      // Play second sound - with sound mixing, both should be active
      await AudioService.play('ocean-waves');
      state = AudioService.getAllState();
      
      // Both sounds should be in the Map as we now support sound mixing
      expect(state.activeSounds.length).toBe(2);
      expect(state.activeSounds).toContain('rain-forest');
      expect(state.activeSounds).toContain('ocean-waves');
      expect(state.currentSound).toBe('ocean-waves');
      
      // Stop should remove all sounds from the Map
      AudioService.stop();
      state = AudioService.getAllState();
      
      // All sounds should be cleaned up - no memory leak!
      expect(state.activeSounds.length).toBe(0);
      expect(state.currentSound).toBeNull();
    });

    test('should properly clean up multiple sounds', async () => {
      // Play multiple sounds in sequence
      const soundIds = ['rain-forest', 'ocean-waves', 'white-noise', 'wind-chimes'];
      
      for (const soundId of soundIds) {
        await AudioService.play(soundId);
      }
      
      let state = AudioService.getAllState();
      
      // All sounds should be in the Map as we support sound mixing
      expect(state.activeSounds.length).toBe(soundIds.length);
      expect(state.currentSound).toBe('wind-chimes'); // Last sound played
      
      // Stop should remove all sounds from the Map
      AudioService.stop();
      state = AudioService.getAllState();
      
      // All sounds should be cleaned up - no memory leak!
      expect(state.activeSounds.length).toBe(0);
      expect(state.activeSounds).not.toContain('wind-chimes');
      expect(state.activeSounds).not.toContain('rain-forest');
      expect(state.activeSounds).not.toContain('ocean-waves');
      expect(state.activeSounds).not.toContain('white-noise');
    });

    test('should demonstrate that destroy() properly cleans up all resources', async () => {
      // Create multiple sounds
      await AudioService.play('rain-forest');
      await AudioService.play('ocean-waves');
      await AudioService.play('white-noise');
      
      let state = AudioService.getAllState();
      expect(state.activeSounds.length).toBe(3);
      
      // destroy() should clean up everything
      AudioService.destroy();
      state = AudioService.getAllState();
      
      // All memory should be cleared
      expect(state.activeSounds.length).toBe(0);
      expect(state.currentSound).toBeNull();
    });
  });

  describe('State Management Fixes', () => {
    test('should maintain consistent state between currentSound and activeSounds', async () => {
      await AudioService.play('rain-forest');
      await AudioService.play('ocean-waves');
      
      const state = AudioService.getAllState();
      
      // Both sounds should be tracked properly in sound mixing mode
      expect(state.currentSound).toBe('ocean-waves');
      expect(state.activeSounds).toContain('rain-forest');
      expect(state.activeSounds).toContain('ocean-waves');
      
      // isPlaying() should reflect actual playing state
      const isPlaying = AudioService.isPlaying();
      expect(isPlaying).toBe(true);
      
      // Current sound should be properly tracked
      const currentSound = AudioService.getCurrentSound();
      expect(currentSound).toBe('ocean-waves');
    });

    test('should properly manage volume control for all sounds', async () => {
      await AudioService.play('rain-forest');
      await AudioService.play('ocean-waves');
      
      // Set volume - should affect all sounds
      AudioService.setVolume(0.8);
      
      // Check global volume is set
      const globalVolume = AudioService.getVolume();
      expect(globalVolume).toBe(0.8);
      
      // All sounds should be properly managed in the state
      const state = AudioService.getAllState();
      expect(state.activeSounds).toContain('rain-forest');
      expect(state.activeSounds).toContain('ocean-waves');
    });
  });

  describe('Timer Management Fixes', () => {
    test('should properly manage timer cleanup', async () => {
      // Mock timers to track creation/cleanup
      const originalSetInterval = global.setInterval;
      const originalClearInterval = global.clearInterval;
      
      let intervalCreated = false;
      let intervalCleared = false;
      
      (global as any).setInterval = jest.fn(() => {
        intervalCreated = true;
        return { id: 1 };
      });
      
      (global as any).clearInterval = jest.fn(() => {
        intervalCleared = true;
      });
      
      // Play a sound
      await AudioService.play('rain-forest');
      
      // Timer should be created
      expect(intervalCreated).toBe(true);
      
      // Stop the sound
      AudioService.stop();
      
      // Timer should be cleared when no sounds are playing
      expect(intervalCleared).toBe(true);
      
      // Restore original functions
      (global as any).setInterval = originalSetInterval;
      (global as any).clearInterval = originalClearInterval;
    });
  });

  describe('Memory Leak Prevention Verification', () => {
    test('should not accumulate memory leaks through repeated operations', async () => {
      let maxMapSize = 0;
      
      // Simulate app usage with proper cleanup
      for (let cycle = 0; cycle < 5; cycle++) {
        // Play multiple sounds in each cycle
        await AudioService.play('rain-forest');
        await AudioService.play('ocean-waves');
        
        const state = AudioService.getAllState();
        maxMapSize = Math.max(maxMapSize, state.activeSounds.length);
        
        // Stop removes all sounds
        AudioService.stop();
        
        // After stop, map should be empty
        const postStopState = AudioService.getAllState();
        expect(postStopState.activeSounds.length).toBe(0);
      }
      
      const finalState = AudioService.getAllState();
      
      // Map size should be 0 - no memory leaks!
      expect(finalState.activeSounds.length).toBe(0);
    });

    test('should verify proper cleanup prevents memory leaks', async () => {
      // Create multiple sounds
      for (let i = 0; i < 3; i++) {
        await AudioService.play('rain-forest');
        await AudioService.play('ocean-waves');
        AudioService.stop(); // Removes all sounds
      }
      
      let state = AudioService.getAllState();
      expect(state.activeSounds.length).toBe(0); // No memory leak exists
      
      // Proper cleanup
      AudioService.destroy();
      
      state = AudioService.getAllState();
      expect(state.activeSounds.length).toBe(0); // Memory remains clean
    });
  });
});