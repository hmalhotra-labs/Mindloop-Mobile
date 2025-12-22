/**
 * State Synchronization Tests for AudioService
 * 
 * These tests demonstrate issues with state management between:
 * - currentSound (tracks the "main" playing sound)
 * - activeSounds (the Map of all playing sounds)
 * - individual sound states
 */

import { AudioService } from '../src/services/audioService';

describe('AudioService State Synchronization Tests', () => {
  beforeEach(() => {
    // Reset AudioService state before each test
    AudioService.destroy();
  });

  afterEach(() => {
    // Clean up AudioService after each test
    AudioService.destroy();
  });

  test('should maintain consistent state between currentSound and activeSounds', async () => {
    // Initially, both should be empty/null
    let state = AudioService.getAllState();
    expect(state.currentSound).toBeNull();
    expect(state.activeSounds.length).toBe(0);

    // After playing a sound, both should reflect the change
    await AudioService.play('rain-forest');
    state = AudioService.getAllState();
    
    // ISSUE: In current implementation, when only one sound plays,
    // currentSound and the single entry in activeSounds should be consistent
    expect(state.currentSound).toBe('rain-forest');
    expect(state.activeSounds).toContain('rain-forest');
    expect(state.activeSounds.length).toBe(1);

    // When playing a second sound (intended behavior), state should be consistent
    await AudioService.play('ocean-waves');
    state = AudioService.getAllState();
    
    // EXPECTED: Both sounds in activeSounds, currentSound reflects most recent or main sound
    expect(state.activeSounds.length).toBe(2);
    expect(state.activeSounds).toContain('rain-forest');
    expect(state.activeSounds).toContain('ocean-waves');
    // The exact behavior for currentSound with multiple sounds needs to be defined
  });

  test('should properly handle state when stopping individual sounds', async () => {
    await AudioService.play('rain-forest');
    await AudioService.play('ocean-waves');
    await AudioService.play('white-noise');
    
    let state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(3);
    
    // ISSUE: Current implementation stops the current sound only
    // EXPECTED: Need proper mechanism to stop individual sounds
    AudioService.stop();
    state = AudioService.getAllState();
    
    // For now, testing what happens with current implementation
    // This reveals the state inconsistency issue
  });

  test('should maintain isPlaying consistency with active sounds', async () => {
    expect(AudioService.isPlaying()).toBe(false);
    
    await AudioService.play('rain-forest');
    expect(AudioService.isPlaying()).toBe(true);
    
    await AudioService.play('ocean-waves');
    expect(AudioService.isPlaying()).toBe(true); // Should remain true
    
    // ISSUE: When sounds are stopped individually, isPlaying should reflect actual state
    AudioService.stop(); // Current implementation
    expect(AudioService.isPlaying()).toBe(false); // Should be false when no sounds active
    
    // But with multiple sounds, if we could stop just one, isPlaying should remain true
  });

  test('should properly update state when all sounds are stopped', async () => {
    await AudioService.play('rain-forest');
    await AudioService.play('ocean-waves');
    
    let state = AudioService.getAllState();
    expect(state.activeSounds.length).toBeGreaterThan(0);
    expect(AudioService.isPlaying()).toBe(true);
    
    // Stop all should clear all state
    AudioService.stopAll();
    state = AudioService.getAllState();
    
    expect(state.activeSounds.length).toBe(0);
    expect(state.currentSound).toBeNull();
    expect(AudioService.isPlaying()).toBe(false);
  });

  test('should handle volume control consistently across all sounds', async () => {
    await AudioService.play('rain-forest');
    await AudioService.play('ocean-waves');
    
    // Set global volume
    AudioService.setVolume(0.8);
    const globalVolume = AudioService.getVolume();
    expect(globalVolume).toBe(0.8);
    
    // ISSUE: If multiple sounds were supported, they should all respect the global volume
    // but currently only the current sound exists in the map
  });

  test('should maintain proper state during rapid play/stop cycles', async () => {
    // Simulate rapid user interactions that could cause state inconsistency
    for (let i = 0; i < 5; i++) {
      await AudioService.play('rain-forest');
      await AudioService.play('ocean-waves');
      AudioService.stop();
      await new Promise(resolve => setTimeout(resolve, 10)); // Small delay
    }
    
    const state = AudioService.getAllState();
    // ISSUE: Current implementation might have inconsistent state after rapid operations
    // The cleanup might not work properly
  });

  test('should prevent orphaned entries in playingSounds Map', async () => {
    // This test looks for entries in the Map that should have been cleaned up
    await AudioService.play('rain-forest');
    await AudioService.play('ocean-waves');
    
    // Simulate what happens when sounds finish playing naturally
    // or when cleanup should occur
    const state = AudioService.getAllState();
    
    // ISSUE: The current implementation should ensure no orphaned entries exist
    // but with the current design, there shouldn't be any with single sound playback
    // However, if we implement proper multiple sound support, this becomes critical
  });
});