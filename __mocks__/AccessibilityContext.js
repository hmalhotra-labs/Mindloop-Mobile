import React, { createContext, useContext, useState } from 'react';
import { View } from 'react-native';

// Create a mock context
const AccessibilityContext = createContext();

// Mock provider component
export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    reduceMotion: false,
    screenReaderEnabled: false,
    highContrastMode: false,
    fontSize: 1,
    isKeyboardMode: false,
  });

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
      fontSize: Math.min(prev.fontSize + 0.2, 2),
    }));
  };

  const decreaseFontSize = () => {
    setSettings(prev => ({
      ...prev,
      fontSize: Math.max(prev.fontSize - 0.2, 0.8),
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

  const announceForAccessibility = (announcement) => {
    // Mock implementation
    console.log('Accessibility announcement:', announcement);
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
  };

  const value = {
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

// Mock hook
export const useAccessibility = () => {
  return useContext(AccessibilityContext);
};

// Export the context as default if needed
export default AccessibilityContext;