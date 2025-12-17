import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SubscriptionService } from '../../services/subscriptionService';
import { ContentAccessControl } from '../../services/contentAccessControl';
import { SubscriptionTier, SubscriptionPlan, Subscription } from '../../models/subscription';
import PaywallErrorBoundary from './PaywallErrorBoundary';

interface PaywallProps {
  userId: number;
  contentTitle: string;
  requiredTier: SubscriptionTier;
  onClose: () => void;
  onSubscribe: (plan: SubscriptionPlan) => void;
  subscriptionService?: SubscriptionService;
  contentAccessControl?: ContentAccessControl;
}

export const Paywall: React.FC<PaywallProps> = ({
  userId,
  contentTitle,
  requiredTier,
  onClose,
  onSubscribe,
  subscriptionService: externalSubscriptionService,
  contentAccessControl: externalContentAccessControl
}) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upgradeRecommendation, setUpgradeRecommendation] = useState<{
    shouldShowUpgrade: boolean;
    recommendedTier?: SubscriptionTier;
    message?: string;
  }>({ shouldShowUpgrade: false });

  const subscriptionService = externalSubscriptionService || new SubscriptionService();
  const contentAccessControl = externalContentAccessControl || new ContentAccessControl(subscriptionService);

  useEffect(() => {
    loadData();
  }, [userId, subscriptionService, contentAccessControl]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load available plans
      const availablePlans = await subscriptionService.getAvailablePlans();
      setPlans(availablePlans);

      // Load current subscription
      const userSubscription = await subscriptionService.getUserSubscription(userId);
      setCurrentSubscription(userSubscription);

      // Get upgrade recommendation if needed
      if (requiredTier !== SubscriptionTier.FREE) {
        // Create a mock content object for upgrade recommendation
        const mockContent = {
          id: 'mock_content',
          title: contentTitle,
          description: '',
          requiredTier,
          category: '',
          duration: 0,
          isAvailable: true
        };

        const recommendation = await contentAccessControl.getContentUpgradeRecommendation(
          userId,
          mockContent as any
        );
        setUpgradeRecommendation(recommendation);
      }
    } catch (err) {
      setError('Unable to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (plan: SubscriptionPlan) => {
    onSubscribe(plan);
  };

  const formatPrice = (price: number, currency: string): string => {
    if (price === 0) return 'Free';
    return `$${price.toFixed(2)}`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer} testID="paywall-loading">
          <Text style={styles.loadingText}>Loading plans...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No subscription plans available</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose} testID="paywall-close-button">
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <PaywallErrorBoundary onRetry={() => loadData()}>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose} testID="paywall-close-button">
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Upgrade to Premium</Text>
          </View>

          {/* Content Info */}
          {requiredTier !== SubscriptionTier.FREE && (
            <View style={styles.contentInfo}>
              <Text style={styles.contentTitle}>{contentTitle}</Text>
              <Text style={styles.contentDescription}>
                This content requires a {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} subscription
              </Text>
            </View>
          )}

          {/* Current Plan */}
          {currentSubscription && (
            <View style={styles.currentPlan}>
              <Text style={styles.currentPlanText}>
                Current Plan: {currentSubscription.plan.name}
              </Text>
            </View>
          )}

          {/* Upgrade Recommendation */}
          {upgradeRecommendation && upgradeRecommendation.shouldShowUpgrade && upgradeRecommendation.message && (
            <View style={styles.upgradeRecommendation}>
              <Text style={styles.upgradeRecommendationText}>{upgradeRecommendation.message}</Text>
            </View>
          )}

          {/* Subscription Plans */}
          <ScrollView style={styles.plansContainer} showsVerticalScrollIndicator={false}>
            {plans && plans.length > 0 ? (
              plans.map((plan) => (
                <View key={plan.id} style={styles.planCard}>
                  <View style={styles.planHeader}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planPrice}>
                      {formatPrice(plan.price, plan.currency)}
                      {plan.billingPeriod !== 'free' && (
                        <Text style={styles.billingPeriod}> / {plan.billingPeriod}</Text>
                      )}
                    </Text>
                  </View>

                  {/* Features */}
                  <View style={styles.featuresContainer}>
                    {plan.features.map((feature, index) => (
                      <View key={index} style={styles.featureItem}>
                        <Text style={styles.featureText}>• {feature}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Subscribe Button */}
                  <TouchableOpacity
                    style={[
                      styles.subscribeButton,
                      plan.tier === requiredTier && styles.recommendedButton
                    ]}
                    onPress={() => handleSubscribe(plan)}
                    testID={`subscribe-button-${plan.tier}`}
                  >
                    <Text style={styles.subscribeButtonText}>
                      {plan.tier === requiredTier ? 'Upgrade Now' : 'Subscribe'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.noPlansContainer}>
                <Text style={styles.noPlansText}>No subscription plans available</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </PaywallErrorBoundary>
  );
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
content: {
  backgroundColor: 'white',
  borderRadius: 16,
  width: '90%',
  maxHeight: '80%',
  padding: 20,
},
header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
},
title: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#333',
},
closeButton: {
  padding: 8,
},
closeButtonText: {
  fontSize: 18,
  color: '#666',
},
contentInfo: {
  backgroundColor: '#f8f9fa',
  padding: 16,
  borderRadius: 8,
  marginBottom: 20,
},
contentTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 4,
},
contentDescription: {
  fontSize: 14,
  color: '#666',
},
currentPlan: {
  backgroundColor: '#e3f2fd',
  padding: 12,
  borderRadius: 8,
  marginBottom: 20,
},
currentPlanText: {
  fontSize: 14,
  fontWeight: '600',
  color: '#1976d2',
  textAlign: 'center',
},
upgradeRecommendation: {
  backgroundColor: '#fff3cd',
  padding: 12,
  borderRadius: 8,
  marginBottom: 20,
  borderLeftWidth: 4,
  borderLeftColor: '#ffc107',
},
upgradeRecommendationText: {
  fontSize: 14,
  fontWeight: '600',
  color: '#856404',
  textAlign: 'center',
},
plansContainer: {
  maxHeight: 400,
},
planCard: {
  backgroundColor: '#f8f9fa',
  borderRadius: 12,
  padding: 16,
  marginBottom: 16,
},
planHeader: {
  marginBottom: 12,
},
planName: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 4,
},
planPrice: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#2196f3',
},
billingPeriod: {
  fontSize: 14,
  fontWeight: 'normal',
  color: '#666',
},
featuresContainer: {
  marginBottom: 16,
},
featureItem: {
  marginBottom: 4,
},
featureText: {
  fontSize: 14,
  color: '#555',
},
subscribeButton: {
  backgroundColor: '#2196f3',
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
},
recommendedButton: {
  backgroundColor: '#ff6b35',
},
subscribeButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},
loadingContainer: {
  padding: 40,
  alignItems: 'center',
},
loadingText: {
  fontSize: 16,
  color: '#666',
},
errorContainer: {
  padding: 40,
  alignItems: 'center',
},
errorText: {
  fontSize: 16,
  color: '#d32f2f',
  textAlign: 'center',
  marginBottom: 20,
},
noPlansContainer: {
  padding: 40,
  alignItems: 'center',
},
noPlansText: {
  fontSize: 16,
  color: '#666',
  textAlign: 'center',
},
});