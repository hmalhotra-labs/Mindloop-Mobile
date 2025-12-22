import React from 'react';
import { View, Text } from 'react-native';
import { formatTimeMMSS } from '../../utils/timeUtils';

interface TimerDisplayProps {
  remainingTime: number; // in seconds
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ remainingTime }) => {
  return (
    <View style={{ alignItems: 'center', marginBottom: 30 }}>
      <Text style={{
        fontSize: 48,
        fontWeight: 'bold',
        color: '#2c3e50',
        fontVariant: ['tabular-nums']
      }}>
        {formatTimeMMSS(remainingTime)}
      </Text>
    </View>
  );
};