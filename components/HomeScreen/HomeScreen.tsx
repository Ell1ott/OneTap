import * as React from 'react';
import { View, Pressable } from 'react-native';
import { theme } from 'tailwind.config';
import { AudioRecorder } from '../AudioRecorder';

export const HomeScreen: React.FC = () => {
  console.log('current theme', theme);

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Pressable></Pressable>
      <AudioRecorder />
    </View>
  );
};
