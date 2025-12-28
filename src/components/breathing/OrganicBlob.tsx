import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing, ViewStyle } from 'react-native';
import { colors, shadows } from '../../config/theme';

interface OrganicBlobProps {
    size?: number;
    isBreathing?: boolean;
    breathingPhase?: 'inhale' | 'hold' | 'exhale';
    style?: ViewStyle;
}

export const OrganicBlob: React.FC<OrganicBlobProps> = ({
    size = 200,
    isBreathing = true,
    breathingPhase = 'inhale',
    style,
}) => {
    const scaleAnim = useRef(new Animated.Value(0.85)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0.5)).current;
    const morphAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!isBreathing) {
            scaleAnim.setValue(1);
            rotateAnim.setValue(0);
            glowAnim.setValue(0.5);
            return;
        }

        // Breathing animation: inhale (4s) → hold (2s) → exhale (6s) → hold (2s)
        const breatheAnimation = Animated.loop(
            Animated.sequence([
                // Inhale: expand
                Animated.parallel([
                    Animated.timing(scaleAnim, {
                        toValue: 1.3,
                        duration: 4000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 1,
                        duration: 4000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ]),
                // Hold at top
                Animated.delay(2000),
                // Exhale: contract
                Animated.parallel([
                    Animated.timing(scaleAnim, {
                        toValue: 0.75,
                        duration: 6000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 0.3,
                        duration: 6000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ]),
                // Hold at bottom
                Animated.delay(2000),
            ])
        );

        // Continuous slow rotation for organic feel
        const rotateAnimation = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 20000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );

        // Morphing effect
        const morphAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(morphAnim, {
                    toValue: 1,
                    duration: 3000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(morphAnim, {
                    toValue: 0,
                    duration: 3000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        breatheAnimation.start();
        rotateAnimation.start();
        morphAnimation.start();

        return () => {
            breatheAnimation.stop();
            rotateAnimation.stop();
            morphAnimation.stop();
        };
    }, [isBreathing, scaleAnim, rotateAnim, glowAnim, morphAnim]);

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const scaleX = morphAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.1],
    });

    const scaleY = morphAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.9],
    });

    return (
        <View style={[styles.container, { width: size, height: size }, style]}>
            {/* Outer glow */}
            <Animated.View
                style={[
                    styles.glowOuter,
                    {
                        width: size * 1.4,
                        height: size * 1.4,
                        borderRadius: size * 0.7,
                        opacity: glowAnim,
                    },
                ]}
            />

            {/* Main blob shape - simulating organic curve with multiple overlapping circles */}
            <Animated.View
                style={[
                    styles.blobBase,
                    {
                        width: size,
                        height: size,
                        borderRadius: size * 0.45,
                        transform: [
                            { rotate: rotation },
                            { scale: scaleAnim },
                            { scaleX },
                            { scaleY },
                        ],
                    },
                ]}
            >
                {/* Inner ring 1 */}
                <View
                    style={[
                        styles.innerRing,
                        {
                            width: size * 0.85,
                            height: size * 0.85,
                            borderRadius: size * 0.4,
                        },
                    ]}
                />
                {/* Inner ring 2 */}
                <View
                    style={[
                        styles.innerRingDeep,
                        {
                            width: size * 0.7,
                            height: size * 0.7,
                            borderRadius: size * 0.35,
                        },
                    ]}
                />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    glowOuter: {
        position: 'absolute',
        backgroundColor: colors.primaryMuted,
        ...shadows.glowLarge,
    },
    blobBase: {
        borderWidth: 3,
        borderColor: colors.primary,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.glow,
    },
    innerRing: {
        position: 'absolute',
        borderWidth: 2,
        borderColor: colors.primaryGlow,
        backgroundColor: 'transparent',
        opacity: 0.6,
    },
    innerRingDeep: {
        position: 'absolute',
        borderWidth: 1.5,
        borderColor: colors.primaryDark,
        backgroundColor: 'transparent',
        opacity: 0.4,
    },
});

export default OrganicBlob;
