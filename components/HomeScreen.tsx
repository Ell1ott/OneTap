import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Audio } from 'expo-av';

export const HomeScreen: React.FC = () => {
  const [active, setActive] = useState<boolean>(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
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
  const minVolumeSize = 1.0;
  const maxVolumeSize = 2.0;

  // Request audio recording permissions
  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        console.error('Audio recording permissions not granted');
      }
    })();
  }, []);

  // Start recording and monitoring volume
  const startRecording = async () => {
    try {
      // Prepare the recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        onRecordingStatusUpdate,
        100 // Update status every 100ms
      );

      console.log(recording.getAvailableInputs());

      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  // Stop recording
  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      setRecording(null);

      // Reset scale to inactive size
      scale.value = withSpring(inactiveSize, SpringConfig);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  // Handle recording status updates (including volume)
  const onRecordingStatusUpdate = (status: Audio.RecordingStatus) => {
    if (!status.isRecording) return;

    // Get the metering level (volume) from the status
    // metering is in dB, typically between -160 and 0
    // where 0 is the loudest
    const metering = status.metering || -160;

    // Convert dB to a scale value
    // Map -160dB (silence) to minVolumeSize and 0dB (loudest) to maxVolumeSize
    const normalizedVolume = Math.max(0, (metering + 160) / 160);
    const newScale = minVolumeSize + normalizedVolume * (maxVolumeSize - minVolumeSize);

    // Apply the new scale with spring animation
    scale.value = withSpring(newScale, SpringConfig);
  };

  const handlePressIn = () => {
    if (active) return;
    // Shrink when pressed
    scale.value = withSpring(pressedSize, SpringConfig);
  };

  const handlePressOut = () => {
    if (active) return;
    // Return to hover state or active state
    scale.value = withSpring(active ? activeSize : hoverSize, SpringConfig);
  };

  const handleHoverIn = () => {
    if (active) return;
    // Grow slightly on hover
    scale.value = withSpring(hoverSize, SpringConfig);
  };

  const handleHoverOut = () => {
    if (active) return;
    // Return to normal or active state
    scale.value = withSpring(active ? activeSize : inactiveSize, SpringConfig);
  };

  const handlePress = () => {
    const newActiveState = !active;
    setActive(newActiveState);

    if (newActiveState) {
      // Start recording when activated
      startRecording();
    } else {
      // Stop recording when deactivated
      stopRecording();
      // Animate to inactive state
      scale.value = withSpring(inactiveSize, SpringConfig);
    }
  };

  // AnimatedPressable combines Animated and Pressable
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  return (
    <View className="flex-1 items-center justify-center bg-gray-300">
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        style={animatedStyles}
        className={`h-24 w-24 items-center justify-center rounded-full ${
          active ? 'bg-blue-500' : 'bg-blue-400'
        }`}
      />
    </View>
  );
};
