import { ContentAccessControl } from '../src/services/contentAccessControl';
import { SubscriptionService } from '../src/services/subscriptionService';
import { 
  SubscriptionTier, 
  SubscriptionStatus, 
  SubscriptionPlan, 
  PremiumContent 
} from '../src/models/subscription';

describe('ContentAccessControl', () => {
  let contentAccessControl: ContentAccessControl;
  let subscriptionService: SubscriptionService;

  beforeEach(() => {
    subscriptionService = new SubscriptionService();
    contentAccessControl = new ContentAccessControl(subscriptionService);
  });

  describe('checkAccessToContent', () => {
    it('should allow access to free content for free users', async () => {
      const content = new PremiumContent({
        id: 'free_breathing',
        title: 'Basic Breathing',
        description: 'Simple breathing exercise',
        requiredTier: SubscriptionTier.FREE,
        category: 'breathing',
        duration: 300,
        isAvailable: true
      });

      const result = await contentAccessControl.checkAccessToContent(999, content);
      expect(result.hasAccess).toBe(true);
      expect(result.reason).toBe('Access granted');
    });

    it('should deny access to premium content for free users', async () => {
      const content = new PremiumContent({
        id: 'premium_meditation',
        title: 'Premium Meditation',
        description: 'Advanced meditation session',
        requiredTier: SubscriptionTier.PREMIUM,
        category: 'meditation',
        duration: 900,
        isAvailable: true
      });

      const result = await contentAccessControl.checkAccessToContent(999, content);
      expect(result.hasAccess).toBe(false);
      expect(result.reason).toBe('Requires Premium subscription');
      expect(result.requiredTier).toBe(SubscriptionTier.PREMIUM);
    });

    it('should allow access to basic content for basic subscribers', async () => {
      const content = new PremiumContent({
        id: 'basic_breathing',
        title: 'Basic Breathing',
        description: 'Standard breathing exercise',
        requiredTier: SubscriptionTier.BASIC,
        category: 'breathing',
        duration: 600,
        isAvailable: true
      });

      const result = await contentAccessControl.checkAccessToContent(1, content);
      expect(result.hasAccess).toBe(true);
      expect(result.reason).toBe('Access granted');
    });

    it('should deny access to premium content for basic subscribers', async () => {
      const content = new PremiumContent({
        id: 'premium_meditation',
        title: 'Premium Meditation',
        description: 'Advanced meditation session',
        requiredTier: SubscriptionTier.PREMIUM,
        category: 'meditation',
        duration: 900,
        isAvailable: true
      });

      const result = await contentAccessControl.checkAccessToContent(1, content);
      expect(result.hasAccess).toBe(false);
      expect(result.reason).toBe('Requires Premium subscription');
    });

    it('should allow access to premium content for premium subscribers', async () => {
      const content = new PremiumContent({
        id: 'premium_meditation',
        title: 'Premium Meditation',
        description: 'Advanced meditation session',
        requiredTier: SubscriptionTier.PREMIUM,
        category: 'meditation',
        duration: 900,
        isAvailable: true
      });

      const result = await contentAccessControl.checkAccessToContent(2, content);
      expect(result.hasAccess).toBe(true);
      expect(result.reason).toBe('Access granted');
    });

    it('should deny access to unavailable content', async () => {
      const content = new PremiumContent({
        id: 'unavailable_content',
        title: 'Unavailable Content',
        description: 'This content is not available',
        requiredTier: SubscriptionTier.FREE,
        category: 'general',
        duration: 300,
        isAvailable: false
      });

      const result = await contentAccessControl.checkAccessToContent(999, content);
      expect(result.hasAccess).toBe(false);
      expect(result.reason).toBe('Content not available');
    });
  });

  describe('filterAccessibleContent', () => {
    it('should filter content based on user subscription tier', async () => {
      const content = [
        new PremiumContent({
          id: 'free_content',
          title: 'Free Content',
          description: 'Accessible to all',
          requiredTier: SubscriptionTier.FREE,
          category: 'general',
          duration: 300,
          isAvailable: true
        }),
        new PremiumContent({
          id: 'basic_content',
          title: 'Basic Content',
          description: 'For basic subscribers',
          requiredTier: SubscriptionTier.BASIC,
          category: 'basic',
          duration: 600,
          isAvailable: true
        }),
        new PremiumContent({
          id: 'premium_content',
          title: 'Premium Content',
          description: 'Premium only',
          requiredTier: SubscriptionTier.PREMIUM,
          category: 'premium',
          duration: 900,
          isAvailable: true
        })
      ];

      const accessible = await contentAccessControl.filterAccessibleContent(1, content);
      expect(accessible).toHaveLength(2);
      expect(accessible.map(c => c.id)).toEqual(['free_content', 'basic_content']);
    });

    it('should return only free content for users without subscription', async () => {
      const content = [
        new PremiumContent({
          id: 'free_content',
          title: 'Free Content',
          description: 'Accessible to all',
          requiredTier: SubscriptionTier.FREE,
          category: 'general',
          duration: 300,
          isAvailable: true
        }),
        new PremiumContent({
          id: 'basic_content',
          title: 'Basic Content',
          description: 'For basic subscribers',
          requiredTier: SubscriptionTier.BASIC,
          category: 'basic',
          duration: 600,
          isAvailable: true
        })
      ];

      const accessible = await contentAccessControl.filterAccessibleContent(999, content);
      expect(accessible).toHaveLength(1);
      expect(accessible[0].id).toBe('free_content');
    });
  });

  describe('getContentUpgradeRecommendation', () => {
    it('should recommend appropriate subscription for basic users wanting premium content', async () => {
      const content = new PremiumContent({
        id: 'premium_meditation',
        title: 'Premium Meditation',
        description: 'Advanced meditation session',
        requiredTier: SubscriptionTier.PREMIUM,
        category: 'meditation',
        duration: 900,
        isAvailable: true
      });

      const recommendation = await contentAccessControl.getContentUpgradeRecommendation(1, content);
      expect(recommendation.shouldShowUpgrade).toBe(true);
      expect(recommendation.recommendedTier).toBe(SubscriptionTier.PREMIUM);
      expect(recommendation.message).toContain('Premium');
    });

    it('should not recommend upgrade for free users accessing free content', async () => {
      const content = new PremiumContent({
        id: 'free_content',
        title: 'Free Content',
        description: 'Accessible to all',
        requiredTier: SubscriptionTier.FREE,
        category: 'general',
        duration: 300,
        isAvailable: true
      });

      const recommendation = await contentAccessControl.getContentUpgradeRecommendation(999, content);
      expect(recommendation.shouldShowUpgrade).toBe(false);
    });

    it('should not recommend upgrade for premium users', async () => {
      const content = new PremiumContent({
        id: 'premium_meditation',
        title: 'Premium Meditation',
        description: 'Advanced meditation session',
        requiredTier: SubscriptionTier.PREMIUM,
        category: 'meditation',
        duration: 900,
        isAvailable: true
      });

      const recommendation = await contentAccessControl.getContentUpgradeRecommendation(2, content);
      expect(recommendation.shouldShowUpgrade).toBe(false);
    });
  });

  describe('canAccessContentCategory', () => {
    it('should allow access to all categories for premium users', async () => {
      const canAccessBasic = await contentAccessControl.canAccessContentCategory(2, 'breathing');
      const canAccessPremium = await contentAccessControl.canAccessContentCategory(2, 'premium');
      
      expect(canAccessBasic).toBe(true);
      expect(canAccessPremium).toBe(true);
    });

    it('should restrict access based on tier for basic users', async () => {
      const canAccessBasic = await contentAccessControl.canAccessContentCategory(1, 'breathing');
      const canAccessPremium = await contentAccessControl.canAccessContentCategory(1, 'premium');
      
      expect(canAccessBasic).toBe(true);
      expect(canAccessPremium).toBe(false);
    });

    it('should restrict access to free categories for free users', async () => {
      const canAccessBasic = await contentAccessControl.canAccessContentCategory(999, 'free');
      const canAccessPremium = await contentAccessControl.canAccessContentCategory(999, 'premium');
      
      expect(canAccessBasic).toBe(true);
      expect(canAccessPremium).toBe(false);
    });
  });

  describe('getContentAccessLevel', () => {
    it('should return appropriate access level for different subscription tiers', async () => {
      const freeAccess = await contentAccessControl.getContentAccessLevel(999);
      const basicAccess = await contentAccessControl.getContentAccessLevel(1);
      const premiumAccess = await contentAccessControl.getContentAccessLevel(2);

      expect(freeAccess.maxTier).toBe(SubscriptionTier.FREE);
      expect(freeAccess.canAccessCategory('free')).toBe(true);
      expect(freeAccess.canAccessCategory('premium')).toBe(false);

      expect(basicAccess.maxTier).toBe(SubscriptionTier.BASIC);
      expect(basicAccess.canAccessCategory('free')).toBe(true);
      expect(basicAccess.canAccessCategory('basic')).toBe(true);
      expect(basicAccess.canAccessCategory('premium')).toBe(false);

      expect(premiumAccess.maxTier).toBe(SubscriptionTier.PREMIUM);
      expect(premiumAccess.canAccessCategory('free')).toBe(true);
      expect(premiumAccess.canAccessCategory('basic')).toBe(true);
      expect(premiumAccess.canAccessCategory('premium')).toBe(true);
    });
  });
});