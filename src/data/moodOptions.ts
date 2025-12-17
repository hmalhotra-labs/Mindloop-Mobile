export enum MoodCategory {
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  NEGATIVE = 'negative'
}

export interface MoodOption {
  id: string;
  label: string;
  emoji: string;
  category: MoodCategory;
}

const moodOptions: MoodOption[] = [
  {
    id: 'good',
    label: 'Good',
    emoji: '😊',
    category: MoodCategory.POSITIVE
  },
  {
    id: 'okay',
    label: 'Okay',
    emoji: '🙂',
    category: MoodCategory.POSITIVE
  },
  {
    id: 'meh',
    label: 'Meh',
    emoji: '😐',
    category: MoodCategory.NEUTRAL
  },
  {
    id: 'bad',
    label: 'Bad',
    emoji: '😔',
    category: MoodCategory.NEGATIVE
  }
];

export const getMoodOptions = (): MoodOption[] => {
  return moodOptions;
};

export const getMoodById = (id: string): MoodOption | undefined => {
  return moodOptions.find(mood => mood.id === id);
};