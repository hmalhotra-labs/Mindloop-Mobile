// Ambient sounds data structure for Mindloop mindfulness app
// Defines available ambient sounds for meditation sessions

export interface AmbientSound {
  id: string;
  name: string;
  category: 'nature' | 'ambient' | 'guided' | 'meditation';
  description: string;
  duration: number; // in seconds
  filePath: string;
  volume: number; // default volume (0-1)
  tags: string[];
  moodAssociations: string[];
  isLoopable: boolean;
  quality: 'low' | 'medium' | 'high';
}

export const ambientSounds: AmbientSound[] = [
  {
    id: 'rain-forest',
    name: 'Forest Rain',
    category: 'nature',
    description: 'Gentle rain falling in a peaceful forest with distant thunder',
    duration: 1800, // 30 minutes
    filePath: 'audio/ambient/rain-forest.mp3',
    volume: 0.6,
    tags: ['rain', 'forest', 'relaxing', 'sleep'],
    moodAssociations: ['calm', 'focused', 'relaxed'],
    isLoopable: true,
    quality: 'high'
  },
  {
    id: 'ocean-waves',
    name: 'Ocean Waves',
    category: 'nature',
    description: 'Rhythmic ocean waves lapping against the shore',
    duration: 2400, // 40 minutes
    filePath: 'audio/ambient/ocean-waves.mp3',
    volume: 0.5,
    tags: ['ocean', 'waves', 'meditative', 'peaceful'],
    moodAssociations: ['calm', 'peaceful', 'relaxed'],
    isLoopable: true,
    quality: 'high'
  },
  {
    id: 'white-noise',
    name: 'White Noise',
    category: 'ambient',
    description: 'Pure white noise for focus and concentration',
    duration: 3600, // 60 minutes
    filePath: 'audio/ambient/white-noise.mp3',
    volume: 0.4,
    tags: ['focus', 'concentration', 'study', 'neutral'],
    moodAssociations: ['focused', 'neutral'],
    isLoopable: true,
    quality: 'medium'
  },
  {
    id: 'wind-chimes',
    name: 'Tibetan Wind Chimes',
    category: 'meditation',
    description: 'Gentle Tibetan wind chimes for deep meditation',
    duration: 1200, // 20 minutes
    filePath: 'audio/meditation/wind-chimes.mp3',
    volume: 0.3,
    tags: ['meditation', 'spiritual', 'healing', 'peaceful'],
    moodAssociations: ['calm', 'peaceful', 'spiritual'],
    isLoopable: true,
    quality: 'high'
  },
  {
    id: 'bird-songs',
    name: 'Morning Bird Songs',
    category: 'nature',
    description: 'Dawn chorus of various bird species',
    duration: 1500, // 25 minutes
    filePath: 'audio/nature/bird-songs.mp3',
    volume: 0.5,
    tags: ['birds', 'morning', 'awakening', 'uplifting'],
    moodAssociations: ['energetic', 'uplifted', 'positive'],
    isLoopable: true,
    quality: 'high'
  },
  {
    id: 'breathing-cues',
    name: 'Breathing Cues',
    category: 'guided',
    description: 'Subtle audio cues for breathing session timing',
    duration: 600, // 10 minutes
    filePath: 'audio/guided/breathing-cues.mp3',
    volume: 0.2,
    tags: ['breathing', 'timing', 'cues', 'subtle'],
    moodAssociations: ['focused', 'centered'],
    isLoopable: true,
    quality: 'medium'
  }
];

export const getSoundsByCategory = (category: AmbientSound['category']): AmbientSound[] => {
  return ambientSounds.filter(sound => sound.category === category);
};

export const getSoundsByMood = (mood: string): AmbientSound[] => {
  return ambientSounds.filter(sound => sound.moodAssociations.includes(mood));
};

export const getSoundById = (id: string): AmbientSound | undefined => {
  return ambientSounds.find(sound => sound.id === id);
};

export const getLoopableSounds = (): AmbientSound[] => {
  return ambientSounds.filter(sound => sound.isLoopable);
};