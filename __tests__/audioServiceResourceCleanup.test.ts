import { AudioService } from '../src/services/audioService';

describe('AudioService Resource Cleanup', () => {
  beforeEach(() => {
    // Reset AudioService state before each test
    AudioService.destroy();
  });

  afterEach(() => {
    // Clean up AudioService after each test
    AudioService.destroy();
  });

  test('interval should be properly cleaned up when all sounds stop', async () => {
    // Play a sound
    await AudioService.play('rain-forest');
    
    // Verify interval is running (by checking that sounds are being tracked)
    let state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(1);
    expect(state.isPlaying).toBe(true);
    
    // Stop the sound
    AudioService.stop();
    
    // Verify all sounds are cleared
    state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(0);
    expect(state.isPlaying).toBe(false);
  });

  test('interval should be properly cleaned up when individual sounds stop', async () => {
    // Play multiple sounds
    await AudioService.play('rain-forest');
    await AudioService.play('ocean-waves');
    
    // Verify both sounds are playing
    let state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(2);
    expect(state.isPlaying).toBe(true);
    
    // Stop one sound
    const stopResult = AudioService.stopSound('rain-forest');
    expect(stopResult).toBe(true);
    
    // Verify one sound remains
    state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(1);
    expect(state.activeSounds).toContain('ocean-waves');
    expect(state.isPlaying).toBe(true);
    
    // Stop the remaining sound
    const stopResult2 = AudioService.stopSound('ocean-waves');
    expect(stopResult2).toBe(true);
    
    // Verify all sounds are cleared
    state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(0);
    expect(state.isPlaying).toBe(false);
  });

  test('should handle rapid play/stop cycles without resource leaks', async () => {
    // Perform multiple rapid play/stop cycles
    for (let i = 0; i < 5; i++) {
      await AudioService.play('rain-forest');
      AudioService.stop();
    }
    
    // Verify clean state
    const state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(0);
    expect(state.isPlaying).toBe(false);
    expect(state.currentSound).toBeNull();
  });

  test('should properly clean up on destroy', async () => {
    // Play multiple sounds
    await AudioService.play('rain-forest');
    await AudioService.play('ocean-waves');
    await AudioService.play('white-noise');
    
    // Verify sounds are active
    let state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(3);
    expect(state.isPlaying).toBe(true);
    
    // Destroy the service
    AudioService.destroy();
    
    // Verify complete cleanup
    state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(0);
    expect(state.isPlaying).toBe(false);
    expect(state.currentSound).toBeNull();
  });

  test('pause should pause all playing sounds', async () => {
    // Play multiple sounds
    await AudioService.play('rain-forest');
    await AudioService.play('ocean-waves');
    
    // Get initial state
    let state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(2);
    expect(state.isPlaying).toBe(true);
    expect(state.currentSound).toBe('ocean-waves'); // Last played
    
    // Pause - should pause all sounds
    AudioService.pause();
    
    // Check state - no sounds should be playing
    state = AudioService.getAllState();
    expect(state.isPlaying).toBe(false); // isPlaying() checks if ANY sound is playing
    
    // Check individual sound states - both should be paused
    const rainForestPlaying = AudioService.isSoundPlaying('rain-forest');
    const oceanWavesPlaying = AudioService.isSoundPlaying('ocean-waves');
    
    // Both sounds should be paused
    expect(rainForestPlaying).toBe(false);
    expect(oceanWavesPlaying).toBe(false);
  });

  test('should handle multiple intervals correctly', async () => {
    // Play sound 1
    await AudioService.play('rain-forest');
    let state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(1);
    
    // Play sound 2
    await AudioService.play('ocean-waves');
    state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(2);
    
    // Stop service
    AudioService.stop();
    state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(0);
    
    // Play again to ensure service works after cleanup
    await AudioService.play('white-noise');
    state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(1);
    expect(state.currentSound).toBe('white-noise');
    
    AudioService.stop();
  });
});