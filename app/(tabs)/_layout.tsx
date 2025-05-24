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
        tabBarActiveTintColor: 'Black',
        tabBarInactiveTintColor: '#8C8C8C',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarShowLabel: false,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {
            height: 95,
            border: 'none',
            // paddingLeft: 10,
            // paddingRight: 10,
            paddingHorizontal: 30,
          },
        }),

        tabBarIconStyle: {
          height: 85,
        },
      }}>
      <Tabs.Screen
        name="diary"
        options={{
          title: 'Diary',
          tabBarIcon: ({ color }) => <Feather size={40} color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Plane size={40} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calender"
        options={{
          title: 'Calender',
          tabBarIcon: ({ color }) => <Calendar size={40} color={color} />,
        }}
      />
    </Tabs>
  );
}
