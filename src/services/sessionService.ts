import { Session, SessionData } from '../models/Session';
import { DatabaseService, SessionOperationResult } from './databaseService';

export type SessionState = 'not_started' | 'running' | 'paused' | 'completed';

// Session configuration interface
export interface SessionConfig {
  userId: number;
  mood: string;
  type: string;
}

// Constants for validation
const MIN_DURATION = 1; // 1 second minimum
const MAX_DURATION = 7200; // 2 hours maximum

export class SessionService {
  private state: SessionState = 'not_started';
  private duration: number = 0;
  private remainingTime: number = 0;
  private sessionData: SessionData | null = null;
  private databaseService: DatabaseService;
  private sessionConfig: SessionConfig;

  constructor(databaseService?: DatabaseService, sessionConfig?: SessionConfig) {
    this.databaseService = databaseService || new DatabaseService();
    this.sessionConfig = sessionConfig || this.getDefaultConfig();
  }

  private getDefaultConfig(): SessionConfig {
    return {
      userId: 1, // Fallback to default
      mood: 'peaceful', // Default mood
      type: 'breathing' // Default session type
    };
  }

  updateSessionConfig(config: Partial<SessionConfig>): void {
    this.sessionConfig = { ...this.sessionConfig, ...config };
  }

  getState(): SessionState {
    return this.state;
  }

  getRemainingTime(): number {
    return this.remainingTime;
  }

  getDuration(): number {
    return this.duration;
  }

  getSessionData(): SessionData | null {
    return this.sessionData;
  }

  startSession(durationInSeconds: number): void {
    // Validation
    if (durationInSeconds < MIN_DURATION) {
      throw new Error('Invalid duration');
    }
    if (durationInSeconds > MAX_DURATION) {
      throw new Error('Duration exceeds maximum');
    }
    if (this.state !== 'not_started') {
      throw new Error('Session already started');
    }

    this.state = 'running';
    this.duration = durationInSeconds;
    this.remainingTime = durationInSeconds;
  }

  tick(): void {
    if (this.state !== 'running') {
      return;
    }

    if (this.remainingTime > 0) {
      this.remainingTime -= 1;
    }

    // Auto-complete when timer reaches zero
    if (this.remainingTime === 0) {
      this.stopSession();
    }
  }

  pauseSession(): void {
    if (this.state !== 'running') {
      throw new Error('Cannot pause session that is not running');
    }
    this.state = 'paused';
  }

  resumeSession(): void {
    if (this.state !== 'paused') {
      throw new Error('Cannot resume session that is not paused');
    }
    this.state = 'running';
  }

  stopSession(): void {
    if (this.state === 'completed') {
      return; // Already stopped
    }

    this.state = 'completed';
    this.saveSessionData();
  }

  private saveSessionData(): void {
    this.sessionData = {
      id: Date.now(), // Simple ID generation
      userId: this.sessionConfig.userId, // Use configurable userId
      duration: this.duration,
      mood: this.sessionConfig.mood, // Use configurable mood
      completedAt: new Date(),
      type: this.sessionConfig.type // Use configurable type
    };

    // Persist to database
    this.persistSessionToDatabase();
  }

  private async persistSessionToDatabase(): Promise<void> {
    if (this.sessionData) {
      try {
        await this.databaseService.createSession(this.sessionData);
      } catch (error) {
        // Log error but don't throw - session completion should not fail due to persistence issues
        console.error('Failed to persist session to database:', error);
      }
    }
  }
}