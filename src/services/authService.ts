import { firebaseAuth, getFirebaseErrorMessage } from '../config/firebase';
import { secureStorage, SecurityValidator, SecureLogger } from '../utils/securityUtils';

interface AuthResult {
  success: boolean;
  user?: any | null;
  error?: string;
}

export class AuthService {
  private currentUser: any = null;

  /**
   * Validates email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validates password strength
   */
  private isValidPassword(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    // Allow special characters
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    
    return passwordRegex.test(password);
  }

  /**
   * Creates a new user account with email and password
   */
  async createUser(email: string, password: string): Promise<AuthResult> {
    try {
      // Input validation
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      if (!this.isValidEmail(email)) {
        return { success: false, error: 'Invalid email format' };
      }

      if (!this.isValidPassword(password)) {
        return {
          success: false,
          error: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number'
        };
      }

      // Create user with Firebase Auth
      const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Store user data securely in storage for offline access
      try {
        await secureStorage.setSecureItem('mindloop_user', {
          email: user.email,
          id: user.uid,
          createdAt: user.metadata.creationTime || new Date().toISOString()
        }, ['email', 'id', 'createdAt']);
        SecureLogger.logSecurityEvent('user_data_stored', { userId: user.uid });
      } catch (storageError) {
        SecureLogger.logError('Failed to store user data', storageError as Error);
      }

      return {
        success: true,
        user: {
          email: user.email,
          id: user.uid,
          createdAt: user.metadata.creationTime || new Date().toISOString()
        }
      };
    } catch (error: any) {
      // Map Firebase errors to user-friendly messages
      const errorMessage = getFirebaseErrorMessage(error.code) || error.message;
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Signs in user with email and password
   */
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      // Input validation
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      if (!this.isValidEmail(email)) {
        return { success: false, error: 'Invalid email format' };
      }

      // Sign in with Firebase Auth
      const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Store user data securely in storage for offline access
      try {
        await secureStorage.setSecureItem('mindloop_user', {
          email: user.email,
          id: user.uid,
          lastLogin: new Date().toISOString()
        }, ['email', 'id', 'lastLogin']);
        SecureLogger.logSecurityEvent('user_login_data_stored', { userId: user.uid });
      } catch (storageError) {
        SecureLogger.logError('Failed to store login data', storageError as Error);
      }

      return {
        success: true,
        user: {
          email: user.email,
          id: user.uid,
          lastLogin: new Date().toISOString()
        }
      };
    } catch (error: any) {
      // Map Firebase errors to user-friendly messages
      const errorMessage = getFirebaseErrorMessage(error.code) || error.message;
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Signs out the current user
   */
  async logout(): Promise<void> {
    try {
      await firebaseAuth.signOut();
      this.currentUser = null;
      
      // Remove user data from secure storage
      try {
        await secureStorage.removeSecureItem('mindloop_user');
        SecureLogger.logSecurityEvent('user_data_removed', { userId: this.currentUser?.id });
      } catch (storageError) {
        SecureLogger.logError('Failed to remove user data', storageError as Error);
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to sign out');
    }
  }

  /**
   * Gets the current authenticated user
   */
  async getCurrentUser(): Promise<any | null> {
    // Check if we already have the user in memory
    if (this.currentUser) {
      return this.currentUser;
    }
    
    // Check Firebase Auth current user
    const firebaseUser = firebaseAuth.currentUser;
    if (firebaseUser) {
      this.currentUser = {
        email: firebaseUser.email,
        id: firebaseUser.uid,
        lastLogin: new Date().toISOString()
      };
      return this.currentUser;
    }
    
    // Try to get from secure storage as fallback
    try {
      const userData = await secureStorage.getSecureItem('mindloop_user', ['email', 'id', 'lastLogin', 'createdAt']);
      if (userData) {
        this.currentUser = userData;
        SecureLogger.logSecurityEvent('user_data_retrieved_from_storage', { userId: userData.id });
        return this.currentUser;
      }
    } catch (storageError) {
      SecureLogger.logError('Failed to retrieve user data', storageError as Error);
    }
    
    return null;
  }

  /**
   * Checks if user is authenticated
   */
  isAuthenticated(): boolean {
    return firebaseAuth.currentUser !== null || this.currentUser !== null;
  }

  /**
   * Resets user password
   */
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!email) {
        return { success: false, error: 'Email is required' };
      }

      if (!this.isValidEmail(email)) {
        return { success: false, error: 'Invalid email format' };
      }

      // Use Firebase to send a password reset email
      await firebaseAuth.sendPasswordResetEmail(email);
      
      return { success: true };
    } catch (error: any) {
      const errorMessage = getFirebaseErrorMessage(error.code) || error.message;
      return {
        success: false,
        error: errorMessage
      };
    }
  }
}