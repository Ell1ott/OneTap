import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';
import AppText from 'components/base/AppText';
import FadeInText from 'components/base/FadeInText';

interface DeepgramTranscriberProps {
  isRecording: boolean;
  audioData?: Uint16Array | null; // Audio data from the recorder
  textClassName?: string;
  finishCallback?: () => void;
}

const apiKey = process.env.EXPO_PUBLIC_DEEPGRAM_API_KEY;

export const DeepgramTranscriber: React.FC<DeepgramTranscriberProps> = ({
  isRecording,
  audioData,
  textClassName,
  finishCallback,
}) => {
  const [transcript, setTranscript] = useState<string>('');
  const [transcripts, setTranscripts] = useState<string[]>(['']);
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('Idle');

  // Connect to Deepgram when recording starts, disconnect when it stops
  useEffect(() => {
    if (!apiKey) return;

    // Only open connection when recording starts
    if (isRecording && !socket) {
      console.log('Initializing Deepgram connection');
      setConnectionStatus('Connecting to Deepgram...');

      const deepgram = createClient(apiKey);

      const connection = deepgram.listen.live({
        language: 'en',
        model: 'nova-3',
        smart_format: true,
        interim_results: true,
        encoding: 'linear16', // For PCM 16-bit audio
        sample_rate: 16000, // Match the recorder's sample rate
        channels: 1, // Mono audio
        endpointing: 1000,
      });

      // Currently researching which model is best for this use case
      // I found this really interesting video on the topic:
      // https://youtu.be/t38gZi8WNKE

      connection.on('open', () => {
        console.log('Deepgram connection established');
        setIsConnected(true);
        setConnectionStatus('Connected to Deepgram');
      });

      connection.on(LiveTranscriptionEvents.Transcript, (data) => {
        const transcriptText: string = data.channel.alternatives[0].transcript;
        if (transcriptText) {
          setTranscript(transcriptText);
          setTranscripts((prev) => {
            const newTranscripts = [...prev];
            newTranscripts[newTranscripts.length - 1] = transcriptText;
            if (data.speech_final) {
              newTranscripts.push('');
              finishCallback?.();
            }
            return newTranscripts;
          });
          console.log('newTranscription', transcriptText);
        }
      });

      connection.on('error', (error) => {
        console.error('Deepgram error:', error);
        setConnectionStatus('Error: ' + error.message);
      });

      connection.on('close', () => {
        console.log('Deepgram connection closed');
        setIsConnected(false);
        setConnectionStatus('Disconnected');
      });

      setSocket(connection);
    }
    // Close connection when recording stops
    else if (!isRecording && socket) {
      console.log('Closing Deepgram connection');
      setConnectionStatus('Disconnecting...');
      socket.finish();
      setSocket(null);
      setIsConnected(false);
      setConnectionStatus('Idle');
    }

    return () => {
      if (socket) {
        socket.finish();
        setConnectionStatus('Cleanup: Disconnected');
      }
    };
  }, [isRecording, apiKey, socket]);

  // Send audio data to Deepgram when recording
  useEffect(() => {
    if (isRecording && isConnected && socket && audioData) {
      try {
        // Send PCM audio data directly
        socket.send(audioData);
      } catch (error) {
        console.error('Error sending audio data to Deepgram:', error);
      }
    }
  }, [isRecording, audioData, socket, isConnected]);

  const [t, setT] = useState<string>('');

  // Get the complete transcript text
  const getCompleteTranscript = () => {
    return transcripts
      .filter((t) => t.trim() !== '')
      .join(' ')
      .trim();
    // return t;
  };

  // const exampleTexts = "Hey, I really wanna talk more with Tim. I would optimally call him every 5 days".split(' ');
  // const i = useRef<number>(0);
  // useEffect(() => {
  //   setInterval(() => {
  //     setT((t) => {
  //       return t + " " + exampleTexts[i.current];
  //     })
  //     i.current = (i.current + 1) % exampleTexts.length;
  //   }, 100);
  // }, []);

  return (
    <FadeInText
      text={getCompleteTranscript()}
      splitMode="words"
      className={`text-lg ${textClassName}`}
      fallbackContent={<AppText className="text-foreground/40">Could you please...</AppText>}
    />
  );
};

export default DeepgramTranscriber;
