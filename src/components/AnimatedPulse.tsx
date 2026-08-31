import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface AnimatedPulseProps {
  color?: string;
}

export const AnimatedPulse: React.FC<AnimatedPulseProps> = ({ color = '#10b981' }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.6,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scale]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.pulse,
          { backgroundColor: color, transform: [{ scale }] },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
    marginRight: 8,
  },
  pulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});