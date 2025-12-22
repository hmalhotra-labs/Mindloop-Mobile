import { AuthService } from '../src/services/authService';

// Firebase mocks are now centralized in jest.setup.js
// This ensures consistent mock behavior across all tests

describe('AuthService', () => {
  test('should create user account successfully', async () => {
    const authService = new AuthService();
    const result = await authService.createUser('test@example.com', 'Password123');
    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('test@example.com');
  });

  test('should login user successfully', async () => {
    const authService = new AuthService();
    const result = await authService.login('test@example.com', 'Password123');
    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('test@example.com');
  });
});