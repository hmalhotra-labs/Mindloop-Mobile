import { User, UserData } from '../models/User';
import { Session, SessionData } from '../models/Session';

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

  async initialize(): Promise<void> {
    try {
      // Initialize in-memory storage
      this.isInitialized = true;
    } catch (error) {
      throw new DatabaseError(
        'Database initialization failed',
        'INIT_FAILED',
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

      // Create a new user with incremented ID
      const newUser = new User({
        ...userData,
        id: this.nextUserId++
      });
      
      // Store in our in-memory database
      this.users.set(newUser.id, newUser);
      
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

      // Create a new session with incremented ID
      const newSession = new Session({
        ...sessionData,
        id: this.nextSessionId++
      });
      
      // Store in our in-memory database
      this.sessions.set(newSession.id, newSession);
      
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
    } catch (error) {
      throw new DatabaseError(
        'Failed to clear database',
        'CLEAR_FAILED',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }
}