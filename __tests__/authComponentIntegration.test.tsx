import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { RegisterScreen } from '../src/components/auth/RegisterScreen';
import { AuthService } from '../src/services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock the AuthService
jest.mock('../src/services/authService', () => ({
  AuthService: jest.fn()
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

describe('Auth Component Integration Tests', () => {
  let mockAuthService: jest.Mocked<AuthService>;
  
  beforeEach(() => {
    // Create a mock AuthService instance
    mockAuthService = {
      createUser: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      getCurrentUser: jest.fn(),
      isAuthenticated: jest.fn(),
      verifyEmail: jest.fn(),
      resetPassword: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;
    
    // Make the AuthService constructor return our mock instance
    (require('../src/services/authService').AuthService as jest.Mock).mockImplementation(() => mockAuthService);
    
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('RegisterScreen Integration', () => {
    it('should call authService.createUser when registration form is submitted with valid data', async () => {
      // This test should fail initially because RegisterScreen creates its own AuthService instance
      // instead of accepting it as a prop, so the mock won't be called
      mockAuthService.createUser.mockResolvedValue({ success: true });

      render(<RegisterScreen authServiceInstance={mockAuthService} />);

      // Fill in the form
      fireEvent.changeText(screen.getByTestId('email-input'), 'test@example.com');
      fireEvent.changeText(screen.getByTestId('password-input'), 'Password123!');
      fireEvent.changeText(screen.getByTestId('confirm-password-input'), 'Password123!');

      // Click the checkbox to agree to terms
      fireEvent.press(screen.getByLabelText('Agree to terms of service'));

      // Submit the form
      fireEvent.press(screen.getByLabelText('Create account button'));

      // Wait for the async operation to complete
      await waitFor(() => {
        expect(mockAuthService.createUser).toHaveBeenCalledWith('test@example.com', 'Password123!');
      });
    });

    it('should handle registration errors gracefully', async () => {
      mockAuthService.createUser.mockResolvedValue({ success: false, error: 'User already exists' });

      render(<RegisterScreen authServiceInstance={mockAuthService} />);

      // Fill in the form
      fireEvent.changeText(screen.getByTestId('email-input'), 'test@example.com');
      fireEvent.changeText(screen.getByTestId('password-input'), 'Password123!');
      fireEvent.changeText(screen.getByTestId('confirm-password-input'), 'Password123!');

      // Click the checkbox to agree to terms
      fireEvent.press(screen.getByLabelText('Agree to terms of service'));

      // Submit the form
      fireEvent.press(screen.getByLabelText('Create account button'));

      // Wait for the async operation to complete
      await waitFor(() => {
        expect(screen.getByText('User already exists')).toBeTruthy();
      });
    });
  });

  describe('LoginScreen Integration', () => {
    // We'll add LoginScreen tests once we fix the RegisterScreen issue
    it('should be able to test login functionality once RegisterScreen is fixed', () => {
      // Placeholder test
      expect(true).toBe(true);
    });
  });
});