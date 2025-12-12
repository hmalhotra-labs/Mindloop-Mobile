export interface SessionData {
  id: number;
  userId: number;
  duration: number;
  mood: string;
  completedAt: Date;
  type: string;
}

export class Session {
  id: number;
  userId: number;
  duration: number;
  mood: string;
  completedAt: Date;
  type: string;

  constructor(data: SessionData) {
    this.id = data.id;
    this.userId = data.userId;
    this.duration = data.duration;
    this.mood = data.mood;
    this.completedAt = data.completedAt;
    this.type = data.type;
  }
}