import AppText from 'components/AppText';
import { View, ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Todo, Event, TaskCategory, Task } from 'components/Todos/classes';
import { TodoList } from 'components/Todos/components/TodoList';
import { PartialDate, Time } from 'components/Todos/types';
import { ChevronLeft, Plus } from 'lucide-react-native';
import { GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
  interpolate,
  useAnimatedReaction,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';

import { BackHandler } from 'react-native';

const screenWidth = Dimensions.get('window').width;

// Mock data for different categories
const getMockDataForCategory = (categoryName: string): Task[] => {
  switch (categoryName.toLowerCase()) {
    case 'groceries':
      return [
        new Todo({
          id: 'g1',
          title: 'Buy milk',
          completed: [false],
          category: 'groceries',
        }),
        new Todo({
          id: 'g2',
          title: 'Get bread',
          completed: [true],
          category: 'groceries',
        }),
        new Todo({
          id: 'g3',
          title: 'Fresh vegetables',
          note: 'Carrots, broccoli, spinach',
          completed: [false],
          category: 'groceries',
        }),
        new Todo({
          id: 'g4',
          title: 'Chicken breast',
          completed: [false],
          category: 'groceries',
        }),
        new Todo({
          id: 'g5',
          title: 'Pasta and sauce',
          completed: [false],
          category: 'groceries',
        }),
        new TaskCategory({
          id: 'gc1',
          title: 'Pantry Items',
          note: '4 items',
        }),
        new TaskCategory({
          id: 'gc2',
          title: 'Frozen Foods',
          note: '2 items',
        }),
      ];

    case 'homework':
      return [
        new Todo({
          id: 'h1',
          title: 'Math Assignment Chapter 5',
          due: new PartialDate({
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
            day: new Date().getDate(),
          }),
          completed: [false],
          category: 'homework',
        }),
        new Todo({
          id: 'h2',
          title: 'History Essay',
          note: 'World War II causes and effects',
          due: new PartialDate({
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
            day: new Date().getDate() + 2,
          }),
          completed: [false],
          category: 'homework',
        }),
        new Todo({
          id: 'h3',
          title: 'Chemistry Lab Report',
          completed: [true],
          category: 'homework',
        }),
        new Event({
          id: 'h4',
          title: 'Group Study Session',
          start: new Date(new Date().setHours(19, 0, 0, 0)),
        }),
        new TaskCategory({
          id: 'hc1',
          title: 'Science Projects',
          note: '2 urgent',
        }),
      ];

    case 'work':
      return [
        new Todo({
          id: 'w1',
          title: 'Finish quarterly report',
          due: new PartialDate({
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
            day: new Date().getDate() + 1,
          }),
          completed: [false],
          category: 'work',
        }),
        new Todo({
          id: 'w2',
          title: 'Review team performance',
          completed: [false],
          category: 'work',
        }),
        new Event({
          id: 'w3',
          title: 'Team Meeting',
          start: new Date(new Date().setHours(14, 0, 0, 0)),
        }),
        new Todo({
          id: 'w4',
          title: 'Update project documentation',
          completed: [true],
          category: 'work',
        }),
        new TaskCategory({
          id: 'wc1',
          title: 'Client Projects',
          note: '5 active',
        }),
      ];

    default:
      return [
        new Todo({
          id: 'd1',
          title: `Sample task for ${categoryName}`,
          completed: [false],
          category: categoryName,
        }),
        new Todo({
          id: 'd2',
          title: 'Another sample task',
          note: 'This is a note',
          completed: [false],
          category: categoryName,
        }),
        new TaskCategory({
          id: 'dc1',
          title: 'Subcategory',
          note: '3 items',
        }),
      ];
  }
};

export default function CategoryScreen({
  category,
  onClose,
}: {
  category: string;
  onClose: () => void;
}) {
  const [tasks, setTasks] = useState<Task[]>(getMockDataForCategory(category || ''));
  const [lastAddedTodoId, setLastAddedTodoId] = useState<string>();

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
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = 0;
  }, [category]);

  // Monitor translateX value and close when threshold is reached
  useAnimatedReaction(
    () => translateX.value,
    (value) => {
      if (value > screenWidth - 30) {
        runOnJS(onClose)();
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
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setLastAddedTodoId(newId);
  };

  const gestureHandler = Gesture.Pan()
    .onStart(() => {
      // Gesture started
    })
    .onUpdate((event) => {
      // Only allow right swipe (positive translation)
      if (event.translationX > 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      const shouldGoBack =
        (event.translationX > 10 && event.velocityX > -100) || event.velocityX > 800;

      if (shouldGoBack) {
        // Animate out and navigate back
        translateX.value = withSpring(
          400,
          {
            stiffness: 300,
            damping: 20,
            velocity: event.velocityX,
          },
          () => {
            runOnJS(onClose)();
          }
        );
      } else {
        // Snap back to original position
        translateX.value = withSpring(0, { damping: 20, velocity: event.velocityX });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // Background overlay style that becomes more transparent as we swipe
  const backgroundStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateX.value, [0, 200], [0.4, 0], 'clamp');
    return {
      opacity: opacity,
    };
  });

  const completedCount = tasks.filter(
    (task) => task instanceof Todo && task.completed?.every(Boolean)
  ).length;

  const totalTodos = tasks.filter((task) => task instanceof Todo).length;
  const pendingCount = totalTodos - completedCount;

  return (
    <GestureHandlerRootView
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
            className="flex-1 bg-background"
            contentContainerClassName="px-6 pt-16 pb-6 flex-1"
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
                  : 'All tasks completed! 🎉'}
              </AppText>
            </View>

            {/* Tasks List */}
            {tasks.length > 0 && (
              <TodoList
                tasks={tasks}
                updateTasks={setTasks}
                lastAddedTodoId={lastAddedTodoId}
                onCategoryPress={onClose}
              />
            )}
            {/* Add Task Button */}
            <Pressable
              onPress={handleAddTask}
              className="mt-auto flex-row items-center justify-center rounded-xl bg-middleground p-4">
              <Plus size={20} className="mr-2 text-foregroundMuted" />
              <AppText className="text-foregroundMuted">Add new task</AppText>
            </Pressable>
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
