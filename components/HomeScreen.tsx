import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Pressable, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {
  AudioRecording,
  useAudioRecorder,
  ExpoAudioStreamModule,
  RecordingConfig,
} from '@siteed/expo-audio-studio';
import Recorder from './Recorder';

export const HomeScreen: React.FC = () => {
  const [active, setActive] = useState<boolean>(false);
  const [audioResult, setAudioResult] = useState<AudioRecording | null>(null);
  const scale = useSharedValue(1);

  const { startRecording, stopRecording, isRecording, durationMs, size, analysisData } =
    useAudioRecorder();

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
  const minVolumeSize = 1.1;
  const maxVolumeSize = 1.5;

  // Request audio recording permissions
  useEffect(() => {
    (async () => {
      const { status } = await ExpoAudioStreamModule.requestPermissionsAsync();
      if (status !== 'granted') {
        console.error('Audio recording permissions aint granted');
      }
    })();
  }, []);

  // Start recording and monitoring volume
  const beginRecording = async () => {
    try {
      // Configure recording options
      const config: RecordingConfig = {
        interval: 100, // Emit recording data every 100ms
        enableProcessing: true, // Enable audio analysis
        sampleRate: 44100, // Sample rate in Hz
        channels: 1, // Mono recording
        encoding: 'pcm_16bit', // PCM encoding

        // Handle audio analysis data for volume visualization
        onAudioAnalysis: async (analysisEvent) => {
          if (analysisEvent && analysisEvent.dataPoints[0].amplitude !== undefined) {
            console.log('Volume:', analysisEvent.dataPoints[0].amplitude);

            // Map volume to scale value
            // Volume typically ranges from 0 to 1
            const newScale =
              minVolumeSize +
              (analysisEvent.dataPoints[0].amplitude / 32768) * (maxVolumeSize - minVolumeSize);
            // Apply the new scale with spring animation
            scale.value = withSpring(newScale, { damping: 100, stiffness: 1000 });
          }
        },
      };

      await startRecording(config);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  // Stop recording
  const endRecording = async () => {
    try {
      const result = await stopRecording();
      setAudioResult(result);

      // Reset scale to inactive size
      scale.value = withSpring(inactiveSize, SpringConfig);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const handlePressIn = () => {
    console.log('pressed in');
    if (active) return;

    // Shrink when pressed
    scale.value = withSpring(pressedSize, SpringConfig);
  };

  const handlePressOut = () => {
    console.log('pressed out');
    const newActiveState = !active;
    setActive(newActiveState);
    // Return to hover state or active state
    scale.value = withSpring(newActiveState ? activeSize : hoverSize, SpringConfig);

    if (newActiveState) {
      // Start recording when activated
      beginRecording();
    } else {
      // Stop recording when deactivated
      endRecording();
      // Animate to inactive state
      scale.value = withSpring(inactiveSize, SpringConfig);
    }
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

  // AnimatedPressable combines Animated and Pressable
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  return (
    <View className="flex-1 items-center justify-center bg-gray-300">
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => {
          console.log('pressed');
        }}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        style={animatedStyles}
        className={`h-48 w-48 items-center justify-center rounded-full ${
          active ? 'bg-blue-500' : 'bg-blue-400'
        }`}
      />
    </View>
  );
};
