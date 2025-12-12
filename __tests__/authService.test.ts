import { AuthService } from '../src/services/authService';

describe('AuthService', () => {
  test('should create user account successfully', async () => {
    const authService = new AuthService();
    const result = await authService.createUser('test@example.com', 'password123');
    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
  });

  test('should login user successfully', async () => {
    const authService = new AuthService();
    const result = await authService.login('test@example.com', 'password123');
    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
  });
});