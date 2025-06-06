import React, { useEffect, useRef } from 'react';
import { View, Dimensions, BackHandler } from 'react-native';
import { GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
  interpolate,
  useAnimatedReaction,
  withDecay,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const topMargin = screenHeight * 0.1;

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Drawer({ isOpen, onClose, children }: DrawerProps) {
  const shouldClose = useRef(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => backHandler.remove();
  }, [onClose]);

  // Gesture handler values
  const translateY = useSharedValue(screenHeight);

  useEffect(() => {
    if (isOpen) {
      translateY.value = withSpring(topMargin, { damping: 20, velocity: 0 });
    }
  }, [isOpen]);

  // Monitor translateY value and close when threshold is reached
  useAnimatedReaction(
    () => translateY.value,
    (value) => {
      if (!shouldClose.current) return;
      if (value > screenHeight - 20) {
        runOnJS(onClose)();
        shouldClose.current = false;
      }
    }
  );

  let startY = 0;

  const gestureHandler = Gesture.Pan()
    .onStart(() => {
      startY = translateY.value;
    })
    .onUpdate((event) => {
      translateY.value = startY + event.translationY;
    })
    .onEnd((event) => {
      const shouldGoBack =
        (event.translationY + startY > topMargin + 10 && event.velocityY > 100) ||
        event.velocityY > 2000;

      if (shouldGoBack) {
        shouldClose.current = true;
        translateY.value = withSpring(
          screenHeight,
          {
            stiffness: 200,
            damping: 20,
            velocity: event.velocityY,
          },
          () => {
            runOnJS(onClose)();
          }
        );
      } else {
        if (translateY.value > topMargin) {
          translateY.value = withSpring(topMargin, {
            damping: 10,
            velocity: event.velocityY,
          });
        } else {
          translateY.value = withDecay({
            velocity: event.velocityY,
            deceleration: 0.998,
            clamp: [-100, topMargin],
            rubberBandEffect: true,
            rubberBandFactor: 0.9,
          });
        }
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  // Background overlay style that becomes more transparent as we swipe
  const backgroundStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateY.value, [topMargin, screenHeight], [0.7, 0], 'clamp');
    return {
      opacity: opacity,
    };
  });

  if (!isOpen) return null;

  return (
    <View
      pointerEvents="box-none"
      removeClippedSubviews={true}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
      }}>
      {/* Background overlay */}
      <Animated.View
        removeClippedSubviews={true}
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          },
          backgroundStyle,
        ]}
        pointerEvents="none"
      />

      <GestureDetector gesture={gestureHandler}>
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>{children}</Animated.View>
      </GestureDetector>
    </View>
  );
}
