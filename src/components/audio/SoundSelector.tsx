import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { ambientSounds, AmbientSound } from '../../data/ambientSounds';

interface SoundSelectorProps {
  sounds: AmbientSound[];
  selectedSoundId?: string | null;
  onSoundSelect: (sound: AmbientSound) => void;
}

const SoundSelector: React.FC<SoundSelectorProps> = ({ sounds, selectedSoundId, onSoundSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Get unique categories
  const categories = ['All', ...new Set(sounds.map(sound => sound.category))];
  
  // Filter sounds based on selected category
  const filteredSounds = selectedCategory === 'All'
    ? sounds
    : sounds.filter(sound => sound.category === selectedCategory);

  const renderSoundItem = ({ item }: { item: AmbientSound }) => {
    const isSelected = selectedSoundId === item.id;
    
    return (
      <TouchableOpacity
        style={[styles.soundItem, isSelected && styles.selectedSoundItem]}
        onPress={() => onSoundSelect(item)}
      >
        <Text style={styles.soundName}>{item.name}</Text>
        <Text style={styles.soundCategory}>{item.category}</Text>
      </TouchableOpacity>
    );
  };

  const renderCategoryButton = (category: string) => {
    const isActive = selectedCategory === category;
    
    return (
      <TouchableOpacity
        key={category}
        style={[styles.categoryButton, isActive && styles.activeCategoryButton]}
        onPress={() => setSelectedCategory(category)}
      >
        <Text style={[styles.categoryText, isActive && styles.activeCategoryText]}>
          {category}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
   <View style={styles.container} testID="sound-selector">
     <Text style={styles.title}>Select Ambient Sound</Text>
     
     {/* Category Filter */}
     <View style={styles.categoryContainer}>
       {categories.map(renderCategoryButton)}
     </View>
     
     {/* Sound List */}
     <FlatList
       data={filteredSounds}
       renderItem={renderSoundItem}
       keyExtractor={(item) => item.id}
       showsVerticalScrollIndicator={false}
       testID="sound-list"
       initialNumToRender={10}
       maxToRenderPerBatch={10}
       windowSize={10}
     />
   </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
  },
  activeCategoryButton: {
    backgroundColor: '#4a90e2',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  activeCategoryText: {
    color: '#fff',
  },
  soundItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedSoundItem: {
    backgroundColor: '#d0e7ff',
    borderWidth: 2,
    borderColor: '#4a90e2',
  },
  soundName: {
    fontSize: 16,
    fontWeight: '600',
  },
  soundCategory: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export { SoundSelector };