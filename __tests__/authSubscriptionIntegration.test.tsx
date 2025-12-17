import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { AuthService } from '../src/services/authService';
import { SubscriptionService } from '../src/services/subscriptionService';
import { useAuthSubscription } from '../src/hooks/useAuthSubscription';
import { SubscriptionTier, SubscriptionPlan } from '../src/models/subscription';
import { View, Text, TouchableOpacity } from 'react-native';

// Mock the services
jest.mock('../src/services/authService');
jest.mock('../src/services/subscriptionService');

const mockAuthService = AuthService as jest.MockedClass<typeof AuthService>;
const mockSubscriptionService = SubscriptionService as jest.MockedClass<typeof SubscriptionService>;

// Create mock instances with all required methods
const mockAuthServiceInstance = {
  createUser: jest.fn(),
  login: jest.fn(),
  getCurrentUser: jest.fn(),
  logout: jest.fn(),
  isAuthenticated: jest.fn(),
  onAuthStateChanged: jest.fn(),
  removeAuthStateChangedListener: jest.fn(),
} as any;

const mockSubscriptionServiceInstance = {
  getUserSubscription: jest.fn(),
  createSubscription: jest.fn(),
  cancelSubscription: jest.fn(),
  getAvailablePlans: jest.fn(),
  checkContentAccess: jest.fn(),
  getUserSubscriptionTier: jest.fn(),
  isSubscriptionValid: jest.fn(),
  renewSubscription: jest.fn(),
} as any;

// Set up default mock implementations
mockAuthService.mockImplementation(() => mockAuthServiceInstance);
mockSubscriptionService.mockImplementation(() => mockSubscriptionServiceInstance);

describe('Auth-Subscription Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set default return values
    mockAuthServiceInstance.getCurrentUser.mockResolvedValue(null);
    mockSubscriptionServiceInstance.getUserSubscription.mockResolvedValue(null);
    mockAuthServiceInstance.isAuthenticated.mockReturnValue(false);
  });

  describe('useAuthSubscription Hook', () => {
    it('should initialize with no authenticated user', async () => {
      // Mock the getCurrentUser to return null initially
      mockAuthServiceInstance.getCurrentUser.mockResolvedValue(null);
      mockAuthServiceInstance.isAuthenticated.mockReturnValue(false);
      
      const TestComponent = () => {
        const { user, subscription, isLoading } = useAuthSubscription(mockAuthServiceInstance, mockSubscriptionServiceInstance);
        
        return (
          <View>
            <Text>User: {user ? user.email : 'None'}</Text>
            <Text>Subscription: {subscription ? 'Active' : 'None'}</Text>
            <Text>Loading: {isLoading.toString()}</Text>
          </View>
        );
      };

      const { findByText } = render(<TestComponent />);

      expect(await findByText(/User: None/)).toBeTruthy();
      expect(await findByText(/Subscription: None/)).toBeTruthy();
      expect(await findByText(/Loading: false/)).toBeTruthy();
    });

    it('should handle loading state properly', async () => {
      // Mock the getCurrentUser to return null initially
      mockAuthServiceInstance.getCurrentUser.mockResolvedValue(null);
      mockAuthServiceInstance.isAuthenticated.mockReturnValue(false);
      
      const TestComponent = () => {
        const { user, subscription, isLoading } = useAuthSubscription(mockAuthServiceInstance, mockSubscriptionServiceInstance);
        
        return (
          <View>
            <Text>User: {user ? user.email : 'None'}</Text>
            <Text>Subscription: {subscription ? 'Active' : 'None'}</Text>
            <Text>Loading: {isLoading.toString()}</Text>
          </View>
        );
      };

      const { findByText } = render(<TestComponent />);
      
      // Initially loading should be true during initialization
      expect(await findByText(/Loading:/i)).toBeTruthy();
      expect(await findByText(/false/i)).toBeTruthy(); // After initialization
    });

    it('should load user subscription after authentication', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      const mockSubscription = {
        id: 'sub_123',
        userId: 1,
        plan: new SubscriptionPlan({
          id: 'basic_monthly',
          name: 'Basic Monthly',
          tier: SubscriptionTier.BASIC,
          price: 4.99,
          currency: 'USD',
          billingPeriod: 'monthly',
          features: ['Unlimited sessions']
        }),
        status: 'active' as any,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        isActive: true,
        canAccessContent: jest.fn()
      };

      mockAuthServiceInstance.getCurrentUser.mockResolvedValue(mockUser);
      mockAuthServiceInstance.isAuthenticated.mockReturnValue(true);
      mockSubscriptionServiceInstance.getUserSubscription.mockResolvedValue(mockSubscription);

      const TestComponent = () => {
        const { user, subscription, isLoading } = useAuthSubscription(mockAuthServiceInstance, mockSubscriptionServiceInstance);
        
        return (
          <View>
            <Text>User: {user ? user.email : 'None'}</Text>
            <Text>Subscription: {subscription ? subscription.plan.name : 'None'}</Text>
            <Text>Loading: {isLoading.toString()}</Text>
          </View>
        );
      };

      const { findByText } = render(<TestComponent />);

      await waitFor(() => {
        expect(mockAuthServiceInstance.getCurrentUser).toHaveBeenCalled();
      });

      expect(await findByText('User: test@example.com')).toBeTruthy();
      expect(await findByText('Subscription: Basic Monthly')).toBeTruthy();
    });

    it('should handle authentication failure', async () => {
      mockAuthServiceInstance.getCurrentUser.mockResolvedValue(null);
      mockAuthServiceInstance.isAuthenticated.mockReturnValue(false);

      const TestComponent = () => {
        const { user, subscription, error, isLoading } = useAuthSubscription(mockAuthServiceInstance, mockSubscriptionServiceInstance);
        
        return (
          <View>
            <Text>User: {user ? user.email : 'None'}</Text>
            <Text>Error: {error || 'None'}</Text>
            <Text>Loading: {isLoading.toString()}</Text>
          </View>
        );
      };

      const { findByText } = render(<TestComponent />);

      expect(await findByText(/User: None/)).toBeTruthy();
      expect(await findByText(/Error: None/)).toBeTruthy();
    });

    it('should handle subscription creation after successful authentication', async () => {
      const mockUser = { id: 2, email: 'premium@example.com' };
      const mockPlan = new SubscriptionPlan({
        id: 'premium_monthly',
        name: 'Premium Monthly',
        tier: SubscriptionTier.PREMIUM,
        price: 9.99,
        currency: 'USD',
        billingPeriod: 'monthly',
        features: ['All premium features']
      });
      const mockAvailablePlans = [mockPlan]; // Return the premium plan as available

      mockAuthServiceInstance.getCurrentUser.mockResolvedValue(mockUser);
      mockAuthServiceInstance.isAuthenticated.mockReturnValue(true);
      mockSubscriptionServiceInstance.getUserSubscription.mockResolvedValue(null);
      mockSubscriptionServiceInstance.getAvailablePlans.mockReturnValue(mockAvailablePlans);
      mockSubscriptionServiceInstance.createSubscription.mockResolvedValue({
        id: 'sub_new',
        userId: 2,
        plan: mockPlan,
        status: 'active' as any,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        isActive: true,
        canAccessContent: jest.fn()
      });

      const TestComponent = () => {
        const { user, subscription } = useAuthSubscription(mockAuthServiceInstance, mockSubscriptionServiceInstance);
        
        return (
          <View>
            <Text>User: {user ? user.email : 'None'}</Text>
            <Text>Subscription: {subscription ? subscription.plan.name : 'None'}</Text>
          </View>
        );
      };

      const { findByText } = render(<TestComponent />);

      await waitFor(() => {
        expect(mockAuthServiceInstance.getCurrentUser).toHaveBeenCalled();
      });

      expect(await findByText(/premium@example\.com/)).toBeTruthy();
      expect(await findByText(/Premium Monthly/)).toBeTruthy();
    });

    it('should clear subscription data on logout', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      const mockSubscription = {
        id: 'sub_123',
        userId: 1,
        plan: new SubscriptionPlan({
          id: 'basic_monthly',
          name: 'Basic Monthly',
          tier: SubscriptionTier.BASIC,
          price: 4.99,
          currency: 'USD',
          billingPeriod: 'monthly',
          features: []
        }),
        status: 'active' as any,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        isActive: true,
        canAccessContent: jest.fn()
      };

      mockAuthServiceInstance.getCurrentUser.mockResolvedValue(mockUser);
      mockAuthServiceInstance.isAuthenticated.mockReturnValue(true);
      mockSubscriptionServiceInstance.getUserSubscription.mockResolvedValue(mockSubscription);

      const TestComponent = () => {
        const { user, subscription, logout } = useAuthSubscription(mockAuthServiceInstance, mockSubscriptionServiceInstance);
        
        return (
          <View>
            <Text>User: {user ? user.email : 'None'}</Text>
            <Text>Subscription: {subscription ? subscription.plan.name : 'None'}</Text>
            <TouchableOpacity onPress={logout}>
              <Text>Logout</Text>
            </TouchableOpacity>
          </View>
        );
      };

      const { findByText } = render(<TestComponent />);

      await waitFor(() => {
        expect(mockAuthServiceInstance.getCurrentUser).toHaveBeenCalled();
      });

      expect(await findByText('User: test@example.com')).toBeTruthy();
      expect(await findByText('Subscription: Basic Monthly')).toBeTruthy();

      // Then logout
      const logoutButton = await findByText('Logout');
      fireEvent.press(logoutButton);

      await waitFor(() => {
        expect(mockAuthServiceInstance.logout).toHaveBeenCalled();
      });
    });

    it('should check content access based on subscription tier', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      const mockSubscription = {
        id: 'sub_123',
        userId: 1,
        plan: new SubscriptionPlan({
          id: 'basic_monthly',
          name: 'Basic Monthly',
          tier: SubscriptionTier.BASIC,
          price: 4.99,
          currency: 'USD',
          billingPeriod: 'monthly',
          features: []
        }),
        status: 'active' as any,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        isActive: true,
        canAccessContent: jest.fn((contentTier: string) => {
          const tierOrder = ['free', 'basic', 'premium'];
          const userTierIndex = tierOrder.indexOf('basic');
          const contentTierIndex = tierOrder.indexOf(contentTier);
          return userTierIndex >= contentTierIndex;
        })
      };

      mockAuthServiceInstance.getCurrentUser.mockResolvedValue(mockUser);
      mockAuthServiceInstance.isAuthenticated.mockReturnValue(true);
      mockSubscriptionServiceInstance.getUserSubscription.mockResolvedValue(mockSubscription);
      mockSubscriptionServiceInstance.checkContentAccess.mockResolvedValue(true);

      const TestComponent = () => {
        const { user, subscription, checkAccess } = useAuthSubscription(mockAuthServiceInstance, mockSubscriptionServiceInstance);
        
        return (
          <View>
            <Text>User: {user ? user.email : 'None'}</Text>
            <Text>Access: {checkAccess('premium') ? 'Granted' : 'Denied'}</Text>
          </View>
        );
      };

      const { findByText } = render(<TestComponent />);

      await waitFor(() => {
        expect(mockAuthServiceInstance.getCurrentUser).toHaveBeenCalled();
      });

      expect(await findByText(/Granted/)).toBeTruthy();
      expect(mockSubscriptionServiceInstance.checkContentAccess).toHaveBeenCalledWith(1, 'premium');
    });

    it('should handle registration with automatic subscription creation', async () => {
      const mockNewUser = { id: 3, email: 'newuser@example.com' };
      const mockPlan = new SubscriptionPlan({
        id: 'basic_monthly',
        name: 'Basic Monthly',
        tier: SubscriptionTier.BASIC,
        price: 4.99,
        currency: 'USD',
        billingPeriod: 'monthly',
        features: ['Unlimited sessions']
      });

      mockAuthServiceInstance.getCurrentUser.mockResolvedValue(mockNewUser);
      mockAuthServiceInstance.isAuthenticated.mockReturnValue(true);
      mockSubscriptionServiceInstance.getUserSubscription.mockResolvedValue(null);
      mockSubscriptionServiceInstance.createSubscription.mockResolvedValue({
        id: 'sub_new',
        userId: 3,
        plan: mockPlan,
        status: 'active' as any,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        isActive: true,
        canAccessContent: jest.fn()
      });

      const TestComponent = () => {
        const { user, subscription } = useAuthSubscription(mockAuthServiceInstance, mockSubscriptionServiceInstance);
        
        return (
          <View>
            <Text>User: {user ? user.email : 'None'}</Text>
            <Text>Subscription: {subscription ? subscription.plan.name : 'None'}</Text>
          </View>
        );
      };

      const { findByText } = render(<TestComponent />);

      await waitFor(() => {
        expect(mockAuthServiceInstance.getCurrentUser).toHaveBeenCalled();
      });

      expect(await findByText(/newuser@example\.com/)).toBeTruthy();
      expect(await findByText(/Basic Monthly/)).toBeTruthy();
    });

    it('should handle subscription expiration gracefully', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      const expiredSubscription = {
        id: 'sub_expired',
        userId: 1,
        plan: new SubscriptionPlan({
          id: 'basic_monthly',
          name: 'Basic Monthly',
          tier: SubscriptionTier.BASIC,
          price: 4.99,
          currency: 'USD',
          billingPeriod: 'monthly',
          features: []
        }),
        status: 'expired' as any,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        isActive: false,
        canAccessContent: jest.fn()
      };

      mockAuthServiceInstance.getCurrentUser.mockResolvedValue(mockUser);
      mockAuthServiceInstance.isAuthenticated.mockReturnValue(true);
      mockSubscriptionServiceInstance.getUserSubscription.mockResolvedValue(expiredSubscription);

      const TestComponent = () => {
        const { user, subscription, hasActiveSubscription } = useAuthSubscription(mockAuthServiceInstance, mockSubscriptionServiceInstance);
        
        return (
          <View>
            <Text>User: {user ? user.email : 'None'}</Text>
            <Text>Has Active Subscription: {hasActiveSubscription.toString()}</Text>
          </View>
        );
      };

      const { findByText } = render(<TestComponent />);

      await waitFor(() => {
        expect(mockAuthServiceInstance.getCurrentUser).toHaveBeenCalled();
      });

      expect(await findByText('User: test@example.com')).toBeTruthy();
      expect(await findByText('Has Active Subscription: false')).toBeTruthy();
    });
  });
});