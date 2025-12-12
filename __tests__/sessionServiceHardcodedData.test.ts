import { SessionService, SessionConfig } from '../src/services/sessionService';

describe('SessionService Hardcoded Data Fix', () => {
  test('should PASS when using custom session configuration', () => {
    // This test should PASS with current implementation when using custom config
    // Demonstrates that hardcoded values can be overridden
    
    const customConfig: SessionConfig = {
      userId: 123,
      mood: 'focused',
      type: 'meditation'
    };
    
    const service = new SessionService(undefined, customConfig);
    service.startSession(300);
    service.stopSession();
    
    const sessionData = service.getSessionData();
    
    // This should PASS with custom configuration
    expect(sessionData?.userId).toBe(123);
    expect(sessionData?.mood).toBe('focused');
    expect(sessionData?.type).toBe('meditation');
  });

  test('should support partial configuration updates', () => {
    // This test shows that partial updates work correctly
    const service = new SessionService();
    
    // Update only userId, keep other defaults
    service.updateSessionConfig({ userId: 789 });
    
    service.startSession(90);
    service.stopSession();
    
    const sessionData = service.getSessionData();
    
    // Should use custom userId with default mood and type
    expect(sessionData?.userId).toBe(789);
    expect(sessionData?.mood).toBe('peaceful'); // Default preserved
    expect(sessionData?.type).toBe('breathing'); // Default preserved
  });

  test('should allow custom session configuration', () => {
    // This test shows the desired behavior after the fix
    const service = new SessionService();
    
    // Service should support custom configuration
    service.updateSessionConfig({
      userId: 999,
      mood: 'energetic',
      type: 'breathing_exercise'
    });
    
    service.startSession(240);
    service.stopSession();
    
    const sessionData = service.getSessionData();
    
    // Should use the custom configuration
    expect(sessionData?.userId).toBe(999);
    expect(sessionData?.mood).toBe('energetic');
    expect(sessionData?.type).toBe('breathing_exercise');
  });

  test('should support configurable session metadata', () => {
    // This test demonstrates that session data is no longer hardcoded
    const customConfig: SessionConfig = {
      userId: 111,
      mood: 'balanced',
      type: 'mindfulness'
    };
    
    const service = new SessionService(undefined, customConfig);
    service.startSession(360); // 6 minutes
    service.stopSession();
    
    const sessionData = service.getSessionData();
    
    // All values should come from configuration, not hardcoded
    expect(sessionData?.userId).toBe(111);
    expect(sessionData?.mood).toBe('balanced');
    expect(sessionData?.type).toBe('mindfulness');
  });

  test('should use constructor-provided configuration', () => {
    // This test verifies that constructor config works
    const config: SessionConfig = {
      userId: 555,
      mood: 'relaxed',
      type: 'guided_meditation'
    };
    
    const service = new SessionService(undefined, config);
    service.startSession(180);
    service.stopSession();
    
    const sessionData = service.getSessionData();
    
    // Should use constructor-provided configuration
    expect(sessionData?.userId).toBe(555);
    expect(sessionData?.mood).toBe('relaxed');
    expect(sessionData?.type).toBe('guided_meditation');
  });
});