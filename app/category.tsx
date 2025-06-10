import { observable } from '@legendapp/state';
import CategoryDrawer from 'components/screens/CategoryDrawer';
import { Event, TaskCategory, Todo } from 'components/Todos/classes';

import { router, useLocalSearchParams } from 'expo-router';
import { tasks$ } from 'utils/supabase/SupaLegend';

export default function Category() {
  const { category } = useLocalSearchParams();

  const categoryTasks$ = observable(() => {
    const tasks = tasks$.get().objs;
    return tasks.filter((task: Todo | Event | TaskCategory) => {
      if (task instanceof Todo) {
        return task.r.category?.toLowerCase() === (category as string).toLowerCase();
      }
    });
  });
  return (
    <CategoryDrawer
      categoryTasks$={categoryTasks$}
      name={category as string}
      onClose={() => {
        router.back();
      }}
    />
  );
}
