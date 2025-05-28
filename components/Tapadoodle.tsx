import { View } from 'react-native';
import TapadoodleSvg from '../assets/tapadoodle.svg';
import { DeepgramTranscriber } from './AudioRecorder/DeepgramTranscriber';
import { useEffect, useState } from 'react';
import { useAudioRecording } from 'utils/useAudioRecording';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import AppText from './base/AppText';

export const Tapadoodle = ({ isOpen }: { isOpen: boolean }) => {
  const [active, setActive] = useState<boolean>(false);
  const [volumeScale, setVolumeScale] = useState<number | undefined>(1);

  const { transcriptionData, isRecording, requestPermissions, beginRecording, endRecording } =
    useAudioRecording();

  // Request audio recording permissions
  useEffect(() => {
    requestPermissions();
  }, []);

  const scale = useSharedValue(1);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  useEffect(() => {
    if (isOpen && volumeScale !== undefined) {
      scale.value = withSpring(volumeScale, { damping: 100, stiffness: 400 });
    }
  }, [volumeScale, isOpen]);

  useEffect(() => {
    console.log(isOpen);
    if (isOpen) {
      beginRecording((newScale) => {
        setVolumeScale(newScale);
      });
    } else if (isRecording) {
      console.log('ending recording');
      endRecording();
      setVolumeScale(1);
    }
  }, [isOpen]);

  return (
    // <View className="h-full flex-row gap-6">
    //   <View className="h-full justify-center">
    //     <Animated.View style={animatedStyles}>
    //       <TapadoodleSvg width={35} height={33} />
    //     </Animated.View>
    //   </View>
    //   {/* <AppText className="text-xl font-medium text-foregroundMuted/50">
    //   Could you please...
    // </AppText> */}

    // </View>
    // <View className="h-full flex-1 items-center justify-center">
    //   <DeepgramTranscriber
    //     textClassName="text-xl font-medium leading-6 overflow-visible"
    //     audioData={transcriptionData}
    //     isRecording={isOpen}
    //   />
    // </View>
    <AppText className="text-xl">
      Tapadoodle Tapadoodle Tapadoodle Tapadoodle Tapadoodle Tapadoodle Tapadoodle Tapadoodle
      Tapadoodle Tapadoodle Tapadoodle Tapadoodle Tapadoodle Tapadoodle Tapadoodle Tapadoodle
      Tapadoodle Tapadoodle Tapadoodle Tapadoodle Tapadoodle Tapadoodle Tapadoodle Tapadoodle
      Tapadoodle Tapadoodle Tapadoodle Tapadoodle Tapadoodle Tapadoodle Tapadoodle Tapadoodle
      Tapadoodle Tapadoodle Tapadoodle Tapadoodle Tapadoodle Tapadoodle Tapadoodle Tapadoodle
      Tapadoodle Tapadoodle Tapadoodle Tapadoodle Tapadoodle Tapadoodle Tapadoodle Tapadoodle
      Tapadoodle
    </AppText>
  );
};
