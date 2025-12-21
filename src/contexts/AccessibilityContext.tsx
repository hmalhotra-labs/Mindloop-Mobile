import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AccessibilityInfo, Dimensions, Platform } from 'react-native';

// Define the accessibility settings interface
interface AccessibilitySettings {
  reduceMotion: boolean;
  screenReaderEnabled: boolean;
  highContrastMode: boolean;
  fontSize: number;
  isKeyboardMode: boolean;
}

// Define the context type
interface AccessibilityContextType extends AccessibilitySettings {
  toggleHighContrastMode: () => void;
  toggleReduceMotion: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  enableKeyboardMode: () => void;
  disableKeyboardMode: () => void;
  announceForAccessibility: (announcement: string) => void;
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
}

// Create the context with default values
const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

// Provider component
export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    reduceMotion: false,
    screenReaderEnabled: false,
    highContrastMode: false,
    fontSize: 1,
    isKeyboardMode: false,
  });

  // Initialize accessibility settings
  useEffect(() => {
    // Check if we're in a test environment or if AccessibilityInfo is available
    if (typeof AccessibilityInfo !== 'undefined' && AccessibilityInfo.isScreenReaderEnabled) {
      // Check if screen reader is enabled
      AccessibilityInfo.isScreenReaderEnabled().then(isEnabled => {
        setSettings(prev => ({ ...prev, screenReaderEnabled: isEnabled }));
      });

      // Check if reduce motion is preferred
      AccessibilityInfo.isReduceMotionEnabled().then(isEnabled => {
        setSettings(prev => ({ ...prev, reduceMotion: isEnabled }));
      });

      // Subscribe to screen reader change events
      const screenReaderSubscription = AccessibilityInfo.addEventListener(
        'screenReaderChanged',
        (isEnabled: boolean) => {
          setSettings(prev => ({ ...prev, screenReaderEnabled: isEnabled }));
        }
      );

      // Subscribe to reduce motion change events
      const reduceMotionSubscription = AccessibilityInfo.addEventListener(
        'reduceMotionChanged',
        (isEnabled: boolean) => {
          setSettings(prev => ({ ...prev, reduceMotion: isEnabled }));
        }
      );

      // Cleanup subscriptions
      return () => {
        screenReaderSubscription?.remove();
        reduceMotionSubscription?.remove();
      };
    }
  }, []);

  const toggleHighContrastMode = () => {
    setSettings(prev => ({
      ...prev,
      highContrastMode: !prev.highContrastMode,
    }));
  };

  const toggleReduceMotion = () => {
    setSettings(prev => ({
      ...prev,
      reduceMotion: !prev.reduceMotion,
    }));
  };

  const increaseFontSize = () => {
    setSettings(prev => ({
      ...prev,
      fontSize: Math.min(prev.fontSize + 0.2, 2), // Max 2x font size
    }));
  };

  const decreaseFontSize = () => {
    setSettings(prev => ({
      ...prev,
      fontSize: Math.max(prev.fontSize - 0.2, 0.8), // Min 0.8x font size
    }));
  };

  const enableKeyboardMode = () => {
    setSettings(prev => ({
      ...prev,
      isKeyboardMode: true,
    }));
  };

  const disableKeyboardMode = () => {
    setSettings(prev => ({
      ...prev,
      isKeyboardMode: false,
    }));
  };

  const announceForAccessibility = (announcement: string) => {
    if (typeof AccessibilityInfo !== 'undefined' && AccessibilityInfo.announceForAccessibility) {
      if (Platform.OS === 'ios') {
        // On iOS, we need to add a small delay for the announcement to work properly
        setTimeout(() => {
          AccessibilityInfo.announceForAccessibility(announcement);
        }, 100);
      } else {
        AccessibilityInfo.announceForAccessibility(announcement);
      }
    }
  };

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
  };

  const value: AccessibilityContextType = {
    ...settings,
    toggleHighContrastMode,
    toggleReduceMotion,
    increaseFontSize,
    decreaseFontSize,
    enableKeyboardMode,
    disableKeyboardMode,
    announceForAccessibility,
    updateSettings,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Custom hook to use the accessibility context
export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};