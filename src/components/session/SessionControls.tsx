import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

interface SessionControlsProps {
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
}

export const SessionControls: React.FC<SessionControlsProps> = ({ 
  onPause, 
  onResume, 
  onStop 
}) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 20 }}>
      <TouchableOpacity onPress={onPause} style={{ padding: 10, backgroundColor: '#ff6b6b', borderRadius: 8 }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Pause</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onResume} style={{ padding: 10, backgroundColor: '#4ecdc4', borderRadius: 8 }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Resume</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onStop} style={{ padding: 10, backgroundColor: '#ff9999', borderRadius: 8 }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Stop</Text>
      </TouchableOpacity>
    </View>
  );
};