import { calculateProgress, formatTime, validateAudioUrl, getAudioDuration } from '../src/utils/audioUtils';

describe('audioUtils', () => {
  describe('calculateProgress', () => {
    it('should calculate progress percentage correctly', () => {
      expect(calculateProgress(30, 60)).toBe(50);
      expect(calculateProgress(0, 60)).toBe(0);
      expect(calculateProgress(60, 60)).toBe(100);
      expect(calculateProgress(45, 90)).toBe(50);
    });

    it('should handle edge cases', () => {
      expect(calculateProgress(0, 0)).toBe(0);
      expect(calculateProgress(10, 0)).toBe(0);
      expect(calculateProgress(-5, 60)).toBe(0);
      expect(calculateProgress(70, 60)).toBe(100);
    });
  });

  describe('formatTime', () => {
    it('should format time in seconds to MM:SS format', () => {
      expect(formatTime(0)).toBe('00:00');
      expect(formatTime(30)).toBe('00:30');
      expect(formatTime(60)).toBe('01:00');
      expect(formatTime(90)).toBe('01:30');
      expect(formatTime(3661)).toBe('61:01'); // 1 hour + 1 min + 1 sec
    });

    it('should handle edge cases', () => {
      expect(formatTime(-10)).toBe('00:00');
      expect(formatTime(59)).toBe('00:59');
    });
  });

  describe('validateAudioUrl', () => {
    it('should validate audio URLs correctly', () => {
      expect(validateAudioUrl('https://example.com/audio.mp3')).toBe(true);
      expect(validateAudioUrl('http://example.com/audio.wav')).toBe(true);
      expect(validateAudioUrl('https://example.com/audio.ogg')).toBe(true);
      expect(validateAudioUrl('https://example.com/audio.m4a')).toBe(true);
      expect(validateAudioUrl('https://example.com/audio.aac')).toBe(true);
    });

    it('should reject invalid audio URLs', () => {
      expect(validateAudioUrl('')).toBe(false);
      expect(validateAudioUrl('https://example.com/document.pdf')).toBe(false);
      expect(validateAudioUrl('https://example.com/image.jpg')).toBe(false);
      expect(validateAudioUrl('not-a-url')).toBe(false);
      expect(validateAudioUrl('https://example.com/audio')).toBe(false);
    });
  });

  describe('getAudioDuration', () => {
    it('should return a promise with duration', async () => {
      const duration = await getAudioDuration('https://example.com/audio.mp3');
      expect(duration).toBe(0); // Currently returns 0 as default in React Native
    });

    it('should handle any URL and return 0 as default', async () => {
      const duration = await getAudioDuration('any-url');
      expect(duration).toBe(0);
    });
    
    it('should reject with error for invalid URL', async () => {
      await expect(getAudioDuration('')).rejects.toThrow('Invalid URL provided');
      await expect(getAudioDuration(null as any)).rejects.toThrow('Invalid URL provided');
      await expect(getAudioDuration(undefined as any)).rejects.toThrow('Invalid URL provided');
    });
  });
});