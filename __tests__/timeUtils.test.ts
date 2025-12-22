import { formatTimeMMSS, secondsToMinutes, secondsToMinutesAndSeconds, formatDuration } from '../src/utils/timeUtils';

describe('timeUtils', () => {
  describe('formatTimeMMSS', () => {
    it('should format seconds to MM:SS format', () => {
      expect(formatTimeMMSS(0)).toBe('00:00');
      expect(formatTimeMMSS(1)).toBe('00:01');
      expect(formatTimeMMSS(59)).toBe('00:59');
      expect(formatTimeMMSS(60)).toBe('01:00');
      expect(formatTimeMMSS(61)).toBe('01:01');
      expect(formatTimeMMSS(120)).toBe('02:00');
      expect(formatTimeMMSS(125)).toBe('02:05');
      expect(formatTimeMMSS(3600)).toBe('60:00');
    });
  });

  describe('secondsToMinutes', () => {
    it('should convert seconds to minutes (rounded up)', () => {
      expect(secondsToMinutes(0)).toBe(0);
      expect(secondsToMinutes(1)).toBe(1);
      expect(secondsToMinutes(59)).toBe(1);
      expect(secondsToMinutes(60)).toBe(1);
      expect(secondsToMinutes(61)).toBe(2);
      expect(secondsToMinutes(119)).toBe(2);
      expect(secondsToMinutes(120)).toBe(2);
      expect(secondsToMinutes(121)).toBe(3);
    });
  });

  describe('secondsToMinutesAndSeconds', () => {
    it('should convert seconds to minutes and seconds object', () => {
      expect(secondsToMinutesAndSeconds(0)).toEqual({ minutes: 0, seconds: 0 });
      expect(secondsToMinutesAndSeconds(1)).toEqual({ minutes: 0, seconds: 1 });
      expect(secondsToMinutesAndSeconds(59)).toEqual({ minutes: 0, seconds: 59 });
      expect(secondsToMinutesAndSeconds(60)).toEqual({ minutes: 1, seconds: 0 });
      expect(secondsToMinutesAndSeconds(61)).toEqual({ minutes: 1, seconds: 1 });
      expect(secondsToMinutesAndSeconds(120)).toEqual({ minutes: 2, seconds: 0 });
      expect(secondsToMinutesAndSeconds(125)).toEqual({ minutes: 2, seconds: 5 });
    });
  });

  describe('formatDuration', () => {
    it('should format duration in human-readable format', () => {
      expect(formatDuration(0)).toBe('0 seconds');
      expect(formatDuration(1)).toBe('1 seconds');
      expect(formatDuration(30)).toBe('30 seconds');
      expect(formatDuration(59)).toBe('59 seconds');
      expect(formatDuration(60)).toBe('1 minute');
      expect(formatDuration(61)).toBe('1 minute 1 second'); // Note: function handles singular seconds in mixed format
      expect(formatDuration(119)).toBe('1 minute 59 seconds');
      expect(formatDuration(120)).toBe('2 minutes');
      expect(formatDuration(121)).toBe('2 minutes 1 second');
      expect(formatDuration(180)).toBe('3 minutes');
    });
  });
});