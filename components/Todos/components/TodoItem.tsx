import { Text, View, TextInput } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import AppText, { fontStyle } from '../../AppText';
import { getRelativeDateString } from '../../../utils/dateUtils';
import { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react-native';
import { ChevronLeft } from 'lucide-react-native';
import CheckBox from 'components/CheckBox';
import { Task, TaskCategory, Todo, Event } from '../classes';

export const TodoItem = ({
  item,
  editing = false,
  onnoteChange,
  shouldFocus = false,
  updateTasks,
  classname,
}: {
  item: Task;
  editing?: boolean;
  onnoteChange?: (note: string) => void;
  shouldFocus?: boolean;
  updateTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  classname?: string;
}) => {
  const inputRef = useRef<TextInput>(null);
  const textRef = useRef<Text>(null);
  const [textWidth, setTextWidth] = useState(0);
  // Animation for strikethrough effect
  const isCompleted = item instanceof Todo && item.completed?.every(Boolean);
  const isEditable = item instanceof Todo && !isCompleted;
  const strikethroughProgress = useSharedValue(isCompleted ? 1 : 0);
  const scaleHeight = useSharedValue(0);

  useEffect(() => {
    if (item instanceof Todo) {
      const allCompleted = item.completed?.every(Boolean) || false;
      strikethroughProgress.value = withTiming(allCompleted ? 1 : 0, {
        duration: 300,
      });
    }
  }, [item instanceof Todo ? item.completed : null]);

  useEffect(() => {
    if (isCompleted) {
      textRef.current?.measure((x, y, width, height, pageX, pageY) => {
        setTextWidth(width);
      });
    }
  }, [isCompleted]);

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(strikethroughProgress.value, [0, 1], [1, 0.6]);
    return {
      opacity,
    };
  });

  const strikethroughStyle = useAnimatedStyle(() => {
    const width = interpolate(strikethroughProgress.value, [0, 1], [0, textWidth]);
    return {
      width: width,
      height: 2,
      position: 'absolute' as const,
      top: '50%',
      left: 0,
      transform: [{ translateY: -1 }],
    };
  });

  function onTextChange(text: string) {
    updateTodo({ title: text });
  }

  function updateTodo(updates: Partial<Todo | Event | TaskCategory>) {
    updateTasks(
      (tasks) => [...tasks.map((t) => (t.id === item.id ? Object.assign(t, updates) : t))] as Task[]
    );
  }

  useEffect(() => {
    if (shouldFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [shouldFocus]);

  return (
    <Animated.View
      className={`flex-row justify-between py-2.5 pr-2 ${classname} `}
      entering={FadeIn}
      exiting={FadeOut}>
      <View className="flex-1">
        <View className="relative items-baseline justify-start">
          {isEditable ? (
            <Animated.View style={animatedTextStyle}>
              <TextInput
                ref={inputRef}
                className="m-0 mx-0 p-0 text-xl font-medium leading-7 outline-none"
                onChangeText={onTextChange}
                value={item.title}
                placeholder="New task..."
                style={fontStyle}
                multiline={false}
              />
            </Animated.View>
          ) : (
            <Animated.View style={animatedTextStyle} collapsable={false}>
              <AppText
                ref={textRef}
                className="m-0 mx-0 p-0 text-xl font-medium leading-7 outline-none">
                {item.title}
              </AppText>
            </Animated.View>
          )}
          {item instanceof Todo && (
            <Animated.View style={strikethroughStyle} className="bg-foregroundMuted" />
          )}
        </View>
        {item.renderSubtext()}
      </View>
      {item.renderEndContent(updateTodo)}
    </Animated.View>
  );
};
