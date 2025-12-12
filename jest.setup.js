// Jest setup file

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
  };
});

// Suppress console warnings during tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};