import { useState } from 'react';
import { Platform } from 'react-native';
import {
  AudioRecording,
  useAudioRecorder,
  ExpoAudioStreamModule,
  RecordingConfig,
} from '@siteed/expo-audio-studio';
import { base64ToInt16Array, calculateRMSVolume } from './AudioConversionUtils';

export const useAudioRecording = () => {
  const [audioResult, setAudioResult] = useState<AudioRecording | null>(null);
  const [transcriptionData, setTranscriptionData] = useState<any | null>(null);

  const { startRecording, stopRecording, isRecording, durationMs, size, analysisData } =
    useAudioRecorder();

  // Request audio recording permissions
  const requestPermissions = async () => {
    const { status } = await ExpoAudioStreamModule.requestPermissionsAsync();
    if (status !== 'granted') {
      console.error('Audio recording permissions aint granted');
    }
  };

  const interval = 100;

  // Start recording and monitoring volume
  const beginRecording = async (onVolumeChange: (newScale: number) => void) => {
    try {
      console.log('starting recording');
      // Configure recording options
      const config: RecordingConfig = {
        interval: interval,
        enableProcessing: Platform.OS === 'web',
        sampleRate: 16000,
        channels: 1,
        encoding: 'pcm_16bit',

        onAudioStream: async (audioStreamEvent) => {
          if (audioStreamEvent && audioStreamEvent.data) {
            if (typeof audioStreamEvent.data === 'string') {
              const int16Array = base64ToInt16Array(audioStreamEvent.data);

              const newScale = 1.1 + (calculateRMSVolume(int16Array) / 32768) * (1.5 - 1.1) * 5;
              onVolumeChange(newScale);
              setTranscriptionData(int16Array);
            } else if (typeof audioStreamEvent.data === 'object') {
              if (audioStreamEvent.data.length < 15 * interval) return;
              setTranscriptionData(new Int16Array(audioStreamEvent.data));
            }
          }
        },

        onAudioAnalysis: async (analysisEvent) => {
          if (analysisEvent && analysisEvent.dataPoints[0].amplitude !== undefined) {
            const newScale = 1.1 + (analysisEvent.dataPoints[0].amplitude / 32768) * (1.5 - 1.1);
            onVolumeChange(newScale);
          }
        },
      };

      await startRecording(config);
    } catch (err) {
      console.log('Failed to start recording', err);
    }
  };

  // Stop recording
  const endRecording = async () => {
    try {
      const result = await stopRecording();
      setAudioResult(result);
      setTranscriptionData(null);
      return result;
    } catch (err) {
      console.log('Failed to stop recording', err);
      return null;
    }
  };

  return {
    audioResult,
    transcriptionData,
    isRecording,
    durationMs,
    size,
    analysisData,
    requestPermissions,
    beginRecording,
    endRecording,
  };
};
