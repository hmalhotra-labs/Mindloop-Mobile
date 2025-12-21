import { 
  KeyboardNavigationManager, 
  keyboardNavigationManager, 
  isKeyboardNavigationActive, 
  enableKeyboardNavigation, 
  disableKeyboardNavigation, 
  toggleKeyboardNavigation,
  shouldShowFocusIndicators,
  getKeyboardNavigationOptions
} from '../src/utils/keyboardNavigationUtils';

// Mock react-native module
jest.mock('react-native', () => ({
  AccessibilityInfo: {
    isAccessibilityServiceEnabled: jest.fn(() => Promise.resolve(false)),
  },
  Platform: {
    OS: 'ios',
    isTesting: true,
  },
  Keyboard: {},
  InteractionManager: {
    runAfterInteractions: jest.fn((callback) => {
      callback();
    }),
  },
}));

describe('Keyboard Navigation Utilities', () => {
  beforeEach(() => {
    // Reset the singleton instance before each test
    const manager = KeyboardNavigationManager.getInstance();
    manager['isKeyboardMode'] = false;
    manager['focusIndicatorEnabled'] = true;
    manager['autoFocusEnabled'] = true;
    manager['focusManagementEnabled'] = true;
    manager['keyboardListeners'] = [];
    manager['focusListeners'] = [];
  });

  it('should create a singleton instance of KeyboardNavigationManager', () => {
    const instance1 = KeyboardNavigationManager.getInstance();
    const instance2 = KeyboardNavigationManager.getInstance();
    
    expect(instance1).toBe(instance2);
    expect(keyboardNavigationManager).toBe(instance1);
  });

  it('should initialize with keyboard mode disabled', () => {
    const manager = KeyboardNavigationManager.getInstance();
    
    expect(manager.isKeyboardModeActive()).toBe(false);
    expect(isKeyboardNavigationActive()).toBe(false);
  });

  it('should enable keyboard mode', () => {
    const manager = KeyboardNavigationManager.getInstance();
    
    manager.enableKeyboardMode();
    
    expect(manager.isKeyboardModeActive()).toBe(true);
    expect(isKeyboardNavigationActive()).toBe(true);
  });

  it('should disable keyboard mode', () => {
    const manager = KeyboardNavigationManager.getInstance();
    
    manager.enableKeyboardMode();
    expect(manager.isKeyboardModeActive()).toBe(true);
    
    manager.disableKeyboardMode();
    expect(manager.isKeyboardModeActive()).toBe(false);
  });

  it('should toggle keyboard mode', () => {
    const manager = KeyboardNavigationManager.getInstance();
    
    expect(manager.isKeyboardModeActive()).toBe(false);
    
    manager.toggleKeyboardMode();
    expect(manager.isKeyboardModeActive()).toBe(true);
    
    manager.toggleKeyboardMode();
    expect(manager.isKeyboardModeActive()).toBe(false);
  });

  it('should enable keyboard navigation using utility function', () => {
    expect(isKeyboardNavigationActive()).toBe(false);
    
    enableKeyboardNavigation();
    expect(isKeyboardNavigationActive()).toBe(true);
  });

  it('should disable keyboard navigation using utility function', () => {
    enableKeyboardNavigation();
    expect(isKeyboardNavigationActive()).toBe(true);
    
    disableKeyboardNavigation();
    expect(isKeyboardNavigationActive()).toBe(false);
  });

  it('should toggle keyboard navigation using utility function', () => {
    expect(isKeyboardNavigationActive()).toBe(false);
    
    toggleKeyboardNavigation();
    expect(isKeyboardNavigationActive()).toBe(true);
    
    toggleKeyboardNavigation();
    expect(isKeyboardNavigationActive()).toBe(false);
  });

  it('should show focus indicators when keyboard mode is active and focus indicators are enabled', () => {
    const manager = KeyboardNavigationManager.getInstance();
    
    // Initially, keyboard mode is off
    expect(manager.shouldShowFocusIndicators()).toBe(false);
    expect(shouldShowFocusIndicators()).toBe(false);
    
    // Enable keyboard mode but focus indicators are still enabled by default
    manager.enableKeyboardMode();
    expect(manager.shouldShowFocusIndicators()).toBe(true);
    expect(shouldShowFocusIndicators()).toBe(true);
    
    // Disable focus indicators
    manager.disableFocusIndicators();
    expect(manager.shouldShowFocusIndicators()).toBe(false);
    expect(shouldShowFocusIndicators()).toBe(false);
  });

  it('should manage focus indicator settings', () => {
    const manager = KeyboardNavigationManager.getInstance();
    
    expect(manager.shouldShowFocusIndicators()).toBe(false); // keyboard mode is off
    
    manager.enableKeyboardMode();
    expect(manager.shouldShowFocusIndicators()).toBe(true); // keyboard mode is on, indicators enabled
    
    manager.disableFocusIndicators();
    expect(manager.shouldShowFocusIndicators()).toBe(false); // keyboard mode is on, but indicators disabled
    
    manager.enableFocusIndicators();
    expect(manager.shouldShowFocusIndicators()).toBe(true); // keyboard mode is on, indicators enabled
  });

  it('should manage auto focus settings', () => {
    const manager = KeyboardNavigationManager.getInstance();
    
    // Initially enabled
    expect(manager['autoFocusEnabled']).toBe(true);
    
    manager.disableAutoFocus();
    expect(manager['autoFocusEnabled']).toBe(false);
    
    manager.enableAutoFocus();
    expect(manager['autoFocusEnabled']).toBe(true);
  });

  it('should manage focus management settings', () => {
    const manager = KeyboardNavigationManager.getInstance();
    
    // Initially enabled
    expect(manager['focusManagementEnabled']).toBe(true);
    
    manager.disableFocusManagement();
    expect(manager['focusManagementEnabled']).toBe(false);
    
    manager.enableFocusManagement();
    expect(manager['focusManagementEnabled']).toBe(true);
  });

  it('should add and remove keyboard listeners', () => {
    const manager = KeyboardNavigationManager.getInstance();
    const mockCallback = jest.fn();
    
    manager.addKeyboardListener(mockCallback);
    expect(manager['keyboardListeners']).toHaveLength(1);
    expect(manager['keyboardListeners'][0]).toBe(mockCallback);
    
    manager.removeKeyboardListener(mockCallback);
    expect(manager['keyboardListeners']).toHaveLength(0);
  });

  it('should add and remove focus listeners', () => {
    const manager = KeyboardNavigationManager.getInstance();
    const mockCallback = jest.fn();
    
    manager.addFocusListener(mockCallback);
    expect(manager['focusListeners']).toHaveLength(1);
    expect(manager['focusListeners'][0]).toBe(mockCallback);
    
    manager.removeFocusListener(mockCallback);
    expect(manager['focusListeners']).toHaveLength(0);
  });

  it('should notify focus listeners when keyboard mode changes', () => {
    const manager = KeyboardNavigationManager.getInstance();
    const mockCallback = jest.fn();
    
    manager.addFocusListener(mockCallback);
    
    // Initially, callback should not have been called
    expect(mockCallback).not.toHaveBeenCalled();
    
    // Enabling keyboard mode should notify listeners
    manager.enableKeyboardMode();
    expect(mockCallback).toHaveBeenCalledTimes(1);
    
    // Disabling keyboard mode should notify listeners again
    manager.disableKeyboardMode();
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  it('should handle errors in focus listeners gracefully', () => {
    const manager = KeyboardNavigationManager.getInstance();
    const erroringCallback = jest.fn(() => {
      throw new Error('Test error');
    });
    const workingCallback = jest.fn();
    
    manager.addFocusListener(erroringCallback);
    manager.addFocusListener(workingCallback);
    
    // This should not throw even though one listener errors
    expect(() => {
      manager.enableKeyboardMode();
    }).not.toThrow();
    
    // The working callback should still be called
    expect(workingCallback).toHaveBeenCalledTimes(1);
  });

  it('should get correct keyboard navigation options', () => {
    const manager = KeyboardNavigationManager.getInstance();
    
    let options = manager.getKeyboardNavigationOptions();
    expect(options).toEqual({
      enableAutoFocus: true,
      enableFocusIndicator: true,
      enableFocusManagement: true,
    });
    
    // Change settings
    manager.disableAutoFocus();
    manager.disableFocusIndicators();
    manager.disableFocusManagement();
    
    options = manager.getKeyboardNavigationOptions();
    expect(options).toEqual({
      enableAutoFocus: false,
      enableFocusIndicator: false,
      enableFocusManagement: false,
    });
  });

  it('should get keyboard navigation options using utility function', () => {
    const options = getKeyboardNavigationOptions();
    expect(options).toEqual({
      enableAutoFocus: true,
      enableFocusIndicator: true,
      enableFocusManagement: true,
    });
  });
});