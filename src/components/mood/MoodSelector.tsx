import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MoodButton } from './MoodButton';
import { getMoodOptions, MoodOption } from '../../data/moodOptions';

interface MoodSelectorProps {
  onMoodSelect: (mood: MoodOption) => void;
  onSkip: () => void;
  selectedMoodId?: string;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ 
  onMoodSelect, 
  onSkip, 
  selectedMoodId 
}) => {
  const moodOptions = getMoodOptions();

  const handleMoodPress = (mood: MoodOption) => {
    onMoodSelect(mood);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How did this reset feel?</Text>
      <Text style={styles.subtitle}>Choose the option that best matches your mood</Text>
      
      <View style={styles.moodContainer}>
        {moodOptions.map((mood) => (
          <MoodButton
            key={mood.id}
            mood={mood}
            onPress={handleMoodPress}
            isSelected={selectedMoodId === mood.id}
          />
        ))}
      </View>
      
      <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff'
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 32
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32
  },
  skipButton: {
    padding: 16,
    alignItems: 'center'
  },
  skipText: {
    fontSize: 16,
    color: '#6c757d',
    textDecorationLine: 'underline'
  }
});