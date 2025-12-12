export interface UserPreferences {
  theme: string;
  notifications: boolean;
}

export class UserPreferences {
  theme: string;
  notifications: boolean;

  constructor(data: { theme: string; notifications: boolean }) {
    this.theme = data.theme;
    this.notifications = data.notifications;
  }
}

export interface UserData {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
  preferences?: UserPreferences;
}

export class User {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
  preferences?: UserPreferences;

  constructor(data: UserData) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.createdAt = data.createdAt;
    this.preferences = data.preferences;
  }
}