// Subscription tier types
export enum SubscriptionTier {
  FREE = 'free',
  BASIC = 'basic',
  PREMIUM = 'premium'
}

// Subscription status types
export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  EXPIRED = 'expired',
  PENDING = 'pending'
}

// Subscription plan data interface
export interface SubscriptionPlanData {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number;
  currency: string;
  billingPeriod: string;
  features: string[];
}

// Subscription plan class
export class SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number;
  currency: string;
  billingPeriod: string;
  features: string[];
  isActive: boolean = true;

  constructor(data: SubscriptionPlanData) {
    this.id = data.id;
    this.name = data.name;
    this.tier = data.tier;
    this.price = data.price;
    this.currency = data.currency;
    this.billingPeriod = data.billingPeriod;
    this.features = data.features;
  }
}

// Subscription data interface
export interface SubscriptionData {
  id: string;
  userId: number;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

// Subscription class
export class Subscription {
  id: string;
  userId: number;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;

  constructor(data: SubscriptionData) {
    this.id = data.id;
    this.userId = data.userId;
    this.plan = data.plan;
    this.status = data.status;
    this.currentPeriodStart = data.currentPeriodStart;
    this.currentPeriodEnd = data.currentPeriodEnd;
    this.cancelAtPeriodEnd = data.cancelAtPeriodEnd;
  }

  get isActive(): boolean {
    const now = new Date();
    return this.status === SubscriptionStatus.ACTIVE && 
           now >= this.currentPeriodStart && 
           now <= this.currentPeriodEnd;
  }

  canAccessContent(contentTier: SubscriptionTier): boolean {
    const tierOrder = [SubscriptionTier.FREE, SubscriptionTier.BASIC, SubscriptionTier.PREMIUM];
    const userTierIndex = tierOrder.indexOf(this.plan.tier);
    const contentTierIndex = tierOrder.indexOf(contentTier);
    return userTierIndex >= contentTierIndex && this.isActive;
  }
}

// Premium content data interface
export interface PremiumContentData {
  id: string;
  title: string;
  description: string;
  requiredTier: SubscriptionTier;
  category: string;
  duration: number;
  isAvailable: boolean;
}

// Premium content class
export class PremiumContent {
  id: string;
  title: string;
  description: string;
  requiredTier: SubscriptionTier;
  category: string;
  duration: number;
  isAvailable: boolean;

  constructor(data: PremiumContentData) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.requiredTier = data.requiredTier;
    this.category = data.category;
    this.duration = data.duration;
    this.isAvailable = data.isAvailable;
  }

  isAccessibleBy(userTier: SubscriptionTier): boolean {
    const tierOrder = [SubscriptionTier.FREE, SubscriptionTier.BASIC, SubscriptionTier.PREMIUM];
    const userTierIndex = tierOrder.indexOf(userTier);
    const requiredTierIndex = tierOrder.indexOf(this.requiredTier);
    return userTierIndex >= requiredTierIndex && this.isAvailable;
  }
}