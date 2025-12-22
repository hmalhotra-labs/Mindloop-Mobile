import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing, ViewStyle } from 'react-native';

interface BreathingCircleProps {
  size?: number;
  color?: string;
  breathingPhase?: 'inhale' | 'hold' | 'exhale';
  isBreathing?: boolean;
  style?: ViewStyle;
}

export const BreathingCircle: React.FC<BreathingCircleProps> = ({
  size = 100,
  color = '#4ade80',
  breathingPhase = 'inhale',
  isBreathing = true,
  style
}) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    if (!isBreathing) {
      // If not breathing, keep the circle at a neutral state
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.7,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    // Define breathing animation sequence
    const breatheAnimation = Animated.sequence([
      // Inhale: grow and fade in
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 4000, // 4 seconds for inhale
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      // Hold at top for 2 seconds
      Animated.delay(2000),
      // Exhale: shrink and fade out
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 6000, // 6 seconds for exhale
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.4,
          duration: 6000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      // Hold at bottom for 2 seconds
      Animated.delay(2000),
    ]);

    // Loop the breathing animation
    const loopAnimation = Animated.loop(breatheAnimation);
    loopAnimation.start();

    // Cleanup function to stop animation on unmount
    return () => {
      loopAnimation.stop();
    };
  }, [isBreathing, scaleAnim, opacityAnim]);

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            backgroundColor: color,
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          }
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
  circle: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});