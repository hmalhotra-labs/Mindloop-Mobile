import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { SubscriptionManagement } from '../src/components/subscription/SubscriptionManagement';
import { SubscriptionService } from '../src/services/subscriptionService';
import { SubscriptionTier, SubscriptionStatus, SubscriptionPlan } from '../src/models/subscription';

// Mock the subscription service
jest.mock('../src/services/subscriptionService');

// Mock Alert
const mockAlert = {
  alert: jest.fn(),
};

jest.mock('react-native', () => {
  const actual = jest.requireActual('react-native');
  return {
    ...actual,
    Alert: mockAlert,
  };
});

const mockSubscriptionService = SubscriptionService as jest.MockedClass<typeof SubscriptionService>;

describe('SubscriptionManagement Component', () => {
  let mockSubscriptionServiceInstance: jest.Mocked<SubscriptionService>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockSubscriptionServiceInstance = {
      getUserSubscription: jest.fn(),
      cancelSubscription: jest.fn(),
      renewSubscription: jest.fn(),
      getAvailablePlans: jest.fn(),
      createSubscription: jest.fn(),
      checkContentAccess: jest.fn(),
      getUserSubscriptionTier: jest.fn(),
      isSubscriptionValid: jest.fn(),
    } as any;

    mockSubscriptionService.mockImplementation(() => mockSubscriptionServiceInstance);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering current subscription', () => {
    it('should display current subscription details', async () => {
      const currentSubscription = {
        id: 'sub_123',
        userId: 1,
        plan: new SubscriptionPlan({
          id: 'basic_monthly',
          name: 'Basic Monthly',
          tier: SubscriptionTier.BASIC,
          price: 4.99,
          currency: 'USD',
          billingPeriod: 'monthly',
          features: ['Unlimited sessions', 'Progress tracking']
        }),
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: new Date('2025-12-01'),
        currentPeriodEnd: new Date('2025-12-31'),
        cancelAtPeriodEnd: false,
        isActive: true,
        canAccessContent: jest.fn()
      };

      mockSubscriptionServiceInstance.getUserSubscription.mockResolvedValue(currentSubscription);
      mockSubscriptionServiceInstance.getUserSubscriptionTier.mockResolvedValue(SubscriptionTier.BASIC);

      const { findByText } = render(
        <SubscriptionManagement
          userId={1}
          onManageSubscription={() => {}}
        />
      );

      expect(await findByText('Basic Monthly')).toBeTruthy();
      expect(await findByText('$4.99/month')).toBeTruthy();
      expect(await findByText('Active')).toBeTruthy();
      expect(await findByText('Dec 31, 2025')).toBeTruthy();
    });

    it('should show upgrade option for free users', async () => {
      mockSubscriptionServiceInstance.getUserSubscription.mockResolvedValue(null);
      mockSubscriptionServiceInstance.getUserSubscriptionTier.mockResolvedValue(SubscriptionTier.FREE);

      const { findByText } = render(
        <SubscriptionManagement
          userId={1}
          onManageSubscription={() => {}}
        />
      );

      expect(await findByText('Free Plan')).toBeTruthy();
      expect(await findByText('Upgrade to Premium')).toBeTruthy();
    });

    it('should handle expired subscription', async () => {
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
        status: SubscriptionStatus.EXPIRED,
        currentPeriodStart: new Date('2025-11-01'),
        currentPeriodEnd: new Date('2025-11-30'),
        cancelAtPeriodEnd: false,
        isActive: false,
        canAccessContent: jest.fn()
      };

      mockSubscriptionServiceInstance.getUserSubscription.mockResolvedValue(expiredSubscription);
      mockSubscriptionServiceInstance.getUserSubscriptionTier.mockResolvedValue(SubscriptionTier.FREE);

      const { findByText } = render(
        <SubscriptionManagement
          userId={1}
          onManageSubscription={() => {}}
        />
      );

      expect(await findByText('Expired')).toBeTruthy();
      expect(await findByText('Renew Subscription')).toBeTruthy();
    });
  });

  describe('subscription actions', () => {
    it('should call onManageSubscription when manage button is pressed', async () => {
      const currentSubscription = {
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
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        isActive: true,
        canAccessContent: jest.fn()
      };

      mockSubscriptionServiceInstance.getUserSubscription.mockResolvedValue(currentSubscription);
      mockSubscriptionServiceInstance.getUserSubscriptionTier.mockResolvedValue(SubscriptionTier.BASIC);

      const onManageMock = jest.fn();

      const { findByText } = render(
        <SubscriptionManagement
          userId={1}
          onManageSubscription={onManageMock}
        />
      );

      const manageButton = await findByText('Manage Subscription');
      fireEvent.press(manageButton);

      expect(onManageMock).toHaveBeenCalled();
    });

    it('should handle subscription cancellation', async () => {
      const currentSubscription = {
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
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        isActive: true,
        canAccessContent: jest.fn()
      };

      mockSubscriptionServiceInstance.getUserSubscription.mockResolvedValue(currentSubscription);
      mockSubscriptionServiceInstance.getUserSubscriptionTier.mockResolvedValue(SubscriptionTier.BASIC);
      mockSubscriptionServiceInstance.cancelSubscription.mockResolvedValue(true);

      const { findByText } = render(
        <SubscriptionManagement
          userId={1}
          onManageSubscription={() => {}}
        />
      );

      const cancelButton = await findByText('Cancel Subscription');
      fireEvent.press(cancelButton);

      // Since the cancellation is inside an Alert, we need to mock the Alert buttons
      // For testing purposes, we'll directly call the service method to verify it was called
      expect(mockSubscriptionServiceInstance.cancelSubscription).toHaveBeenCalledWith('sub_123');
    });

    it('should handle subscription renewal', async () => {
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
        status: SubscriptionStatus.EXPIRED,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        isActive: false,
        canAccessContent: jest.fn()
      };

      mockSubscriptionServiceInstance.getUserSubscription.mockResolvedValue(expiredSubscription);
      mockSubscriptionServiceInstance.getUserSubscriptionTier.mockResolvedValue(SubscriptionTier.FREE);
      mockSubscriptionServiceInstance.renewSubscription.mockResolvedValue(true);

      const { findByText } = render(
        <SubscriptionManagement
          userId={1}
          onManageSubscription={() => {}}
        />
      );

      const renewButton = await findByText('Renew Subscription');
      fireEvent.press(renewButton);

      expect(mockSubscriptionServiceInstance.renewSubscription).toHaveBeenCalledWith('sub_expired');
    });
  });

  describe('billing information', () => {
    it('should display billing cycle information', async () => {
      const currentSubscription = {
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
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: new Date('2025-12-01'),
        currentPeriodEnd: new Date('2025-12-31'),
        cancelAtPeriodEnd: false,
        isActive: true,
        canAccessContent: jest.fn()
      };

      mockSubscriptionServiceInstance.getUserSubscription.mockResolvedValue(currentSubscription);
      mockSubscriptionServiceInstance.getUserSubscriptionTier.mockResolvedValue(SubscriptionTier.BASIC);

      const { findByText } = render(
        <SubscriptionManagement
          userId={1}
          onManageSubscription={() => {}}
        />
      );

      expect(await findByText('Next billing date')).toBeTruthy();
      expect(await findByText('Dec 31, 2025')).toBeTruthy();
    });

    it('should show cancellation date for subscriptions set to cancel', async () => {
      const cancelingSubscription = {
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
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: new Date('2025-12-01'),
        currentPeriodEnd: new Date('2025-12-31'),
        cancelAtPeriodEnd: true,
        isActive: true,
        canAccessContent: jest.fn()
      };

      mockSubscriptionServiceInstance.getUserSubscription.mockResolvedValue(cancelingSubscription);
      mockSubscriptionServiceInstance.getUserSubscriptionTier.mockResolvedValue(SubscriptionTier.BASIC);

      const { findByText } = render(
        <SubscriptionManagement
          userId={1}
          onManageSubscription={() => {}}
        />
      );

      expect(await findByText('Subscription will end on')).toBeTruthy();
      expect(await findByText('Dec 31, 2025')).toBeTruthy();
    });
  });

  describe('loading and error states', () => {
    it('should show loading state while fetching subscription', () => {
      mockSubscriptionServiceInstance.getUserSubscription.mockImplementation(() =>
        new Promise(() => {}) // Never resolves
      );

      const { getByTestId } = render(
        <SubscriptionManagement
          userId={1}
          onManageSubscription={() => {}}
        />
      );

      expect(getByTestId('subscription-loading')).toBeTruthy();
    });

    it('should show error message when subscription fetch fails', async () => {
      mockSubscriptionServiceInstance.getUserSubscription.mockRejectedValue(
        new Error('Failed to fetch subscription')
      );

      const { findByText } = render(
        <SubscriptionManagement
          userId={1}
          onManageSubscription={() => {}}
        />
      );

      expect(await findByText('Failed to load subscription information')).toBeTruthy();
    });
  });

  describe('feature access display', () => {
    it('should show available features for current plan', async () => {
      const currentSubscription = {
        id: 'sub_123',
        userId: 1,
        plan: new SubscriptionPlan({
          id: 'premium_monthly',
          name: 'Premium Monthly',
          tier: SubscriptionTier.PREMIUM,
          price: 9.99,
          currency: 'USD',
          billingPeriod: 'monthly',
          features: [
            'All premium sessions',
            'Advanced analytics',
            'Premium sounds',
            'Offline downloads',
            'Priority support'
          ]
        }),
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        isActive: true,
        canAccessContent: jest.fn()
      };

      mockSubscriptionServiceInstance.getUserSubscription.mockResolvedValue(currentSubscription);
      mockSubscriptionServiceInstance.getUserSubscriptionTier.mockResolvedValue(SubscriptionTier.PREMIUM);

      const { findByText } = render(
        <SubscriptionManagement
          userId={1}
          onManageSubscription={() => {}}
        />
      );

      expect(await findByText('Your Premium Features:')).toBeTruthy();
      expect(await findByText('All premium sessions')).toBeTruthy();
      expect(await findByText('Advanced analytics')).toBeTruthy();
      expect(await findByText('Offline downloads')).toBeTruthy();
    });
  });
});