import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MoodOption } from '../../data/moodOptions';

interface MoodButtonProps {
  mood: MoodOption;
  onPress: (mood: MoodOption) => void;
  isSelected?: boolean;
}

export const MoodButton: React.FC<MoodButtonProps> = ({ mood, onPress, isSelected }) => {
  const handlePress = () => {
    onPress(mood);
  };

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        isSelected && styles.selected,
        mood.category === 'positive' && styles.positive,
        mood.category === 'neutral' && styles.neutral,
        mood.category === 'negative' && styles.negative
      ]}
      onPress={handlePress}
      testID={`mood-button-${mood.id}`}
    >
      <Text style={styles.emoji}>{mood.emoji}</Text>
      <Text style={styles.label}>{mood.label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    padding: 16,
    margin: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#dee2e6'
  },
  selected: {
    borderColor: '#007bff',
    borderWidth: 3
  },
  positive: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb'
  },
  neutral: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7'
  },
  negative: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb'
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057'
  }
});