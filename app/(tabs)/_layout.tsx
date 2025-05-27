import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, useColorScheme } from 'react-native';

import { HapticTab } from 'components/HapticTab';
import TabBarBackground from 'components/ui/TabBarBackground';
import { Calendar, Feather, Plane } from 'lucide-react-native';

export default function TabLayout() {
  // Get the foregroundMuted color from the theme

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
      <Tabs.Screen
        name="category/[category]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
