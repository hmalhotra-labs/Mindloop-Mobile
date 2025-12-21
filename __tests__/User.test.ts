// Test that verifies User model exists and has correct structure
describe('User Model', () => {
  let User: any;
  let UserPreferences: any;

  beforeAll(() => {
    try {
      // Try to import the User model - this will throw if it doesn't exist
      const userModule = require('../src/models/User');
      User = userModule.User;
      UserPreferences = userModule.UserPreferences;
    } catch (error) {
      // If import fails, the tests will fail appropriately
      throw new Error(`Failed to import User model: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  describe('User interface', () => {
    it('should have all required properties', () => {
      const user = new User({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date('2025-01-01'),
        preferences: {
          theme: 'dark',
          notifications: true
        }
      });

      expect(user.id).toBe(1);
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.createdAt).toEqual(new Date('2025-01-01'));
      expect(user.preferences).toEqual({
        theme: 'dark',
        notifications: true
      });
    });

    it('should allow optional preferences', () => {
      const user = new User({
        id: 2,
        email: 'minimal@example.com',
        name: 'Minimal User',
        createdAt: new Date('2025-01-01')
        // preferences is optional
      });

      expect(user.id).toBe(2);
      expect(user.email).toBe('minimal@example.com');
      expect(user.name).toBe('Minimal User');
      expect(user.preferences).toBeUndefined();
    });

    it('should export UserPreferences interface', () => {
      // UserPreferences is an interface, not a class, so we can't instantiate it
      // Instead, we'll verify that the User class can accept UserPreferences
      const userData = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date('2025-01-01'),
        preferences: {
          theme: 'light',
          notifications: false
        }
      };

      const user = new User(userData);
      expect(user.preferences).toEqual({
        theme: 'light',
        notifications: false
      });
    });
  });
});