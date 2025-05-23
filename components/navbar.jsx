import { Pressable, View } from 'react-native';
import AppText from './AppText';
export const Navbar = () => {
  return (
    <View className="flex-row items-center justify-between">
      <Pressable>
        <AppText>Home</AppText>
      </Pressable>
    </View>
  );
};
