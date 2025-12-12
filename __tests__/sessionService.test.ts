import { SessionService, SessionState } from '../src/services/sessionService';

describe('SessionService', () => {
  let sessionService: SessionService;

  beforeEach(() => {
    sessionService = new SessionService();
  });

  describe('initial state', () => {
    it('should initialize with not_started state', () => {
      expect(sessionService.getState()).toBe('not_started');
    });

    it('should have zero remaining time initially', () => {
      expect(sessionService.getRemainingTime()).toBe(0);
    });
  });

  describe('starting a session', () => {
    it('should transition from not_started to running when starting session', () => {
      sessionService.startSession(300); // 5 minutes
      expect(sessionService.getState()).toBe('running');
    });

    it('should set the correct remaining time when starting session', () => {
      sessionService.startSession(180); // 3 minutes
      expect(sessionService.getRemainingTime()).toBe(180);
    });

    it('should throw error for invalid duration (negative)', () => {
      expect(() => sessionService.startSession(-1)).toThrow('Invalid duration');
    });

    it('should throw error for invalid duration (zero)', () => {
      expect(() => sessionService.startSession(0)).toThrow('Invalid duration');
    });

    it('should throw error for excessive duration', () => {
      expect(() => sessionService.startSession(7201)).toThrow('Duration exceeds maximum');
    });
  });

  describe('timer countdown', () => {
    beforeEach(() => {
      sessionService.startSession(5); // 5 seconds for testing
    });

    it('should decrement remaining time when ticking', () => {
      sessionService.tick();
      expect(sessionService.getRemainingTime()).toBe(4);
    });

    it('should decrement multiple times', () => {
      sessionService.tick();
      sessionService.tick();
      expect(sessionService.getRemainingTime()).toBe(3);
    });

    it('should not go below zero', () => {
      // Create fresh service instance to avoid beforeEach conflict
      const freshService = new SessionService();
      
      // Start with 1 second
      freshService.startSession(1);
      freshService.tick();
      expect(freshService.getRemainingTime()).toBe(0);
      
      // Try to tick again
      freshService.tick();
      expect(freshService.getRemainingTime()).toBe(0);
    });
  });

  describe('session control transitions', () => {
    beforeEach(() => {
      sessionService.startSession(300);
    });

    it('should transition from running to paused when pausing session', () => {
      sessionService.pauseSession();
      expect(sessionService.getState()).toBe('paused');
    });

    it('should transition from paused to running when resuming session', () => {
      sessionService.pauseSession();
      sessionService.resumeSession();
      expect(sessionService.getState()).toBe('running');
    });

    it('should transition to completed when stopping session', () => {
      sessionService.stopSession();
      expect(sessionService.getState()).toBe('completed');
    });

    it('should auto-complete when timer reaches zero', () => {
      // Create fresh service instance to avoid beforeEach conflict
      const freshService = new SessionService();
      
      freshService.startSession(2);
      freshService.tick();
      freshService.tick();
      expect(freshService.getState()).toBe('completed');
    });
  });

  describe('session data persistence', () => {
    beforeEach(() => {
      // Mock database service
      const mockDb = {
        createSession: jest.fn().mockResolvedValue({ id: 1 })
      };
      sessionService = new SessionService(mockDb as any);
    });

    it('should save session data when completing session', async () => {
      sessionService.startSession(300);
      await sessionService.stopSession();
      
      const sessionData = sessionService.getSessionData();
      expect(sessionData).toBeDefined();
      expect(sessionData.duration).toBe(300);
      expect(sessionData.type).toBe('breathing');
    });

    it('should persist session to database when completed', async () => {
      const mockDb = {
        createSession: jest.fn().mockResolvedValue({ id: 123 })
      };
      sessionService = new SessionService(mockDb as any);
      
      sessionService.startSession(180);
      await sessionService.stopSession();
      
      expect(mockDb.createSession).toHaveBeenCalledWith(
        expect.objectContaining({
          duration: 180,
          type: 'breathing'
        })
      );
    });
  });

  describe('error handling', () => {
    it('should throw error when trying to pause non-running session', () => {
      expect(() => sessionService.pauseSession()).toThrow('Cannot pause session that is not running');
    });

    it('should throw error when trying to resume non-paused session', () => {
      expect(() => sessionService.resumeSession()).toThrow('Cannot resume session that is not paused');
    });

    it('should throw error when starting session from non-not_started state', () => {
      sessionService.startSession(300);
      expect(() => sessionService.startSession(180)).toThrow('Session already started');
    });
  });

  describe('duration presets', () => {
    it('should support 1 minute duration', () => {
      sessionService.startSession(60);
      expect(sessionService.getDuration()).toBe(60);
    });

    it('should support 3 minute duration', () => {
      sessionService.startSession(180);
      expect(sessionService.getDuration()).toBe(180);
    });

    it('should support 5 minute duration', () => {
      sessionService.startSession(300);
      expect(sessionService.getDuration()).toBe(300);
    });

    it('should support custom durations', () => {
      sessionService.startSession(420); // 7 minutes
      expect(sessionService.getDuration()).toBe(420);
    });
  });
});