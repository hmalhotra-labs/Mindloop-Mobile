import { AccessibilityInfo, Platform, Keyboard, InteractionManager } from 'react-native';

/**
 * Keyboard Navigation Utilities
 * Provides utilities for managing keyboard navigation and focus management
 */

export interface KeyboardNavigationOptions {
  enableAutoFocus?: boolean;
  enableFocusIndicator?: boolean;
  enableFocusManagement?: boolean;
}

export class KeyboardNavigationManager {
  private static instance: KeyboardNavigationManager;
  private isKeyboardMode: boolean = false;
  private focusIndicatorEnabled: boolean = true;
  private autoFocusEnabled: boolean = true;
  private focusManagementEnabled: boolean = true;
  private keyboardListeners: any[] = [];
  private focusListeners: any[] = [];

  private constructor() {
    this.initializeKeyboardDetection();
  }

  public static getInstance(): KeyboardNavigationManager {
    if (!KeyboardNavigationManager.instance) {
      KeyboardNavigationManager.instance = new KeyboardNavigationManager();
    }
    return KeyboardNavigationManager.instance;
  }

  /**
   * Initialize keyboard detection by monitoring keyboard events
   */
  private initializeKeyboardDetection() {
    // On mobile platforms, we don't have physical keyboards, but we can detect
    // when users are navigating using external keyboards if available
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      // For mobile, we'll primarily rely on accessibility settings and user preferences
      this.detectKeyboardModeFromAccessibility();
    }
  }

  /**
   * Detect keyboard mode from accessibility settings
   */
  private detectKeyboardModeFromAccessibility() {
    if (typeof AccessibilityInfo !== 'undefined' && AccessibilityInfo.isAccessibilityServiceEnabled) {
      AccessibilityInfo.isAccessibilityServiceEnabled().then((enabled) => {
        // If accessibility services are enabled, user might be using keyboard navigation
        this.isKeyboardMode = enabled;
      }).catch(() => {
        // Default to false if we can't detect
        this.isKeyboardMode = false;
      });
    }
  }

  /**
   * Check if keyboard navigation mode is currently active
   */
  public isKeyboardModeActive(): boolean {
    return this.isKeyboardMode;
  }

  /**
   * Enable keyboard navigation mode
   */
  public enableKeyboardMode() {
    this.isKeyboardMode = true;
    this.notifyFocusListeners();
  }

  /**
   * Disable keyboard navigation mode
   */
  public disableKeyboardMode() {
    this.isKeyboardMode = false;
    this.notifyFocusListeners();
  }

  /**
   * Toggle keyboard navigation mode
   */
  public toggleKeyboardMode() {
    this.isKeyboardMode = !this.isKeyboardMode;
    this.notifyFocusListeners();
  }

  /**
   * Check if focus indicators should be shown
   */
  public shouldShowFocusIndicators(): boolean {
    return this.focusIndicatorEnabled && this.isKeyboardMode;
  }

  /**
   * Enable focus indicators
   */
  public enableFocusIndicators() {
    this.focusIndicatorEnabled = true;
  }

  /**
   * Disable focus indicators
   */
  public disableFocusIndicators() {
    this.focusIndicatorEnabled = false;
  }

  /**
   * Enable auto focus behavior
   */
  public enableAutoFocus() {
    this.autoFocusEnabled = true;
  }

  /**
   * Disable auto focus behavior
   */
  public disableAutoFocus() {
    this.autoFocusEnabled = false;
  }

  /**
   * Enable focus management
   */
  public enableFocusManagement() {
    this.focusManagementEnabled = true;
  }

  /**
   * Disable focus management
   */
  public disableFocusManagement() {
    this.focusManagementEnabled = false;
  }

  /**
   * Add a keyboard event listener
   */
  public addKeyboardListener(callback: (event: any) => void) {
    this.keyboardListeners.push(callback);
  }

  /**
   * Remove a keyboard event listener
   */
  public removeKeyboardListener(callback: (event: any) => void) {
    const index = this.keyboardListeners.indexOf(callback);
    if (index !== -1) {
      this.keyboardListeners.splice(index, 1);
    }
  }

  /**
   * Add a focus change listener
   */
  public addFocusListener(callback: () => void) {
    this.focusListeners.push(callback);
  }

  /**
   * Remove a focus change listener
   */
  public removeFocusListener(callback: () => void) {
    const index = this.focusListeners.indexOf(callback);
    if (index !== -1) {
      this.focusListeners.splice(index, 1);
    }
  }

  /**
   * Notify all focus listeners about a focus change
   */
  private notifyFocusListeners() {
    this.focusListeners.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.warn('Error in focus listener:', error);
      }
    });
  }

  /**
   * Get keyboard navigation options based on current settings
   */
  public getKeyboardNavigationOptions(): KeyboardNavigationOptions {
    return {
      enableAutoFocus: this.autoFocusEnabled,
      enableFocusIndicator: this.focusIndicatorEnabled,
      enableFocusManagement: this.focusManagementEnabled,
    };
  }

  /**
   * Focus a specific element with keyboard navigation considerations
   */
  public focusElement(elementRef: any) {
    if (this.focusManagementEnabled && elementRef?.current) {
      // Use InteractionManager to ensure the UI is ready before focusing
      InteractionManager.runAfterInteractions(() => {
        if (elementRef.current) {
          elementRef.current.focus?.();
        }
      });
    }
  }

  /**
   * Blur the currently focused element
   */
  public blurElement(elementRef: any) {
    if (elementRef?.current) {
      elementRef.current.blur?.();
    }
  }

  /**
   * Get the next focusable element in the specified direction
   */
  public getNextFocusableElement(currentElement: any, direction: 'up' | 'down' | 'left' | 'right'): any {
    // For React Native, we rely on the built-in focus management
    // This is a simplified implementation - in a real app, you'd have more complex logic
    return null;
  }
}

// Create a singleton instance
export const keyboardNavigationManager = KeyboardNavigationManager.getInstance();

/**
 * Utility function to check if keyboard navigation is active
 */
export const isKeyboardNavigationActive = (): boolean => {
  return keyboardNavigationManager.isKeyboardModeActive();
};

/**
 * Utility function to get keyboard navigation options
 */
export const getKeyboardNavigationOptions = (): KeyboardNavigationOptions => {
  return keyboardNavigationManager.getKeyboardNavigationOptions();
};

/**
 * Utility function to enable keyboard mode
 */
export const enableKeyboardNavigation = () => {
  keyboardNavigationManager.enableKeyboardMode();
};

/**
 * Utility function to disable keyboard mode
 */
export const disableKeyboardNavigation = () => {
  keyboardNavigationManager.disableKeyboardMode();
};

/**
 * Utility function to toggle keyboard mode
 */
export const toggleKeyboardNavigation = () => {
  keyboardNavigationManager.toggleKeyboardMode();
};

/**
 * Utility function to check if focus indicators should be shown
 */
export const shouldShowFocusIndicators = (): boolean => {
  return keyboardNavigationManager.shouldShowFocusIndicators();
};