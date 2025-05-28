import { useLayoutEffect, useState } from 'react';
import { Dimensions, Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  interpolateColor,
  withDelay,
} from 'react-native-reanimated';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export const Tapadoodle = () => {
  const shadowOpacity = useSharedValue(0);
  const height = useSharedValue(56);
  const width = useSharedValue(56);
  const borderRadius = useSharedValue(56 / 2);
  const y = useSharedValue(8);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      boxShadow: `0px 2px 60px rgba(0, 0, 0, ${shadowOpacity.value})`,
      height: height.value,
      width: width.value,
      borderRadius: borderRadius.value,
      bottom: y.value,
    };
  });

  // Get screen width
  const screenWidth = Dimensions.get('window').width;

  const [isOpen, setIsOpen] = useState(false);

  const expandedPadding = 24;

  const backgroundOpacity = useSharedValue(0);

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        backgroundOpacity.value,
        [0, 1],
        ['transparent', 'rgba(0, 0, 0, 0.5)']
      ),
    };
  });

  function Open() {
    setIsOpen(true);
    height.value = withSpring(100, {
      damping: 30,
      stiffness: 200,
    });
    width.value = withSpring(screenWidth - expandedPadding * 2, {
      damping: 30,
      stiffness: 200,
    });
    borderRadius.value = withSpring(25, {
      damping: 30,
      stiffness: 200,
    });
    y.value = withSpring(expandedPadding, {
      damping: 30,
      stiffness: 200,
    });
    backgroundOpacity.value = withSpring(1, {
      damping: 30,
      stiffness: 200,
    });
  }

  function Close() {
    height.value = withSpring(56, {
      damping: 30,
      stiffness: 200,
    });
    width.value = withSpring(56, {
      damping: 30,
      stiffness: 200,
    });
    borderRadius.value = withSpring(56 / 2, {
      damping: 30,
      stiffness: 200,
    });
    y.value = withSpring(8, {
      damping: 30,
      stiffness: 200,
    });
    backgroundOpacity.value = withSpring(
      0,
      {
        damping: 30,
        stiffness: 200,
        restDisplacementThreshold: 0.05,
      },
      () => {
        setIsOpen(false);
      }
    );

    setTimeout(() => {
      shadowOpacity.value = withSpring(0, {
        damping: 30,
        stiffness: 50,
      });
    }, 300);
  }
  function handlePressIn() {
    shadowOpacity.value = withSpring(0.2, {
      damping: 10,
      stiffness: 200,
      velocity: 0.5,
    });
  }

  return (
    <Animated.View
      className="absolute bottom-0 z-10 items-center self-center"
      style={[
        animatedBackgroundStyle,
        { height: isOpen ? '100%' : 70, width: isOpen ? '100%' : 128 },
      ]}>
      <Pressable
        className="absolute bottom-0 z-10 h-full w-full items-center justify-end self-center"
        onPressIn={handlePressIn}
        onPress={() => (isOpen ? Close() : Open())}>
        <Animated.View
          className="absolute rounded-full bg-middleground shadow-2xl"
          style={[animatedStyle]}>
          <Pressable onPress={Open} onPressIn={handlePressIn} className="h-full w-full"></Pressable>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};
