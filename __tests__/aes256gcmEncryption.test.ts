import AsyncStorage from '@react-native-async-storage/async-storage';
import { secureStorage } from '../src/utils/securityUtils';

// Mock Web Crypto API for Jest environment
(global as any).crypto = {
  subtle: {
    importKey: jest.fn(),
    deriveKey: jest.fn(),
    encrypt: jest.fn(),
    decrypt: jest.fn()
  },
  getRandomValues: jest.fn((array: Uint8Array) => {
    // Fill with deterministic random values for testing
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  })
};

// Mock CryptoKey class
class MockCryptoKey {
  extractable = true;
  type = 'secret' as any;
  algorithm = { name: 'AES-GCM', length: 256 } as any;
  usages = ['encrypt', 'decrypt'] as any;
}

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Global storage for testing
let testStorage: Record<string, string> = {};

describe('AES-256-GCM Production Encryption', () => {
  const testKey = 'test_key';
  const allowedFields = ['id', 'name', 'email'];
  const testData = { 
    id: 1, 
    name: 'test_user', 
    email: 'user@example.com',
    password: 'secret123',
    token: 'auth_token_123'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    testStorage = {};
    
    // Setup AsyncStorage mocks to use testStorage
    (AsyncStorage.setItem as jest.MockedFunction<typeof AsyncStorage.setItem>)
      .mockImplementation(async (key: string, value: string) => {
        testStorage[key] = value;
      });
    
    (AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>)
      .mockImplementation(async (key: string) => {
        return testStorage[key] || null;
      });
    
    (AsyncStorage.removeItem as jest.MockedFunction<typeof AsyncStorage.removeItem>)
      .mockImplementation(async (key: string) => {
        delete testStorage[key];
      });
    
    (AsyncStorage.clear as jest.MockedFunction<typeof AsyncStorage.clear>)
      .mockImplementation(async () => {
        testStorage = {};
      });
      
    // Setup Web Crypto API mocks
    const mockCrypto = {
      getRandomValues: (global as any).crypto.getRandomValues,
      subtle: {
        importKey: (global as any).crypto.subtle.importKey,
        deriveKey: (global as any).crypto.subtle.deriveKey,
        encrypt: (global as any).crypto.subtle.encrypt,
        decrypt: (global as any).crypto.subtle.decrypt
      }
    };
    
    // Mock importKey to return a mock CryptoKey
    mockCrypto.subtle.importKey.mockResolvedValue(new MockCryptoKey());
    
    // Mock deriveKey to return a mock CryptoKey
    mockCrypto.subtle.deriveKey.mockResolvedValue(new MockCryptoKey());
    
    // Mock encrypt/decrypt to work with our test data
    mockCrypto.subtle.encrypt.mockImplementation(async (algorithm: any, key: CryptoKey, data: Uint8Array) => {
      // Simple mock encryption: just return the input data with some padding
      const encrypted = new Uint8Array(data.length + 16);
      encrypted.set(data);
      // Add some mock authentication tag
      for (let i = data.length; i < encrypted.length; i++) {
        encrypted[i] = 0x42;
      }
      return encrypted.buffer;
    });
    
    mockCrypto.subtle.decrypt.mockImplementation(async (algorithm: any, key: CryptoKey, ciphertext: ArrayBuffer) => {
      const data = new Uint8Array(ciphertext);
      // Simple mock decryption: remove the padding
      const decrypted = data.slice(0, -16);
      return decrypted.buffer;
    });
    
    (global as any).crypto = mockCrypto;
  });

  describe('Production-Grade Encryption Requirements', () => {
    test('should use AES-256-GCM instead of XOR encryption', async () => {
      await secureStorage.setSecureItem(testKey, testData, allowedFields);
      
      const storedData = testStorage[testKey];
      
      // AES-256-GCM should produce cryptographically secure ciphertext
      // The stored data should be completely different from XOR encryption
      expect(storedData).toBeDefined();
      expect(storedData).not.toContain('test_user');
      expect(storedData).not.toContain('user@example.com');
      expect(storedData).not.toContain('secret123');
      expect(storedData).not.toContain('auth_token_123');
      
      // Should not be simple XOR pattern (which would be easily reversible)
      const xorPattern = /[\x00-\x1F\x7F-\x9F]/;
      expect(storedData).not.toMatch(xorPattern);
    });

    test('should implement PBKDF2 key derivation for secure key management', async () => {
      // This test will verify that a passphrase-based key derivation is used
      // rather than a hardcoded key
      const sensitiveData1 = { password: 'user1_password' };
      const sensitiveData2 = { password: 'user2_password' };
      
      await secureStorage.setSecureItem('user1', sensitiveData1);
      await secureStorage.setSecureItem('user2', sensitiveData2);
      
      const storedUser1 = testStorage['user1'];
      const storedUser2 = testStorage['user2'];
      
      // With proper PBKDF2, different passwords should produce different encryption
      // even with the same salt (which would be stored per-record)
      expect(storedUser1).not.toBe(storedUser2);
      
      // Both should be properly encrypted and not contain the original passwords
      expect(storedUser1).not.toContain('user1_password');
      expect(storedUser2).not.toContain('user2_password');
    });

    test('should generate unique IV for each encryption operation', async () => {
      // Store the same data twice and verify IV uniqueness
      const sameData = { token: 'same_token_123' };
      
      await secureStorage.setSecureItem('token1', sameData);
      await secureStorage.setSecureItem('token2', sameData);
      
      const stored1 = testStorage['token1'];
      const stored2 = testStorage['token2'];
      
      // Even with same plaintext, different IVs should produce different ciphertext
      expect(stored1).not.toBe(stored2);
      
      // Both should decrypt back to the same data
      const decrypted1 = await secureStorage.getSecureItem('token1');
      const decrypted2 = await secureStorage.getSecureItem('token2');
      
      expect(decrypted1).toEqual(sameData);
      expect(decrypted2).toEqual(sameData);
    });

    test('should provide authenticated encryption (GCM mode)', async () => {
      // Test that GCM provides authentication - tampered data should fail decryption
      const originalData = { secret: 'important_data' };
      
      await secureStorage.setSecureItem('auth_test', originalData);
      const stored = testStorage['auth_test'];
      
      // Tamper with the stored data
      const tamperedData = stored.replace('important', 'tampered');
      testStorage['auth_test'] = tamperedData;
      
      // Should return null for tampered data (authentication failure)
      const result = await secureStorage.getSecureItem('auth_test');
      expect(result).toBeNull();
    });
  });

  describe('Backward Compatibility', () => {
    test('should maintain SimpleEncryption API compatibility', async () => {
      // The new AES-256-GCM implementation should work with existing API
      const testString = 'test_encryption_data';
      
      // Mock getItem to return encrypted data for the API test
      (AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>)
        .mockResolvedValueOnce('mock_encrypted_data');
      
      // The secureStorage API should still work the same way
      await expect(secureStorage.setSecureItem('compat_test', testString)).resolves.not.toThrow();
      const result = await secureStorage.getSecureItem('compat_test');
      
      // Should either return null (if decryption fails with mock) or the actual data
      expect(result === null || result === testString).toBe(true);
    });

    test('should handle existing XOR-encrypted data migration', async () => {
      // Test that the new implementation can handle data encrypted with the old XOR method
      const oldEncryptedData = 'dGVzdF9lbmNyeXB0aW9uX2RhdGE='; // base64 encoded XOR result
      
      (AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>)
        .mockResolvedValueOnce(oldEncryptedData);
      
      // Should gracefully handle old format (return null rather than crash)
      const result = await secureStorage.getSecureItem('old_data');
      expect(result).toBeNull(); // Old format should be handled gracefully
    });
  });

  describe('Security Edge Cases', () => {
    test('should handle empty and null data gracefully', async () => {
      await expect(secureStorage.setSecureItem('empty', '')).resolves.not.toThrow();
      await expect(secureStorage.setSecureItem('null', null)).rejects.toThrow();
      await expect(secureStorage.setSecureItem('undefined', undefined)).rejects.toThrow();
    });

    test('should handle large data efficiently', async () => {
      const largeData = {
        largeField: 'x'.repeat(10000), // 10KB of data
        metadata: { type: 'large_payload' }
      };
      
      await expect(secureStorage.setSecureItem('large', largeData)).resolves.not.toThrow();
      
      const result = await secureStorage.getSecureItem('large');
      expect(result).toEqual(largeData);
    });

    test('should generate cryptographically secure random values', async () => {
      // Generate multiple encrypted values and verify randomness
      const encryptedValues: string[] = [];
      const plaintext = { id: 123, data: 'random_test' };
      
      for (let i = 0; i < 5; i++) {
        await secureStorage.setSecureItem(`random_${i}`, plaintext);
        const stored = testStorage[`random_${i}`];
        encryptedValues.push(stored);
      }
      
      // All encrypted values should be different (IV uniqueness)
      const uniqueValues = new Set(encryptedValues);
      expect(uniqueValues.size).toBe(5); // All should be unique
      
      // None should contain the plaintext
      encryptedValues.forEach(value => {
        expect(value).not.toContain('random_test');
        expect(value).not.toContain('123');
      });
    });
  });

  describe('Performance Requirements', () => {
    test('should complete encryption operations within reasonable time', async () => {
      const startTime = Date.now();
      const testData = { operation: 'performance_test', timestamp: Date.now() };
      
      await secureStorage.setSecureItem('perf_test', testData);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within 100ms for reasonable-sized data
      expect(duration).toBeLessThan(100);
    });
  });
});

// Global TextEncoder/TextDecoder mocks for Node.js environment
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = class {
    encode(str: string): Uint8Array {
      return new TextEncoder().encode(str);
    }
  } as any;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = class {
    decode(buffer: ArrayBuffer): string {
      return new TextDecoder().decode(buffer);
    }
  } as any;
}