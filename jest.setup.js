// Jest setup file

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

// Mock React Native modules
jest.mock('react-native', () => {
  return {
    Platform: {
      OS: 'ios',
      select: (obj) => obj.ios || obj.default,
    },
    StyleSheet: {
      create: (styles) => styles,
      flatten: (styles) => styles,
    },
    View: 'View',
    Text: 'Text',
    TouchableOpacity: 'TouchableOpacity',
    TextInput: 'TextInput',
    Button: 'Button',
    FlatList: 'FlatList',
    ScrollView: 'ScrollView',
    Alert: {
      alert: jest.fn(),
    },
    AsyncStorage: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    NativeModules: {
      SettingsManager: {
        get: jest.fn(),
      },
    },
    Settings: {
      get: jest.fn(),
    },
  };
});

// Suppress console warnings during tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};