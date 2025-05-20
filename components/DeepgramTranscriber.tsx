import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';

interface DeepgramTranscriberProps {
  isRecording: boolean;
  audioData?: Uint16Array | null; // Audio data from the recorder
  apiKey: string; // Deepgram API key
}

export const DeepgramTranscriber: React.FC<DeepgramTranscriberProps> = ({ 
  isRecording, 
  audioData,
  apiKey 
}) => {
  const [transcript, setTranscript] = useState<string>('');
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('Idle');

  // Connect to Deepgram when recording starts, disconnect when it stops
  useEffect(() => {
    if (!apiKey) return;

    // Only open connection when recording starts
    if (isRecording && !socket) {
      console.log("Initializing Deepgram connection");
      setConnectionStatus('Connecting to Deepgram...');
      
      const deepgram = createClient(apiKey);
      
      const connection = deepgram.listen.live({
        language: "da",
        model: "nova-2",
        smart_format: true,
        interim_results: true,
        encoding: "linear16", // For PCM 16-bit audio
        sample_rate: 16000,   // Match the recorder's sample rate
        channels: 1,          // Mono audio
        
      });

      connection.on("open", () => {
        console.log("Deepgram connection established");
        setIsConnected(true);
        setConnectionStatus('Connected to Deepgram');
      });

      connection.on(LiveTranscriptionEvents.Transcript, (data) => {
        const transcriptText = data.channel.alternatives[0].transcript;
        if (transcriptText) {
          setTranscript(transcriptText);
        }
      });

      connection.on("error", (error) => {
        console.error("Deepgram error:", error);
        setConnectionStatus('Error: ' + error.message);
      });

      connection.on("close", () => {
        console.log("Deepgram connection closed");
        setIsConnected(false);
        setConnectionStatus('Disconnected');
      });

      setSocket(connection);
    } 
    // Close connection when recording stops
    else if (!isRecording && socket) {
      console.log("Closing Deepgram connection");
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
        console.error("Error sending audio data to Deepgram:", error);
      }
    }
  }, [isRecording, audioData, socket, isConnected]);

  return (
    <View className="mt-4 p-4 bg-gray-100 rounded-lg w-full">
      <View className="flex-row justify-between mb-2">
        <Text className="text-sm text-gray-500">Transcription</Text>
        <Text className={`text-xs ${isConnected ? 'text-green-600' : 'text-gray-500'}`}>
          {connectionStatus}
        </Text>
      </View>
      <Text className="text-lg">{transcript || 'Waiting for speech...'}</Text>
    </View>
  );
};

export default DeepgramTranscriber; 