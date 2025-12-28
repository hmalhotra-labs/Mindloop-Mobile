import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Share } from 'react-native';
import { MulticolorBlob } from '../components/common/MulticolorBlob';
import { colors, spacing, typography, borderRadius } from '../config/theme';

interface CompletionScreenProps {
    sessionDuration?: number;
    onShareProgress?: () => void;
    onBackToHome?: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
    sessionDuration = 60,
    onShareProgress,
    onBackToHome,
}) => {
    const handleShare = async () => {
        try {
            await Share.share({
                message: `I just completed a ${Math.floor(sessionDuration / 60)} minute mindfulness session with Mindloop! 🧘‍♀️✨`,
            });
            onShareProgress?.();
        } catch (error) {
            console.log('Error sharing:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            {/* Main Content */}
            <View style={styles.content}>
                {/* Completion Title */}
                <Text
                    style={styles.title}
                    accessibilityRole="header"
                >
                    Loop{'\n'}Complete
                </Text>

                <Text style={styles.subtitle}>Nice reset today</Text>

                {/* Multicolor Blob Animation */}
                <View style={styles.blobContainer}>
                    <MulticolorBlob
                        size={220}
                        isAnimating={true}
                    />
                </View>

                {/* Action Buttons */}
                <TouchableOpacity
                    style={styles.shareButton}
                    onPress={handleShare}
                    accessibilityLabel="Share your progress"
                    accessibilityRole="button"
                >
                    <Text style={styles.shareButtonText}>Share Progress</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.homeLink}
                    onPress={onBackToHome}
                    accessibilityLabel="Back to home"
                    accessibilityRole="button"
                >
                    <Text style={styles.homeLinkText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
    },
    title: {
        fontSize: typography.xxxl,
        fontWeight: typography.bold,
        color: colors.primary,
        textAlign: 'center',
        lineHeight: 52,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: typography.base,
        color: colors.textSecondary,
        marginBottom: spacing.xxl,
    },
    blobContainer: {
        marginBottom: spacing.xxl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shareButton: {
        backgroundColor: colors.surfaceLight,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.buttonBorder,
        marginBottom: spacing.lg,
        minWidth: 180,
        alignItems: 'center',
    },
    shareButtonText: {
        color: colors.text,
        fontSize: typography.base,
        fontWeight: typography.semibold,
    },
    homeLink: {
        padding: spacing.md,
    },
    homeLinkText: {
        color: colors.primary,
        fontSize: typography.base,
        fontWeight: typography.medium,
    },
});

export default CompletionScreen;
