import * as React from 'react';
import { View, Pressable, Text } from 'react-native';
import { theme } from 'tailwind.config';
import { AudioRecorder } from '../AudioRecorder';
import { Greeting } from './Greeting';
import FontLoader from '../FontLoader';
export const HomeScreen: React.FC = () => {
  console.log('current theme', theme);

  return (
    <View className="flex-1 bg-background px-6 py-12">
      <Greeting />
      <Text className="text-lg leading-5 text-foregroundMuted" style={{ fontFamily: 'Inter' }}>
        You have 3 assignments due today. And it's probably time for a trip to the grocery store, as
        you have 9 items on your shopping list.
      </Text>
      {/* <FontLoader /> */}
    </View>
  );
};
