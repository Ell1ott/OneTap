import { Image } from 'expo-image';
import { Platform, StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Home } from 'lucide-react-native';

import AppText from 'components/base/AppText';

export default function TabTwoScreen() {
  const handleBackToHome = () => {
    router.push('/(tabs)');
  };

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      {/* Construction Icon */}
      <View className="mb-8">
        <AppText className="text-6xl">🚧</AppText>
      </View>

      {/* Title */}
      <AppText className="mb-4 text-center text-3xl font-bold text-foreground">
        Under Construction
      </AppText>

      {/* Subtitle */}
      <AppText className="text-muted-foreground mb-6 text-center text-lg leading-6">
        I'm working hard to bring you an amazing calendar experience
      </AppText>

      {/* Description */}
      <AppText className="text-muted-foreground max-w-sm text-center text-base leading-5">
        Check back soon for updates!
      </AppText>

      {/* Additional Icon */}
      <View className="mt-8">
        <AppText className="text-2xl">⚡</AppText>
      </View>

      {/* Back to Home Button */}
      <TouchableOpacity
        onPress={handleBackToHome}
        className="mt-8 flex-row items-center justify-center rounded-lg bg-blue-500 px-6 py-3 shadow-sm"
        activeOpacity={0.8}>
        <Home size={20} color="white" className="mr-2" />
        <AppText className="ml-2 font-semibold text-white">Back to Home</AppText>
      </TouchableOpacity>
    </View>
  );
}
