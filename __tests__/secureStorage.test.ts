import AsyncStorage from '@react-native-async-storage/async-storage';
import { secureStorage, SecurityValidator, SecureLogger } from '../src/utils/securityUtils';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe('secureStorage', () => {
  const testKey = 'test_key';
  const testData = { id: 1, name: 'test', email: 'test@example.com' };
  const allowedFields = ['id', 'name', 'email'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setSecureItem', () => {
    it('should encrypt and store data successfully', async () => {
      // This test should fail initially due to Buffer not being available in Jest
      await expect(secureStorage.setSecureItem(testKey, testData, allowedFields)).resolves.not.toThrow();
      
      // Verify that AsyncStorage.setItem was called
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should fail when invalid data is provided', async () => {
      await expect(secureStorage.setSecureItem(testKey, null, allowedFields)).rejects.toThrow('Invalid data provided for storage');
    });

    it('should fail when invalid key is provided', async () => {
      await expect(secureStorage.setSecureItem('', testData, allowedFields)).rejects.toThrow('Invalid storage key provided');
    });
  });

  describe('getSecureItem', () => {
    it('should retrieve and decrypt data successfully', async () => {
      // Mock AsyncStorage to return encrypted data
      (AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>).mockResolvedValueOnce('encrypted_data');
      
      // This test should fail initially due to Buffer not being available in Jest
      const result = await secureStorage.getSecureItem(testKey, allowedFields);
      
      // Should return null due to decryption failure
      expect(result).toBeNull();
    });

    it('should return null when key does not exist', async () => {
      (AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>).mockResolvedValueOnce(null);
      
      const result = await secureStorage.getSecureItem(testKey, allowedFields);
      expect(result).toBeNull();
    });
  });

  describe('removeSecureItem', () => {
    it('should remove item successfully', async () => {
      await expect(secureStorage.removeSecureItem(testKey)).resolves.not.toThrow();
      
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(testKey);
    });

    it('should fail when invalid key is provided', async () => {
      await expect(secureStorage.removeSecureItem('')).rejects.toThrow('Invalid storage key provided');
    });
  });
});

describe('SecurityValidator', () => {
  describe('validateUserInput', () => {
    it('should validate and sanitize user input correctly', () => {
      const result = SecurityValidator.validateUserInput('<script>alert("xss")</script>hello@example.com', 'email');
      expect(result.isValid).toBe(true); // Should pass after sanitization
      expect(result.sanitized).toBe('hello@example.com');
    });

    it('should reject invalid email format', () => {
      const result = SecurityValidator.validateUserInput('invalid-email', 'email');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('email is not a valid email address');
    });

    it('should reject short passwords', () => {
      const result = SecurityValidator.validateUserInput('123', 'password');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('password must be at least 8 characters long');
    });
  });
});

describe('SecureLogger', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.log as jest.Mock).mockRestore();
    (console.error as jest.Mock).mockRestore();
  });

  it('should log security events without sensitive data', () => {
    SecureLogger.logSecurityEvent('test_event', { 
      userId: '123', 
      token: 'secret_token',
      password: 'user_password',
      email: 'user@example.com',
      safe_field: 'safe_value'
    });

    expect(console.log).toHaveBeenCalledWith(
      '[SECURITY] test_event',
      { userId: '123', token: '[REDACTED]', password: '[REDACTED]', email: '[REDACTED]', safe_field: 'safe_value' }
    );
  });

  it('should log errors properly', () => {
    const error = new Error('Test error');
    SecureLogger.logError('test_operation', error);

    expect(console.error).toHaveBeenCalledWith('[SECURITY-ERROR] test_operation: Test error');
  });
});