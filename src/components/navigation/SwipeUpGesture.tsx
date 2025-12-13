import React from 'react';

export interface SwipeUpGestureProps {
  children?: React.ReactNode;
  onSwipeUp?: () => void;
}

export const SwipeUpGesture: React.FC<SwipeUpGestureProps> = ({
  children,
  onSwipeUp
}) => {
  return (
    <div
      data-testid="swipe-up-gesture"
      onTouchStart={() => {}}
      onTouchMove={() => {}}
      onTouchEnd={() => {}}
    >
      {children || <div data-testid="gesture-area">Swipe up area</div>}
    </div>
  );
};