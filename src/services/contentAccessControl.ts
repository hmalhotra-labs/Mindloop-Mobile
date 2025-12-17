import { SubscriptionService } from './subscriptionService';
import { SubscriptionTier, PremiumContent } from '../models/subscription';

export interface AccessResult {
  hasAccess: boolean;
  reason: string;
  requiredTier?: SubscriptionTier;
}

export interface UpgradeRecommendation {
  shouldShowUpgrade: boolean;
  recommendedTier?: SubscriptionTier;
  message?: string;
}

export interface ContentAccessLevel {
  maxTier: SubscriptionTier;
  canAccessCategory(category: string): boolean;
}

export class ContentAccessControl {
  constructor(private subscriptionService: SubscriptionService) {}

  async checkAccessToContent(userId: number, content: PremiumContent): Promise<AccessResult> {
    // Check if content is available
    if (!content.isAvailable) {
      return {
        hasAccess: false,
        reason: 'Content not available'
      };
    }

    // Get user's subscription tier
    const userTier = await this.subscriptionService.getUserSubscriptionTier(userId);
    
    // Check if user can access content based on tier
    if (content.isAccessibleBy(userTier)) {
      return {
        hasAccess: true,
        reason: 'Access granted'
      };
    } else {
      return {
        hasAccess: false,
        reason: `Requires ${content.requiredTier.charAt(0).toUpperCase() + content.requiredTier.slice(1)} subscription`,
        requiredTier: content.requiredTier
      };
    }
  }

  async filterAccessibleContent(userId: number, content: PremiumContent[]): Promise<PremiumContent[]> {
    const accessibleContent: PremiumContent[] = [];
    
    for (const item of content) {
      const accessResult = await this.checkAccessToContent(userId, item);
      if (accessResult.hasAccess) {
        accessibleContent.push(item);
      }
    }
    
    return accessibleContent;
  }

  async getContentUpgradeRecommendation(userId: number, content: PremiumContent): Promise<UpgradeRecommendation> {
    const accessResult = await this.checkAccessToContent(userId, content);
    
    if (accessResult.hasAccess) {
      return {
        shouldShowUpgrade: false
      };
    }

    const userTier = await this.subscriptionService.getUserSubscriptionTier(userId);
    
    // Only show upgrade recommendation if user has a lower tier than required
    if (this.isTierUpgradeAvailable(userTier, content.requiredTier)) {
      return {
        shouldShowUpgrade: true,
        recommendedTier: content.requiredTier,
        message: `Upgrade to ${content.requiredTier.charAt(0).toUpperCase() + content.requiredTier.slice(1)} to access this content`
      };
    }

    return {
      shouldShowUpgrade: false
    };
  }

  async canAccessContentCategory(userId: number, category: string): Promise<boolean> {
    const userTier = await this.subscriptionService.getUserSubscriptionTier(userId);
    return this.canUserAccessCategory(userTier, category);
  }

  async getContentAccessLevel(userId: number): Promise<ContentAccessLevel> {
    const userTier = await this.subscriptionService.getUserSubscriptionTier(userId);
    
    return {
      maxTier: userTier,
      canAccessCategory: (category: string) => this.canUserAccessCategory(userTier, category)
    };
  }

  private isTierUpgradeAvailable(currentTier: SubscriptionTier, requiredTier: SubscriptionTier): boolean {
    const tierOrder = [SubscriptionTier.FREE, SubscriptionTier.BASIC, SubscriptionTier.PREMIUM];
    const currentIndex = tierOrder.indexOf(currentTier);
    const requiredIndex = tierOrder.indexOf(requiredTier);
    return requiredIndex > currentIndex;
  }

  private canUserAccessCategory(userTier: SubscriptionTier, category: string): boolean {
    const categoryTierMapping: { [key: string]: SubscriptionTier } = {
      'free': SubscriptionTier.FREE,
      'basic': SubscriptionTier.BASIC,
      'premium': SubscriptionTier.PREMIUM,
      'general': SubscriptionTier.FREE,
      'breathing': SubscriptionTier.BASIC,
      'meditation': SubscriptionTier.PREMIUM
    };

    const requiredTier = categoryTierMapping[category.toLowerCase()] || SubscriptionTier.FREE;
    const tierOrder = [SubscriptionTier.FREE, SubscriptionTier.BASIC, SubscriptionTier.PREMIUM];
    const userTierIndex = tierOrder.indexOf(userTier);
    const requiredTierIndex = tierOrder.indexOf(requiredTier);
    
    return userTierIndex >= requiredTierIndex;
  }
}