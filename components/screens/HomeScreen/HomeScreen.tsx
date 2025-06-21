import { View, ScrollView, TouchableOpacity } from 'react-native';
import AppText from 'components/base/AppText';
import { TodoSection } from 'components/screens/HomeScreen/TodoSection';
import { Greeting } from 'components/screens/HomeScreen/Greeting';
import { Todo, Task } from 'components/Todos/classes';
import { useState } from 'react';
import { ThemeToggle } from 'components/ThemeToggle';
import {
  addCategory,
  addTodo,
  events$,
  generateId,
  tasks$,
  todos$,
} from 'utils/supabase/SupaLegend';
import { observer } from '@legendapp/state/react';
import { observable } from '@legendapp/state';
import { router } from 'expo-router';
import { User } from 'lucide-react-native';
import { Icon } from 'components/base/LucideIcon';

const todayTasks$ = observable(() => {
  const tasks = tasks$.get();
  const todos = todos$.get();
  const events = events$.get();
  return tasks
    .filter((t: Task) => t.r.title !== undefined && t.r.title !== null)
    .filter((t: Task) => t.isToday());
});

const priorityTasks$ = observable(() => {
  const tasks = tasks$.get();
  const todos = todos$.get();
  const events = events$.get();
  return tasks
    .filter((t: Task) => t.r.title !== undefined && t.r.title !== null)
    .filter((t: Task) => t.isPriority());
});

const otherTasks$ = observable(() => {
  const tasks = tasks$.get();
  const todos = todos$.get();
  const events = events$.get();
  return tasks
    .filter((t: Task) => t.r.title !== undefined && t.r.title !== null)
    .filter((t: Task) => !t.isToday() && !t.isPriority() && !(t instanceof Todo && t.r.category));
});
// Length-based observables for performance optimization
const todayTasksLength$ = observable(() => todayTasks$.get().length);
const priorityTasksLength$ = observable(() => priorityTasks$.get().length);
const otherTasksLength$ = observable(() => otherTasks$.get().length);

const subGreetingStats$ = observable(() => {
  const todos = todos$.get();
  if (!todos) return { groceryCount: 0, homeworkCount: 0 };
  return {
    groceryCount: Object.values(todos).filter(
      (t) => t.category?.toLowerCase().includes('groceries') && t.completed?.[0] === false
    ).length,
    homeworkCount: Object.values(todos).filter(
      (t) => t.category?.toLowerCase().includes('homework') && t.completed?.[0] === false
    ).length,
  };
});

const handleAddTodo = () => {
  const newId = generateId();
  addTodo({
    id: generateId(),
    title: '',
    completed: [false],
    note: '',
  });
};

export const HomeScreen = observer(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [openCategory, setOpenCategory] = useState<string | null>(null);

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
  const tasks: Task[] = tasks$.peek();

  console.log(todaysTasks.length, priorityTasks.length, otherTasks.length);

  if (!todaysTasks || !priorityTasks || !otherTasks) return <AppText>Loading...</AppText>;

  const { groceryCount, homeworkCount } = subGreetingStats$.get();

  console.log('tasks', todaysTasks);
  return (
    <>
      {/* <Todos todos$={_todos$} /> */}

      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="px-6 pt-16 pb-6"
        keyboardDismissMode="on-drag">
        <View className="mb-10"></View>

        <View className="flex-1 gap-6">
          {todayTasksLength > 0 && (
            <TodoSection
              title="Today"
              tasks={todaysTasks}
              onCategoryPress={(category) => setOpenCategory(category)}
            />
          )}
          {priorityTasksLength > 0 && (
            <TodoSection
              title="Priority"
              tasks={priorityTasks}
              onCategoryPress={(category) => setOpenCategory(category)}
              addAction={() => {
                const newCategoryId = addCategory({ title: '', note: '' });
                router.push({
                  pathname: '/category',
                  params: {
                    id: newCategoryId,
                  },
                });
              }}
            />
          )}
          {otherTasksLength > 0 && (
            <TodoSection
              title="Other"
              tasks={otherTasks}
              onCategoryPress={(category) => setOpenCategory(category)}
              addAction={handleAddTodo}
            />
          )}
        </View>
        <ThemeToggle />
        <TouchableOpacity
          onPress={() => {
            router.push('/auth');
          }}
          className="flex-row items-center justify-center"
          activeOpacity={0.8}>
          <Icon icon={User} size={20} className="text-foreground" />
          <AppText className="ml-2 font-medium text-foreground">Change account</AppText>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
});
