import { useLayoutEffect, useRef, useState } from 'react';
import { Dimensions, LayoutChangeEvent, Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  interpolateColor,
  withDelay,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import TapadoodleSvg from '../assets/tapadoodle.svg';
import AppText from '../base/AppText';
import DeepgramTranscriber from '../AudioRecorder/DeepgramTranscriber';
import { Tapadoodle } from './Tapadoodle';
const SPRING_CONFIG = {
  damping: 30,
  stiffness: 200,
};

export const TapadoodleBox = () => {
  // Get screen width
  const screenWidth = Dimensions.get('window').width;

  const [isOpen, setIsOpen] = useState(false);
  // const [dynamicHeight, setDynamicHeight] = useState(false);

  const expandedPadding = 24;
  const openWidth = Math.min(screenWidth - expandedPadding * 2, 500);

  const backgroundOpacity = useSharedValue(0);

  const shadowOpacity = useSharedValue(0);
  const height = useSharedValue(56);
  const width = useSharedValue(56);
  const borderRadius = useSharedValue(56 / 2);
  const y = useSharedValue(8);
  const paddingX = useSharedValue(10);
  const paddingY = useSharedValue(7);

  const childrenRef = useRef<View>(null);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      boxShadow: `0px 2px 60px rgba(0, 0, 0, ${shadowOpacity.value})`,
      height: height.value,
      width: width.value,
      borderRadius: borderRadius.value,
      bottom: y.value,
      paddingLeft: paddingX.value,
      paddingRight: paddingX.value,
      paddingTop: paddingY.value,
      // paddingBottom: paddingY.value,
    };
  });

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        backgroundOpacity.value,
        [0, 1],
        ['transparent', 'rgba(0, 0, 0, 0.2)']
      ),
    };
  });

  const testAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
      paddingBottom: 15,
    };
  });

  function AnimateSprings(isOpen: boolean) {
    height.value = withSpring(isOpen ? 45 + 20 * 2 : 52, SPRING_CONFIG);

    borderRadius.value = withSpring(isOpen ? 20 : 56 / 2, SPRING_CONFIG);
    y.value = withSpring(isOpen ? expandedPadding : 8, SPRING_CONFIG);
    backgroundOpacity.value = withSpring(isOpen ? 1 : 0, SPRING_CONFIG);
    paddingX.value = withSpring(isOpen ? 20 : 9, SPRING_CONFIG);
    paddingY.value = withSpring(isOpen ? 20 : 0, SPRING_CONFIG);
  }
  function Open() {
    if (isOpen) return;
    setIsOpen(true);
    AnimateSprings(true);
    width.value = withSpring(openWidth, SPRING_CONFIG);
  }

  function Close() {
    AnimateSprings(false);
    width.value = withSpring(52, SPRING_CONFIG);

    backgroundOpacity.value = withSpring(
      0,
      {
        ...SPRING_CONFIG,
        restDisplacementThreshold: 0.05,
      },
      () => {
        runOnJS(setIsOpen)(false);
      }
    );

    setTimeout(() => {
      shadowOpacity.value = withSpring(0, SPRING_CONFIG);
    }, 300);
  }
  function handlePressIn() {
    shadowOpacity.value = withSpring(0.2, {
      damping: 10,
      stiffness: 200,
      velocity: 0.5,
    });
  }

  const handleLayout = (event: LayoutChangeEvent) => {
    if (width.value === openWidth) {
      height.value = withSpring(
        event.nativeEvent.layout.height + paddingY.value * 2,
        SPRING_CONFIG
      );
    }
  };

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  return (
    <>
      <Animated.View
        className="absolute top-10 h-10 w-10 items-center self-center"
        style={testAnimatedStyle}></Animated.View>
      <Animated.View
        className="absolute bottom-0 z-10 items-center self-center "
        style={[
          animatedBackgroundStyle,
          { height: isOpen ? '100%' : 70, width: isOpen ? '100%' : 128 },
        ]}>
        <Pressable
          className="absolute bottom-0 z-10 h-full w-full items-center justify-end self-center"
          onPressIn={handlePressIn}
          onPress={() => (isOpen ? Close() : Open())}>
          <AnimatedPressable
            className="absolute h-full overflow-hidden rounded-full bg-white shadow-2xl"
            style={[animatedStyle]}
            onPress={Open}
            onPressIn={handlePressIn}>
            <View className="h-[20rem] w-full" style={{ width: openWidth - 17 * 2 }}>
              <View ref={childrenRef} className="gap-2" onLayout={handleLayout}>
                <Tapadoodle isOpen={isOpen} />
              </View>
            </View>
          </AnimatedPressable>
        </Pressable>
      </Animated.View>
    </>
  );
};
