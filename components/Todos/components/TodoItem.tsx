import { Text, View, TextInput, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Layout,
  LinearTransition,
} from 'react-native-reanimated';
import AppText, { fontStyle } from '../../base/AppText';
import { useRef, useEffect, useState } from 'react';
import { Task, TaskCategory, Todo, Event } from '../classes';
import { useRouter } from 'expo-router';
import { useTasksStore } from 'stores/tasksStore';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { TodoActions } from './TodoActions';
import { toast } from 'sonner-native';
import { useTheme } from 'components/ThemeProvider';
import { $View, $Text, $TextInput } from '@legendapp/state/react-native';
import { useObservable } from '@legendapp/state/react';
import { observer } from '@legendapp/state/react';

export const TodoItem = observer(
  ({
    item: _item,
    editing = false,
    onnoteChange,
    shouldFocus = false,
    classname,
    onCategoryPress,
  }: {
    item: Todo | Event | TaskCategory;
    editing?: boolean;
    onnoteChange?: (note: string) => void;
    shouldFocus?: boolean;
    classname?: string;
    onCategoryPress: (category: string) => void;
  }) => {
    const row = _item.$().get();
    const item = new row.constructor(row);
    const { theme } = useTheme();
    const router = useRouter();
    const inputRef = useRef<TextInput>(null);
    const textRef = useRef<Text>(null);
    const [textWidth, setTextWidth] = useState(0);
    // Animation for strikethrough effect
    const isCompleted = item instanceof Todo && item.r.completed?.every(Boolean);
    const isEditable = !(item instanceof TaskCategory) && !isCompleted;
    const strikethroughProgress = useSharedValue(isCompleted ? 1 : 0);
    const scaleHeight = useSharedValue(0);

    useEffect(() => {
      if (item instanceof Todo) {
        const allCompleted = item.r.completed?.every(Boolean) || false;
        strikethroughProgress.value = withTiming(allCompleted ? 1 : 0, {
          duration: 300,
        });
      }
    }, [item instanceof Todo ? item.r.completed : null]);

    useEffect(() => {
      if (isCompleted) {
        textRef.current?.measure((x: number, y: number, width: number) => {
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
      item.$().updated_at.set(new Date().toISOString());
      item.$().title.set(text);
    }

    useEffect(() => {
      if (shouldFocus && inputRef.current) {
        inputRef.current.focus();
      }
    }, [shouldFocus]);

    const handlePress = () => {
      if (item instanceof Todo) {
        console.log(item.r.completed);
        if (item.r.completed?.length === 1) {
          item.$().completed.set([!item.r.completed[0]]);
          item.onToggle(item.r.completed);
        }
      } else if (item instanceof TaskCategory) {
        router.push({
          pathname: '/category',
          params: { category: item.r.title },
        });
      } else if (item instanceof Event) {
        router.push({
          pathname: '/event',
          params: { id: item.r.id },
        });
      }
    };

    const [isSwipeableOpen, setIsSwipeableOpen] = useState(false);

    useEffect(() => {
      console.log(isSwipeableOpen);
    }, [isSwipeableOpen]);

    function handleDelete() {
      item.$().delete();
      toast('Deleted: ' + item.r.title, {
        closeButton: true,
        dismissible: true,
        id: item.r.id,
        action: {
          label: 'Undo',
          onClick: () => {
            item.$().deleted.set(false);
            toast.dismiss(item.r.id);
          },
        },
      });
    }

    console.log('rerender');

    const [isInFocus, setIsInFocus] = useState(false);

    console.log('item', item.$().title);

    return (
      // <Animated.View layout={LinearTransition.springify()}>
      <Swipeable
        renderRightActions={() => <TodoActions onDelete={handleDelete} />}
        onSwipeableClose={() => setIsSwipeableOpen(false)}
        onSwipeableOpenStartDrag={() => setIsSwipeableOpen(true)}>
        <Pressable
          onPress={handlePress}
          disabled={isSwipeableOpen}
          className="overflow-hidden rounded-t-lg bg-card px-4"
          android_ripple={!(item instanceof Todo) ? { color: 'rgba(0, 0, 0, 0.1)' } : undefined}>
          <View className={`flex-row justify-between py-2.5 pr-2 ${classname}`}>
            <View className="flex-1">
              <View className="relative flex-1 flex-row items-baseline justify-start gap-1.5">
                {isEditable ? (
                  <>
                    {item.r.emoji && (
                      <AppText className="text-xl font-medium leading-7">{item.r.emoji}</AppText>
                    )}
                    <Animated.View style={animatedTextStyle}>
                      <Pressable onPress={() => {}}>
                        <TextInput
                          className="m-0 mx-0 p-0 text-xl font-medium leading-7 text-foreground outline-none"
                          placeholder="New task..."
                          style={fontStyle}
                          value={item.$().title.get() ?? ''}
                          onChangeText={onTextChange}
                          ref={inputRef}
                          placeholderTextColor={
                            theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
                          }
                          multiline={false}
                        />
                      </Pressable>
                    </Animated.View>
                  </>
                ) : (
                  <Animated.View
                    style={animatedTextStyle}
                    collapsable={false}
                    className="flex-row gap-1">
                    <AppText
                      ref={textRef}
                      className="m-0 mx-0 whitespace-nowrap p-0 text-xl font-medium leading-7 outline-none">
                      {item.r.emoji}
                      {item.r.emoji && ' '}
                      {item.r.title}
                    </AppText>
                  </Animated.View>
                )}
                {item instanceof Todo && (
                  <Animated.View style={strikethroughStyle} className="bg-foregroundMuted" />
                )}
              </View>
              {item.renderSubtext()}
            </View>
            <item.EndContent />
          </View>
        </Pressable>
      </Swipeable>
      // </Animated.View>
    );
  }
);
