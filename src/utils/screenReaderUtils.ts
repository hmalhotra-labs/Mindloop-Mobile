import { AccessibilityInfo, Platform } from 'react-native';

/**
 * Screen reader utility functions for Mindloop app
 * These utilities help improve accessibility for users with visual impairments
 */

/**
 * Announces text to the screen reader
 * @param announcement The text to announce
 */
export const announceToScreenReader = (announcement: string): Promise<void> => {
  return new Promise((resolve) => {
    if (AccessibilityInfo && AccessibilityInfo.announceForAccessibility) {
      if (Platform.OS === 'ios') {
        // On iOS, we need to add a small delay for the announcement to work properly
        setTimeout(() => {
          AccessibilityInfo.announceForAccessibility(announcement);
          resolve();
        }, 100);
      } else {
        AccessibilityInfo.announceForAccessibility(announcement);
        resolve();
      }
    } else {
      // In test environment or if AccessibilityInfo is not available
      console.log(`Screen Reader Announcement: ${announcement}`);
      resolve();
    }
  });
};

/**
 * Checks if screen reader is currently enabled
 * @returns Promise<boolean> indicating if screen reader is enabled
 */
export const isScreenReaderEnabled = (): Promise<boolean> => {
  if (AccessibilityInfo && AccessibilityInfo.isScreenReaderEnabled) {
    return AccessibilityInfo.isScreenReaderEnabled();
  }
  // In test environment, return false by default
  return Promise.resolve(false);
};

/**
 * Checks if reduce motion is enabled
 * @returns Promise<boolean> indicating if reduce motion is enabled
 */
export const isReduceMotionEnabled = (): Promise<boolean> => {
  if (AccessibilityInfo && AccessibilityInfo.isReduceMotionEnabled) {
    return AccessibilityInfo.isReduceMotionEnabled();
  }
  // In test environment, return false by default
  return Promise.resolve(false);
};

/**
 * Gets the preferred reduced motion setting
 * @returns Promise<boolean> indicating if reduced motion is preferred
 */
export const getReduceMotionSetting = (): Promise<boolean> => {
  return isReduceMotionEnabled();
};

/**
 * Gets the preferred screen reader setting
 * @returns Promise<boolean> indicating if screen reader is preferred
 */
export const getScreenReaderSetting = (): Promise<boolean> => {
  return isScreenReaderEnabled();
};

/**
 * Subscribes to screen reader change events
 * @param handler Function to call when screen reader state changes
 * @returns Subscription object with remove method
 */
export const addScreenReaderChangeListener = (
  handler: (isEnabled: boolean) => void
): { remove: () => void } | null => {
  if (AccessibilityInfo && AccessibilityInfo.addEventListener) {
    return AccessibilityInfo.addEventListener('screenReaderChanged', handler);
  }
  // In test environment, return a mock subscription
  return {
    remove: () => {
      // Mock implementation
    }
  };
};

/**
 * Subscribes to reduce motion change events
 * @param handler Function to call when reduce motion state changes
 * @returns Subscription object with remove method
 */
export const addReduceMotionChangeListener = (
  handler: (isEnabled: boolean) => void
): { remove: () => void } | null => {
  if (AccessibilityInfo && AccessibilityInfo.addEventListener) {
    return AccessibilityInfo.addEventListener('reduceMotionChanged', handler);
  }
  // In test environment, return a mock subscription
  return {
    remove: () => {
      // Mock implementation
    }
  };
};