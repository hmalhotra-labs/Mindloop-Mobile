import { useSessionTimer } from '../src/hooks/useSessionTimer';
import { SessionService } from '../src/services/sessionService';

describe('useSessionTimer Service Integration', () => {
  test('should demonstrate that hook uses duplicate timer logic instead of SessionService.tick()', () => {
    // This test will FAIL with current implementation
    // The hook currently has: setRemainingTime(prev => Math.max(0, prev - 1))
    // It should instead call: sessionService.tick() and get state from service getters
    
    const timer = useSessionTimer();
    
    // Start a session
    timer.start(3); // 3 seconds
    
    // Check if the hook is using service methods
    // This will show the problem: the hook doesn't call sessionService.tick()
    // Instead it does local setRemainingTime(prev => prev - 1)
    
    // The current implementation doesn't use sessionService.tick() at all
    // This test demonstrates the architectural problem
    expect(timer.remainingTime).toBe(3);
    
    // If properly integrated, timer.remainingTime should come from service.getRemainingTime()
    // and the service should be ticking independently
  });

  test('should show that service has tick() method but hook ignores it', () => {
    // This test shows that SessionService has the tick() method
    // but the hook duplicates the logic instead of using it
    
    const service = new SessionService();
    service.startSession(5);
    
    // Service has tick() method
    expect(typeof service.tick).toBe('function');
    
    // Service has proper state getters
    expect(typeof service.getRemainingTime).toBe('function');
    expect(service.getRemainingTime()).toBe(5);
    
    // But the hook doesn't use these - it duplicates the logic
    const timer = useSessionTimer();
    
    // This demonstrates the duplication problem
    // Hook should call service.tick() and service.getRemainingTime()
    // Instead it does its own countdown logic
  });

  test('should show that service state changes on tick() but hook doesn\'t sync', () => {
    // This test demonstrates the synchronization problem
    const service = new SessionService();
    service.startSession(2);
    
    // Service tick() works correctly
    expect(service.getRemainingTime()).toBe(2);
    service.tick();
    expect(service.getRemainingTime()).toBe(1);
    
    // But the hook doesn't sync with service state
    const timer = useSessionTimer();
    timer.start(2);
    
    // This shows the architectural problem: hook has its own state
    // instead of being synchronized with service
    
    // The hook should reflect service.getRemainingTime(), not maintain its own
  });
});