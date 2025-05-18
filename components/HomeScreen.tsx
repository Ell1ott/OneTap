import * as React from 'react';
import { useState } from 'react';
import { View, Pressable } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  Easing
} from 'react-native-reanimated';

export const HomeScreen: React.FC = () => {
  const [active, setActive] = useState<boolean>(false);
  const scale = useSharedValue(1);
  
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
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


  const handlePressIn = () => {
    if(active) return;
    // Shrink when pressed
    scale.value = withSpring(pressedSize, SpringConfig);
  };

  const handlePressOut = () => {
    if(active) return;
    // Return to hover state or active state
    scale.value = withSpring(active ? activeSize : hoverSize, SpringConfig);
  };

  const handleHoverIn = () => {
    if(active) return;
    // Grow slightly on hover
    scale.value = withSpring(hoverSize, SpringConfig);
  };

  const handleHoverOut = () => {
    if(active) return;
    // Return to normal or active state
    scale.value = withSpring(active ? activeSize : inactiveSize, SpringConfig);
  };

  const handlePress = () => {
    setActive(prev => !prev);
    
    // Animate to the active/inactive state with physics
    scale.value = withSpring(active ? inactiveSize : activeSize, SpringConfig);
  };

  // AnimatedPressable combines Animated and Pressable
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  return (
    <View className="flex-1 bg-gray-300 items-center justify-center">
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        style={animatedStyles}
        className={`w-24 h-24 rounded-full items-center justify-center ${
          active ? 'bg-blue-500' : 'bg-blue-400'
        }`}
      />
    </View>
  );
};