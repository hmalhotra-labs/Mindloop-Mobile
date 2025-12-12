import React from 'react';

interface TimerDisplayProps {
  remainingTime: number; // in seconds
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ remainingTime }) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <span>{formatTime(remainingTime)}</span>
    </div>
  );
};