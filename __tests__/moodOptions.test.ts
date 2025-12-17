import { getMoodOptions, MoodOption, getMoodById, MoodCategory } from '../src/data/moodOptions';

describe('moodOptions', () => {
  describe('getMoodOptions', () => {
    it('should return all mood options', () => {
      const options = getMoodOptions();
      expect(options).toHaveLength(4);
    });

    it('should include all mood categories', () => {
      const options = getMoodOptions();
      const categories = options.map(option => option.category);
      expect(categories).toContain(MoodCategory.POSITIVE);
      expect(categories).toContain(MoodCategory.NEUTRAL);
      expect(categories).toContain(MoodCategory.NEGATIVE);
    });

    it('should have proper mood options structure', () => {
      const options = getMoodOptions();
      options.forEach((option: MoodOption) => {
        expect(option).toHaveProperty('id');
        expect(option).toHaveProperty('label');
        expect(option).toHaveProperty('emoji');
        expect(option).toHaveProperty('category');
      });
    });
  });

  describe('getMoodById', () => {
    it('should return correct mood for valid id', () => {
      const mood = getMoodById('good');
      expect(mood).toBeDefined();
      expect(mood?.id).toBe('good');
      expect(mood?.label).toBe('Good');
      expect(mood?.emoji).toBe('😊');
    });

    it('should return undefined for invalid id', () => {
      const mood = getMoodById('invalid');
      expect(mood).toBeUndefined();
    });
  });

  describe('MoodCategory enum', () => {
    it('should have correct values', () => {
      expect(MoodCategory.POSITIVE).toBe('positive');
      expect(MoodCategory.NEUTRAL).toBe('neutral');
      expect(MoodCategory.NEGATIVE).toBe('negative');
    });
  });
});