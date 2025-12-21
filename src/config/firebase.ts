import AsyncStorage from '@react-native-async-storage/async-storage';

// Development configuration (replace with actual values in production)
export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyExampleKeyReplaceInProduction",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "mindloop-dev.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "mindloop-dev",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "mindloop-dev.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

// Initialize Firebase app (handled by @react-native-firebase/app automatically)
// For testing purposes, we'll use a mock implementation
export const firebaseApp = {
  name: 'mindloop-dev',
  options: firebaseConfig
};

// Firebase services (mock implementations for testing)
export const firebaseAuth = {
  currentUser: null,
  onAuthStateChanged: () => {},
  createUserWithEmailAndPassword: async () => { throw new Error('Not implemented'); },
  signInWithEmailAndPassword: async () => { throw new Error('Not implemented'); },
  signOut: async () => { throw new Error('Not implemented'); },
  sendPasswordResetEmail: async () => { throw new Error('Not implemented'); }
};

export const firebaseFirestore = {
  collection: () => ({ add: () => Promise.resolve(), doc: () => ({ set: () => Promise.resolve(), get: () => Promise.resolve({ exists: () => false, data: () => null }) }) }),
  doc: () => ({ get: () => Promise.resolve({ exists: () => false, data: () => null }), set: () => Promise.resolve(), update: () => Promise.resolve() }),
  addDoc: () => Promise.resolve(),
  getDocs: () => Promise.resolve({ docs: [] }),
  onSnapshot: () => () => {}
};

// Utility functions
export const isFirebaseConfigured = (): boolean => {
  return firebaseConfig.apiKey !== "AIzaSyExampleKeyReplaceInProduction";
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