import * as React from 'react';
import { View, Pressable, Text, LayoutChangeEvent, findNodeHandle, UIManager } from 'react-native';
import AppText from 'components/base/AppText';
import { TodoSection } from 'components/HomeScreen/TodoSection';
import { Greeting } from 'components/HomeScreen/Greeting';
import { Todo, Event, TaskCategory, Task } from 'components/Todos/classes';
import { Time } from 'components/Todos/types';
import { useEffect, useState, useRef } from 'react';
import { ScrollView } from 'react-native';
import { isToday } from 'utils/dateUtils';
import CategoryScreen from 'components/CategoryScreen';
import { useTasksStore } from 'stores/tasksStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeToggle } from 'components/ThemeToggle';
import { router } from 'expo-router';
export function HomeScreen() {
  const { tasks } = useTasksStore();
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  return (
    <>
      {openCategory && (
        <CategoryScreen category={openCategory} onClose={() => setOpenCategory(null)} />
      )}

      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="px-6 pt-16 pb-6"
        keyboardDismissMode="on-drag">
        <View className="mb-10">
          <Greeting />
          <AppText f className="text-base leading-5 text-foregroundMuted">
            You have 3 assignments due today. And it's probably time for a trip to the grocery
            store, as you have 9 items on your shopping list.
          </AppText>
        </View>
        <Pressable onPress={() => router.push('/modal')}>
          <AppText>Open modal</AppText>
        </Pressable>

        <View className="flex-1 gap-6">
          <TodoSection
            title="Today"
            tasks={tasks.filter((t) => t.isToday())}
            onCategoryPress={(category) => setOpenCategory(category)}
          />
          <TodoSection
            title="Priority"
            tasks={tasks.filter((t) => t.isPriority())}
            onCategoryPress={(category) => setOpenCategory(category)}
          />
          <TodoSection
            title="Other"
            tasks={tasks.filter(
              (t) => !t.isToday() && !t.isPriority() && !(t instanceof Todo && t.category)
            )}
            onCategoryPress={(category) => setOpenCategory(category)}
          />
        </View>
        <ThemeToggle />
      </ScrollView>
    </>
  );
}
