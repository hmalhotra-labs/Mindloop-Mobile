import React from 'react';
import { View, Text } from 'react-native';

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
    <View style={{ alignItems: 'center', marginBottom: 30 }}>
      <Text style={{ 
        fontSize: 48, 
        fontWeight: 'bold', 
        color: '#2c3e50',
        fontVariant: ['tabular-nums']
      }}>
        {formatTime(remainingTime)}
      </Text>
    </View>
  );
};