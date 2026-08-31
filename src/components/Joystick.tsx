import React, { useRef } from 'react';
import { StyleSheet, View, PanResponder, Animated } from 'react-native';

interface JoystickProps {
  onMove: (data: { x: number; y: number; force: number }) => void;
  onStop: () => void;
  radius?: number;
}

export const Joystick: React.FC<JoystickProps> = ({ onMove, onStop, radius = 60 }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const maxDistance = radius; 

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderMove: (_, gestureState) => {
        const distance = Math.sqrt(gestureState.dx ** 2 + gestureState.dy ** 2);
        let targetX = gestureState.dx;
        let targetY = gestureState.dy;

        if (distance > maxDistance) {
          const angle = Math.atan2(gestureState.dy, gestureState.dx);
          targetX = Math.cos(angle) * maxDistance;
          targetY = Math.sin(angle) * maxDistance;
        }

        pan.setValue({ x: targetX, y: targetY });

        const normalizedX = parseFloat((targetX / maxDistance).toFixed(2));
        const normalizedY = parseFloat((-targetY / maxDistance).toFixed(2)); // Inverte o Y para cima ser positivo
        const force = parseFloat((Math.min(distance / maxDistance, 1)).toFixed(2));

        onMove({ x: normalizedX, y: normalizedY, force });
      },
      
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          friction: 5,
        }).start();

        onStop();
      },
    })
  ).current;

  return (
    <View style={[styles.container, { width: radius * 2, height: radius * 2, borderRadius: radius }]}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.stick,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    borderWidth: 2,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stick: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#38bdf8',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
