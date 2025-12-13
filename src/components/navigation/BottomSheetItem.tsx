import React from 'react';

export interface BottomSheetItemProps {
  id: string;
  label: string;
  icon: string;
  onPress?: () => void;
  children?: React.ReactNode;
}

export const BottomSheetItem: React.FC<BottomSheetItemProps> = ({
  id,
  label,
  icon,
  onPress,
  children
}) => {
  return (
    <div
      data-testid={`bottom-sheet-item-${id}`}
      onClick={onPress}
    >
      <span data-testid="item-icon">{icon}</span>
      <span data-testid="item-label">{label}</span>
      {children}
    </div>
  );
};