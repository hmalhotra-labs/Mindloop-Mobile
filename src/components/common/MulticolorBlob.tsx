import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, ViewStyle } from 'react-native';
import { colors } from '../../config/theme';

interface MulticolorBlobProps {
    size?: number;
    isAnimating?: boolean;
    style?: ViewStyle;
}

export const MulticolorBlob: React.FC<MulticolorBlobProps> = ({
    size = 200,
    isAnimating = true,
    style,
}) => {
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const morphAnim1 = useRef(new Animated.Value(0)).current;
    const morphAnim2 = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        if (!isAnimating) return;

        // Slow rotation
        const rotateAnimation = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 15000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );

        // Gentle pulse
        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 2500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0.95,
                    duration: 2500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        // Morphing animations for organic shape
        const morphAnimation1 = Animated.loop(
            Animated.sequence([
                Animated.timing(morphAnim1, {
                    toValue: 1,
                    duration: 4000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(morphAnim1, {
                    toValue: 0,
                    duration: 4000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        const morphAnimation2 = Animated.loop(
            Animated.sequence([
                Animated.timing(morphAnim2, {
                    toValue: 0,
                    duration: 3000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(morphAnim2, {
                    toValue: 1,
                    duration: 3000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        rotateAnimation.start();
        pulseAnimation.start();
        morphAnimation1.start();
        morphAnimation2.start();

        return () => {
            rotateAnimation.stop();
            pulseAnimation.stop();
            morphAnimation1.stop();
            morphAnimation2.stop();
        };
    }, [isAnimating, rotateAnim, pulseAnim, morphAnim1, morphAnim2]);

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const rotation2 = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['360deg', '0deg'],
    });

    const scaleX1 = morphAnim1.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.15],
    });

    const scaleY1 = morphAnim1.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.85],
    });

    const scaleX2 = morphAnim2.interpolate({
        inputRange: [0, 1],
        outputRange: [0.9, 1.1],
    });

    const scaleY2 = morphAnim2.interpolate({
        inputRange: [0, 1],
        outputRange: [1.1, 0.9],
    });

    return (
        <View style={[styles.container, { width: size, height: size }, style]}>
            {/* Pink/magenta layer */}
            <Animated.View
                style={[
                    styles.blobLayer,
                    styles.layerPink,
                    {
                        width: size * 0.9,
                        height: size * 0.9,
                        borderRadius: size * 0.4,
                        transform: [
                            { rotate: rotation },
                            { scale: pulseAnim },
                            { scaleX: scaleX1 },
                            { scaleY: scaleY1 },
                        ],
                    },
                ]}
            />

            {/* Teal/cyan layer */}
            <Animated.View
                style={[
                    styles.blobLayer,
                    styles.layerTeal,
                    {
                        width: size * 0.85,
                        height: size * 0.85,
                        borderRadius: size * 0.38,
                        transform: [
                            { rotate: rotation2 },
                            { scale: pulseAnim },
                            { scaleX: scaleX2 },
                            { scaleY: scaleY2 },
                        ],
                    },
                ]}
            />

            {/* Yellow/gold layer */}
            <Animated.View
                style={[
                    styles.blobLayer,
                    styles.layerGold,
                    {
                        width: size * 0.7,
                        height: size * 0.7,
                        borderRadius: size * 0.32,
                        transform: [
                            { rotate: rotation },
                            { scale: pulseAnim },
                            { scaleX: scaleY1 },
                            { scaleY: scaleX1 },
                        ],
                    },
                ]}
            />

            {/* Center white glow */}
            <Animated.View
                style={[
                    styles.centerGlow,
                    {
                        width: size * 0.4,
                        height: size * 0.4,
                        borderRadius: size * 0.2,
                        opacity: morphAnim1,
                        transform: [{ scale: pulseAnim }],
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
    blobLayer: {
        position: 'absolute',
        borderWidth: 2,
        backgroundColor: 'transparent',
    },
    layerPink: {
        borderColor: '#ff6b9d',
        shadowColor: '#ff6b9d',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
    },
    layerTeal: {
        borderColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
    },
    layerGold: {
        borderColor: '#ffd93d',
        shadowColor: '#ffd93d',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    centerGlow: {
        position: 'absolute',
        backgroundColor: '#ffffff15',
    },
});

export default MulticolorBlob;
