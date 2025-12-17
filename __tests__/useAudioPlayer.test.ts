import { renderHook, act } from '@testing-library/react-native';
import { useAudioPlayer } from '../src/hooks/useAudioPlayer';
import { AmbientSound, ambientSounds } from '../src/data/ambientSounds';
import { AudioService } from '../src/services/audioService';

describe('useAudioPlayer', () => {
  // Use a real sound from the ambient sounds data for testing
  const testSound: AmbientSound = ambientSounds[0] || {
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

  // Clean up audio service state between tests
  beforeEach(() => {
    AudioService.stop();
  });

  afterEach(() => {
    AudioService.stop();
  });

  it('should be defined and export the useAudioPlayer hook', () => {
    expect(useAudioPlayer).toBeDefined();
    expect(typeof useAudioPlayer).toBe('function');
  });

  it('should initialize with default state values', () => {
    const { result } = renderHook(() => useAudioPlayer());
    
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentSound).toBeUndefined();
    expect(result.current.volume).toBe(0.5); // Updated to match service default
    expect(result.current.currentTime).toBe(0);
    expect(result.current.duration).toBe(0);
  });

  it('should load and play a sound', async () => {
    const { result } = renderHook(() => useAudioPlayer());
    
    await act(async () => {
      await result.current.loadSound(testSound);
    });
    
    await act(async () => {
      await result.current.play();
    });
    
    expect(result.current.isPlaying).toBe(true);
    expect(result.current.currentSound).toEqual(testSound);
  });

  it('should pause the current sound', async () => {
    const { result } = renderHook(() => useAudioPlayer());
    
    await act(async () => {
      await result.current.loadSound(testSound);
      await result.current.play();
    });
    
    await act(async () => {
      await result.current.pause();
    });
    
    expect(result.current.isPlaying).toBe(false);
  });

  it('should stop the current sound', async () => {
    const { result } = renderHook(() => useAudioPlayer());
    
    await act(async () => {
      await result.current.loadSound(testSound);
    });
    
    expect(result.current.currentSound).toEqual(testSound); // Verify sound is loaded
    expect(result.current.isPlaying).toBe(false); // Initially not playing after loading

    await act(async () => {
      await result.current.play();
    });
    
    // Wait a bit for the state to sync from the service
    await new Promise(resolve => setTimeout(resolve, 10));
    
    expect(result.current.currentSound).toEqual(testSound); // Verify sound is still there after playing
    expect(result.current.isPlaying).toBe(true); // Verify it's playing after play call
    
    await act(async () => {
      await result.current.stop();
    });
    
    // Wait a bit for the state to sync from the service
    await new Promise(resolve => setTimeout(resolve, 10));
    
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentSound).toBeUndefined();
  });

  it('should update volume', async () => {
    const { result } = renderHook(() => useAudioPlayer());
    
    await act(async () => {
      result.current.setVolume(0.5);
    });
    
    expect(result.current.volume).toBe(0.5);
  });

  it('should handle multiple sound changes', async () => {
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
    
    const { result } = renderHook(() => useAudioPlayer());
    
    await act(async () => {
      await result.current.loadSound(testSound);
      await result.current.play();
    });
    
    expect(result.current.currentSound).toEqual(testSound);
    
    await act(async () => {
      await result.current.loadSound(anotherSound);
    });
    
    expect(result.current.currentSound).toEqual(anotherSound);
  });

  it('should handle play when no sound is loaded', async () => {
    const { result } = renderHook(() => useAudioPlayer());
    
    await act(async () => {
      await result.current.play();
    });
    
    expect(result.current.isPlaying).toBe(false);
  });

  it('should handle pause when no sound is playing', async () => {
    const { result } = renderHook(() => useAudioPlayer());
    
    await act(async () => {
      await result.current.pause();
    });
    
    expect(result.current.isPlaying).toBe(false);
  });

  it('should handle stop when no sound is loaded', async () => {
    const { result } = renderHook(() => useAudioPlayer());
    
    await act(async () => {
      await result.current.stop();
    });
    
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentSound).toBeUndefined();
  });
});