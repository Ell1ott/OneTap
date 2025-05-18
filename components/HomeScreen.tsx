import * as React from 'react';
import { useState } from 'react';
import { View, Pressable } from 'react-native';

export const HomeScreen: React.FC = () => {
  const [pressed, setPressed] = useState<boolean>(false);

  const handlePress = () => {
    // You can add more functionality here later
  };

  return (
    <View className="flex-1 bg-gray-300 items-center justify-center">
      <Pressable
        onPress={handlePress}
        className={`w-24 h-24 rounded-full items-center justify-center ${
          pressed ? 'bg-blue-500' : 'bg-blue-400'
        }`}
      />
    </View>
  );
};