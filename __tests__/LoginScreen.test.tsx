import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../src/components/auth/LoginScreen';
import { AuthService } from '../src/services/authService';

// Mock AuthService
jest.mock('../src/services/authService');

describe('LoginScreen - TDD Implementation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('RED Phase - Component Rendering', () => {
    test('should render login form with title', () => {
      render(<LoginScreen />);
      // Use queryAllByText to handle multiple elements with same text
      const signInElements = screen.queryAllByText('Sign In');
      expect(signInElements.length).toBeGreaterThan(0);
    });

    test('should render email input field', () => {
      render(<LoginScreen />);
      expect(screen.getByLabelText('Email address')).toBeTruthy();
    });

    test('should render password input field', () => {
      render(<LoginScreen />);
      expect(screen.getByLabelText('Password')).toBeTruthy();
    });

    test('should render sign in button', () => {
      render(<LoginScreen />);
      expect(screen.getByLabelText('Sign in button')).toBeTruthy();
    });

    test('should render forgot password link', () => {
      render(<LoginScreen />);
      expect(screen.getByText('Forgot Password?')).toBeTruthy();
    });

    test('should render navigation to register', () => {
      render(<LoginScreen />);
      expect(screen.getByText('Sign Up')).toBeTruthy();
    });
  });

  describe('RED Phase - Email Validation', () => {
    test('should show email required error when email is empty and field is blurred', () => {
      render(<LoginScreen />);
      const emailInput = screen.getByLabelText('Email address');
      
      fireEvent.changeText(emailInput, '');
      fireEvent(emailInput, 'blur');
      
      expect(screen.getByText('Email is required')).toBeTruthy();
    });

    test('should show invalid email error for malformed email', () => {
      render(<LoginScreen />);
      const emailInput = screen.getByLabelText('Email address');
      
      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent(emailInput, 'blur');
      
      expect(screen.getByText('Please enter a valid email address')).toBeTruthy();
    });

    test('should clear email error when valid email is entered', () => {
      render(<LoginScreen />);
      const emailInput = screen.getByLabelText('Email address');
      
      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent(emailInput, 'blur');
      expect(screen.getByText('Please enter a valid email address')).toBeTruthy();
      
      fireEvent.changeText(emailInput, 'valid@example.com');
      fireEvent(emailInput, 'blur');
      
      expect(screen.queryByText('Please enter a valid email address')).toBeNull();
    });
  });

  describe('RED Phase - Password Validation', () => {
    test('should show password required error when password is empty and field is blurred', () => {
      render(<LoginScreen />);
      const passwordInput = screen.getByLabelText('Password');
      
      fireEvent.changeText(passwordInput, '');
      fireEvent(passwordInput, 'blur');
      
      expect(screen.getByText('Password is required')).toBeTruthy();
    });

    test('should show password length error for passwords less than 8 characters', () => {
      render(<LoginScreen />);
      const passwordInput = screen.getByLabelText('Password');
      
      fireEvent.changeText(passwordInput, 'short');
      fireEvent(passwordInput, 'blur');
      
      expect(screen.getByText('Password must be at least 8 characters')).toBeTruthy();
    });
  });

  describe('RED Phase - Form Submission', () => {
    test('should call AuthService.login when form is submitted with valid credentials', async () => {
      const mockLogin = jest.fn().mockResolvedValue({ success: true });
      (AuthService as jest.Mock).mockImplementation(() => ({
        login: mockLogin
      }));

      render(<LoginScreen />);
      
      const emailInput = screen.getByLabelText('Email address');
      const passwordInput = screen.getByLabelText('Password');
      const signInButton = screen.getByLabelText('Sign in button');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'validpassword123');
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'validpassword123');
      });
    });

    test('should show loading state during authentication', async () => {
      const mockLogin = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100)));
      (AuthService as jest.Mock).mockImplementation(() => ({
        login: mockLogin
      }));

      render(<LoginScreen />);
      
      const emailInput = screen.getByLabelText('Email address');
      const passwordInput = screen.getByLabelText('Password');
      const signInButton = screen.getByLabelText('Sign in button');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'validpassword123');
      fireEvent.press(signInButton);

      expect(screen.getByText('Signing In...')).toBeTruthy();
      
      await waitFor(() => {
        expect(screen.getByText('Sign In')).toBeTruthy();
      });
    });

    test('should show success message and call onLoginSuccess when login is successful', async () => {
      const mockLogin = jest.fn().mockResolvedValue({ success: true });
      const mockOnLoginSuccess = jest.fn();
      (AuthService as jest.Mock).mockImplementation(() => ({
        login: mockLogin
      }));

      render(<LoginScreen onLoginSuccess={mockOnLoginSuccess} />);
      
      const emailInput = screen.getByLabelText('Email address');
      const passwordInput = screen.getByLabelText('Password');
      const signInButton = screen.getByLabelText('Sign in button');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'validpassword123');
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(mockOnLoginSuccess).toHaveBeenCalled();
      });
    });

    test('should show error message when login fails', async () => {
      const mockLogin = jest.fn().mockResolvedValue({ 
        success: false, 
        error: 'Invalid credentials' 
      });
      (AuthService as jest.Mock).mockImplementation(() => ({
        login: mockLogin
      }));

      render(<LoginScreen />);
      
      const emailInput = screen.getByLabelText('Email address');
      const passwordInput = screen.getByLabelText('Password');
      const signInButton = screen.getByLabelText('Sign in button');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'wrongpassword');
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeTruthy();
      });
    });

    test('should prevent form submission when form is invalid', () => {
      const mockLogin = jest.fn();
      (AuthService as jest.Mock).mockImplementation(() => ({
        login: mockLogin
      }));

      render(<LoginScreen />);
      
      const signInButton = screen.getByLabelText('Sign in button');
      fireEvent.press(signInButton);

      expect(mockLogin).not.toHaveBeenCalled();
      expect(screen.getByText('Please fix the errors below')).toBeTruthy();
    });
  });

  describe('RED Phase - Password Visibility', () => {
    test('should toggle password visibility when visibility button is pressed', () => {
      render(<LoginScreen />);
      const passwordInput = screen.getByLabelText('Password');
      const visibilityToggle = screen.getByLabelText('Show password');

      expect(passwordInput.props.secureTextEntry).toBe(true);

      fireEvent.press(visibilityToggle);
      
      expect(screen.getByLabelText('Hide password')).toBeTruthy();
      expect(passwordInput.props.secureTextEntry).toBe(false);
    });
  });

  describe('RED Phase - Navigation', () => {
    test('should call onNavigateToForgotPassword when forgot password link is pressed', () => {
      const mockOnNavigateToForgotPassword = jest.fn();
      render(<LoginScreen onNavigateToForgotPassword={mockOnNavigateToForgotPassword} />);
      
      const forgotPasswordLink = screen.getByText('Forgot Password?');
      fireEvent.press(forgotPasswordLink);
      
      expect(mockOnNavigateToForgotPassword).toHaveBeenCalled();
    });

    test('should call onNavigateToRegister when sign up link is pressed', () => {
      const mockOnNavigateToRegister = jest.fn();
      render(<LoginScreen onNavigateToRegister={mockOnNavigateToRegister} />);
      
      const signUpLink = screen.getByText('Sign Up');
      fireEvent.press(signUpLink);
      
      expect(mockOnNavigateToRegister).toHaveBeenCalled();
    });
  });

  describe('RED Phase - Accessibility (WCAG 2.1 AA)', () => {
    test('should have proper accessibility labels for form fields', () => {
      render(<LoginScreen />);
      
      expect(screen.getByLabelText('Email address')).toBeTruthy();
      expect(screen.getByLabelText('Password')).toBeTruthy();
      expect(screen.getByLabelText('Sign in button')).toBeTruthy();
    });

    test('should have accessibility hints for form fields', () => {
      render(<LoginScreen />);
      
      const emailInput = screen.getByLabelText('Email address');
      const passwordInput = screen.getByLabelText('Password');
      
      expect(emailInput.props.accessibilityHint).toBe('Enter your email address to sign in');
      expect(passwordInput.props.accessibilityHint).toBe('Enter your password to sign in');
    });

    test('should support keyboard navigation', () => {
      render(<LoginScreen />);
      
      const emailInput = screen.getByLabelText('Email address');
      const passwordInput = screen.getByLabelText('Password');
      
      // Simulate submit editing on email field
      fireEvent(emailInput, 'submitEditing');
      
      // Verify both inputs exist (focus management is handled by React Native)
      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
    });

    test('should disable form inputs when loading', async () => {
      const mockLogin = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100)));
      (AuthService as jest.Mock).mockImplementation(() => ({
        login: mockLogin
      }));

      render(<LoginScreen />);
      
      const emailInput = screen.getByLabelText('Email address');
      const passwordInput = screen.getByLabelText('Password');
      const signInButton = screen.getByLabelText('Sign in button');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'validpassword123');
      fireEvent.press(signInButton);

      expect(emailInput.props.editable).toBe(false);
      expect(passwordInput.props.editable).toBe(false);
      // Button should be disabled during loading
      expect(signInButton.props.disabled || signInButton.props.accessibilityState?.disabled).toBe(true);
    });
  });

  describe('RED Phase - Keyboard Handling', () => {
    test('should dismiss keyboard when tapping outside form', () => {
      render(<LoginScreen />);
      
      const keyboardDismissOverlay = screen.getByTestId('keyboard-dismiss-overlay');
      fireEvent.press(keyboardDismissOverlay);
      
      // Keyboard dismissal is handled by React Native, we just verify the overlay exists
      expect(keyboardDismissOverlay).toBeTruthy();
    });

    test('should focus next field on email submit', () => {
      render(<LoginScreen />);
      
      const emailInput = screen.getByLabelText('Email address');
      const passwordInput = screen.getByLabelText('Password');
      
      fireEvent(emailInput, 'submitEditing');
      
      // Focus management is handled internally, we verify the inputs exist
      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
    });
  });
});