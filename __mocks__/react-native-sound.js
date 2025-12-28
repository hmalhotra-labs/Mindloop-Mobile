// Mock implementation of react-native-sound for testing
const Sound = jest.fn().mockImplementation((filename, basePath, callback) => {
  // Create a state object to track playback status
  const state = {
    isPlayingStatus: false,
    volume: 1.0,
    duration: 100,
    currentTime: 0
  };

  return {
    isLoaded: jest.fn().mockReturnValue(true),
    play: jest.fn().mockImplementation((completionCallback) => {
      state.isPlayingStatus = true;
      if (completionCallback) {
        completionCallback(true); // Simulate successful playback
      }
      return true;
    }),
    pause: jest.fn().mockImplementation(() => {
      state.isPlayingStatus = false;
    }),
    stop: jest.fn().mockImplementation((callback) => {
      state.isPlayingStatus = false;
      if (callback) callback();
    }),
    release: jest.fn(),
    getDuration: jest.fn().mockReturnValue(state.duration), // Mock duration
    getCurrentTime: jest.fn().mockImplementation((callback) => {
      callback(state.currentTime, false); // currentTime, isFinished
    }),
    setCurrentTime: jest.fn().mockImplementation((value, callback) => {
      state.currentTime = value;
      if (callback) callback();
    }),
    setVolume: jest.fn().mockImplementation((vol) => {
      state.volume = vol;
    }),
    getVolume: jest.fn().mockReturnValue(state.volume),
    setLooping: jest.fn(),
    setSpeed: jest.fn(),
    enable: jest.fn(),
    prepare: jest.fn(),
    onPlay: null,
    onPause: null,
    onStop: null,
    onEnd: null,
    isPlaying: jest.fn().mockImplementation(() => {
      return state.isPlayingStatus;
    })
  };
});

Sound.MAIN_BUNDLE = 'MainBundle';
Sound.DOCUMENT = 'Document';
Sound.LIBRARY = 'Library';
Sound.CACHES = 'Caches';
Sound.setCategory = jest.fn();

export default Sound;