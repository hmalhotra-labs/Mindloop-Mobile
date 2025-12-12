// Test that verifies Session model exists and has correct structure
describe('Session Model', () => {
  let Session: any;

  beforeAll(() => {
    try {
      // Try to import the Session model - this will throw if it doesn't exist
      const sessionModule = require('../src/models/Session');
      Session = sessionModule.Session;
    } catch (error) {
      // If import fails, the tests will fail appropriately
      throw new Error(`Failed to import Session model: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  describe('Session interface', () => {
    it('should have all required properties', () => {
      const session = new Session({
        id: 1,
        userId: 123,
        duration: 600,
        mood: 'calm',
        completedAt: new Date('2025-12-11T10:00:00Z'),
        type: 'meditation'
      });

      expect(session.id).toBe(1);
      expect(session.userId).toBe(123);
      expect(session.duration).toBe(600);
      expect(session.mood).toBe('calm');
      expect(session.completedAt).toEqual(new Date('2025-12-11T10:00:00Z'));
      expect(session.type).toBe('meditation');
    });

    it('should handle different session types', () => {
      const breathingSession = new Session({
        id: 2,
        userId: 456,
        duration: 300,
        mood: 'focused',
        completedAt: new Date('2025-12-11T11:30:00Z'),
        type: 'breathing'
      });

      expect(breathingSession.type).toBe('breathing');
      expect(breathingSession.duration).toBe(300);
    });
  });
});