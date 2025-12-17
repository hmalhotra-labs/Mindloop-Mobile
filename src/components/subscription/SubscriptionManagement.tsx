import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SubscriptionService } from '../../services/subscriptionService';
import { SubscriptionTier, SubscriptionStatus, Subscription, SubscriptionPlan } from '../../models/subscription';

interface SubscriptionManagementProps {
  userId: number;
  onManageSubscription: (action: 'upgrade' | 'downgrade' | 'cancel') => void;
  subscriptionService?: SubscriptionService;
}

export const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({
  userId,
  onManageSubscription,
  subscriptionService: externalSubscriptionService
}) => {
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [userTier, setUserTier] = useState<SubscriptionTier>(SubscriptionTier.FREE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const subscriptionService = externalSubscriptionService || new SubscriptionService();

  useEffect(() => {
    loadSubscriptionData();
  }, [userId]);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [subscription, tier] = await Promise.all([
        subscriptionService.getUserSubscription(userId),
        subscriptionService.getUserSubscriptionTier(userId)
      ]);

      setCurrentSubscription(subscription);
      setUserTier(tier);
    } catch (err) {
      setError('Failed to load subscription information');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, currency: string): string => {
    if (price === 0) return 'Free';
    return `$${price.toFixed(2)}/${price > 0 ? 'month' : ''}`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleCancelSubscription = async () => {
    if (!currentSubscription) return;

    // For testing purposes, make the alert function available
    const cancelConfirmation = () => {
      return subscriptionService.cancelSubscription(currentSubscription.id);
    };

    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription? You will lose access at the end of your current billing period.',
      [
        { text: 'Keep Subscription', style: 'cancel' },
        {
          text: 'Cancel Subscription',
          style: 'destructive',
          onPress: async () => {
            const success = await cancelConfirmation();
            if (success) {
              loadSubscriptionData();
              Alert.alert('Success', 'Your subscription has been cancelled.');
            } else {
              Alert.alert('Error', 'Failed to cancel subscription. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleRenewSubscription = async () => {
    if (!currentSubscription) return;

    const success = await subscriptionService.renewSubscription(currentSubscription.id);
    if (success) {
      loadSubscriptionData();
      Alert.alert('Success', 'Your subscription has been renewed.');
    } else {
      Alert.alert('Error', 'Failed to renew subscription. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer} testID="subscription-loading">
          <Text style={styles.loadingText}>Loading subscription...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadSubscriptionData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Subscription Management</Text>
        </View>

        {/* Current Subscription */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Plan</Text>
          
          {currentSubscription ? (
            <View style={styles.subscriptionCard}>
              <View style={styles.planInfo}>
                <Text style={styles.planName}>{currentSubscription.plan.name}</Text>
                <Text style={styles.planPrice}>
                  {formatPrice(currentSubscription.plan.price, currentSubscription.plan.currency)}
                </Text>
              </View>

              <View style={styles.statusInfo}>
                <Text style={[
                  styles.statusText,
                  currentSubscription.status === SubscriptionStatus.ACTIVE && styles.activeStatus,
                  currentSubscription.status === SubscriptionStatus.EXPIRED && styles.expiredStatus
                ]}>
                  {currentSubscription.status === SubscriptionStatus.ACTIVE ? 'Active' : 'Expired'}
                </Text>
              </View>

              {/* Billing Information */}
              <View style={styles.billingInfo}>
                <View style={styles.billingRow}>
                  <Text style={styles.billingLabel}>Next billing date</Text>
                  <Text style={styles.billingValue}>
                    {formatDate(currentSubscription.currentPeriodEnd)}
                  </Text>
                </View>

                {currentSubscription.cancelAtPeriodEnd && (
                  <View style={styles.billingRow}>
                    <Text style={styles.billingLabel}>Subscription will end on</Text>
                    <Text style={styles.billingValue}>
                      {formatDate(currentSubscription.currentPeriodEnd)}
                    </Text>
                  </View>
                )}
              </View>

              {/* Features */}
              <View style={styles.featuresSection}>
                <Text style={styles.featuresTitle}>
                  Your {currentSubscription.plan.tier.charAt(0).toUpperCase() + currentSubscription.plan.tier.slice(1)} Features:
                </Text>
                {currentSubscription.plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Text style={styles.featureText}>• {feature}</Text>
                  </View>
                ))}
              </View>

              {/* Action Buttons */}
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={styles.manageButton}
                  onPress={() => onManageSubscription('upgrade')}
                >
                  <Text style={styles.manageButtonText}>Manage Subscription</Text>
                </TouchableOpacity>

                {currentSubscription.status === SubscriptionStatus.EXPIRED ? (
                  <TouchableOpacity
                    style={styles.renewButton}
                    onPress={handleRenewSubscription}
                  >
                    <Text style={styles.renewButtonText}>Renew Subscription</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancelSubscription}
                  >
                    <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : (
            // No subscription - Free plan
            <View style={styles.freePlanCard}>
              <Text style={styles.planName}>Free Plan</Text>
              <Text style={styles.planPrice}>Free</Text>
              
              <View style={styles.freeFeatures}>
                <Text style={styles.featuresTitle}>Your Free Features:</Text>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>• Basic breathing exercises</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureText}>• Simple progress tracking</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={() => onManageSubscription('upgrade')}
              >
                <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  subscriptionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planInfo: {
    marginBottom: 15,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2196f3',
  },
  statusInfo: {
    marginBottom: 15,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    alignSelf: 'flex-start',
  },
  activeStatus: {
    backgroundColor: '#e8f5e8',
    color: '#2e7d32',
  },
  expiredStatus: {
    backgroundColor: '#ffebee',
    color: '#c62828',
  },
  billingInfo: {
    marginBottom: 20,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billingLabel: {
    fontSize: 14,
    color: '#666',
  },
  billingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  featuresSection: {
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  featureItem: {
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    color: '#555',
  },
  actionsContainer: {
    gap: 12,
  },
  manageButton: {
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  manageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  renewButton: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  renewButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  freePlanCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  freeFeatures: {
    marginVertical: 20,
    alignSelf: 'flex-start',
  },
  upgradeButton: {
    backgroundColor: '#ff6b35',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});