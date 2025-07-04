import { useState, useEffect, useCallback } from 'react';
import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';
import { fontStyle } from 'components/base/AppText';
import { FadeInText } from 'components/base/FadeInText';
import { useApiKeyStore } from 'stores/apiKeyStore';
import * as Haptics from 'expo-haptics';
import { TextInput } from 'react-native';

interface DeepgramTranscriberProps {
  isRecording: boolean;
  audioData?: Uint16Array | null; // Audio data from the recorder
  textClassName?: string;
  finishCallback?: (transcript: string) => void;
  setIsConnected?: (isConnected: boolean) => void;
}

export default function DeepgramTranscriber({
  isRecording,
  audioData,
  textClassName,
  finishCallback,
  setIsConnected: setIsConnectedProp,
}: DeepgramTranscriberProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { apiKey, isLoading, error, clearError } = useApiKeyStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [transcript, setTranscript] = useState<string>('');
  const [transcripts, setTranscripts] = useState<string[]>(['']);
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    setIsConnectedProp?.(isConnected);
  }, [isConnected]);

  const [connectionStatus, setConnectionStatus] = useState<string>('Idle');

  const [isFinished, setIsFinished] = useState<boolean>(false);

  const [textInput, setTextInput] = useState<string>('');

  // Connect to Deepgram when recording starts, disconnect when it stops
  useEffect(() => {
    if (!apiKey) return;

    // Only open connection when recording starts
    if (isRecording && !socket && textInput === '') {
      console.log('Initializing Deepgram connection');
      setConnectionStatus('Connecting to Deepgram...');

      const deepgram = createClient(apiKey);

      const connection = deepgram.listen.live({
        language: 'multi',
        model: 'nova-3',
        smart_format: true,
        interim_results: true,
        encoding: 'linear16', // For PCM 16-bit audio
        sample_rate: 16000, // Match the recorder's sample rate
        channels: 1, // Mono audio
        endpointing: 800,
        utterance_end_ms: 1000,
      });

      // Currently researching which model is best for this use case
      // I found this really interesting video on the topic:
      // https://youtu.be/t38gZi8WNKE

      connection.on('open', () => {
        console.log('Deepgram connection established, vibrating');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        setIsConnected(true);
        setConnectionStatus('Connected to Deepgram');
      });

      connection.on(LiveTranscriptionEvents.Transcript, (data) => {
        const transcriptText: string = data.channel.alternatives[0].transcript;
        console.log('transcriptText', data);
        if (transcriptText) {
          setTranscript(transcriptText);
          setTranscripts((prev) => {
            const newTranscripts = [...prev];
            newTranscripts[newTranscripts.length - 1] = transcriptText;
            if (data.is_final) {
              newTranscripts.push('');
            }
            if (data.speech_final) {
              console.log('speech_final', data);
              setIsFinished(true);
            }
            return newTranscripts;
          });
          console.log('newTranscription', transcriptText);
        }
      });

      connection.on(LiveTranscriptionEvents.UtteranceEnd, (data) => {
        console.log('utteranceEnd', data);
        setIsFinished(true);
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
  }, [isRecording, apiKey, socket, textInput]);

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

  // Get the complete transcript text
  const getCompleteTranscript = useCallback(() => {
    return transcripts
      .filter((t) => t.trim() !== '')
      .join(' ')
      .trim();
  }, [transcripts]);

  useEffect(() => {
    if (isFinished) {
      finishCallback?.(getCompleteTranscript());
      setIsFinished(false);
    }
  }, [finishCallback, getCompleteTranscript, isFinished]);

  useEffect(() => {
    if (textInput && textInput !== '') {
      socket?.finish();
      setSocket(null);
      setIsConnected(false);
      setConnectionStatus('Idle');
    }
  }, [socket, textInput]);

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
      fallbackContent={
        <TextInput
          style={fontStyle}
          value={textInput}
          onChangeText={setTextInput}
          placeholder={isConnected ? "Go ahead, I'm listening..." : 'Loading speech recognition...'}
          className={`text-lg outline-none placeholder:text-foreground/40 ${textClassName}`}
          onSubmitEditing={() => {
            finishCallback?.(textInput);
          }}></TextInput>
      }
    />
  );
}

export { DeepgramTranscriber };
