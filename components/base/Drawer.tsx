import React, { useEffect, useRef } from 'react';
import { View, Dimensions, BackHandler, ScrollView, Pressable } from 'react-native';
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
const screenHeight = Dimensions.get('window').height + 20;
const topMargin = screenHeight * 0.12;

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  scrollEnabled?: boolean;
  className?: string;
  isDismissable?: boolean;
  startClose?: boolean;
}

export default function Drawer({
  isOpen,
  startClose = false,
  onClose,
  scrollEnabled = true,
  isDismissable = true,
  className,
  children,
}: DrawerProps) {
  const shouldClose = useSharedValue(false);

  useEffect(() => {
    if (startClose) {
      closingAnimation(0);
      console.log('startClose', startClose);
    }
  }, [startClose]);

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
      if (!shouldClose.value) return;
      if (value > screenHeight - 40) {
        console.log('close');
        runOnJS(onClose)();
        shouldClose.value = false;
      }
    }
  );

  const startY = useSharedValue(0);

  const gestureHandler = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
      console.log('startY', startY.value);
    })
    .onUpdate((event) => {
      if (scrollEnabled) {
        translateY.value = startY.value + event.translationY;
      } else {
        translateY.value = Math.max(startY.value + event.translationY, topMargin);
      }

      console.log('ss', startY.value);
      // console.log('translateY', translateY.value);
    })
    .onEnd((event) => {

      const shouldGoBack = isDismissable && (
        (event.translationY + startY.value > topMargin + 10 && event.velocityY > 100) ||
        event.velocityY > 2000);

      if (shouldGoBack) {
        runOnJS(closingAnimation)(event.velocityY);
      } else {
        if (translateY.value > topMargin || !scrollEnabled) {
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

  function closingAnimation(velocityY: number) {
    if (!isDismissable) {
      return;
    };
    shouldClose.value = true;
    translateY.value = withSpring(screenHeight, {
      stiffness: 200,
      damping: 20,
      velocity: velocityY,
    });
  }

  // Background overlay style that becomes more transparent as we swipe
  const backgroundStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateY.value, [topMargin, screenHeight], [0.7, 0], 'clamp');
    return {
      opacity: opacity,
    };
  });

  if (!isOpen) return null;

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
      <AnimatedPressable
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
        onPress={() => closingAnimation(0)}
      />

      <GestureDetector gesture={gestureHandler}>
        <Animated.View
          style={[{ flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center' }, animatedStyle]}>
          <ScrollView
            className={`flex-none rounded-t-[45px] ${className}`}
            style={{
              height: 2000,
            }}
            contentContainerClassName="px-9 pt-12 pb-6 flex-1 h-[100rem]"
            keyboardDismissMode="on-drag">
            {children}
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
