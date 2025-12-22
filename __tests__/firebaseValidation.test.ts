import { 
  firebaseConfig,
  validateEnvironmentVariables,
  isFirebaseConfigured,
  isProductionSafe,
  getFirebaseConfig,
  getFirebaseErrorMessage
} from '../src/config/firebase';

// Mock environment variables for testing
const originalEnv = process.env;

describe('Firebase Configuration Validation', () => {
  beforeEach(() => {
    // Reset environment variables before each test
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original environment variables after each test
    process.env = originalEnv;
  });

  describe('validateEnvironmentVariables', () => {
    test('should return valid when all required environment variables are present', () => {
      process.env.FIREBASE_API_KEY = 'valid-api-key-1234567890';
      process.env.FIREBASE_AUTH_DOMAIN = 'test-project.firebaseapp.com';
      process.env.FIREBASE_PROJECT_ID = 'test-project-id';
      process.env.FIREBASE_STORAGE_BUCKET = 'test-project.appspot.com';
      process.env.FIREBASE_MESSAGING_SENDER_ID = '1234567890';
      process.env.FIREBASE_APP_ID = 'valid-app-id-1234567890';

      const result = validateEnvironmentVariables();
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should return invalid when required environment variables are missing', () => {
      delete process.env.FIREBASE_API_KEY;
      delete process.env.FIREBASE_AUTH_DOMAIN;
      delete process.env.FIREBASE_PROJECT_ID;

      const result = validateEnvironmentVariables();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing required environment variable: FIREBASE_API_KEY');
      expect(result.errors).toContain('Missing required environment variable: FIREBASE_AUTH_DOMAIN');
      expect(result.errors).toContain('Missing required environment variable: FIREBASE_PROJECT_ID');
    });

    test('should return invalid when API key is too short', () => {
      process.env.FIREBASE_API_KEY = 'short';
      process.env.FIREBASE_AUTH_DOMAIN = 'test-project.firebaseapp.com';
      process.env.FIREBASE_PROJECT_ID = 'test-project-id';
      process.env.FIREBASE_STORAGE_BUCKET = 'test-project.appspot.com';
      process.env.FIREBASE_MESSAGING_SENDER_ID = '1234567890';
      process.env.FIREBASE_APP_ID = 'valid-app-id-1234567890';

      const result = validateEnvironmentVariables();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Environment variable FIREBASE_API_KEY appears to be too short');
    });

    test('should return invalid when messaging sender ID is too short', () => {
      process.env.FIREBASE_API_KEY = 'valid-api-key-1234567890';
      process.env.FIREBASE_AUTH_DOMAIN = 'test-project.firebaseapp.com';
      process.env.FIREBASE_PROJECT_ID = 'test-project-id';
      process.env.FIREBASE_STORAGE_BUCKET = 'test-project.appspot.com';
      process.env.FIREBASE_MESSAGING_SENDER_ID = '123';
      process.env.FIREBASE_APP_ID = 'valid-app-id-1234567890';

      const result = validateEnvironmentVariables();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Environment variable FIREBASE_MESSAGING_SENDER_ID appears to be too short');
    });

    test('should return invalid when environment contains forbidden development/test values', () => {
      process.env.FIREBASE_API_KEY = 'test-api-key';
      process.env.FIREBASE_AUTH_DOMAIN = 'test-auth-domain';
      process.env.FIREBASE_PROJECT_ID = 'test-project-id';
      process.env.FIREBASE_STORAGE_BUCKET = 'test-storage-bucket';
      process.env.FIREBASE_MESSAGING_SENDER_ID = '1234567890';
      process.env.FIREBASE_APP_ID = 'test-app-id';

      const result = validateEnvironmentVariables();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Environment variable FIREBASE_API_KEY contains forbidden development/test value');
      expect(result.errors).toContain('Environment variable FIREBASE_AUTH_DOMAIN contains forbidden development/test value');
      expect(result.errors).toContain('Environment variable FIREBASE_PROJECT_ID contains forbidden development/test value');
      expect(result.errors).toContain('Environment variable FIREBASE_STORAGE_BUCKET contains forbidden development/test value');
      expect(result.errors).toContain('Environment variable FIREBASE_APP_ID contains forbidden development/test value');
    });

    test('should return invalid for production environment with test values', () => {
      process.env.NODE_ENV = 'production';
      process.env.FIREBASE_API_KEY = 'test-api-key-123456789';
      process.env.FIREBASE_AUTH_DOMAIN = 'test-project.firebaseapp.com';
      process.env.FIREBASE_PROJECT_ID = 'test-project-id';
      process.env.FIREBASE_STORAGE_BUCKET = 'test-project.appspot.com';
      process.env.FIREBASE_MESSAGING_SENDER_ID = '1234567890';
      process.env.FIREBASE_APP_ID = 'valid-app-id-1234567890';

      const result = validateEnvironmentVariables();
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('CRITICAL: Production environment variable FIREBASE_API_KEY contains non-production value');
    });
  });

  describe('isFirebaseConfigured', () => {
    test('should return true when all required environment variables are set', () => {
      process.env.FIREBASE_API_KEY = 'valid-api-key-1234567890';
      process.env.FIREBASE_AUTH_DOMAIN = 'test-project.firebaseapp.com';
      process.env.FIREBASE_PROJECT_ID = 'test-project-id';
      process.env.FIREBASE_STORAGE_BUCKET = 'test-project.appspot.com';
      process.env.FIREBASE_MESSAGING_SENDER_ID = '1234567890';
      process.env.FIREBASE_APP_ID = 'valid-app-id-1234567890';

      const result = isFirebaseConfigured();
      expect(result).toBe(true);
    });

    test('should return false when required environment variables are missing', () => {
      delete process.env.FIREBASE_API_KEY;
      delete process.env.FIREBASE_AUTH_DOMAIN;

      const result = isFirebaseConfigured();
      expect(result).toBe(false);
    });

    test('should return false when environment variables are empty strings', () => {
      process.env.FIREBASE_API_KEY = '';
      process.env.FIREBASE_AUTH_DOMAIN = 'test-project.firebaseapp.com';
      process.env.FIREBASE_PROJECT_ID = 'test-project-id';
      process.env.FIREBASE_STORAGE_BUCKET = 'test-project.appspot.com';
      process.env.FIREBASE_MESSAGING_SENDER_ID = '1234567890';
      process.env.FIREBASE_APP_ID = 'valid-app-id-1234567890';

      const result = isFirebaseConfigured();
      expect(result).toBe(false);
    });
  });

  describe('isProductionSafe', () => {
    test('should return true in development when configuration is valid', () => {
      process.env.NODE_ENV = 'development';
      process.env.FIREBASE_API_KEY = 'valid-api-key-1234567890';
      process.env.FIREBASE_AUTH_DOMAIN = 'test-project.firebaseapp.com';
      process.env.FIREBASE_PROJECT_ID = 'test-project-id';
      process.env.FIREBASE_STORAGE_BUCKET = 'test-project.appspot.com';
      process.env.FIREBASE_MESSAGING_SENDER_ID = '1234567890';
      process.env.FIREBASE_APP_ID = 'valid-app-id-1234567890';

      const result = isProductionSafe();
      expect(result).toBe(true);
    });

    test('should return false in production when configuration contains test values', () => {
      process.env.NODE_ENV = 'production';
      process.env.FIREBASE_API_KEY = 'test-api-key-123456789';
      process.env.FIREBASE_AUTH_DOMAIN = 'test-project.firebaseapp.com';
      process.env.FIREBASE_PROJECT_ID = 'test-project-id';
      process.env.FIREBASE_STORAGE_BUCKET = 'test-project.appspot.com';
      process.env.FIREBASE_MESSAGING_SENDER_ID = '1234567890';
      process.env.FIREBASE_APP_ID = 'valid-app-id-1234567890';

      const result = isProductionSafe();
      expect(result).toBe(false);
    });

    test('should return false when configuration is invalid', () => {
      process.env.NODE_ENV = 'production';
      delete process.env.FIREBASE_API_KEY;

      const result = isProductionSafe();
      expect(result).toBe(false);
    });
  });

  describe('getFirebaseConfig', () => {
    test('should return Firebase configuration object with all required properties', () => {
      process.env.FIREBASE_API_KEY = 'test-api-key';
      process.env.FIREBASE_AUTH_DOMAIN = 'test.firebaseapp.com';
      process.env.FIREBASE_PROJECT_ID = 'test-project-id';
      process.env.FIREBASE_STORAGE_BUCKET = 'test.appspot.com';
      process.env.FIREBASE_MESSAGING_SENDER_ID = '123456789';
      process.env.FIREBASE_APP_ID = 'test-app-id';

      const config = getFirebaseConfig();
      expect(config).toHaveProperty('apiKey');
      expect(config).toHaveProperty('authDomain');
      expect(config).toHaveProperty('projectId');
      expect(config).toHaveProperty('storageBucket');
      expect(config).toHaveProperty('messagingSenderId');
      expect(config).toHaveProperty('appId');
    });

    test('should return empty strings when environment variables are not set', () => {
      delete process.env.FIREBASE_API_KEY;
      delete process.env.FIREBASE_AUTH_DOMAIN;
      delete process.env.FIREBASE_PROJECT_ID;
      delete process.env.FIREBASE_STORAGE_BUCKET;
      delete process.env.FIREBASE_MESSAGING_SENDER_ID;
      delete process.env.FIREBASE_APP_ID;

      const config = getFirebaseConfig();
      expect(config.apiKey).toBe('');
      expect(config.authDomain).toBe('');
      expect(config.projectId).toBe('');
      expect(config.storageBucket).toBe('');
      expect(config.messagingSenderId).toBe('');
      expect(config.appId).toBe('');
    });
  });

  describe('getFirebaseErrorMessage', () => {
    test('should return specific error message for known error codes', () => {
      expect(getFirebaseErrorMessage('auth/user-not-found'))
        .toBe('User not found. Please check your email or create an account.');
      expect(getFirebaseErrorMessage('auth/wrong-password'))
        .toBe('Incorrect password. Please try again.');
      expect(getFirebaseErrorMessage('auth/email-already-in-use'))
        .toBe('This email is already registered. Please use a different email.');
    });

    test('should return generic message for unknown error codes', () => {
      expect(getFirebaseErrorMessage('unknown-error-code'))
        .toBe('An unexpected error occurred. Please try again.');
    });
  });

  describe('firebaseConfig', () => {
    test('should have all required Firebase configuration properties', () => {
      expect(firebaseConfig).toHaveProperty('apiKey');
      expect(firebaseConfig).toHaveProperty('authDomain');
      expect(firebaseConfig).toHaveProperty('projectId');
      expect(firebaseConfig).toHaveProperty('storageBucket');
      expect(firebaseConfig).toHaveProperty('messagingSenderId');
      expect(firebaseConfig).toHaveProperty('appId');
    });
  });

  // Test for missing validation functions that should exist
  describe('Missing Validation Functions', () => {
    test('should have validateFirebaseConfig function that validates the entire config object', () => {
      // This test will fail until we implement the missing function
      expect(typeof (require('../src/config/firebase') as any).validateFirebaseConfig).toBe('function');
    });

    test('should have validateApiKeyFormat function that validates API key format', () => {
      // This test will fail until we implement the missing function
      expect(typeof (require('../src/config/firebase') as any).validateApiKeyFormat).toBe('function');
    });

    test('should have validateProjectIdFormat function that validates project ID format', () => {
      // This test will fail until we implement the missing function
      expect(typeof (require('../src/config/firebase') as any).validateProjectIdFormat).toBe('function');
    });

    test('should have validateAuthDomainFormat function that validates auth domain format', () => {
      // This test will fail until we implement the missing function
      expect(typeof (require('../src/config/firebase') as any).validateAuthDomainFormat).toBe('function');
    });

    test('should have validateStorageBucketFormat function that validates storage bucket format', () => {
      // This test will fail until we implement the missing function
      expect(typeof (require('../src/config/firebase') as any).validateStorageBucketFormat).toBe('function');
    });

    test('should have validateAppIdFormat function that validates app ID format', () => {
      // This test will fail until we implement the missing function
      expect(typeof (require('../src/config/firebase') as any).validateAppIdFormat).toBe('function');
    });

    test('should have validateMessagingSenderIdFormat function that validates messaging sender ID format', () => {
      // This test will fail until we implement the missing function
      expect(typeof (require('../src/config/firebase') as any).validateMessagingSenderIdFormat).toBe('function');
    });
  });
});