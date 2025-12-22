// Mock the ambientSounds to include our test sounds BEFORE importing other modules
jest.mock('../src/data/ambientSounds', () => {
  const actual = jest.requireActual('../src/data/ambientSounds');
  const testSound1 = {
    id: 'test-sound-1',
    name: 'Test Sound',
    category: 'nature',
    description: 'A test sound for unit testing',
    duration: 300,
    filePath: 'test-sound.mp3',
    volume: 0.5,
    tags: ['test'],
    moodAssociations: ['calm'],
    isLoopable: true,
    quality: 'medium',
  };
  const testSound2 = {
    id: 'test-sound-2',
    name: 'Another Test Sound',
    category: 'nature',
    description: 'Another test sound for unit testing',
    duration: 400,
    filePath: 'another-test-sound.mp3',
    volume: 0.6,
    tags: ['test'],
    moodAssociations: ['calm'],
    isLoopable: true,
    quality: 'medium',
  };
  return {
    ...actual,
    ambientSounds: [
      ...actual.ambientSounds,
      testSound1,
      testSound2
    ],
    getSoundById: (id: string) => {
      const allSounds = [...actual.ambientSounds, testSound1, testSound2];
      return allSounds.find(sound => sound.id === id);
    }
  };
});

import { renderHook, act } from '@testing-library/react-native';
import { useAudioPlayer } from '../src/hooks/useAudioPlayer';
import { AmbientSound, ambientSounds } from '../src/data/ambientSounds';
import { AudioService } from '../src/services/audioService';

// Mock the AudioService to avoid actual audio operations during tests
jest.mock('../src/services/audioService', () => ({
  AudioService: {
    play: jest.fn().mockResolvedValue(true),
    pause: jest.fn().mockReturnValue(false),
    stop: jest.fn().mockReturnValue(true),
    setVolume: jest.fn().mockResolvedValue(undefined),
    isPlaying: jest.fn().mockReturnValue(false),
    getVolume: jest.fn().mockReturnValue(0.5),
    getCurrentSound: jest.fn().mockReturnValue(null),
    getCurrentTime: jest.fn().mockResolvedValue(0),
    getDuration: jest.fn().mockResolvedValue(0),
    getAllState: jest.fn().mockReturnValue({
      isPlaying: false,
      currentSound: null,
      currentTime: 0,
      duration: 0,
      volume: 0.5,
      activeSounds: []
    }),
    destroy: jest.fn().mockResolvedValue(undefined),
  }
}));

describe('useAudioPlayer', () => {
  // Define test sounds explicitly to ensure they're available in the test environment
  const testSound: AmbientSound = {
    id: 'test-sound-1',
    name: 'Test Sound',
    category: 'nature',
    description: 'A test sound for unit testing',
    duration: 300,
    filePath: 'test-sound.mp3',
    volume: 0.5,
    tags: ['test'],
    moodAssociations: ['calm'],
    isLoopable: true,
    quality: 'medium',
  };
  
  const anotherSound: AmbientSound = {
    id: 'test-sound-2',
    name: 'Another Test Sound',
    category: 'nature',
    description: 'Another test sound for unit testing',
    duration: 400,
    filePath: 'another-test-sound.mp3',
    volume: 0.6,
    tags: ['test'],
    moodAssociations: ['calm'],
    isLoopable: true,
    quality: 'medium',
  };

  // Clean up audio service state between tests
  beforeEach(() => {
    // Reset all mock calls
    jest.clearAllMocks();
    
    // Set default return values for the mock methods
    (AudioService.isPlaying as jest.Mock).mockReturnValue(false);
    (AudioService.getCurrentSound as jest.Mock).mockReturnValue(null);
    (AudioService.getVolume as jest.Mock).mockReturnValue(0.5);
    (AudioService.getCurrentTime as jest.Mock).mockReturnValue(0);
    (AudioService.getDuration as jest.Mock).mockReturnValue(0);
  });

  afterEach(() => {
    // Additional cleanup after each test to ensure complete isolation
    jest.clearAllMocks();
  });

  it('should be defined and export the useAudioPlayer hook', () => {
    expect(useAudioPlayer).toBeDefined();
    expect(typeof useAudioPlayer).toBe('function');
  });

  it('should initialize with default state values', () => {
    // Mock the initial state for the useEffect sync
    (AudioService.getAllState as jest.Mock).mockReturnValue({
      isPlaying: false,
      currentSound: null,
      currentTime: 0,
      duration: 0,
      volume: 0.5,
      activeSounds: []
    });
    
    const { result } = renderHook(() => useAudioPlayer());
    
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentSound).toBeUndefined();
    expect(result.current.volume).toBe(0.5); // Updated to match service default
    expect(result.current.currentTime).toBe(0);
    expect(result.current.duration).toBe(0);
  });

  it('should load and play a sound', async () => {
    const { result } = renderHook(() => useAudioPlayer());
    
    // Mock the service to simulate loading and playing a sound
    (AudioService.play as jest.Mock).mockResolvedValue(true);
    (AudioService.isPlaying as jest.Mock).mockReturnValue(true);
    (AudioService.getCurrentSound as jest.Mock).mockReturnValue(testSound.id);
    (AudioService.getAllState as jest.Mock).mockReturnValue({
      isPlaying: true,
      currentSound: testSound.id,
      currentTime: 0,
      duration: testSound.duration,
      volume: 0.5,
      activeSounds: [testSound.id]
    });
    
    await act(async () => {
      await result.current.loadSound(testSound);
    });
    
    await act(async () => {
      await result.current.play();
    });
    
    expect(result.current.isPlaying).toBe(true);
    expect(result.current.currentSound).toEqual(testSound);
    expect(AudioService.play).toHaveBeenCalledWith(testSound.id, testSound.volume);
  });

  it('should pause the current sound', async () => {
    const { result } = renderHook(() => useAudioPlayer());
    
    // Mock the service to simulate playing state
    (AudioService.play as jest.Mock).mockResolvedValue(true);
    (AudioService.isPlaying as jest.Mock).mockReturnValue(true);
    (AudioService.getCurrentSound as jest.Mock).mockReturnValue(testSound.id);
    (AudioService.getAllState as jest.Mock).mockReturnValue({
      isPlaying: true,
      currentSound: testSound.id,
      currentTime: 0,
      duration: testSound.duration,
      volume: 0.5,
      activeSounds: [testSound.id]
    });
    
    await act(async () => {
      await result.current.loadSound(testSound);
      await result.current.play();
    });
    
    // Mock the service to simulate paused state
    (AudioService.pause as jest.Mock).mockReturnValue(true);
    (AudioService.isPlaying as jest.Mock).mockReturnValue(false);
    (AudioService.getAllState as jest.Mock).mockReturnValue({
      isPlaying: false,
      currentSound: testSound.id,
      currentTime: 0,
      duration: testSound.duration,
      volume: 0.5,
      activeSounds: [testSound.id]
    });
    
    await act(async () => {
      await result.current.pause();
    });
    
    expect(result.current.isPlaying).toBe(false);
    expect(AudioService.pause).toHaveBeenCalled();
  });

  it('should stop the current sound', async () => {
    const { result } = renderHook(() => useAudioPlayer());
    
    // Mock the service to simulate loaded state
    (AudioService.play as jest.Mock).mockResolvedValue(true);
    (AudioService.isPlaying as jest.Mock).mockReturnValue(false);
    (AudioService.getCurrentSound as jest.Mock).mockReturnValue(testSound.id);
    (AudioService.getAllState as jest.Mock).mockReturnValue({
      isPlaying: false,
      currentSound: testSound.id,
      currentTime: 0,
      duration: testSound.duration,
      volume: 0.5,
      activeSounds: [testSound.id]
    });
    
    await act(async () => {
      await result.current.loadSound(testSound);
    });
    
    expect(result.current.currentSound).toEqual(testSound); // Verify sound is loaded
    expect(result.current.isPlaying).toBe(false); // Initially not playing after loading

    // Mock the service to simulate playing state
    (AudioService.isPlaying as jest.Mock).mockReturnValue(true);
    (AudioService.getAllState as jest.Mock).mockReturnValue({
      isPlaying: true,
      currentSound: testSound.id,
      currentTime: 0,
      duration: testSound.duration,
      volume: 0.5,
      activeSounds: [testSound.id]
    });
    
    await act(async () => {
      await result.current.play();
    });
    
    expect(result.current.currentSound).toEqual(testSound); // Verify sound is still there after playing
    expect(result.current.isPlaying).toBe(true); // Verify it's playing after play call
    
    // Mock the service to simulate stopped state
    (AudioService.stop as jest.Mock).mockReturnValue(true);
    (AudioService.getCurrentSound as jest.Mock).mockReturnValue(null);
    (AudioService.isPlaying as jest.Mock).mockReturnValue(false);
    (AudioService.getAllState as jest.Mock).mockReturnValue({
      isPlaying: false,
      currentSound: null,
      currentTime: 0,
      duration: 0,
      volume: 0.5,
      activeSounds: []
    });
    
    await act(async () => {
      await result.current.stop();
    });
    
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentSound).toBeUndefined();
    expect(AudioService.stop).toHaveBeenCalled();
  });

  it('should update volume', async () => {
    const { result } = renderHook(() => useAudioPlayer());
    
    // Mock the service to return the new volume
    (AudioService.getVolume as jest.Mock).mockReturnValue(0.7);
    (AudioService.getAllState as jest.Mock).mockReturnValue({
      isPlaying: false,
      currentSound: null,
      currentTime: 0,
      duration: 0,
      volume: 0.7,
      activeSounds: []
    });
    
    await act(async () => {
      result.current.setVolume(0.7);
    });
    
    expect(result.current.volume).toBe(0.7);
    expect(AudioService.setVolume).toHaveBeenCalledWith(0.7);
  });

  it('should handle multiple sound changes', async () => {
    // Mock the initial state for the useEffect sync
    (AudioService.getAllState as jest.Mock)
      .mockReturnValueOnce({  // Initial sync in useEffect
        isPlaying: false,
        currentSound: null,
        currentTime: 0,
        duration: 0,
        volume: 0.5,
        activeSounds: []
      });
    
    // Mock the service to simulate loading and playing sounds
    (AudioService.play as jest.Mock)
      .mockResolvedValueOnce(true)  // For first play call
      .mockResolvedValueOnce(true); // For second play call
    
    const { result } = renderHook(() => useAudioPlayer());
    
    // Mock state after loading first sound
    (AudioService.getAllState as jest.Mock).mockReturnValueOnce({
      isPlaying: false,
      currentSound: testSound.id,
      currentTime: 0,
      duration: testSound.duration,
      volume: 0.5,
      activeSounds: [testSound.id]
    });
    
    await act(async () => {
      await result.current.loadSound(testSound);
    });
    
    expect(result.current.currentSound).toEqual(testSound);
    
    // Mock state after playing first sound
    (AudioService.getAllState as jest.Mock).mockReturnValueOnce({
      isPlaying: true,
      currentSound: testSound.id,
      currentTime: 0,
      duration: testSound.duration,
      volume: 0.5,
      activeSounds: [testSound.id]
    });
    
    await act(async () => {
      await result.current.play();
    });
    
    // Mock state after loading second sound
    (AudioService.getAllState as jest.Mock).mockReturnValueOnce({
      isPlaying: false,
      currentSound: anotherSound.id,
      currentTime: 0,
      duration: anotherSound.duration,
      volume: 0.6,
      activeSounds: [anotherSound.id]
    });
    
    await act(async () => {
      await result.current.loadSound(anotherSound);
    });
    
    // Check the state after loading the second sound
    expect(result.current.currentSound).toEqual(anotherSound);
    
    // Mock state after playing second sound
    (AudioService.getAllState as jest.Mock).mockReturnValue({
      isPlaying: true,
      currentSound: anotherSound.id,
      currentTime: 0,
      duration: anotherSound.duration,
      volume: 0.6,
      activeSounds: [anotherSound.id]
    });
    
    await act(async () => {
      await result.current.play();
    });
    
    // Check that the last call to AudioService.play was with the second sound
    const playCalls = (AudioService.play as jest.Mock).mock.calls;
    expect(playCalls).toHaveLength(2);
    expect(playCalls[0][0]).toBe(testSound.id);  // First call should be with first sound
    expect(playCalls[1][0]).toBe(anotherSound.id);  // Second call should be with second sound
  });

  it('should handle play when no sound is loaded', async () => {
    // Completely reset the AudioService mock implementation to ensure test isolation
    jest.resetAllMocks();
    
    // Mock the initial state for the useEffect sync
    (AudioService.getAllState as jest.Mock)
      .mockReturnValue({  // All calls return the same state
        isPlaying: false,
        currentSound: null,
        currentTime: 0,
        duration: 0,
        volume: 0.5,
        activeSounds: []
      });
    
    const { result } = renderHook(() => useAudioPlayer());
    
    await act(async () => {
      await result.current.play();
    });
    
    // The play call should have no effect when no sound is loaded
    expect(result.current.isPlaying).toBe(false);
    // Verify that AudioService.play was not called when no sound is loaded
    // In the hook, if currentSound is undefined, it returns early without calling AudioService.play
    expect(AudioService.play).not.toHaveBeenCalled();
  });

  it('should handle pause when no sound is playing', async () => {
    // Mock the initial state for the useEffect sync
    (AudioService.getAllState as jest.Mock).mockReturnValue({
      isPlaying: false,
      currentSound: null,
      currentTime: 0,
      duration: 0,
      volume: 0.5,
      activeSounds: []
    });
    
    const { result } = renderHook(() => useAudioPlayer());
    
    await act(async () => {
      await result.current.pause();
    });
    
    expect(result.current.isPlaying).toBe(false);
  });

  it('should handle stop when no sound is loaded', async () => {
    const { result } = renderHook(() => useAudioPlayer());
    
    // Mock the service to remain in stopped state
    (AudioService.getCurrentSound as jest.Mock).mockReturnValue(null);
    (AudioService.isPlaying as jest.Mock).mockReturnValue(false);
    (AudioService.getAllState as jest.Mock).mockReturnValue({
      isPlaying: false,
      currentSound: null,
      currentTime: 0,
      duration: 0,
      volume: 0.5,
      activeSounds: []
    });
    
    await act(async () => {
      await result.current.stop();
    });
    
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentSound).toBeUndefined();
  });
});