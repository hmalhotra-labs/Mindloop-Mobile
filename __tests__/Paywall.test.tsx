import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Paywall } from '../src/components/subscription/Paywall';
import { SubscriptionService } from '../src/services/subscriptionService';
import { ContentAccessControl } from '../src/services/contentAccessControl';
import { SubscriptionTier, SubscriptionPlan } from '../src/models/subscription';

// Mock the subscription service and content access control
jest.mock('../src/services/subscriptionService');
jest.mock('../src/services/contentAccessControl');

const mockSubscriptionService = SubscriptionService as jest.MockedClass<typeof SubscriptionService>;
const mockContentAccessControl = ContentAccessControl as jest.MockedClass<typeof ContentAccessControl>;

describe('Paywall Component', () => {
  let mockSubscriptionServiceInstance: jest.Mocked<SubscriptionService>;
  let mockContentAccessControlInstance: jest.Mocked<ContentAccessControl>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockSubscriptionServiceInstance = {
      getAvailablePlans: jest.fn(),
      createSubscription: jest.fn(),
      getUserSubscription: jest.fn(),
      cancelSubscription: jest.fn(),
      checkContentAccess: jest.fn(),
      getUserSubscriptionTier: jest.fn(),
      isSubscriptionValid: jest.fn(),
      renewSubscription: jest.fn(),
    } as any;

    mockContentAccessControlInstance = {
      checkAccessToContent: jest.fn(),
      filterAccessibleContent: jest.fn(),
      getContentUpgradeRecommendation: jest.fn(),
      canAccessContentCategory: jest.fn(),
      getContentAccessLevel: jest.fn(),
    } as any;

    mockSubscriptionService.mockImplementation(() => mockSubscriptionServiceInstance);
    mockContentAccessControl.mockImplementation(() => mockContentAccessControlInstance);
  });

  describe('rendering', () => {
    it('should render paywall with subscription plans', async () => {
      const mockPlans = [
        new SubscriptionPlan({
          id: 'free_plan',
          name: 'Free Plan',
          tier: SubscriptionTier.FREE,
          price: 0,
          currency: 'USD',
          billingPeriod: 'free',
          features: ['Basic features']
        }),
        new SubscriptionPlan({
          id: 'basic_monthly',
          name: 'Basic Monthly',
          tier: SubscriptionTier.BASIC,
          price: 4.99,
          currency: 'USD',
          billingPeriod: 'monthly',
          features: ['Unlimited sessions', 'Progress tracking']
        }),
        new SubscriptionPlan({
          id: 'premium_monthly',
          name: 'Premium Monthly',
          tier: SubscriptionTier.PREMIUM,
          price: 9.99,
          currency: 'USD',
          billingPeriod: 'monthly',
          features: ['All premium content', 'Advanced features']
        })
      ];

      mockSubscriptionServiceInstance.getAvailablePlans.mockReturnValue(mockPlans);
      mockContentAccessControlInstance.getContentUpgradeRecommendation.mockResolvedValue({
        shouldShowUpgrade: false
      });

      const { findByText } = render(
        <Paywall 
          userId={999}
          contentTitle="Premium Content"
          requiredTier={SubscriptionTier.PREMIUM}
          onClose={() => {}}
          onSubscribe={() => {}}
        />
      );

      expect(await findByText('Upgrade to Premium')).toBeTruthy();
      expect(await findByText('Basic Monthly')).toBeTruthy();
      expect(await findByText('Premium Monthly')).toBeTruthy();
      expect(await findByText('$4.99 / monthly')).toBeTruthy();
      expect(await findByText('$9.99 / monthly')).toBeTruthy();
    });

    it('should show current plan for subscribed users', async () => {
      mockSubscriptionServiceInstance.getUserSubscription.mockResolvedValue({
        id: 'sub_123',
        userId: 1,
        plan: new SubscriptionPlan({
          id: 'basic_monthly',
          name: 'Basic Monthly',
          tier: SubscriptionTier.BASIC,
          price: 4.99,
          currency: 'USD',
          billingPeriod: 'monthly',
          features: ['Current features']
        }),
        status: 'active' as any,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        isActive: true,
        canAccessContent: jest.fn()
      });

      const { findByText } = render(
        <Paywall 
          userId={1}
          contentTitle="Premium Content"
          requiredTier={SubscriptionTier.PREMIUM}
          onClose={() => {}}
          onSubscribe={() => {}}
        />
      );

      expect(await findByText('Current Plan: Basic Monthly')).toBeTruthy();
      expect(await findByText('Upgrade to Premium')).toBeTruthy();
    });

    it('should show upgrade message for premium content', async () => {
      const mockPlans = [
        new SubscriptionPlan({
          id: 'premium_monthly',
          name: 'Premium Monthly',
          tier: SubscriptionTier.PREMIUM,
          price: 9.99,
          currency: 'USD',
          billingPeriod: 'monthly',
          features: ['All premium features']
        })
      ];

      mockSubscriptionServiceInstance.getAvailablePlans.mockReturnValue(mockPlans);
      mockContentAccessControlInstance.getContentUpgradeRecommendation.mockResolvedValue({
        shouldShowUpgrade: true,
        recommendedTier: SubscriptionTier.PREMIUM,
        message: 'Upgrade to Premium to access this content'
      });

      const { findByText } = render(
        <Paywall 
          userId={999}
          contentTitle="Advanced Meditation"
          requiredTier={SubscriptionTier.PREMIUM}
          onClose={() => {}}
          onSubscribe={() => {}}
        />
      );

      expect(await findByText('Advanced Meditation')).toBeTruthy();
      expect(await findByText('This content requires a Premium subscription')).toBeTruthy();
    });
  });

  describe('user interactions', () => {
    it('should call onSubscribe when subscription plan is selected', async () => {
      const mockPlans = [
        new SubscriptionPlan({
          id: 'basic_monthly',
          name: 'Basic Monthly',
          tier: SubscriptionTier.BASIC,
          price: 4.99,
          currency: 'USD',
          billingPeriod: 'monthly',
          features: ['Unlimited sessions']
        })
      ];

      mockSubscriptionServiceInstance.getAvailablePlans.mockReturnValue(mockPlans);
      mockContentAccessControlInstance.getContentUpgradeRecommendation.mockResolvedValue({
        shouldShowUpgrade: false
      });

      const onSubscribeMock = jest.fn();

      const { findByText } = render(
        <Paywall 
          userId={999}
          contentTitle="Content"
          requiredTier={SubscriptionTier.FREE}
          onClose={() => {}}
          onSubscribe={onSubscribeMock}
        />
      );

      const subscribeButton = await findByText('Subscribe');
      fireEvent.press(subscribeButton);

      await waitFor(() => {
        expect(onSubscribeMock).toHaveBeenCalledWith(mockPlans[0]);
      });
    });

    it('should call onClose when close button is pressed', async () => {
      const mockPlans = [
        new SubscriptionPlan({
          id: 'free_plan',
          name: 'Free Plan',
          tier: SubscriptionTier.FREE,
          price: 0,
          currency: 'USD',
          billingPeriod: 'free',
          features: ['Basic features']
        })
      ];

      mockSubscriptionServiceInstance.getAvailablePlans.mockReturnValue(mockPlans);
      mockContentAccessControlInstance.getContentUpgradeRecommendation.mockResolvedValue({
        shouldShowUpgrade: false
      });

      const onCloseMock = jest.fn();

      const { findByTestId } = render(
        <Paywall 
          userId={999}
          contentTitle="Content"
          requiredTier={SubscriptionTier.FREE}
          onClose={onCloseMock}
          onSubscribe={() => {}}
        />
      );

      const closeButton = await findByTestId('paywall-close-button');
      fireEvent.press(closeButton);

      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  describe('features display', () => {
    it('should display features for each plan', async () => {
      const mockPlans = [
        new SubscriptionPlan({
          id: 'basic_monthly',
          name: 'Basic Monthly',
          tier: SubscriptionTier.BASIC,
          price: 4.99,
          currency: 'USD',
          billingPeriod: 'monthly',
          features: ['Unlimited basic sessions', 'Progress tracking', 'Basic ambient sounds']
        }),
        new SubscriptionPlan({
          id: 'premium_monthly',
          name: 'Premium Monthly',
          tier: SubscriptionTier.PREMIUM,
          price: 9.99,
          currency: 'USD',
          billingPeriod: 'monthly',
          features: ['All premium sessions', 'Advanced analytics', 'Premium sounds', 'Offline downloads']
        })
      ];

      mockSubscriptionServiceInstance.getAvailablePlans.mockReturnValue(mockPlans);
      mockContentAccessControlInstance.getContentUpgradeRecommendation.mockResolvedValue({
        shouldShowUpgrade: false
      });

      const { findByText } = render(
        <Paywall 
          userId={999}
          contentTitle="Content"
          requiredTier={SubscriptionTier.FREE}
          onClose={() => {}}
          onSubscribe={() => {}}
        />
      );

      expect(await findByText('• Unlimited basic sessions')).toBeTruthy();
      expect(await findByText('• Progress tracking')).toBeTruthy();
      expect(await findByText('• Advanced analytics')).toBeTruthy();
      expect(await findByText('• Offline downloads')).toBeTruthy();
    });
  });

  describe('loading states', () => {
    it('should show loading state while fetching plans', async () => {
      mockSubscriptionServiceInstance.getAvailablePlans.mockImplementation(() => {
        // Simulate a delay to keep loading state visible
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              new SubscriptionPlan({
                id: 'free_plan',
                name: 'Free Plan',
                tier: SubscriptionTier.FREE,
                price: 0,
                currency: 'USD',
                billingPeriod: 'free',
                features: ['Basic features']
              })
            ]);
          }, 100);
        }) as any;
      });

      const { findByTestId } = render(
        <Paywall
          userId={999}
          contentTitle="Content"
          requiredTier={SubscriptionTier.FREE}
          onClose={() => {}}
          onSubscribe={() => {}}
        />
      );

      expect(await findByTestId('paywall-loading')).toBeTruthy();
    });
  });

  describe('error handling', () => {
    it('should show error message when plans fail to load', async () => {
      mockSubscriptionServiceInstance.getAvailablePlans.mockImplementation(() => {
        throw new Error('Failed to load plans');
      });

      const { findByText } = render(
        <Paywall 
          userId={999}
          contentTitle="Content"
          requiredTier={SubscriptionTier.FREE}
          onClose={() => {}}
          onSubscribe={() => {}}
        />
      );

      expect(await findByText('No subscription plans available')).toBeTruthy();
    });
  });
});