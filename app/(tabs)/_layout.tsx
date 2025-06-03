import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, useColorScheme, View } from 'react-native';

import { HapticTab } from 'components/HapticTab';
import TabBarBackground from 'components/ui/TabBarBackground';
import { AirVent, Calendar, Feather, Plane } from 'lucide-react-native';
import { generateAPIUrl } from 'utils/apiUrlHandler';
import { experimental_useObject, useChat } from '@ai-sdk/react';
import { fetch } from 'expo/fetch';
import { TapadoodleBox } from 'components/tapadoodle/TapadoodleBox';
import { z } from 'zod';

export default function TabLayout() {
  // Get the foregroundMuted color from the theme
  // const { messages, error, handleInputChange, input, handleSubmit, append } = useChat({
  //   fetch: expoFetch as unknown as typeof globalThis.fetch,
  //   api: generateAPIUrl('/api/chat'),
  //   onError: (error) => console.error(error, 'ERROR'),
  //   onFinish: (message) => console.log(message, 'MESSAGE'),
  // });

  const [aiResponse, setAIResponse] = useState<any | null>(null);
  const [partialJson, setPartialJson] = useState('');

  async function fetchAI() {
    const response = await fetch(
      'https://pobfzmtkkaybunlhhmny.supabase.co/functions/v1/openai-completion',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvYmZ6bXRra2F5YnVubGhobW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NjYyOTEsImV4cCI6MjA2NDU0MjI5MX0.ZZZW31l9BI7TAHIx07JVJyxg81_AYpUQ2JZj_G0wdzk',
        },
        body: JSON.stringify({
          input: 'Return a json object, with a very long msg. Write a little story in it',
        }),
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch AI', response);
      return;
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;
      const text = decoder.decode(value, { stream: true });
      processChunk(text);
    }
  }

  const processChunk = (chunk: string) => {
    console.log('processing chunk', chunk);
    try {
      const accumulated = partialJson + chunk;

      try {
        const parsedData = JSON.parse(accumulated);
        setAIResponse(parsedData);
        setPartialJson('');
      } catch (error) {
        setPartialJson(accumulated);
      }
    } catch (error) {
      console.error('Error processing chunk:', error);
    }
  };

  useEffect(() => {
    console.log(aiResponse);
  }, [aiResponse]);
  // useEffect(() => {
  //   console.log('sending message now!');
  //   append({
  //     role: 'user',
  //     content: 'Write some poetry about a dog',
  //   });
  // }, []);

  // useEffect(() => {
  //   console.log(messages);
  // }, [messages]);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: '#8C8C8C',
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {
              height: 70,
              border: 'none',
              // paddingLeft: 10,
              // paddingRight: 10,
              paddingHorizontal: 30,
            },
          }),
          tabBarIconStyle: {
            height: 60,
          },
        }}
        backBehavior="history">
        <Tabs.Screen
          name="diary"
          options={{
            title: 'Diary',
            tabBarIcon: ({ color }) => <Feather size={30} color={color} />,
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Plane size={30} color={color} />,
            tabBarButton: (props) => (
              <View className="-m-100" style={[StyleSheet.absoluteFillObject]} />
            ),
          }}
        />
        <Tabs.Screen
          name="calender"
          options={{
            title: 'Calender',
            tabBarIcon: ({ color }) => <Calendar size={30} color={color} />,
          }}
        />
      </Tabs>
      <TapadoodleBox />
    </>
  );
}
