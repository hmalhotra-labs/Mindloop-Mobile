import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../src/components/auth/LoginScreen';
import { RegisterScreen } from '../src/components/auth/RegisterScreen';
import { AuthService } from '../src/services/authService';

// Create a properly typed mock instance that matches AuthService interface
const mockAuthService: jest.Mocked<AuthService> = {
  currentUser: null as any, // Mocking private property
  isValidEmail: jest.fn(),
  isValidPassword: jest.fn(),
  createUser: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  getCurrentUser: jest.fn(),
  isAuthenticated: jest.fn(),
  verifyEmail: jest.fn(),
  resetPassword: jest.fn(),
} as unknown as jest.Mocked<AuthService>;

describe('Authentication Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('LoginScreen', () => {
    it('should render email and password inputs', () => {
      render(<LoginScreen authServiceInstance={mockAuthService} />);
      
      expect(screen.getAllByText('Sign In').length).toBeGreaterThan(0); // Title
      expect(screen.getByText('Email')).toBeTruthy();
      expect(screen.getByText('Password')).toBeTruthy();
    });

    it('should handle form submission with valid credentials', async () => {
      mockAuthService.login.mockResolvedValue({ success: true });

      render(<LoginScreen authServiceInstance={mockAuthService} />);
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const signInButton = screen.getAllByText('Sign In')[1]; // Button (second occurrence)

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('should display error message for invalid credentials', async () => {
      mockAuthService.login.mockResolvedValue({ 
        success: false, 
        error: 'Invalid email or password' 
      });

      render(<LoginScreen authServiceInstance={mockAuthService} />);
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const signInButton = screen.getAllByText('Sign In')[1]; // Button (second occurrence)

      fireEvent.changeText(emailInput, 'invalid@example.com');
      fireEvent.changeText(passwordInput, 'wrongpassword');
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid email or password')).toBeTruthy();
      });
    });
  });

  describe('RegisterScreen', () => {
    it('should render email, password, and confirm password inputs', () => {
      render(<RegisterScreen authServiceInstance={mockAuthService} />);
      
      expect(screen.getByText('Create Account')).toBeTruthy();
      expect(screen.getByText('Email')).toBeTruthy();
      expect(screen.getByText('Password')).toBeTruthy();
      expect(screen.getByText('Confirm Password')).toBeTruthy();
    });

    it('should handle form submission with valid data', async () => {
      mockAuthService.createUser.mockResolvedValue({ success: true });

      render(<RegisterScreen authServiceInstance={mockAuthService} />);
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      const termsCheckbox = screen.getByLabelText('Agree to terms of service');
      const signUpButton = screen.getByText('Sign Up');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'Password123');
      fireEvent.changeText(confirmPasswordInput, 'Password123');
      fireEvent.press(termsCheckbox); // Check the terms agreement
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(mockAuthService.createUser).toHaveBeenCalledWith('test@example.com', 'Password123');
      });
    });

    it('should display error for password mismatch', () => {
      render(<RegisterScreen authServiceInstance={mockAuthService} />);
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      const signUpButton = screen.getByText('Sign Up');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'Password123');
      fireEvent.changeText(confirmPasswordInput, 'DifferentPassword');
      fireEvent.press(signUpButton);

      expect(screen.getByText('Passwords do not match')).toBeTruthy();
    });

    it('should display error for weak password', async () => {
      mockAuthService.createUser.mockResolvedValue({ 
        success: false, 
        error: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number' 
      });

      render(<RegisterScreen authServiceInstance={mockAuthService} />);
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      const signUpButton = screen.getByText('Sign Up');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'weak');
      fireEvent.changeText(confirmPasswordInput, 'weak');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(screen.getByText(/Password must be at least 8 characters/)).toBeTruthy();
      });
    });
  });
});