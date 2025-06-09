import { View, Pressable } from 'react-native';
import AppText from 'components/base/AppText';
import { TodoSection } from 'components/screens/HomeScreen/TodoSection';
import { Greeting } from 'components/screens/HomeScreen/Greeting';
import { Event, TaskCategory, Todo } from 'components/Todos/classes';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import CategoryDrawer from 'components/screens/CategoryDrawer';
import { useTasksStore } from 'stores/tasksStore';
import { ThemeToggle } from 'components/ThemeToggle';
import { Tables } from 'utils/supabase/database.types';
import {
  todos$ as _todos$,
  addTodo,
  events$ as _events$,
  addEvent,
  events$,
  todos$,
  categories$,
  tasks$,
  addCategory,
} from 'utils/supabase/SupaLegend';
import { observer } from '@legendapp/state/react';
import { FlatList } from 'react-native';
import { observable } from '@legendapp/state';

export const HomeScreen = observer(() => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openAddEvent, setOpenAddEvent] = useState(false);
  const tasks: (Todo | Event | TaskCategory)[] = tasks$.get();

  if (!tasks) return <AppText>Loading...</AppText>;

  if (!tasks.some((t) => t instanceof TaskCategory && t.r.title === 'Groceries')) {
    addCategory({
      title: 'Groceries',
    });
  }

  console.log('tasks', tasks);
  return (
    <>
      {openCategory && (
        <CategoryDrawer category={openCategory} onClose={() => setOpenCategory(null)} />
      )}
      {/* <Todos todos$={_todos$} /> */}

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
              (t) => !t.isToday() && !t.isPriority() && !(t instanceof Todo && t.r.category)
            )}
            onCategoryPress={(category) => setOpenCategory(category)}
          />
        </View>
        <ThemeToggle />
      </ScrollView>
    </>
  );
});
