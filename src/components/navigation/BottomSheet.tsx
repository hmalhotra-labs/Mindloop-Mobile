import React from 'react';

// Simplified BottomSheet component for TDD testing
interface BottomSheetProps {
  isVisible?: boolean;
  onDismiss?: () => void;
  children?: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isVisible = false, onDismiss }) => {
  // Mock bottom sheet structure with navigation items
  const navigationItems = [
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'sounds', label: 'Sounds', icon: '🔊' },
    { id: 'history', label: 'History', icon: '📊' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  if (!isVisible) {
    return null;
  }

  return {
    navigationItems,
    isVisible,
    onDismiss
  };
};