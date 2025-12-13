import React from 'react';

export interface BottomSheetProps {
  isVisible?: boolean;
  onDismiss?: () => void;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isVisible = true,
  onDismiss
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div data-testid="bottom-sheet" data-visible={isVisible}>
      <div data-testid="bottom-sheet-content">
        <div data-testid="navigation-item-settings">⚙️ Settings</div>
        <div data-testid="navigation-item-sounds">🔊 Sounds</div>
        <div data-testid="navigation-item-history">📊 History</div>
        <div data-testid="navigation-item-profile">👤 Profile</div>
      </div>
    </div>
  );
};