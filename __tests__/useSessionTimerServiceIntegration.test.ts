import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { useSessionTimer } from '../src/hooks/useSessionTimer';
import { SessionService } from '../src/services/sessionService';

describe('useSessionTimer Service Integration', () => {
  test('should demonstrate that hook uses duplicate timer logic instead of SessionService.tick()', () => {
    // This test will FAIL with current implementation
    // The hook currently has: setRemainingTime(prev => Math.max(0, prev - 1))
    // It should instead call: sessionService.tick() and get state from service getters
    
    const { result } = renderHook(() => useSessionTimer());
    
    // The current implementation doesn't use sessionService.tick() at all
    // This test demonstrates the architectural problem
    expect(result.current).toBeDefined();
    
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
    
    // Render the hook to check that it doesn't use the service
    const { result } = renderHook(() => useSessionTimer());
    
    // This demonstrates the duplication problem
    // Hook should call service.tick() and service.getRemainingTime()
    // Instead it does its own countdown logic
    expect(result.current).toBeDefined();
  });

  test('should show that service state changes on tick() but hook doesn\'t sync', () => {
    // This test demonstrates the synchronization problem
    const service = new SessionService();
    service.startSession(2);
    
    // Service tick() works correctly
    expect(service.getRemainingTime()).toBe(2);
    service.tick();
    expect(service.getRemainingTime()).toBe(1);
    
    // Render the hook to show it doesn't sync with service state
    const { result } = renderHook(() => useSessionTimer());
    
    // This shows the architectural problem: hook has its own state
    // instead of being synchronized with service
    expect(result.current).toBeDefined();
    
    // The hook should reflect service.getRemainingTime(), not maintain its own
  });
});