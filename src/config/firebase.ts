// Firebase configuration using environment variables with proper validation
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Secure logging that doesn't expose sensitive data
const secureLogger = {
  error: (message: string, details?: any) => {
    // Only log non-sensitive information
    if (process.env.NODE_ENV === 'production') {
      // In production, only log that validation failed without details
      console.error('Firebase configuration validation failed');
    } else {
      // In development, log full details for debugging
      console.error(message, details);
    }
  },
  log: (message: string) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(message);
    }
  }
};

// Validate environment variables for security
export const validateEnvironmentVariables = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Required Firebase environment variables
  const requiredEnvVars = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID'
  ];

  // Check for missing variables
  requiredEnvVars.forEach(envVar => {
    const value = process.env[envVar];
    if (!value || value.trim() === '') {
      errors.push(`Missing required environment variable: ${envVar}`);
    } else if (envVar === 'FIREBASE_API_KEY' && value.length < 20) {
      errors.push(`Environment variable ${envVar} appears to be too short`);
    } else if (envVar === 'FIREBASE_MESSAGING_SENDER_ID' && value.length < 9) {
      errors.push(`Environment variable ${envVar} appears to be too short`);
    }
  });

  // Check for obvious development/test values
  const forbiddenPatterns = [
    'test-api-key',
    'your-api-key-here',
    'demo-api-key',
    'example-api-key',
    'fake-api-key',
    'test-auth-domain',
    'test-project-id',
    'test-storage-bucket',
    'test-app-id'
  ];

  Object.keys(process.env).forEach(envKey => {
    const value = process.env[envKey];
    if (value && forbiddenPatterns.some(pattern => value.toLowerCase().includes(pattern))) {
      // Don't expose actual values in error messages
      errors.push(`Environment variable ${envKey} contains forbidden development/test value`);
    }
  });

  // Additional validation for production environment
  if (process.env.NODE_ENV === 'production') {
    requiredEnvVars.forEach(envVar => {
      const value = process.env[envVar];
      if (value && (
        value.toLowerCase().includes('test') ||
        value.toLowerCase().includes('dev') ||
        value.toLowerCase().includes('example') ||
        value.toLowerCase().includes('demo') ||
        value.toLowerCase().includes('fake')
      )) {
        errors.push(`CRITICAL: Production environment variable ${envVar} contains non-production value`);
      }
    });
  }

  return {
      isValid: errors.length === 0,
      errors
    };
  };

// Securely load Firebase configuration dynamically
export const getFirebaseConfig = (): FirebaseConfig => {
  return {
    apiKey: process.env.FIREBASE_API_KEY || "",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.FIREBASE_APP_ID || ""
  };
};

// Export firebaseConfig for backward compatibility (but make it dynamic)
export const firebaseConfig = getFirebaseConfig();

// Validate environment variables on import (but be aware this may run during tests)
// Validate environment variables
const validation = validateEnvironmentVariables();

if (!validation.isValid) {
  secureLogger.error('Firebase configuration validation failed');
  if (process.env.NODE_ENV !== 'production') {
    validation.errors.forEach(error => secureLogger.error(`  - ${error}`));
    secureLogger.error('Application will not function properly without valid Firebase configuration.');
    secureLogger.error('Please set the required environment variables for production use.');
  }
} else {
  secureLogger.log('Firebase configuration validated successfully.');
}

// Additional security: Check if we're in production and warn about missing config
if (process.env.NODE_ENV === 'production' && !validation.isValid) {
  secureLogger.error('CRITICAL: Running in production without proper Firebase configuration!');
  secureLogger.error('This will cause authentication and data services to fail.');
}

// Initialize Firebase app (handled by @react-native-firebase/app automatically)
export const firebaseApp = {
  name: process.env.FIREBASE_APP_NAME || 'mindloop',
  options: firebaseConfig
};

// Import Firebase modules for production use - using null implementations to avoid runtime errors
let firebaseAuth: any = null;
let firebaseFirestore: any = null;

// Utility functions with enhanced validation
export const isFirebaseConfigured = (): boolean => {
  // Double-check that all required environment variables are set and not empty
  const requiredEnvVars = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID'
  ];

  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar];
    if (!value || value.trim() === '') {
      return false;
    }
  }

  return true;
};

// Additional security utility to check if configuration is safe for production
export const isProductionSafe = (): boolean => {
  if (process.env.NODE_ENV !== 'production') {
    return true; // Not in production, so always safe
  }

  const validation = validateEnvironmentVariables();
  
  // Additional production-specific checks
  if (validation.isValid) {
    // Ensure no test values are present in production
    const requiredEnvVars = [
      'FIREBASE_API_KEY',
      'FIREBASE_AUTH_DOMAIN',
      'FIREBASE_PROJECT_ID',
      'FIREBASE_STORAGE_BUCKET',
      'FIREBASE_MESSAGING_SENDER_ID',
      'FIREBASE_APP_ID'
    ];

    for (const envVar of requiredEnvVars) {
      const value = process.env[envVar];
      if (value && (
        value.toLowerCase().includes('test') ||
        value.toLowerCase().includes('dev') ||
        value.toLowerCase().includes('example') ||
        value.toLowerCase().includes('demo') ||
        value.toLowerCase().includes('fake')
      )) {
        return false;
      }
    }
  }
  
  return validation.isValid;
};

export const getFirebaseErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/user-not-found': 'User not found. Please check your email or create an account.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'This email is already registered. Please use a different email.',
    'auth/weak-password': 'Password is too weak. Please choose a stronger password.',
    'auth/invalid-email': 'Invalid email address. Please check your email format.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection and try again.',
    'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact support.'
  };
  
  return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
};

// Additional validation functions for specific Firebase configuration parameters

// Validate the entire Firebase configuration object
export const validateFirebaseConfig = (config: FirebaseConfig): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!config.apiKey || config.apiKey.trim() === '') {
    errors.push('Firebase API key is required');
  } else if (config.apiKey.length < 20) {
    errors.push('Firebase API key appears to be too short');
  }
  
  if (!config.authDomain || config.authDomain.trim() === '') {
    errors.push('Firebase auth domain is required');
  } else if (!config.authDomain.includes('.firebaseapp.com') && !config.authDomain.includes('.auth0.com')) {
    errors.push('Firebase auth domain should typically contain ".firebaseapp.com"');
  }
  
  if (!config.projectId || config.projectId.trim() === '') {
    errors.push('Firebase project ID is required');
  } else if (!/^[a-z0-9-]+$/.test(config.projectId)) {
    errors.push('Firebase project ID should contain only lowercase letters, numbers, and hyphens');
  }
  
  if (!config.storageBucket || config.storageBucket.trim() === '') {
    errors.push('Firebase storage bucket is required');
  } else if (!config.storageBucket.includes('.appspot.com')) {
    errors.push('Firebase storage bucket should typically contain ".appspot.com"');
  }
  
  if (!config.messagingSenderId || config.messagingSenderId.trim() === '') {
    errors.push('Firebase messaging sender ID is required');
  } else if (config.messagingSenderId.length < 9) {
    errors.push('Firebase messaging sender ID appears to be too short');
  }
  
  if (!config.appId || config.appId.trim() === '') {
    errors.push('Firebase app ID is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate API key format
export const validateApiKeyFormat = (apiKey: string): boolean => {
  if (!apiKey || apiKey.trim() === '') {
    return false;
  }
  
  // Firebase API keys are typically long alphanumeric strings with some special characters
  // They are usually at least 20 characters long
  return apiKey.length >= 20 && apiKey.length <= 100;
};

// Validate project ID format
export const validateProjectIdFormat = (projectId: string): boolean => {
  if (!projectId || projectId.trim() === '') {
    return false;
  }
  
  // Firebase project IDs are typically lowercase with hyphens
  return /^[a-z0-9-]+$/.test(projectId) && projectId.length >= 6;
};

// Validate auth domain format
export const validateAuthDomainFormat = (authDomain: string): boolean => {
  if (!authDomain || authDomain.trim() === '') {
    return false;
  }
  
  // Should be a valid domain name
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](\.[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9])*(\.[a-zA-Z]{2,})$/;
  return domainRegex.test(authDomain);
};

// Validate storage bucket format
export const validateStorageBucketFormat = (storageBucket: string): boolean => {
  if (!storageBucket || storageBucket.trim() === '') {
    return false;
  }
  
  // Should be a valid GCS bucket name ending with .appspot.com
  const bucketRegex = /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/;
  return bucketRegex.test(storageBucket) && storageBucket.includes('.appspot.com');
};

// Validate app ID format
export const validateAppIdFormat = (appId: string): boolean => {
  if (!appId || appId.trim() === '') {
    return false;
  }
  
  // Firebase app IDs are typically alphanumeric with colons and hyphens
  return /^[a-zA-Z0-9:.-]+$/.test(appId) && appId.length >= 10;
};

// Validate messaging sender ID format
export const validateMessagingSenderIdFormat = (senderId: string): boolean => {
  if (!senderId || senderId.trim() === '') {
    return false;
  }
  
  // Messaging sender IDs are typically numeric
  return /^\d+$/.test(senderId) && senderId.length >= 9;
};

export { firebaseAuth, firebaseFirestore };