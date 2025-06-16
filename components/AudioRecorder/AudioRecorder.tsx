import * as React from 'react';
import { useState, useEffect } from 'react';
import { View } from 'react-native';
import DeepgramTranscriber from './DeepgramTranscriber';
import { useAudioRecording } from '../../utils/useAudioRecording';
import { AnimatedRecordButton } from './AnimatedRecordButton';

export const AudioRecorder: React.FC = () => {
  const [active, setActive] = useState<boolean>(false);
  const [volumeScale, setVolumeScale] = useState<number | undefined>(undefined);

  const { transcriptionData, isRecording, requestPermissions, beginRecording, endRecording } =
    useAudioRecording();

  // Request audio recording permissions
  useEffect(() => {
    requestPermissions();
    // We know requestPermission is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

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

  return (
    <View className="items-center">
      <AnimatedRecordButton active={active} volumeScale={volumeScale} onPressOut={handlePressOut} />

      {/* Transcription component */}
      <View className="mt-8 w-3/4">
        <DeepgramTranscriber isRecording={isRecording} audioData={transcriptionData} />
      </View>
    </View>
  );
};
