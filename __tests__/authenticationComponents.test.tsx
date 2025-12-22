import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../src/components/auth/LoginScreen';
import { RegisterScreen } from '../src/components/auth/RegisterScreen';
import { AuthService } from '../src/services/authService';

// Mock the AuthService
jest.mock('../src/services/authService');
const MockedAuthService = AuthService as jest.MockedClass<typeof AuthService>;

describe('Authentication Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('LoginScreen', () => {
    it('should have a forgot password option', () => {
      const { getByText } = render(
        <LoginScreen onNavigateToForgotPassword={() => {}} />
      );

      // Now should have "Forgot Password" option
      expect(getByText('Forgot Password?')).toBeTruthy();
    });

    it('should have password visibility toggle', () => {
      const { getByTestId } = render(
        <LoginScreen />
      );

      // Now should have password visibility toggle
      expect(getByTestId('password-visibility-toggle')).toBeTruthy();
    });

    it('should have accessibility labels', () => {
      const { getByLabelText } = render(
        <LoginScreen />
      );

      // Now should have accessibility labels
      expect(getByLabelText('Email address')).toBeTruthy();
      expect(getByLabelText('Password')).toBeTruthy();
    });

    it('should dismiss keyboard when tapping outside', () => {
      const { getByTestId } = render(
        <LoginScreen />
      );

      // Now should have keyboard dismiss functionality
      expect(getByTestId('keyboard-dismiss-overlay')).toBeTruthy();
    });
  });

  describe('RegisterScreen', () => {
    it('should have a password strength indicator', () => {
      const { getByTestId, getByPlaceholderText } = render(
        <RegisterScreen />
      );

      // Enter password to show strength indicator
      const passwordInput = getByPlaceholderText('Enter your password');
      fireEvent.changeText(passwordInput, 'testpassword');
      
      // Now should have password strength indicator
      expect(getByTestId('password-strength-indicator')).toBeTruthy();
    });

    it('should have terms of service agreement', () => {
      const { getByText } = render(
        <RegisterScreen />
      );

      // Terms of Service text is split across multiple Text components
      // Use regex to match text with whitespace
      expect(getByText(/I agree to the/)).toBeTruthy();
      expect(getByText('Terms of Service')).toBeTruthy();
      expect(getByText(/and/)).toBeTruthy();
      expect(getByText('Privacy Policy')).toBeTruthy();
    });

    it('should have accessibility labels', () => {
      const { getByLabelText } = render(
        <RegisterScreen />
      );

      // Now should have accessibility labels
      expect(getByLabelText('Email address')).toBeTruthy();
      expect(getByLabelText('Password')).toBeTruthy();
      expect(getByLabelText('Confirm password')).toBeTruthy();
    });

    it('should show real-time validation feedback', () => {
      const { getByTestId, queryByText } = render(
        <RegisterScreen />
      );

      const emailInput = getByTestId('email-input');
      
      // Now should have testID on the input
      expect(emailInput).toBeTruthy();
      
      // Test real-time validation
      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent(emailInput, 'blur');
      
      // Should show error message
      expect(queryByText('Please enter a valid email address')).toBeTruthy();
    });
  });

  describe('Password Reset Flow', () => {
    it('should allow users to reset their password', async () => {
      const mockResetPassword = jest.fn().mockResolvedValue({ success: true });
      MockedAuthService.prototype.resetPassword = mockResetPassword;

      const onNavigateToForgotPassword = jest.fn();
      const { getByText } = render(
        <LoginScreen onNavigateToForgotPassword={onNavigateToForgotPassword} />
      );

      // Should have forgot password link
      const forgotPasswordLink = getByText('Forgot Password?');
      expect(forgotPasswordLink).toBeTruthy();
      
      // Should call navigation when clicked
      fireEvent.press(forgotPasswordLink);
      expect(onNavigateToForgotPassword).toHaveBeenCalled();
    });
  });
});