import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface AnimatedRecordButtonProps {
  active: boolean;
  volumeScale?: number;
  onPressOut: () => void;
}

export const AnimatedRecordButton: React.FC<AnimatedRecordButtonProps> = ({
  active,
  volumeScale,
  onPressOut,
}) => {
  const scale = useSharedValue(1);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const SpringConfig = {
    damping: 10,
    velocity: 0,
    stiffness: 200,
    mass: 1,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  };

  const activeSize = 1.2;
  const inactiveSize = 1;
  const hoverSize = 1.05;
  const pressedSize = 0.9;

  // Handle volume-based scaling when active
  useEffect(() => {
    if (active && volumeScale !== undefined) {
      scale.value = withSpring(volumeScale, { damping: 100, stiffness: 350 });
    }
  }, [volumeScale, active, scale]);

  const handlePressIn = () => {
    console.log('pressed in');
    if (active) return;
    scale.value = withSpring(pressedSize, SpringConfig);
  };

  const handlePressOut = () => {
    console.log('pressed out');
    const newActive = !active;
    scale.value = withSpring(newActive ? activeSize : hoverSize, SpringConfig);
    onPressOut();

    // Reset to inactive size if stopping recording
    if (!newActive) {
      scale.value = withSpring(inactiveSize, SpringConfig);
    }
  };

  const handleHoverIn = () => {
    if (active) return;
    scale.value = withSpring(hoverSize, SpringConfig);
  };

  const handleHoverOut = () => {
    if (active) return;
    scale.value = withSpring(active ? activeSize : inactiveSize, SpringConfig);
  };

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      style={animatedStyles}
      className={`h-48 w-48 items-center justify-center rounded-full ${
        active ? 'bg-blue-500' : 'bg-blue-400'
      }`}
    />
  );
};
