// Database configuration for SQLite
export const DatabaseConfig = {
  // Database name
  databaseName: 'mindloop.db',
  
  // SQLite database file location (platform-specific)
  location: 'default',
  
  // Database version
  version: 1,
  
  // Database display name
  displayName: 'Mindloop Database',
  
  // Database size in bytes (default 50MB)
  size: 50 * 1024 * 1024,
  
  // Enable logging for debugging
  enableLogging: true,
  
  // Migration configuration
  migrationScripts: [
    // Initial database setup
    `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        preferences TEXT
      );
    `,
    `
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        duration INTEGER NOT NULL,
        mood TEXT NOT NULL,
        completedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        type TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users (id)
      );
    `,
    // Add indexes for better performance
    `
      CREATE INDEX IF NOT EXISTS idx_sessions_userId ON sessions (userId);
    `,
    `
      CREATE INDEX IF NOT EXISTS idx_sessions_completedAt ON sessions (completedAt);
    `
  ]
};

// Database schema version for migrations
export const SCHEMA_VERSION = 1;