import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, useColorScheme } from 'react-native';

import { HapticTab } from 'components/HapticTab';
import TabBarBackground from 'components/ui/TabBarBackground';
import { Calendar, Feather, Plane } from 'lucide-react-native';
import { generateAPIUrl } from 'utils/apiUrlHandler';
import { useChat } from '@ai-sdk/react';
import { fetch as expoFetch } from 'expo/fetch';
export default function TabLayout() {
  // Get the foregroundMuted color from the theme
  // const { messages, error, handleInputChange, input, handleSubmit, append } = useChat({
  //   fetch: expoFetch as unknown as typeof globalThis.fetch,
  //   api: generateAPIUrl('/api/chat'),
  //   onError: (error) => console.error(error, 'ERROR'),
  //   onFinish: (message) => console.log(message, 'MESSAGE'),
  // });

  // useEffect(() => {
  //   console.log('sending message now!');
  //   append({
  //     role: 'user',
  //     content: 'Write some poetry about a dog',
  //   });
  // }, []);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
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
  );
}
