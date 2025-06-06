import AppText from 'components/base/AppText';
import { View, ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Todo, Event, TaskCategory, Task } from 'components/Todos/classes';
import { TodoList } from 'components/Todos/components/TodoList';
import { HumanDate, Time } from 'components/Todos/types';
import { ChevronLeft, Plus } from 'lucide-react-native';
import { GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
  interpolate,
  useAnimatedReaction,
  withDecay,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { useTasksStore } from 'stores/tasksStore';

import { BackHandler } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const topMargin = screenHeight * 0.1;
export default function CategoryScreen({
  category,
  onClose,
}: {
  category: string;
  onClose: () => void;
}) {
  const { tasks, addTask } = useTasksStore();
  const [lastAddedTodoId, setLastAddedTodoId] = useState<string>();
  const shouldClose = useRef(false);

  // Filter tasks by category
  const categoryTasks = tasks.filter((task) => {
    if (task instanceof Todo) {
      return task.category?.toLowerCase() === category.toLowerCase();
    }
    // For TaskCategory items, you might want to include them based on some logic
    // For now, let's exclude them from category filtering
    return false;
  });

  console.log(categoryTasks);

  const categoryName = category?.charAt(0).toUpperCase() + category?.slice(1) || 'Category';

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      console.log('backHandler');
      onClose();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  // Gesture handler values
  const translateY = useSharedValue(screenHeight);

  useEffect(() => {
    console.log('opening');
    translateY.value = withSpring(topMargin, { damping: 20, velocity: 0 });
  }, [category]);

  // Monitor translateX value and close when threshold is reached
  useAnimatedReaction(
    () => translateY.value,
    (value) => {
      if (!shouldClose.current) return;
      if (value > screenHeight - 20) {
        runOnJS(onClose)();
        shouldClose.current = false;
      }
    }
  );

  const handleAddTask = () => {
    const newId = `new_${Date.now()}`;
    const newTask = new Todo({
      id: newId,
      title: '',
      completed: [false],
      category: category || '',
    });
    addTask(newTask);
    setLastAddedTodoId(newId);
  };
  let startY = 0;

  const gestureHandler = Gesture.Pan()
    .onStart(() => {
      // Gesture started
      startY = translateY.value;
    })
    .onUpdate((event) => {
      // Only allow right swipe (positive translation)
      translateY.value = startY + event.translationY;
    })
    .onEnd((event) => {
      console.log(event.translationY + startY, event.velocityY);
      const shouldGoBack =
        (event.translationY + startY > topMargin + 10 && event.velocityY > 100) ||
        event.velocityY > 2000;

      if (shouldGoBack) {
        // Animate out and navigate back
        shouldClose.current = true;
        translateY.value = withSpring(
          screenHeight,
          {
            stiffness: 200,
            damping: 20,
            velocity: event.velocityY,
          },
          () => {
            runOnJS(onClose)();
          }
        );
      } else {
        // Snap back to original position

        console.log(translateY.value);

        if (translateY.value > topMargin) {
          console.log('snap back');
          translateY.value = withSpring(topMargin, {
            damping: 10,
            velocity: event.velocityY,
          });
        } else {
          console.log('scroll');
          translateY.value = withDecay({
            velocity: event.velocityY,
            deceleration: 0.998,
            clamp: [-100, topMargin],
            rubberBandEffect: true,
            rubberBandFactor: 0.9,
          });
        }
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  // Background overlay style that becomes more transparent as we swipe
  const backgroundStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateY.value, [topMargin, screenHeight], [0.7, 0], 'clamp');
    return {
      opacity: opacity,
    };
  });

  const completedCount = categoryTasks.filter(
    (task) => task instanceof Todo && task.completed?.every(Boolean)
  ).length;

  const totalTodos = categoryTasks.filter((task) => task instanceof Todo).length;
  const pendingCount = totalTodos - completedCount;

  return (
    <View
      pointerEvents="box-none"
      removeClippedSubviews={true}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
      }}>
      {/* Background overlay */}
      <Animated.View
        removeClippedSubviews={true}
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          },
          backgroundStyle,
        ]}
        pointerEvents="none"
      />

      <GestureDetector gesture={gestureHandler}>
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
          <ScrollView
            className="flex-none rounded-t-3xl bg-background"
            style={{
              height: 2000,
            }}
            contentContainerClassName="px-6 pt-16 pb-6 flex-1 h-[100rem]"
            keyboardDismissMode="on-drag">
            {/* Header */}
            <View className="mb-6">
              <View className="mb-4 flex-row items-center">
                <Pressable onPress={onClose} className="-ml-2 mr-4 p-2">
                  <ChevronLeft size={24} className="text-foregroundMuted" />
                </Pressable>
                <AppText className="text-3xl font-bold">{categoryName}</AppText>
              </View>

              <AppText className="text-base leading-5 text-foregroundMuted">
                {pendingCount > 0
                  ? `${pendingCount} task${pendingCount !== 1 ? 's' : ''} remaining${completedCount > 0 ? `, ${completedCount} completed` : ''}`
                  : totalTodos > 0
                    ? 'All tasks completed! 🎉'
                    : 'No tasks yet'}
              </AppText>
            </View>

            {/* Tasks List */}
            {categoryTasks.length > 0 && (
              <TodoList
                tasks={categoryTasks}
                lastAddedTodoId={lastAddedTodoId}
                onCategoryPress={onClose}
              />
            )}

            {/* Empty state when no tasks */}
            {categoryTasks.length === 0 && (
              <View className="flex-1 items-center justify-center">
                <AppText className="mb-4 text-center text-foregroundMuted">
                  No tasks in this category yet.{'\n'}Add your first task below!
                </AppText>
              </View>
            )}

            {/* Add Task Button */}
            <Pressable
              onPress={handleAddTask}
              className="mt-auto flex-row items-center justify-center rounded-xl bg-card p-4">
              <Plus size={20} className="mr-2 text-foregroundMuted" />
              <AppText className="text-foregroundMuted">Add new task</AppText>
            </Pressable>
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
