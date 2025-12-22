// Simple test to check if Firebase module loads correctly
const path = require('path');

// Set up environment to simulate Jest
process.env.NODE_ENV = 'test';

console.log('Testing Firebase module loading...');

try {
  // Try to require the Firebase config
  const firebaseModule = require('./src/config/firebase.ts');
  console.log('Module loaded successfully');
  console.log('Available exports:', Object.keys(firebaseModule));
  
  // Check if specific functions exist
  console.log('\nChecking specific functions:');
  console.log('validateEnvironmentVariables exists:', typeof firebaseModule.validateEnvironmentVariables);
  console.log('isProductionSafe exists:', typeof firebaseModule.isProductionSafe);
  console.log('getFirebaseConfig exists:', typeof firebaseModule.getFirebaseConfig);
  console.log('validateFirebaseConfig exists:', typeof firebaseModule.validateFirebaseConfig);
  console.log('validateApiKeyFormat exists:', typeof firebaseModule.validateApiKeyFormat);
  console.log('validateProjectIdFormat exists:', typeof firebaseModule.validateProjectIdFormat);
  console.log('validateAuthDomainFormat exists:', typeof firebaseModule.validateAuthDomainFormat);
  console.log('validateStorageBucketFormat exists:', typeof firebaseModule.validateStorageBucketFormat);
  console.log('validateAppIdFormat exists:', typeof firebaseModule.validateAppIdFormat);
  console.log('validateMessagingSenderIdFormat exists:', typeof firebaseModule.validateMessagingSenderIdFormat);
  console.log('isFirebaseConfigured exists:', typeof firebaseModule.isFirebaseConfigured);
  
} catch (error) {
  console.error('Error loading Firebase module:', error.message);
  console.error('Stack:', error.stack);
}