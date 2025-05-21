import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
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
  const [transcripts, setTranscripts] = useState<string[]>(['']);
  const [transcriptionIndexes, setTranscriptionIndexes] = useState<number[][]>([[]]);
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('Idle');
  
  // Store animation values in a ref to persist across renders
  const animationsRef = useRef<Map<string, Animated.Value>>(new Map());

  // Connect to Deepgram when recording starts, disconnect when it stops
  useEffect(() => {
    if (!apiKey) return;

    // Only open connection when recording starts
    if (isRecording && !socket) {
      console.log("Initializing Deepgram connection");
      setConnectionStatus('Connecting to Deepgram...');
      
      const deepgram = createClient(apiKey);
      
      const connection = deepgram.listen.live({
        language: "en",
        model: "nova-3",
        smart_format: true,
        interim_results: true,
        encoding: "linear16", // For PCM 16-bit audio
        sample_rate: 16000,   // Match the recorder's sample rate
        channels: 1,          // Mono audio
        
      });

      // Currently researching which model is best for this use case
      // I found this really interesting video on the topic:
      // https://youtu.be/t38gZi8WNKE

      connection.on("open", () => {
        console.log("Deepgram connection established");
        setIsConnected(true);
        setConnectionStatus('Connected to Deepgram');
      });

      connection.on(LiveTranscriptionEvents.Transcript, (data) => {
        const transcriptText: string = data.channel.alternatives[0].transcript;
        if (transcriptText) {
          setTranscript(transcriptText);
          setTranscripts(prev => {
            const newTranscripts = [...prev];
            
            newTranscripts[newTranscripts.length - 1] = transcriptText;
            if(data.is_final) {
              newTranscripts.push("");
            }
            
            return newTranscripts;
          });
          console.log("newTranscription", transcriptText);
          setTranscriptionIndexes(prevIndexes => {
            const newIndexes = [...prevIndexes];
            newIndexes[newIndexes.length - 1].push(transcriptText.length);
            if(data.is_final) {
              newIndexes.push([]);
            }
            return newIndexes;
          });
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

  // Helper function to get or create an animation value for a specific text segment
  const getAnimationValue = (segmentKey: string): Animated.Value => {
    if (!animationsRef.current.has(segmentKey)) {
      const anim = new Animated.Value(0);
      animationsRef.current.set(segmentKey, anim);
      
      // Start fade-in animation
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
    
    return animationsRef.current.get(segmentKey)!;
  };

  return (
    <View className="mt-4 p-4 bg-gray-100 rounded-lg w-full">
      <View className="flex-row justify-between mb-2">
        <Text className="text-sm text-gray-500">Transcription</Text>
        <Text className={`text-xs ${isConnected ? 'text-green-600' : 'text-gray-500'}`}>
          {connectionStatus}
        </Text>
      </View>
      <Text className="text-lg">
        {transcriptionIndexes.map((indexes, a) => {
          return (
            <Text key={a}>
              {indexes.map((index, b) => {
                // Create unique key for this text segment
                const segmentKey = `text-${a}-${b}`;
                const opacity = getAnimationValue(segmentKey);
                
                return (
                  <Animated.Text 
                    key={segmentKey}
                    style={{ opacity }}
                  >
                    {transcripts[a].slice(indexes[b - 1] || 0, index)}
                  </Animated.Text>
                );
              })}
              {' '}
            </Text>
          );
        })}
      </Text>
    </View>
  );
};

export default DeepgramTranscriber; 