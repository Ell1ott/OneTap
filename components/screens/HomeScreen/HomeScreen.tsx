import { View, Pressable } from 'react-native';
import AppText from 'components/base/AppText';
import { TodoSection } from 'components/screens/HomeScreen/TodoSection';
import { Greeting } from 'components/screens/HomeScreen/Greeting';
import { Todo } from 'components/Todos/classes';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import CategoryDrawer from 'components/screens/CategoryDrawer';
import { useTasksStore } from 'stores/tasksStore';
import { ThemeToggle } from 'components/ThemeToggle';
import { Tables } from 'utils/database.types';
import { todos$ as _todos$, addTodo, events$ as _events$, addEvent } from 'utils/SupaLegend';
import { observer } from '@legendapp/state/react';
import { FlatList } from 'react-native';
import { observable } from '@legendapp/state';

const _tasks$ = observable(() => [
  ...Object.values(_todos$.get()),
  ...Object.values(_events$.get()),
]);

const Todos = observer(({ tasks$ }: { tasks$: typeof _tasks$ }) => {
  // Get the todos from the state and subscribe to updates
  const tasks = tasks$
    .get()
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  const renderItem = ({ item: task }: { item: Tables<'todos'> | Tables<'events'> }) => (
    <View>
      <AppText>{task.title}</AppText>
    </View>
  );
  if (tasks)
    return (
      <>
        <FlatList data={tasks} renderItem={renderItem} />
        <Pressable
          onPress={() => {
            addTodo({
              title: 'todo',
              category: 'test',
              completed: [],
            });
          }}>
          <AppText>add todo</AppText>;
        </Pressable>
        <Pressable
          onPress={() => {
            addEvent({
              title: 'event',
              category: 'test',
              start: [new Date().toISOString()],
            });
          }}>
          <AppText>add event</AppText>;
        </Pressable>
      </>
    );
  return <></>;
});

export function HomeScreen() {
  console.log('tasks', _tasks$.get());
  const { tasks } = useTasksStore();
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openAddEvent, setOpenAddEvent] = useState(false);
  return (
    <>
      {openCategory && (
        <CategoryDrawer category={openCategory} onClose={() => setOpenCategory(null)} />
      )}
      {/* <Todos todos$={_todos$} /> */}
      <Todos tasks$={_tasks$} />
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
