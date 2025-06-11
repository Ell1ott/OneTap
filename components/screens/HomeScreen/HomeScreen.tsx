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
import { observable, observe } from '@legendapp/state';
import { HumanDateType } from 'components/Todos/types/HumanDate';
import { use$ } from '@legendapp/state/react';

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

const todosWrapper$ = observable(() => {
  return Object.values(todos$);
});

const items$ = observable({
  id1: { id: 'id1', status: 'ready', name: 'item1' },
  id2: { id: 'id2', status: 'disabled', name: 'item' },
});

const itemsAsList$ = observable(() => {
  const items = items$.get();
  return Object.values(items);
});

const hackyItemAsList$ = observable({});
observe(() => {
  hackyItemAsList$.set(Object.values(items$.get()));
  console.log('observe set hacky:' + Object.values(items$.get()).map((i) => i.name));
});

observe(() => {
  console.log('observe:' + itemsAsList$.get().map((i) => i.name));
});
observe(() => {
  console.log('observe hacky:' + hackyItemAsList$.get().map((i) => i.name));
});

export const HomeScreen = observer(() => {
  const tasks = tasks$.get();
  if (!tasks) return <AppText>Loading...</AppText>;

  // observe(() => {
  //   if (state$.itemsReady.get) {
  //     console.log('observe:' + state$.itemsReady.get());
  //   }
  // });
  // const events = todosWrapper$.get();
  console.log('tasks', tasks);
  // console.log('tasksevents', events);
  console.log('taskTest', taskTest$.get());
  console.log('taskTest2', taskTest2$.get());
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openAddEvent, setOpenAddEvent] = useState(false);

  useEffect(() => {
    // Works
    todos$.onChange((todos) => {
      console.log('tasksOnTodos', todos.value);
    });

    // Does not work
    todosWrapper$.onChange((todos) => {
      console.log('tasksOnTodos Wrapper', todos.value);
    });
  }, []);

  items$.id2.name.set('item2');
  items$.id2.name.set('item22');
  items$.id3.set({ id: 'id3', status: 'ready', name: 'item3' });
  // state$.itemsReady[0].status.set('disabled');

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
