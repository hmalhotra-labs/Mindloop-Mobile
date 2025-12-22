// Test Firebase security configuration
describe('Firebase Security Configuration', () => {
  beforeEach(() => {
    // Reset environment variables before each test
    delete process.env.FIREBASE_API_KEY;
    delete process.env.FIREBASE_AUTH_DOMAIN;
    delete process.env.FIREBASE_PROJECT_ID;
    delete process.env.FIREBASE_STORAGE_BUCKET;
    delete process.env.FIREBASE_MESSAGING_SENDER_ID;
    delete process.env.FIREBASE_APP_ID;
    delete process.env.NODE_ENV;
  });

  describe('Environment Variable Security', () => {
    it('should validate environment variables properly', () => {
      // Import the module after setting environment variables
      jest.resetModules();
      
      // Set invalid environment variables
      process.env.FIREBASE_API_KEY = '';
      process.env.FIREBASE_AUTH_DOMAIN = '';
      process.env.FIREBASE_PROJECT_ID = '';
      process.env.FIREBASE_STORAGE_BUCKET = '';
      process.env.FIREBASE_MESSAGING_SENDER_ID = '';
      process.env.FIREBASE_APP_ID = '';
      
      // Import the module
      const firebase = require('../src/config/firebase');
      
      // Check that validation fails
      expect(firebase.isFirebaseConfigured()).toBe(false);
    });

    it('should reject obviously fake API keys', () => {
      jest.resetModules();
      
      // Set fake API key
      process.env.FIREBASE_API_KEY = 'your-api-key-here';
      process.env.FIREBASE_AUTH_DOMAIN = 'test.firebaseapp.com';
      process.env.FIREBASE_PROJECT_ID = 'test-project';
      process.env.FIREBASE_STORAGE_BUCKET = 'test.appspot.com';
      process.env.FIREBASE_MESSAGING_SENDER_ID = '123456789012';
      process.env.FIREBASE_APP_ID = '1:123456789012:web:abcdef123456';
      
      const firebase = require('../src/config/firebase');
      
      // Should reject fake API keys
      expect(firebase.isFirebaseConfigured()).toBe(false);
    });

    it('should reject test values in production', () => {
      jest.resetModules();
      
      // Set production environment with test values
      process.env.NODE_ENV = 'production';
      process.env.FIREBASE_API_KEY = 'test-api-key';
      process.env.FIREBASE_AUTH_DOMAIN = 'test.firebaseapp.com';
      process.env.FIREBASE_PROJECT_ID = 'test-project';
      process.env.FIREBASE_STORAGE_BUCKET = 'test.appspot.com';
      process.env.FIREBASE_MESSAGING_SENDER_ID = '123456789012';
      process.env.FIREBASE_APP_ID = '1:123456789012:web:abcdef123456';
      
      const firebase = require('../src/config/firebase');
      
      // Should detect unsafe production configuration
      expect(firebase.isProductionSafe()).toBe(false);
    });

    it('should accept valid configuration', () => {
      jest.resetModules();
      
      // Set valid environment variables
      process.env.FIREBASE_API_KEY = 'valid-api-key-that-is-long-enough-and-not-fake';
      process.env.FIREBASE_AUTH_DOMAIN = 'valid-project.firebaseapp.com';
      process.env.FIREBASE_PROJECT_ID = 'valid-project-id';
      process.env.FIREBASE_STORAGE_BUCKET = 'valid-project-id.appspot.com';
      process.env.FIREBASE_MESSAGING_SENDER_ID = '123456789012';
      process.env.FIREBASE_APP_ID = '1:123456789012:web:abcdef123456';
      
      const firebase = require('../src/config/firebase');
      
      // Should accept valid configuration
      expect(firebase.isFirebaseConfigured()).toBe(true);
      expect(firebase.isProductionSafe()).toBe(true);
    });
  });
});