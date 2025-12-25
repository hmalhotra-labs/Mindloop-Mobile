import { User, UserData } from '../models/User';
import { Session, SessionData } from '../models/Session';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Database operation result types for better type safety
export interface DatabaseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UserOperationResult extends DatabaseResult<User> {}
export interface SessionOperationResult extends DatabaseResult<Session> {}

// Enhanced error types for better error handling
export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class DatabaseService {
  private isInitialized = false;
  private users: Map<number, User> = new Map();
  private sessions: Map<number, Session> = new Map();
  private nextUserId = 1;
  private nextSessionId = 1;

  // Storage keys for AsyncStorage
  private static readonly USERS_STORAGE_KEY = 'database_users';
  private static readonly SESSIONS_STORAGE_KEY = 'database_sessions';
  private static readonly NEXT_IDS_STORAGE_KEY = 'database_next_ids';

  async initialize(): Promise<void> {
    try {
      // Load data from AsyncStorage
      await this.loadFromStorage();
      this.isInitialized = true;
    } catch (error) {
      throw new DatabaseError(
        'Database initialization failed',
        'INIT_FAILED',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  // Private helper methods for AsyncStorage operations
  private async loadFromStorage(): Promise<void> {
    try {
      // Load users
      const usersData = await AsyncStorage.getItem(DatabaseService.USERS_STORAGE_KEY);
      if (usersData) {
        const usersArray = JSON.parse(usersData);
        this.users.clear();
        for (const userData of usersArray) {
          // Deserialize Date objects
          const user = new User({
            ...userData,
            createdAt: new Date(userData.createdAt)
          });
          this.users.set(user.id, user);
        }
      }

      // Load sessions
      const sessionsData = await AsyncStorage.getItem(DatabaseService.SESSIONS_STORAGE_KEY);
      if (sessionsData) {
        const sessionsArray = JSON.parse(sessionsData);
        this.sessions.clear();
        for (const sessionData of sessionsArray) {
          // Deserialize Date objects
          const session = new Session({
            ...sessionData,
            completedAt: new Date(sessionData.completedAt)
          });
          this.sessions.set(session.id, session);
        }
      }

      // Load next IDs
      const nextIdsData = await AsyncStorage.getItem(DatabaseService.NEXT_IDS_STORAGE_KEY);
      if (nextIdsData) {
        const nextIds = JSON.parse(nextIdsData);
        this.nextUserId = nextIds.nextUserId || 1;
        this.nextSessionId = nextIds.nextSessionId || 1;
      }
    } catch (error) {
      throw new DatabaseError(
        'Failed to load data from storage',
        'LOAD_FAILED',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  private async saveToStorage(): Promise<void> {
    try {
      // Save users
      const usersArray = Array.from(this.users.values()).map(user => ({
        ...user,
        createdAt: user.createdAt.toISOString() // Serialize Date to string
      }));
      await AsyncStorage.setItem(DatabaseService.USERS_STORAGE_KEY, JSON.stringify(usersArray));

      // Save sessions
      const sessionsArray = Array.from(this.sessions.values()).map(session => ({
        ...session,
        completedAt: session.completedAt.toISOString() // Serialize Date to string
      }));
      await AsyncStorage.setItem(DatabaseService.SESSIONS_STORAGE_KEY, JSON.stringify(sessionsArray));

      // Save next IDs
      const nextIds = {
        nextUserId: this.nextUserId,
        nextSessionId: this.nextSessionId
      };
      await AsyncStorage.setItem(DatabaseService.NEXT_IDS_STORAGE_KEY, JSON.stringify(nextIds));
    } catch (error) {
      throw new DatabaseError(
        'Failed to save data to storage',
        'SAVE_FAILED',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  async createUser(userData: UserData): Promise<User> {
    this.ensureInitialized();
    
    try {
      // Validate input data
      if (!userData) {
        throw new DatabaseError('User data is required', 'INVALID_INPUT');
      }

      // Use provided ID if valid, otherwise use auto-increment
      const userId = (userData.id && userData.id > 0) ? userData.id : this.nextUserId++;
      
      // Create a new user with the determined ID
      const newUser = new User({
        ...userData,
        id: userId
      });
      
      // Update nextUserId if we used auto-increment
      if (!userData.id || userData.id <= 0) {
        this.nextUserId = userId + 1;
      }
      
      // Store in our in-memory database
      this.users.set(newUser.id, newUser);
      
      // Save to AsyncStorage
      await this.saveToStorage();
      
      return newUser;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError(
        'Failed to create user',
        'CREATE_USER_FAILED',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  async getUser(id: number): Promise<User | null> {
    this.ensureInitialized();
    
    try {
      // Validate input
      if (!id || id <= 0) {
        throw new DatabaseError('Valid user ID is required', 'INVALID_INPUT');
      }

      // Return user from in-memory storage
      return this.users.get(id) || null;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError(
        'Failed to get user',
        'GET_USER_FAILED',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  async updateUser(id: number, userData: Partial<UserData>): Promise<User | null> {
    this.ensureInitialized();
    
    try {
      // Validate input
      if (!id || id <= 0) {
        throw new DatabaseError('Valid user ID is required', 'INVALID_INPUT');
      }
      
      if (!userData || Object.keys(userData).length === 0) {
        throw new DatabaseError('User data is required for update', 'INVALID_INPUT');
      }

      // Get existing user
      const existingUser = this.users.get(id);
      if (!existingUser) {
        return null;
      }
      
      // Create updated user object
      const updatedUser = new User({
        ...existingUser,
        ...userData
      } as UserData);
      
      // Update in-memory storage
      this.users.set(id, updatedUser);
      
      // Save to AsyncStorage
      await this.saveToStorage();
      
      return updatedUser;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError(
        'Failed to update user',
        'UPDATE_USER_FAILED',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  async createSession(sessionData: SessionData): Promise<Session> {
    this.ensureInitialized();
    
    try {
      // Validate input data
      if (!sessionData) {
        throw new DatabaseError('Session data is required', 'INVALID_INPUT');
      }

      if (!sessionData.userId || sessionData.userId <= 0) {
        throw new DatabaseError('Valid user ID is required for session', 'INVALID_INPUT');
      }

      // Use provided ID if valid, otherwise use auto-increment
      const sessionId = (sessionData.id && sessionData.id > 0) ? sessionData.id : this.nextSessionId++;
      
      // Create a new session with the determined ID
      const newSession = new Session({
        ...sessionData,
        id: sessionId
      });
      
      // Update nextSessionId if we used auto-increment
      if (!sessionData.id || sessionData.id <= 0) {
        this.nextSessionId = sessionId + 1;
      }
      
      // Store in our in-memory database
      this.sessions.set(newSession.id, newSession);
      
      // Save to AsyncStorage
      await this.saveToStorage();
      
      return newSession;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError(
        'Failed to create session',
        'CREATE_SESSION_FAILED',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  async getSessions(userId: number): Promise<Session[]> {
    this.ensureInitialized();
    
    try {
      // Validate input
      if (!userId || userId <= 0) {
        throw new DatabaseError('Valid user ID is required', 'INVALID_INPUT');
      }

      // Filter sessions by userId
      const userSessions: Session[] = [];
      for (const session of this.sessions.values()) {
        if (session.userId === userId) {
          userSessions.push(session);
        }
      }
      
      // Sort by completedAt date (most recent first)
      userSessions.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
      
      return userSessions;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError(
        'Failed to get sessions',
        'GET_SESSIONS_FAILED',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  async deleteSession(id: number): Promise<boolean> {
    this.ensureInitialized();
    
    try {
      // Validate input
      if (!id || id <= 0) {
        throw new DatabaseError('Valid session ID is required', 'INVALID_INPUT');
      }

      // Delete session from in-memory storage
      const deleted = this.sessions.delete(id);
      
      // Save to AsyncStorage
      if (deleted) {
        await this.saveToStorage();
      }
      
      return deleted;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError(
        'Failed to delete session',
        'DELETE_SESSION_FAILED',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  // Helper method to ensure database is initialized
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new DatabaseError(
        'Database not initialized. Call initialize() first.',
        'NOT_INITIALIZED'
      );
    }
  }

  // Helper method to check if database is ready
  isReady(): boolean {
    return this.isInitialized;
  }

  // Method to get database statistics for monitoring
  getStats(): { users: number; sessions: number; isReady: boolean } {
    return {
      users: this.users.size,
      sessions: this.sessions.size,
      isReady: this.isInitialized
    };
  }

  // Method to clear all data (for testing/reset purposes)
  async clearAll(): Promise<void> {
    this.ensureInitialized();
    
    try {
      this.users.clear();
      this.sessions.clear();
      this.nextUserId = 1;
      this.nextSessionId = 1;
      
      // Clear AsyncStorage
      await AsyncStorage.multiRemove([
        DatabaseService.USERS_STORAGE_KEY,
        DatabaseService.SESSIONS_STORAGE_KEY,
        DatabaseService.NEXT_IDS_STORAGE_KEY
      ]);
    } catch (error) {
      throw new DatabaseError(
        'Failed to clear database',
        'CLEAR_FAILED',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }
}