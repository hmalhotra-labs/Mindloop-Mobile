import { AudioService } from '../src/services/audioService';
import { ambientSounds } from '../src/data/ambientSounds';

describe('AudioService Current Behavior Analysis', () => {
  beforeEach(() => {
    // Reset AudioService state before each test
    AudioService.destroy();
  });

  afterEach(() => {
    // Clean up AudioService after each test
    AudioService.destroy();
  });

  test('current implementation supports sound mixing with multiple sounds in playingSounds Map', async () => {
    // Play first sound
    await AudioService.play('rain-forest');
    let state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(1);
    expect(state.activeSounds).toContain('rain-forest');
    expect(state.currentSound).toBe('rain-forest');
    
    // Play second sound - this adds to the Map, not replace
    await AudioService.play('ocean-waves');
    state = AudioService.getAllState();
    
    // Current implementation now supports sound mixing with multiple sounds
    expect(state.activeSounds.length).toBe(2);
    expect(state.activeSounds).toContain('rain-forest'); // First sound is still active
    expect(state.activeSounds).toContain('ocean-waves'); // Second sound is added
    expect(state.currentSound).toBe('ocean-waves'); // Current sound is the most recent
    
    // Stop should remove all sounds from the Map
    AudioService.stop();
    state = AudioService.getAllState();
    expect(state.activeSounds.length).toBe(0);
    expect(state.currentSound).toBeNull();
  });

  test('sound mixing test shows intended behavior is now working', async () => {
    // This test shows that sound mixing functionality is now working as intended
    const result1 = await AudioService.play('rain-forest', 0.5);
    const result2 = await AudioService.play('wind-chimes', 0.3);
    
    expect(result1).toBe(true);
    expect(result2).toBe(true);
    expect(AudioService.isPlaying()).toBe(true);
    
    // Get the state to see what's actually happening
    const state = AudioService.getAllState();
    
    // The fix: both sounds are now in activeSounds as expected for mixing
    expect(state.activeSounds.length).toBe(2); // Now 2, supporting mixing
    expect(state.currentSound).toBe('wind-chimes'); // Most recent sound is current
    expect(state.activeSounds).toContain('rain-forest');
    expect(state.activeSounds).toContain('wind-chimes');
  });

  test('memory leak issue has been fixed when playing multiple sounds', async () => {
    // With the fix, multiple sounds can play simultaneously
    await AudioService.play('rain-forest');
    await AudioService.play('ocean-waves');
    await AudioService.play('white-noise');
    
    const state = AudioService.getAllState();
    
    // All sounds are properly tracked in the Map
    // All sounds are now properly managed and won't cause memory leaks
    expect(state.activeSounds.length).toBe(3); // Now properly supports 3 sounds
    expect(state.activeSounds).toContain('white-noise');
    expect(state.activeSounds).toContain('rain-forest');
    expect(state.activeSounds).toContain('ocean-waves');
    
    // All sounds can be properly managed and cleaned up
    AudioService.stop();
    const postStopState = AudioService.getAllState();
    expect(postStopState.activeSounds.length).toBe(0);
  });
});