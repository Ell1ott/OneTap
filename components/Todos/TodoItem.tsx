import { Text, View, TextInput } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import AppText, { fontStyle } from '../AppText';
import { getRelativeDateString } from '../../utils/dateUtils';
import { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react-native';
import { ChevronLeft } from 'lucide-react-native';
import CheckBox from 'components/CheckBox';
import { Time, Task, TaskCategory, Todo, Event } from './types';

export const TodoItem = ({
  item,
  editing = false,
  onSubtextChange,
  shouldFocus = false,
  updateTasks,
  classname,
}: {
  item: Todo | Event | TaskCategory;
  editing?: boolean;
  onSubtextChange?: (subtext: string) => void;
  shouldFocus?: boolean;
  updateTasks: React.Dispatch<React.SetStateAction<(Todo | Event | TaskCategory)[]>>;
  classname?: string;
}) => {
  if (item.type === 'todo') {
    console.log('item.completed', item.completed);
  }
  const inputRef = useRef<TextInput>(null);
  const textRef = useRef<Text>(null);
  const [textWidth, setTextWidth] = useState(0);
  // Animation for strikethrough effect
  const isCompleted = item.type === 'todo' && item.completed?.every(Boolean);
  const strikethroughProgress = useSharedValue(isCompleted ? 1 : 0);

  useEffect(() => {
    if (item.type === 'todo') {
      const allCompleted = item.completed?.every(Boolean) || false;
      strikethroughProgress.value = withTiming(allCompleted ? 1 : 0, {
        duration: 300,
      });
    }
  }, [item.type === 'todo' ? item.completed : null]);

  useEffect(() => {
    if (isCompleted) {
      // console.log('textRef', textRef.current);
      textRef.current?.measure((x, y, width, height, pageX, pageY) => {
        console.log('width', width);
        setTextWidth(width);
      });
    }
    console.log('textWidth', textWidth);
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
      (tasks) =>
        [...tasks.map((t) => (t.id === item.id ? { ...t, ...updates } : t))] as (
          | Todo
          | Event
          | TaskCategory
        )[]
    );
  }

  useEffect(() => {
    if (shouldFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [shouldFocus]);

  return (
    <View className={`flex-row justify-between py-2.5 ${classname}`}>
      <View className="flex-1">
        <View className="relative items-baseline justify-start">
          {!isCompleted ? (
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
          {item.type === 'todo' && (
            <Animated.View style={strikethroughStyle} className="bg-foregroundMuted" />
          )}
        </View>
        {item.type !== 'event' && (
          <AppText className="-mt-0.5 font-medium italic text-foregroundMuted">
            {item.subtext}
          </AppText>
        )}
        {item.type === 'event' && (
          <View className="mt-1 rounded-sm">
            <View className="flex-row items-center gap-x-1">
              <AppText>at</AppText>

              <View className="m-0 rounded-[4px] bg-accent/70 px-1.5 font-medium text-foreground">
                <AppText>
                  {item.start
                    .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                    .toLowerCase()}
                  {/*
                 {' ' + getRelativeDateString(item.startTime)} */}
                </AppText>
              </View>
            </View>
          </View>
        )}
      </View>
      {item.type === 'todo' && (
        <View className="flex-row items-center">
          {item.completed?.map((completed, index) => (
            <CheckBox
              key={index}
              checked={completed}
              classname={` ${index === 0 ? 'pl-6 -ml-6' : ''} ${
                index === (item.completed?.length || 0) - 1 ? 'pr-6 -mr-6' : ''
              }`}
              onToggle={() => {
                console.log('onToggle', index);
                const newCompleted = [...(item.completed || [])];
                newCompleted[index] = !newCompleted[index];
                updateTodo({ completed: newCompleted });
              }}
            />
          ))}
        </View>
      )}
      {item.type === 'category' && (
        <View className="h-full items-center justify-center self-center">
          <ChevronRight size={25} className=" text-foregroundMuted" />
        </View>
      )}
    </View>
  );
};
