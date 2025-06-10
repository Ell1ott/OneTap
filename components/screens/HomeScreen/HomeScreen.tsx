import { View, Pressable } from 'react-native';
import AppText from 'components/base/AppText';
import { TodoSection } from 'components/screens/HomeScreen/TodoSection';
import { Greeting } from 'components/screens/HomeScreen/Greeting';
import { Event, TaskCategory, Todo, Task } from 'components/Todos/classes';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import CategoryDrawer from 'components/screens/CategoryDrawer';
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
  generateId,
  taskTest$,
  taskTest2$,
} from 'utils/supabase/SupaLegend';
import { observer } from '@legendapp/state/react';
import { FlatList } from 'react-native';
import { observable } from '@legendapp/state';
import { HumanDateType } from 'components/Todos/types/HumanDate';

const todayTasks$ = observable(() => {
  const tasks = tasks$.get();
  return tasks.objs
    .filter((t: Task) => t.r.title !== undefined && t.r.title !== null)
    .filter((t: Task) => t.isToday());
});

const priorityTasks$ = observable(() => {
  const tasks = tasks$.get();
  return tasks.objs
    .filter((t: Task) => t.r.title !== undefined && t.r.title !== null)
    .filter((t: Task) => t.isPriority());
});

const otherTasks$ = observable(() => {
  const tasks = tasks$.get();
  return tasks.objs
    .filter((t: Task) => t.r.title !== undefined && t.r.title !== null)
    .filter((t: Task) => !t.isToday() && !t.isPriority() && !(t instanceof Todo && t.r.category));
});
// Length-based observables for performance optimization
const todayTasksLength$ = observable(() => todayTasks$.get().length);
const priorityTasksLength$ = observable(() => priorityTasks$.get().length);
const otherTasksLength$ = observable(() => otherTasks$.get().length);

export const HomeScreen = observer(() => {
  console.log('tasks', tasks$.get());
  console.log('taskTest', taskTest$.get());
  console.log('taskTest2', taskTest2$.get());
  console.log('events', events$.get());
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openAddEvent, setOpenAddEvent] = useState(false);

  // Use length observables to trigger rerenders only when lengths change
  const todayTasksLength = todayTasksLength$.get();
  console.log('todayTasksLength', todayTasksLength);
  const priorityTasksLength = priorityTasksLength$.get();
  console.log('priorityTasksLength', priorityTasksLength);
  const otherTasksLength = otherTasksLength$.get();
  console.log('otherTasksLength', otherTasksLength);

  // Get actual tasks when needed (without subscribing to changes)
  const todaysTasks = todayTasks$.peek();
  const priorityTasks = priorityTasks$.peek();
  const otherTasks = otherTasks$.peek();

  if (!todaysTasks || !priorityTasks || !otherTasks) return <AppText>Loading...</AppText>;

  return (
    <>
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
            tasks={todaysTasks}
            onCategoryPress={(category) => setOpenCategory(category)}
          />
          <TodoSection
            title="Priority"
            tasks={priorityTasks}
            onCategoryPress={(category) => setOpenCategory(category)}
          />
          <TodoSection
            title="Other"
            tasks={otherTasks}
            onCategoryPress={(category) => setOpenCategory(category)}
          />
        </View>
        <ThemeToggle />
      </ScrollView>
    </>
  );
});
