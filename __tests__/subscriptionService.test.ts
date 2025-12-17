import { SubscriptionService } from '../src/services/subscriptionService';
import { SubscriptionTier, SubscriptionStatus, SubscriptionPlan, Subscription } from '../src/models/subscription';

describe('SubscriptionService', () => {
  let subscriptionService: SubscriptionService;

  beforeEach(async () => {
    subscriptionService = new SubscriptionService();
    // Clear all data before each test to ensure clean state
    await subscriptionService['clearAllData']();
  });

  afterEach(async () => {
    // Clean up after each test
    await subscriptionService['clearAllData']();
  });

  describe('getAvailablePlans', () => {
    it('should return available subscription plans', async () => {
      const plans = await subscriptionService.getAvailablePlans();
      expect(plans).toHaveLength(3);
      expect(plans.some(plan => plan.tier === SubscriptionTier.FREE)).toBe(true);
      expect(plans.some(plan => plan.tier === SubscriptionTier.BASIC)).toBe(true);
      expect(plans.some(plan => plan.tier === SubscriptionTier.PREMIUM)).toBe(true);
    });
  });

  describe('getUserSubscription', () => {
    it('should return null for user without subscription', async () => {
      const subscription = await subscriptionService.getUserSubscription(999);
      expect(subscription).toBeNull();
    });

    it('should return subscription for existing user', async () => {
      // First create a subscription for user 1
      const createdSubscription = await subscriptionService.createSubscription(1, 'premium_monthly');
      expect(createdSubscription).not.toBeNull();
      
      const subscription = await subscriptionService.getUserSubscription(1);
      expect(subscription).not.toBeNull();
      expect(subscription?.userId).toBe(1);
      expect(subscription?.status).toBe(SubscriptionStatus.ACTIVE);
    });
  });

  describe('createSubscription', () => {
    it('should create a new subscription', async () => {
      const subscription = await subscriptionService.createSubscription(2, 'basic_monthly');
      expect(subscription).not.toBeNull();
      expect(subscription?.userId).toBe(2);
      expect(subscription?.plan.tier).toBe(SubscriptionTier.BASIC);
      expect(subscription?.status).toBe(SubscriptionStatus.ACTIVE);
    });

    it('should handle subscription creation failure', async () => {
      const subscription = await subscriptionService.createSubscription(2, 'nonexistent_plan');
      expect(subscription).toBeNull();
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel subscription at period end', async () => {
      const newSubscription = await subscriptionService.createSubscription(3, 'premium_monthly');
      expect(newSubscription).not.toBeNull();
      
      if (newSubscription) {
        const result = await subscriptionService.cancelSubscription(newSubscription.id);
        expect(result).toBe(true);
        
        const subscription = await subscriptionService.getUserSubscription(3);
        expect(subscription?.cancelAtPeriodEnd).toBe(true);
      }
    });

    it('should handle cancellation of non-existent subscription', async () => {
      const result = await subscriptionService.cancelSubscription('nonexistent_id');
      expect(result).toBe(false);
    });
  });

  describe('checkContentAccess', () => {
    it('should allow access to free content for free users', async () => {
      // Create premium content with free tier requirement
      const hasAccess = await subscriptionService.checkContentAccess(1, 'free_content');
      expect(hasAccess).toBe(true);
    });

    it('should deny access to premium content for free users', async () => {
      const hasAccess = await subscriptionService.checkContentAccess(1, 'premium_content');
      expect(hasAccess).toBe(false);
    });

    it('should allow access to premium content for premium users', async () => {
      // Create a premium subscription
      const subscription = await subscriptionService.createSubscription(4, 'premium_monthly');
      expect(subscription).not.toBeNull();
      
      if (subscription) {
        const hasAccess = await subscriptionService.checkContentAccess(4, 'premium_content');
        expect(hasAccess).toBe(true);
      }
    });
  });

  describe('getUserSubscriptionTier', () => {
    it('should return FREE tier for users without subscription', async () => {
      const tier = await subscriptionService.getUserSubscriptionTier(999);
      expect(tier).toBe(SubscriptionTier.FREE);
    });

    it('should return correct tier for subscribed users', async () => {
      const subscription = await subscriptionService.createSubscription(5, 'premium_monthly');
      expect(subscription).not.toBeNull();
      
      if (subscription) {
        const tier = await subscriptionService.getUserSubscriptionTier(5);
        expect(tier).toBe(SubscriptionTier.PREMIUM);
      }
    });
  });

  describe('isSubscriptionValid', () => {
    it('should return true for active subscriptions', async () => {
      const subscription = await subscriptionService.createSubscription(6, 'premium_monthly');
      expect(subscription).not.toBeNull();
      
      if (subscription) {
        const isValid = await subscriptionService.isSubscriptionValid(subscription.id);
        expect(isValid).toBe(true);
      }
    });

    it('should return false for non-existent subscriptions', async () => {
      const isValid = await subscriptionService.isSubscriptionValid('nonexistent_id');
      expect(isValid).toBe(false);
    });
  });

  describe('renewSubscription', () => {
    it('should renew an active subscription', async () => {
      const subscription = await subscriptionService.createSubscription(7, 'premium_monthly');
      expect(subscription).not.toBeNull();
      
      if (subscription) {
        const originalEndDate = subscription.currentPeriodEnd;
        
        const renewed = await subscriptionService.renewSubscription(subscription.id);
        expect(renewed).toBe(true);
        
        const updatedSubscription = await subscriptionService.getUserSubscription(7);
        expect(updatedSubscription?.currentPeriodEnd).not.toEqual(originalEndDate);
      }
    });

    it('should handle renewal of non-existent subscription', async () => {
      const renewed = await subscriptionService.renewSubscription('nonexistent_id');
      expect(renewed).toBe(false);
    });
  });
});