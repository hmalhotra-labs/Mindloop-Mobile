import { 
  announceToScreenReader, 
  isScreenReaderEnabled, 
  isReduceMotionEnabled, 
  getReduceMotionSetting, 
  getScreenReaderSetting, 
  addScreenReaderChangeListener, 
  addReduceMotionChangeListener 
} from '../src/utils/screenReaderUtils';

// Mock the AccessibilityInfo module
jest.mock('react-native', () => ({
  AccessibilityInfo: {
    announceForAccessibility: jest.fn(),
    isScreenReaderEnabled: jest.fn(() => Promise.resolve(false)),
    isReduceMotionEnabled: jest.fn(() => Promise.resolve(false)),
    addEventListener: jest.fn(() => ({
      remove: jest.fn(),
    })),
  },
  Platform: {
    OS: 'ios',
  },
}));

// Import after mocking
const { AccessibilityInfo } = require('react-native');

describe('Screen Reader Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('announceToScreenReader', () => {
    it('should announce text to screen reader', async () => {
      const mockAnnouncement = 'Test announcement';
      
      await announceToScreenReader(mockAnnouncement);
      
      expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(mockAnnouncement);
    });
  });

  describe('isScreenReaderEnabled', () => {
    it('should return screen reader status', async () => {
      const mockStatus = true;
      (AccessibilityInfo.isScreenReaderEnabled as jest.Mock).mockResolvedValue(mockStatus);
      
      const result = await isScreenReaderEnabled();
      
      expect(result).toBe(mockStatus);
      expect(AccessibilityInfo.isScreenReaderEnabled).toHaveBeenCalled();
    });
  });

  describe('isReduceMotionEnabled', () => {
    it('should return reduce motion status', async () => {
      const mockStatus = false;
      (AccessibilityInfo.isReduceMotionEnabled as jest.Mock).mockResolvedValue(mockStatus);
      
      const result = await isReduceMotionEnabled();
      
      expect(result).toBe(mockStatus);
      expect(AccessibilityInfo.isReduceMotionEnabled).toHaveBeenCalled();
    });
  });

  describe('getReduceMotionSetting', () => {
    it('should return reduce motion setting', async () => {
      const mockStatus = true;
      (AccessibilityInfo.isReduceMotionEnabled as jest.Mock).mockResolvedValue(mockStatus);
      
      const result = await getReduceMotionSetting();
      
      expect(result).toBe(mockStatus);
    });
  });

  describe('getScreenReaderSetting', () => {
    it('should return screen reader setting', async () => {
      const mockStatus = false;
      (AccessibilityInfo.isScreenReaderEnabled as jest.Mock).mockResolvedValue(mockStatus);
      
      const result = await getScreenReaderSetting();
      
      expect(result).toBe(mockStatus);
    });
  });

  describe('addScreenReaderChangeListener', () => {
    it('should add screen reader change listener', () => {
      const mockHandler = jest.fn();
      const subscription = addScreenReaderChangeListener(mockHandler);
      
      expect(AccessibilityInfo.addEventListener).toHaveBeenCalledWith('screenReaderChanged', mockHandler);
      expect(subscription).toBeDefined();
      expect(subscription?.remove).toBeDefined();
    });
  });

  describe('addReduceMotionChangeListener', () => {
    it('should add reduce motion change listener', () => {
      const mockHandler = jest.fn();
      const subscription = addReduceMotionChangeListener(mockHandler);
      
      expect(AccessibilityInfo.addEventListener).toHaveBeenCalledWith('reduceMotionChanged', mockHandler);
      expect(subscription).toBeDefined();
      expect(subscription?.remove).toBeDefined();
    });
  });
});