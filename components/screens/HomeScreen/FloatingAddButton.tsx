import AppText from 'components/base/AppText';
import { Icon } from 'components/base/LucideIcon';
import { Boxes, Calendar, CircleCheck, LucideIcon, Plus } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useState } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { addCategory } from 'utils/supabase/SupaLegend';
import { router } from 'expo-router';

export const FloatingAddButton = () => {
  const [areOptionsOpen, setAreOptionsOpen] = useState(false);

  // Shared values for animation
  const START_SIZE = 50;
  const height = useSharedValue(START_SIZE); // Initial size (p-4 + icon size)
  const width = useSharedValue(START_SIZE); // Initial size (p-4 + icon size)

  // Update animation when options open/close
  const toggleOptions = () => {
    setAreOptionsOpen(!areOptionsOpen);
    height.value = withSpring(!areOptionsOpen ? 140 : START_SIZE, {
      damping: 30,
      stiffness: 250,
    });
    width.value = withSpring(!areOptionsOpen ? 160 : START_SIZE, {
      damping: 30,
      stiffness: 250,
    });
  };

  // Animated styles
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      height: height.value,
      elevation: 10,
      boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
    };
  });

  return (
    <>
      {/* Backdrop to close options when pressing anywhere */}
      {areOptionsOpen && (
        <Pressable
          onPress={toggleOptions}
          className="absolute inset-0 z-10"
          style={{ backgroundColor: 'transparent' }}
        />
      )}

      <Animated.View
        style={[animatedButtonStyle]}
        className="absolute bottom-5 right-5 z-10 items-end justify-end overflow-hidden rounded-[2rem] bg-card">
        {areOptionsOpen ? (
          <AddItemSelection />
        ) : (
          <Pressable
            style={{
              height: START_SIZE,
              width: START_SIZE,
            }}
            onPress={toggleOptions}
            className="h-full w-full items-center justify-center">
            <Icon icon={Plus} size={24} className="text-foreground" />
          </Pressable>
        )}
      </Animated.View>
    </>
  );
};

const AddItemSelection = () => {
  return (
    <View className="gap-2  p-4">
      <AddItemOption text="Todo" icon={CircleCheck} onPress={() => {}}></AddItemOption>
      <AddItemOption text="Event" icon={Calendar} onPress={() => {}}></AddItemOption>
      <AddItemOption
        text="Category"
        icon={Boxes}
        onPress={() => {
          const catId = addCategory({
            title: '',
          });
          console.log(catId);
          router.push(`/category?id=${catId}`);
        }}></AddItemOption>
    </View>
  );
};

const AddItemOption = ({
  text,
  icon,
  onPress,
}: {
  text: string;
  icon: LucideIcon;
  onPress: () => void;
}) => {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-end gap-2 rounded-full px-2">
      <AppText className="text-end text-2xl text-foreground">{text}</AppText>
      <Icon icon={icon} size={10} className="h-5 text-foreground" />
    </Pressable>
  );
};
