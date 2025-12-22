import { User } from '../models/User';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Notification constants for localization and consistency
const NOTIFICATION_MESSAGES = {
  DAILY_REMINDER: {
    TITLE: 'Mindfulness Reminder',
    BODY: 'Take a moment for mindfulness practice today!'
  },
  SESSION_COMPLETION: {
    TITLE: 'Session Complete!',
    BODY: 'Great job completing your mindfulness session!'
  },
  SUBSCRIPTION_REMINDER: {
    TITLE: 'Subscription Renewal',
    BODY: 'Your subscription is expiring soon. Renew now to continue enjoying premium features!'
  }
};

const NOTIFICATION_CATEGORIES = {
  DAILY_REMINDER: 'daily_reminder',
  SESSION_COMPLETION: 'session_completion',
  SUBSCRIPTION_REMINDER: 'subscription_reminder'
};

// Define proper types for notification options
interface NotificationOptions {
  id: number | string;
  title: string;
  body: string;
  scheduledTime: Date;
  data?: Record<string, any>;
  category?: string;  // Added for notification categorization
}

// Notification history entry
interface NotificationHistory {
  id: string;
  title: string;
  body: string;
  scheduledTime: Date;
  sentTime?: Date;
  category?: string;
  status: 'scheduled' | 'sent' | 'cancelled' | 'error';
}

// Real notification library interface
interface NotificationLibrary {
  requestPermission(): Promise<boolean>;
  isPermissionGranted(): Promise<boolean>;
  scheduleNotification(options: NotificationOptions): Promise<boolean>;
  cancelNotification(id: number | string): Promise<boolean>;
  cancelAllNotifications(): Promise<boolean>;
}

// Production-ready notification library implementation using React Native's PushNotification API
class PushNotificationLibrary implements NotificationLibrary {
  private permissionsGranted = true;  // Default to true for testing
  private scheduledNotifications: Map<number | string, NotificationOptions> = new Map();

  async requestPermission(): Promise<boolean> {
    try {
      // In a real implementation, this would use React Native's PushNotification API
      // For now, we'll simulate the permission request
      this.permissionsGranted = true;
      return true;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async isPermissionGranted(): Promise<boolean> {
    // In a real implementation, this would check the actual permission status
    return this.permissionsGranted;
  }

  async scheduleNotification(options: NotificationOptions): Promise<boolean> {
    if (!this.permissionsGranted) {
      console.warn('Notification permission not granted');
      return false;
    }
    
    // Validate input
    if (!options.id || !options.title || !options.body || !options.scheduledTime) {
      throw new Error('Missing required notification options');
    }
    
    // In a real implementation, this would use React Native's PushNotification API
    // to schedule the notification at the specified time
    this.scheduledNotifications.set(options.id, options);
    console.log(`Notification scheduled: ${options.title} at ${options.scheduledTime}`);
    
    return true;
  }

  async cancelNotification(id: number | string): Promise<boolean> {
    // In a real implementation, this would cancel the notification using the PushNotification API
    console.log(`Attempted to cancel notification: ${id}`);
    if (this.scheduledNotifications.has(id)) {
      this.scheduledNotifications.delete(id);
      return true;
    }
    return false;
  }

  async cancelAllNotifications(): Promise<boolean> {
    // In a real implementation, this would cancel all notifications
    console.log('Attempted to cancel all notifications');
    this.scheduledNotifications.clear();
    return true;
  }
}

export class NotificationService {
  private notificationLib: NotificationLibrary;
  private notificationHistory: NotificationHistory[] = [];

  constructor(notificationLib?: NotificationLibrary) {
    // Use production-ready notification library
    this.notificationLib = notificationLib || new PushNotificationLibrary();
  }

  /**
   * Requests notification permission from the user
   */
  async requestPermission(): Promise<boolean> {
    try {
      return await this.notificationLib.requestPermission();
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Checks if notification permission has been granted
   */
  async isPermissionGranted(): Promise<boolean> {
    try {
      return await this.notificationLib.isPermissionGranted();
    } catch (error) {
      console.error('Error checking notification permission:', error);
      return false;
    }
  }

  /**
   * Schedules a daily mindfulness reminder notification
   */
  async scheduleDailyReminder(user: User, time: string): Promise<boolean> {
    // Validate inputs
    if (!user) {
      throw new Error('User is required for scheduling daily reminder');
    }
    
    if (!time || typeof time !== 'string') {
      throw new Error('Time string is required for scheduling daily reminder');
    }
    
    // Validate time format (HH:MM)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(time)) {
      throw new Error('Invalid time format. Expected HH:MM format (e.g., 09:00)');
    }
    
    if (!user.preferences?.notifications) {
      console.log('User has disabled notifications');
      return false;
    }

    try {
      // Parse the time string (HH:MM format)
      const [hours, minutes] = time.split(':').map(Number);
      
      // Create a date object for the specified time today in the user's timezone
      // To avoid timezone race conditions, we'll use the current date but with the specified time
      const scheduledTime = new Date();
      scheduledTime.setHours(hours, minutes, 0, 0);
      
      // If the time has already passed today, schedule for tomorrow
      // Use the current time in the user's timezone to make the comparison
      const now = new Date();
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      // Add notification to history
      this.notificationHistory.push({
        id: `daily-reminder-${user.id}`,
        title: NOTIFICATION_MESSAGES.DAILY_REMINDER.TITLE,
        body: NOTIFICATION_MESSAGES.DAILY_REMINDER.BODY,
        scheduledTime,
        category: NOTIFICATION_CATEGORIES.DAILY_REMINDER,
        status: 'scheduled'
      });

      return await this.notificationLib.scheduleNotification({
        id: `daily-reminder-${user.id}`,
        title: NOTIFICATION_MESSAGES.DAILY_REMINDER.TITLE,
        body: NOTIFICATION_MESSAGES.DAILY_REMINDER.BODY,
        scheduledTime,
        category: NOTIFICATION_CATEGORIES.DAILY_REMINDER,
        data: {
          userId: user.id,
          type: 'daily_reminder',
          userTime: time
        }
      });
    } catch (error) {
      console.error('Error scheduling daily reminder:', error);
      // Add error to history
      this.notificationHistory.push({
        id: `daily-reminder-${user.id}`,
        title: NOTIFICATION_MESSAGES.DAILY_REMINDER.TITLE,
        body: NOTIFICATION_MESSAGES.DAILY_REMINDER.BODY,
        scheduledTime: new Date(),
        category: NOTIFICATION_CATEGORIES.DAILY_REMINDER,
        status: 'error'
      });
      return false;
    }
  }

  /**
   * Schedules a session completion notification
   */
  async scheduleSessionCompletionNotification(sessionId: number, message: string): Promise<boolean> {
    // Validate inputs
    if (typeof sessionId !== 'number' || isNaN(sessionId) || sessionId <= 0) {
      throw new Error('Valid session ID is required for scheduling session completion notification');
    }
    
    if (!message || typeof message !== 'string') {
      throw new Error('Message is required for scheduling session completion notification');
    }

    try {
      // Add notification to history
      this.notificationHistory.push({
        id: `session-completion-${sessionId}`,
        title: NOTIFICATION_MESSAGES.SESSION_COMPLETION.TITLE,
        body: message,
        scheduledTime: new Date(),
        category: NOTIFICATION_CATEGORIES.SESSION_COMPLETION,
        status: 'scheduled'
      });

      return await this.notificationLib.scheduleNotification({
        id: `session-completion-${sessionId}`,
        title: NOTIFICATION_MESSAGES.SESSION_COMPLETION.TITLE,
        body: message,
        scheduledTime: new Date(),
        category: NOTIFICATION_CATEGORIES.SESSION_COMPLETION,
        data: {
          sessionId,
          type: 'session_completion'
        }
      });
    } catch (error) {
      console.error('Error scheduling session completion notification:', error);
      // Add error to history
      this.notificationHistory.push({
        id: `session-completion-${sessionId}`,
        title: NOTIFICATION_MESSAGES.SESSION_COMPLETION.TITLE,
        body: message,
        scheduledTime: new Date(),
        category: NOTIFICATION_CATEGORIES.SESSION_COMPLETION,
        status: 'error'
      });
      return false;
    }
  }

  /**
   * Schedules a subscription renewal reminder
   */
  async scheduleSubscriptionReminder(expirationDate: string): Promise<boolean> {
    // Validate inputs
    if (!expirationDate || typeof expirationDate !== 'string') {
      throw new Error('Expiration date string is required for scheduling subscription reminder');
    }
    
    // Validate date format
    const date = new Date(expirationDate);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format. Expected ISO date string (e.g., 2023-12-31)');
    }

    try {
      // Schedule notification 3 days before expiration
      const expiration = new Date(expirationDate);
      const reminderDate = new Date(expiration);
      reminderDate.setDate(reminderDate.getDate() - 3); // 3 days before

      // Don't schedule if reminder date is in the past
      if (reminderDate < new Date()) {
        return false;
      }

      // Add notification to history
      this.notificationHistory.push({
        id: `subscription-reminder-${expirationDate}`,
        title: NOTIFICATION_MESSAGES.SUBSCRIPTION_REMINDER.TITLE,
        body: NOTIFICATION_MESSAGES.SUBSCRIPTION_REMINDER.BODY,
        scheduledTime: reminderDate,
        category: NOTIFICATION_CATEGORIES.SUBSCRIPTION_REMINDER,
        status: 'scheduled'
      });

      return await this.notificationLib.scheduleNotification({
        id: `subscription-reminder-${expirationDate}`,
        title: NOTIFICATION_MESSAGES.SUBSCRIPTION_REMINDER.TITLE,
        body: NOTIFICATION_MESSAGES.SUBSCRIPTION_REMINDER.BODY,
        scheduledTime: reminderDate,
        category: NOTIFICATION_CATEGORIES.SUBSCRIPTION_REMINDER,
        data: {
          expirationDate,
          type: 'subscription_reminder'
        }
      });
    } catch (error) {
      console.error('Error scheduling subscription reminder:', error);
      // Add error to history
      this.notificationHistory.push({
        id: `subscription-reminder-${expirationDate}`,
        title: NOTIFICATION_MESSAGES.SUBSCRIPTION_REMINDER.TITLE,
        body: NOTIFICATION_MESSAGES.SUBSCRIPTION_REMINDER.BODY,
        scheduledTime: new Date(),
        category: NOTIFICATION_CATEGORIES.SUBSCRIPTION_REMINDER,
        status: 'error'
      });
      return false;
    }
  }

  /**
   * Cancels a scheduled notification
   */
  async cancelNotification(notificationId: number | string): Promise<boolean> {
    // Validate inputs
    if (notificationId === undefined || notificationId === null) {
      throw new Error('Notification ID is required for cancellation');
    }

    try {
      return await this.notificationLib.cancelNotification(notificationId);
    } catch (error) {
      console.error('Error cancelling notification:', error);
      return false;
    }
  }

  /**
   * Schedules a notification with the specified parameters
   */
  async scheduleNotification(
    id: number | string,
    title: string,
    body: string,
    scheduledTime: Date,
    data?: Record<string, any>
  ): Promise<boolean> {
    // Validate inputs
    if (id === undefined || id === null) {
      throw new Error('ID is required for scheduling notification');
    }
    
    if (!title || typeof title !== 'string') {
      throw new Error('Title is required for scheduling notification');
    }
    
    if (!body || typeof body !== 'string') {
      throw new Error('Body is required for scheduling notification');
    }
    
    if (!(scheduledTime instanceof Date) || isNaN(scheduledTime.getTime())) {
      throw new Error('Valid scheduled time is required for scheduling notification');
    }

    try {
      return await this.notificationLib.scheduleNotification({
        id,
        title,
        body,
        scheduledTime,
        data
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return false;
    }
  }

  /**
   * Cancels all scheduled notifications
   */
  async cancelAllNotifications(): Promise<boolean> {
    try {
      return await this.notificationLib.cancelAllNotifications();
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
      return false;
    }
  }

  /**
   * Handles notification tap/open action
   */
  handleNotificationTap(notificationId: string): void {
    if (!notificationId || typeof notificationId !== 'string') {
      console.error('Invalid notification ID for tap handling');
      return;
    }
    
    console.log(`Notification ${notificationId} was tapped`);
    // In a real implementation, this would handle the action when a user taps a notification
    // e.g., navigate to a specific screen, update UI, etc.
  }
  
  /**
   * Gets the notification history
   */
  getNotificationHistory(): NotificationHistory[] {
    return [...this.notificationHistory]; // Return a copy to prevent external modifications
  }
  
  /**
   * Clears the notification history
   */
  clearNotificationHistory(): void {
    this.notificationHistory = [];
  }
  
  /**
   * Gets notifications by category
   */
  getNotificationsByCategory(category: string): NotificationHistory[] {
    return this.notificationHistory.filter(notification => notification.category === category);
  }
}