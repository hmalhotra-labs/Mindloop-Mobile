import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { getMoodOptions, MoodOption } from '../data/moodOptions';
import { colors, spacing, typography, borderRadius } from '../config/theme';

interface MoodCheckInScreenProps {
    onMoodSelect?: (mood: MoodOption) => void;
    onAddSound?: () => void;
    onBack?: () => void;
    streakDays?: number;
}

export const MoodCheckInScreen: React.FC<MoodCheckInScreenProps> = ({
    onMoodSelect,
    onAddSound,
    onBack,
    streakDays = 0,
}) => {
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const moodOptions = getMoodOptions();

    const handleMoodPress = (mood: MoodOption) => {
        setSelectedMood(mood.id);
        onMoodSelect?.(mood);
    };

    const getMoodButtonStyle = (moodId: string) => {
        const isSelected = selectedMood === moodId;
        return [
            styles.moodButton,
            isSelected && styles.moodButtonSelected,
        ];
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            {/* Header with back button */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={onBack}
                    accessibilityLabel="Go back"
                    accessibilityRole="button"
                >
                    <Text style={styles.backButtonText}>‹</Text>
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {/* Welcome Text */}
                <Text style={styles.title}>Welcome back</Text>
                <Text style={styles.subtitle}>How did your reset feel?</Text>

                {/* Mood Grid - 2x2 */}
                <View style={styles.moodGrid}>
                    <View style={styles.moodRow}>
                        {moodOptions.slice(0, 2).map((mood) => (
                            <TouchableOpacity
                                key={mood.id}
                                style={getMoodButtonStyle(mood.id)}
                                onPress={() => handleMoodPress(mood)}
                                accessibilityLabel={`${mood.label} mood`}
                                accessibilityRole="button"
                                accessibilityState={{ selected: selectedMood === mood.id }}
                            >
                                <Text style={styles.moodButtonText}>{mood.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.moodRow}>
                        {moodOptions.slice(2, 4).map((mood) => (
                            <TouchableOpacity
                                key={mood.id}
                                style={getMoodButtonStyle(mood.id)}
                                onPress={() => handleMoodPress(mood)}
                                accessibilityLabel={`${mood.label} mood`}
                                accessibilityRole="button"
                                accessibilityState={{ selected: selectedMood === mood.id }}
                            >
                                <Text style={styles.moodButtonText}>{mood.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Add Sound Option */}
                <TouchableOpacity
                    style={styles.addSoundButton}
                    onPress={onAddSound}
                    accessibilityLabel="Add a sound"
                    accessibilityRole="button"
                >
                    <Text style={styles.addSoundIcon}>🎵</Text>
                    <Text style={styles.addSoundText}>Add a sound</Text>
                    <Text style={styles.addSoundArrow}>›</Text>
                </TouchableOpacity>

                {/* Streak Indicator */}
                {streakDays > 0 && (
                    <View style={styles.streakContainer}>
                        <View style={styles.streakDot} />
                        <View style={styles.streakDot} />
                        <View style={styles.streakDot} />
                        <View style={[styles.streakDot, styles.streakDotInactive]} />
                        <View style={[styles.streakDot, styles.streakDotInactive]} />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        fontSize: 32,
        color: colors.textSecondary,
        fontWeight: typography.regular,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xl,
    },
    title: {
        fontSize: typography.xxl,
        fontWeight: typography.semibold,
        color: colors.text,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: typography.base,
        color: colors.textSecondary,
        marginBottom: spacing.xl,
    },
    moodGrid: {
        marginBottom: spacing.xl,
    },
    moodRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    moodButton: {
        flex: 1,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.buttonBorder,
        marginHorizontal: spacing.xs,
        alignItems: 'center',
    },
    moodButtonSelected: {
        backgroundColor: colors.buttonSelected,
        borderColor: colors.primary,
    },
    moodButtonText: {
        fontSize: typography.base,
        color: colors.text,
        fontWeight: typography.medium,
    },
    addSoundButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.buttonBorder,
        marginBottom: spacing.xl,
    },
    addSoundIcon: {
        fontSize: 18,
        marginRight: spacing.sm,
    },
    addSoundText: {
        flex: 1,
        fontSize: typography.base,
        color: colors.text,
    },
    addSoundArrow: {
        fontSize: 20,
        color: colors.textSecondary,
    },
    streakContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: spacing.xl,
    },
    streakDot: {
        width: 40,
        height: 4,
        backgroundColor: colors.primary,
        borderRadius: 2,
        marginHorizontal: 4,
    },
    streakDotInactive: {
        backgroundColor: colors.surface,
    },
});

export default MoodCheckInScreen;
