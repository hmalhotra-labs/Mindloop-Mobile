import { SubscriptionTier, SubscriptionStatus, Subscription, PremiumContent, SubscriptionPlan } from '../src/models/subscription';

describe('Subscription Models', () => {
  describe('SubscriptionTier', () => {
    it('should define FREE, BASIC, and PREMIUM tiers', () => {
      expect(SubscriptionTier.FREE).toBe('free');
      expect(SubscriptionTier.BASIC).toBe('basic');
      expect(SubscriptionTier.PREMIUM).toBe('premium');
    });
  });

  describe('SubscriptionStatus', () => {
    it('should define ACTIVE, CANCELED, EXPIRED, and PENDING statuses', () => {
      expect(SubscriptionStatus.ACTIVE).toBe('active');
      expect(SubscriptionStatus.CANCELED).toBe('canceled');
      expect(SubscriptionStatus.EXPIRED).toBe('expired');
      expect(SubscriptionStatus.PENDING).toBe('pending');
    });
  });

  describe('SubscriptionPlan', () => {
    it('should create a plan with required properties', () => {
      const plan = new SubscriptionPlan({
        id: 'basic_monthly',
        name: 'Basic Monthly',
        tier: SubscriptionTier.BASIC,
        price: 4.99,
        currency: 'USD',
        billingPeriod: 'monthly',
        features: [
          'Unlimited basic sessions',
          'Progress tracking',
          'Basic ambient sounds'
        ]
      });

      expect(plan.id).toBe('basic_monthly');
      expect(plan.name).toBe('Basic Monthly');
      expect(plan.tier).toBe(SubscriptionTier.BASIC);
      expect(plan.price).toBe(4.99);
      expect(plan.currency).toBe('USD');
      expect(plan.billingPeriod).toBe('monthly');
      expect(plan.features).toContain('Unlimited basic sessions');
      expect(plan.isActive).toBe(true);
    });
  });

  describe('Subscription', () => {
    it('should create a subscription with user and plan', () => {
      const plan = new SubscriptionPlan({
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
          'Offline downloads'
        ]
      });

      const subscription = new Subscription({
        id: 'sub_123',
        userId: 1,
        plan: plan,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: new Date('2025-12-01'),
        currentPeriodEnd: new Date('2025-12-31'),
        cancelAtPeriodEnd: false
      });

      expect(subscription.id).toBe('sub_123');
      expect(subscription.userId).toBe(1);
      expect(subscription.plan.tier).toBe(SubscriptionTier.PREMIUM);
      expect(subscription.status).toBe(SubscriptionStatus.ACTIVE);
      expect(subscription.isActive).toBe(true);
      expect(subscription.canAccessContent('premium')).toBe(true);
    });

    it('should handle expired subscriptions', () => {
      const plan = new SubscriptionPlan({
        id: 'basic_monthly',
        name: 'Basic Monthly',
        tier: SubscriptionTier.BASIC,
        price: 4.99,
        currency: 'USD',
        billingPeriod: 'monthly',
        features: []
      });

      const subscription = new Subscription({
        id: 'sub_expired',
        userId: 1,
        plan: plan,
        status: SubscriptionStatus.EXPIRED,
        currentPeriodStart: new Date('2025-11-01'),
        currentPeriodEnd: new Date('2025-11-30'),
        cancelAtPeriodEnd: false
      });

      expect(subscription.isActive).toBe(false);
      expect(subscription.canAccessContent('basic')).toBe(false);
    });
  });

  describe('PremiumContent', () => {
    it('should define content with required tier', () => {
      const content = new PremiumContent({
        id: 'advanced_breathing',
        title: 'Advanced Breathing Techniques',
        description: 'Professional breathing exercises',
        requiredTier: SubscriptionTier.PREMIUM,
        category: 'breathing',
        duration: 900,
        isAvailable: true
      });

      expect(content.id).toBe('advanced_breathing');
      expect(content.title).toBe('Advanced Breathing Techniques');
      expect(content.requiredTier).toBe(SubscriptionTier.PREMIUM);
      expect(content.category).toBe('breathing');
      expect(content.isAccessibleBy(SubscriptionTier.FREE)).toBe(false);
      expect(content.isAccessibleBy(SubscriptionTier.PREMIUM)).toBe(true);
    });

    it('should handle content accessible by free tier', () => {
      const content = new PremiumContent({
        id: 'basic_meditation',
        title: 'Basic Meditation',
        description: 'Simple meditation exercises',
        requiredTier: SubscriptionTier.FREE,
        category: 'meditation',
        duration: 300,
        isAvailable: true
      });

      expect(content.isAccessibleBy(SubscriptionTier.FREE)).toBe(true);
      expect(content.isAccessibleBy(SubscriptionTier.BASIC)).toBe(true);
    });
  });
});