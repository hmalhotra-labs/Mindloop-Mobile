import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface PaywallErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onRetry?: () => void;
}

class PaywallErrorBoundary extends React.Component<PaywallErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: PaywallErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Paywall Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      // If a fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Something went wrong with the subscription service.</Text>
          <Text style={styles.errorDetails}>
            {this.state.error?.message || 'Please try again later.'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={this.handleRetry}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorDetails: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaywallErrorBoundary;