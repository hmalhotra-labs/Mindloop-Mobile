import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, ViewStyle } from 'react-native';
import { colors, shadows } from '../../config/theme';

interface GlowingLoopProps {
    size?: number;
    isAnimating?: boolean;
    style?: ViewStyle;
    variant?: 'home' | 'breathing' | 'completion';
}

export const GlowingLoop: React.FC<GlowingLoopProps> = ({
    size = 200,
    isAnimating = true,
    style,
    variant = 'home',
}) => {
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        if (!isAnimating) {
            rotateAnim.setValue(0);
            pulseAnim.setValue(1);
            glowAnim.setValue(0.5);
            return;
        }

        // Slow rotation animation
        const rotateAnimation = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 8000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );

        // Gentle pulse animation
        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0.95,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        // Glow intensity animation
        const glowAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 0.8,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0.4,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        rotateAnimation.start();
        pulseAnimation.start();
        glowAnimation.start();

        return () => {
            rotateAnimation.stop();
            pulseAnimation.stop();
            glowAnimation.stop();
        };
    }, [isAnimating, rotateAnim, pulseAnim, glowAnim]);

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const ringSize = size;
    const borderWidth = size * 0.06;

    return (
        <View style={[styles.container, { width: size, height: size }, style]}>
            {/* Outer glow layer */}
            <Animated.View
                style={[
                    styles.glowLayer,
                    {
                        width: ringSize + 40,
                        height: ringSize + 40,
                        borderRadius: (ringSize + 40) / 2,
                        opacity: glowAnim,
                    },
                ]}
            />

            {/* Main ring */}
            <Animated.View
                style={[
                    styles.ring,
                    {
                        width: ringSize,
                        height: ringSize,
                        borderRadius: ringSize / 2,
                        borderWidth: borderWidth,
                        transform: [
                            { rotate: rotation },
                            { scale: pulseAnim },
                        ],
                    },
                ]}
            />

            {/* Inner gradient effect (simulated with opacity) */}
            <Animated.View
                style={[
                    styles.innerRing,
                    {
                        width: ringSize * 0.85,
                        height: ringSize * 0.85,
                        borderRadius: (ringSize * 0.85) / 2,
                        borderWidth: borderWidth * 0.5,
                        opacity: glowAnim,
                        transform: [
                            { rotate: rotation },
                            { scale: pulseAnim },
                        ],
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    glowLayer: {
        position: 'absolute',
        backgroundColor: colors.primaryMuted,
        ...shadows.glowLarge,
    },
    ring: {
        position: 'absolute',
        borderColor: colors.primary,
        backgroundColor: 'transparent',
        ...shadows.glow,
    },
    innerRing: {
        position: 'absolute',
        borderColor: colors.primaryGlow,
        backgroundColor: 'transparent',
    },
});

export default GlowingLoop;
