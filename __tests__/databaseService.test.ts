// Test that verifies DatabaseService exists and has correct methods
describe('DatabaseService', () => {
  let DatabaseService: any;

  beforeAll(() => {
    try {
      // Try to import the DatabaseService - this will throw if it doesn't exist
      const dbModule = require('../src/services/databaseService');
      DatabaseService = dbModule.DatabaseService;
    } catch (error) {
      // If import fails, the tests will fail appropriately
      throw new Error(`Failed to import DatabaseService: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  describe('DatabaseService methods', () => {
    it('should be instantiable', () => {
      const dbService = new DatabaseService();
      expect(dbService).toBeDefined();
    });

    it('should have initialize method', () => {
      const dbService = new DatabaseService();
      expect(typeof dbService.initialize).toBe('function');
    });

    it('should have createUser method', () => {
      const dbService = new DatabaseService();
      expect(typeof dbService.createUser).toBe('function');
    });

    it('should have getUser method', () => {
      const dbService = new DatabaseService();
      expect(typeof dbService.getUser).toBe('function');
    });

    it('should have updateUser method', () => {
      const dbService = new DatabaseService();
      expect(typeof dbService.updateUser).toBe('function');
    });

    it('should have createSession method', () => {
      const dbService = new DatabaseService();
      expect(typeof dbService.createSession).toBe('function');
    });

    it('should have getSessions method', () => {
      const dbService = new DatabaseService();
      expect(typeof dbService.getSessions).toBe('function');
    });

    it('should have deleteSession method', () => {
      const dbService = new DatabaseService();
      expect(typeof dbService.deleteSession).toBe('function');
    });
  });
});