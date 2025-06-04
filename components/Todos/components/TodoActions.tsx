import { View } from 'react-native';
import { Trash } from 'lucide-react-native';

export const TodoActions = () => {
  return (
    <View className="h-full items-center justify-center px-4">
      <Trash size={22} color="rgba(0, 0, 0, 0.5)" />
    </View>
  );
};
