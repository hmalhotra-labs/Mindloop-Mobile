import { AudioService } from '../src/services/audioService';

describe('AudioService Comprehensive Fix Verification', () => {
  beforeEach(() => {
    // Reset AudioService state before each test
    AudioService.destroy();
  });

  afterEach(() => {
    // Clean up AudioService after each test
    AudioService.destroy();
  });

  test('should support sound mixing with proper resource cleanup', async () => {
    // Play multiple sounds to test sound mixing
    await AudioService.play('rain-forest');
    await AudioService.play('ocean-waves');
    await AudioService.play('wind-chimes');
    
    // Verify all sounds are active
    const state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(3);
    expect(state.activeSounds).toContain('rain-forest');
    expect(state.activeSounds).toContain('ocean-waves');
    expect(state.activeSounds).toContain('wind-chimes');
    expect(state.currentSound).toBe('wind-chimes'); // Last played
    expect(state.isPlaying).toBe(true);
    
    // Stop all sounds
    AudioService.stop();
    
    // Verify cleanup
    const finalState = AudioService.getAllState();
    expect(finalState.activeSounds.length).toBe(0);
    expect(finalState.isPlaying).toBe(false);
    expect(finalState.currentSound).toBeNull();
  });

  test('pause should pause all playing sounds', async () => {
    // Play multiple sounds
    await AudioService.play('rain-forest');
    await AudioService.play('ocean-waves');
    
    // Verify both are playing
    let state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(2);
    expect(state.isPlaying).toBe(true);
    
    // Check individual sound states
    expect(AudioService.isSoundPlaying('rain-forest')).toBe(true);
    expect(AudioService.isSoundPlaying('ocean-waves')).toBe(true);
    
    // Pause all sounds
    AudioService.pause();
    
    // Verify all sounds are paused
    state = AudioService.getAllState();
    expect(state.isPlaying).toBe(false); // No sounds should be playing
    
    // Check individual sound states
    expect(AudioService.isSoundPlaying('rain-forest')).toBe(false);
    expect(AudioService.isSoundPlaying('ocean-waves')).toBe(false);
    
    // Verify sounds are still in the system (just paused)
    expect(state.activeSounds.length).toBe(2);
  });

  test('individual sound control should work properly', async () => {
    // Play multiple sounds
    await AudioService.play('rain-forest');
    await AudioService.play('ocean-waves');
    await AudioService.play('white-noise');
    
    // Verify all are playing
    let state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(3);
    expect(state.isPlaying).toBe(true);
    
    // Stop one sound
    const result = AudioService.stopSound('ocean-waves');
    expect(result).toBe(true);
    
    // Verify only that sound was removed
    state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(2);
    expect(state.activeSounds).toContain('rain-forest');
    expect(state.activeSounds).toContain('white-noise');
    expect(state.activeSounds).not.toContain('ocean-waves');
    
    // Other sounds should still be playing
    expect(state.isPlaying).toBe(true);
  });

  test('should handle rapid operations without memory leaks', async () => {
    // Perform rapid operations to test for resource leaks
    for (let i = 0; i < 10; i++) {
      await AudioService.play(`sound-${i % 3}`); // Cycle through 3 different sounds
      AudioService.pause();
      AudioService.stop();
    }
    
    // Verify clean state after operations
    const state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(0);
    expect(state.isPlaying).toBe(false);
    expect(state.currentSound).toBeNull();
  });

  test('volume control should work for individual sounds', async () => {
    // Play multiple sounds with different volumes
    await AudioService.play('rain-forest', 0.3);
    await AudioService.play('ocean-waves', 0.7);
    
    // Verify initial volumes
    expect(AudioService.getSoundVolume('rain-forest')).toBe(0.3);
    expect(AudioService.getSoundVolume('ocean-waves')).toBe(0.7);
    
    // Change individual sound volumes
    AudioService.setSoundVolume('rain-forest', 0.5);
    AudioService.setSoundVolume('ocean-waves', 0.9);
    
    // Verify volumes changed correctly
    expect(AudioService.getSoundVolume('rain-forest')).toBe(0.5);
    expect(AudioService.getSoundVolume('ocean-waves')).toBe(0.9);
  });

  test('global volume control should work with multiple sounds', async () => {
    // Play multiple sounds
    await AudioService.play('rain-forest', 0.3);
    await AudioService.play('ocean-waves', 0.7);
    
    // Change global volume
    AudioService.setVolume(0.8);
    
    // Verify all sounds reflect the new global volume
    expect(AudioService.getVolume()).toBe(0.8);
    // Note: The current implementation updates all sounds to the new volume when setVolume is called
    expect(AudioService.getSoundVolume('rain-forest')).toBe(0.8);
    expect(AudioService.getSoundVolume('ocean-waves')).toBe(0.8);
  });

  test('destroy should completely clean up all resources', async () => {
    // Play sounds to create state
    await AudioService.play('rain-forest');
    await AudioService.play('ocean-waves');
    
    // Verify state exists
    let state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(2);
    expect(state.isPlaying).toBe(true);
    
    // Destroy the service
    AudioService.destroy();
    
    // Verify complete cleanup
    state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(0);
    expect(state.isPlaying).toBe(false);
    expect(state.currentSound).toBeNull();
    expect(state.currentTime).toBe(0);
    expect(state.duration).toBe(0);
    // Note: Volume is not reset by destroy() - it maintains the current global volume
    // To reset to default, we need to call setVolume() or reinitialize the service
  });

  test('timer should be properly managed during sound operations', async () => {
    // Play a sound and verify timer starts
    await AudioService.play('rain-forest');
    let state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(1);
    expect(state.isPlaying).toBe(true);
    
    // Stop the sound and verify timer stops when no sounds are playing
    AudioService.stop();
    state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(0);
    expect(state.isPlaying).toBe(false);
    
    // Play again to ensure timer restarts properly
    await AudioService.play('ocean-waves');
    state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(1);
    expect(state.isPlaying).toBe(true);
    
    AudioService.stop();
  });

  test('edge case: pause when no sounds are playing', () => {
    // Should handle pausing when no sounds are playing
    const result = AudioService.pause();
    expect(result).toBe(false); // No sounds to pause
    
    const state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(0);
    expect(state.isPlaying).toBe(false);
  });

  test('edge case: stop when no sounds are playing', () => {
    // Should handle stopping when no sounds are playing
    const result = AudioService.stop();
    expect(result).toBe(true); // Should return true even if nothing to stop
    
    const state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(0);
    expect(state.isPlaying).toBe(false);
  });
});