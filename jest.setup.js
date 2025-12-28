// Jest setup file

// Mock the SettingsManager module before other modules are loaded to prevent TurboModuleRegistry errors
jest.mock('react-native/Libraries/Settings/NativeSettingsManager', () => ({
  getConstants: () => ({
    settings: {
      UIUserInterfaceStyle: 'light',
      AppleLocale: 'en_US',
      AppleLanguages: ['en'],
    },
  }),
}));

// Mock React Native modules to prevent issues in test environment
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  return {
    ...RN,
    AccessibilityInfo: {
      isScreenReaderEnabled: jest.fn(() => Promise.resolve(false)),
      isReduceMotionEnabled: jest.fn(() => Promise.resolve(false)),
      addEventListener: jest.fn(() => ({
        remove: jest.fn()
      })),
      announceForAccessibility: jest.fn(),
      removeEventListener: jest.fn(),
    },
    Animated: {
      ...RN.Animated,
      Value: jest.fn(() => ({
        interpolate: jest.fn(),
      })),
      timing: jest.fn(() => ({
        start: jest.fn(),
        stop: jest.fn(),
      })),
      parallel: jest.fn((animations) => ({
        start: jest.fn(),
        stop: jest.fn(),
      })),
      sequence: jest.fn((animations) => ({
        start: jest.fn(),
        stop: jest.fn(),
      })),
      loop: jest.fn((animation) => ({
        start: jest.fn(),
        stop: jest.fn(),
      })),
      delay: jest.fn(() => ({
        start: jest.fn(),
        stop: jest.fn(),
      })),
      createAnimatedComponent: jest.fn((Component) => Component),
    },
    Easing: {
      ...RN.Easing,
      linear: jest.fn(),
      ease: jest.fn(),
      in: jest.fn(),
      out: jest.fn(),
      inOut: jest.fn(() => ({
        step0: 0,
        step1: 1,
      })),
    },
    Platform: {
      ...RN.Platform,
      OS: 'ios',
      select: (obj) => obj.ios || obj.default,
    },
    StyleSheet: {
      ...RN.StyleSheet,
      create: (styles) => styles,
      flatten: (styles) => styles,
    },
    NativeModules: {
      ...RN.NativeModules,
      SettingsManager: {
        settings: {
          UIUserInterfaceStyle: 'light',
          AppleLocale: 'en_US',
          AppleLanguages: ['en'],
        },
      },
    },
    Settings: {
      get: jest.fn(() => 'en'),
    },
  };
});

// Create a simple in-memory storage for AsyncStorage mock
const storage = {};

// Mock @react-native-async-storage/async-storage with in-memory storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async (key) => storage[key] || null),
  setItem: jest.fn(async (key, value) => {
    storage[key] = value;
  }),
  removeItem: jest.fn(async (key) => {
    delete storage[key];
  }),
  clear: jest.fn(async () => {
    Object.keys(storage).forEach(key => delete storage[key]);
  }),
  mergeItem: jest.fn(),
  getAllKeys: jest.fn(async () => Object.keys(storage)),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
  multiMerge: jest.fn(),
}));

// Configure centralized Firebase mocks
// This ensures consistent mock behavior across all test files
jest.mock('./src/config/firebase', () => require('./src/config/__mocks__/firebase'));

// Suppress console warnings during tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock the accessibility context
jest.mock('./src/contexts/AccessibilityContext', () => require('./__mocks__/AccessibilityContext'));