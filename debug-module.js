// Simple test to see if the module loads properly
const fs = require('fs');

console.log('Testing module loading...');

// Check if the file exists
if (!fs.existsSync('./src/config/firebase.ts')) {
  console.error('Firebase config file does not exist');
  process.exit(1);
}

console.log('File exists, checking exports...');

// Try to load the module
try {
  const firebase = require('./src/config/firebase.ts');
  console.log('Module loaded successfully');
  console.log('Available exports:', Object.keys(firebase));
  
  // Check for specific functions
  const functionsToCheck = [
    'validateEnvironmentVariables',
    'isProductionSafe', 
    'getFirebaseConfig',
    'validateFirebaseConfig',
    'validateApiKeyFormat',
    'validateProjectIdFormat',
    'validateAuthDomainFormat',
    'validateStorageBucketFormat',
    'validateAppIdFormat',
    'validateMessagingSenderIdFormat',
    'isFirebaseConfigured',
    'getFirebaseErrorMessage',
    'firebaseConfig'
  ];
  
  console.log('\nFunction availability check:');
  functionsToCheck.forEach(func => {
    console.log(`${func}: ${typeof firebase[func]}`);
  });
} catch (error) {
  console.error('Error loading module:', error.message);
  console.error('Stack:', error.stack);
}