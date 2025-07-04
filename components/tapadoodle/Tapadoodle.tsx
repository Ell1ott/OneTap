import { View } from 'react-native';
import TapadoodleSvg from '../../assets/tapadoodle.svg';
import { DeepgramTranscriber } from '../AudioRecorder/DeepgramTranscriber';
import { useEffect, useState, useCallback } from 'react';
import { useAudioRecording } from 'utils/useAudioRecording';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Response } from './Response';
import { usePathname } from 'expo-router';
import { AudioDevice } from '@siteed/expo-audio-studio';

export const Tapadoodle = ({
  isOpen,
  currentDevice,
}: {
  isOpen: boolean;
  currentDevice: AudioDevice;
}) => {
  const [volumeScale, setVolumeScale] = useState<number | undefined>(1);
  const [transcript, setTranscript] = useState<string | null>(null);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!isOpen) scale.value = withSpring(0.8, { damping: 100, stiffness: 400 });
    else scale.value = withSpring(1, { damping: 100, stiffness: 400 });
  }, [isOpen, scale]);

  const { transcriptionData, isRecording, requestPermissions, beginRecording, endRecording } =
    useAudioRecording();

  const stopRecording = useCallback(async () => {
    console.log('ending recording');
    endRecording();
    setVolumeScale(1);
  }, [endRecording]);

  useEffect(() => {
    console.log('isRecording', isRecording);
  }, [isRecording]);
  // Request audio recording permissions
  useEffect(() => {
    requestPermissions();
  }, [requestPermissions]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  useEffect(() => {
    if (isOpen && volumeScale !== undefined && transcriptionConnected) {
      scale.value = withSpring(volumeScale, { damping: 100, stiffness: 400 });
    }
  }, [volumeScale, isOpen, scale]);

  useEffect(() => {
    console.log(isOpen);
    if (isOpen) {
      console.log('beginning recording', currentDevice);
      beginRecording(currentDevice, (newScale) => {
        setVolumeScale(newScale);
      });
    } else {
      setTranscript(null);
      stopRecording();
    }
    return () => {
      stopRecording();
      console.log('unmounting tapadoodle, so stopping recording');
    };
  }, [isOpen]);

  const currentRoute = usePathname();

  const [transcriptionConnected, setTranscriptionConnected] = useState<boolean>(false);

  return (
    <>
      <View className="mb-2 flex-row gap-4">
        <Animated.View style={animatedStyles} className="my-2 justify-center self-start">
          <TapadoodleSvg
            width={35}
            height={33}
            opacity={currentRoute === '/' && (transcriptionConnected || !isOpen) ? 1 : 0.8}
          />
        </Animated.View>
        <View className="min-h-10 flex-1 justify-center">
          <DeepgramTranscriber
            textClassName="text-xl leading-6 overflow-visible"
            audioData={transcriptionData}
            isRecording={isRecording}
            finishCallback={(transcript) => {
              console.log('finished transcribing', transcript);
              stopRecording();
              setTranscript(transcript);
            }}
            setIsConnected={(isConnected) => {
              setTranscriptionConnected(isConnected);
            }}
          />
        </View>
      </View>
      {transcript && <Response transcript={transcript} />}
    </>
  );
};
