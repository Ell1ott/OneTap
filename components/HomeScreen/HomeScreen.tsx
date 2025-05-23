import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Pressable } from 'react-native';
import DeepgramTranscriber from '../DeepgramTranscriber';
import { DEEPGRAM_API_KEY } from '../../env';
import { theme } from 'tailwind.config';
import { useAudioRecording } from '../../utils/useAudioRecording';
import { AnimatedRecordButton } from '../AnimatedRecordButton';

export const HomeScreen: React.FC = () => {
  console.log('current theme', theme);
  const [active, setActive] = useState<boolean>(false);
  const [deepgramApiKey] = useState<string>(DEEPGRAM_API_KEY);
  const [volumeScale, setVolumeScale] = useState<number | undefined>(undefined);

  const { transcriptionData, isRecording, requestPermissions, beginRecording, endRecording } =
    useAudioRecording();

  // Request audio recording permissions
  useEffect(() => {
    requestPermissions();
  }, []);

  const handlePressIn = () => {
    // Button handles its own animation
  };

  const handlePressOut = () => {
    const newActiveState = !active;
    setActive(newActiveState);

    if (newActiveState) {
      beginRecording((newScale) => {
        setVolumeScale(newScale);
      });
    } else {
      endRecording();
      setVolumeScale(undefined);
    }
  };

  const handleHoverIn = () => {
    // Button handles its own animation
  };

  const handleHoverOut = () => {
    // Button handles its own animation
  };

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Pressable></Pressable>
      <AnimatedRecordButton
        active={active}
        volumeScale={volumeScale}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => {
          console.log('pressed');
        }}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
      />

      {/* Transcription component */}
      <View className="mt-8 w-3/4">
        <DeepgramTranscriber
          isRecording={isRecording}
          audioData={transcriptionData}
          apiKey={deepgramApiKey}
        />
      </View>
    </View>
  );
};
