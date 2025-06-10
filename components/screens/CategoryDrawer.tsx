import AppText from 'components/base/AppText';
import Drawer from 'components/base/Drawer';
import { View, ScrollView, Pressable } from 'react-native';
import { useState } from 'react';
import { Event, TaskCategory, Todo } from 'components/Todos/classes';
import { TodoList } from 'components/Todos/components/TodoList';
import { ChevronLeft, Plus } from 'lucide-react-native';
import { addTodo, tasks$ } from 'utils/supabase/SupaLegend';
import { observer } from '@legendapp/state/react';
import { Observable, observable } from '@legendapp/state';

const CategoryDrawer = observer(
  ({
    categoryTasks$,
    name,
    onClose,
  }: {
    categoryTasks$: Observable<Todo[] | Event[] | TaskCategory[]>;
    name: string;
    onClose: () => void;
  }) => {
    console.log('tasks', categoryTasks$.get());
    const [lastAddedTodoId, setLastAddedTodoId] = useState<string>();

    const categoryTasks = categoryTasks$.get();

    const categoryName = name?.charAt(0).toUpperCase() + name?.slice(1) || 'Category';

    const handleAddTask = () => {
      const newId = addTodo({
        title: '',
        category: name || '',
      });
      setLastAddedTodoId(newId);
    };

    const completedCount = categoryTasks.filter(
      (task: Todo | Event | TaskCategory) =>
        task instanceof Todo && task.r.completed?.every(Boolean)
    ).length;

    const totalTodos = categoryTasks.filter(
      (task: Todo | Event | TaskCategory) => task instanceof Todo
    ).length;
    const pendingCount = totalTodos - completedCount;

    return (
      <Drawer isOpen={!!name} onClose={onClose} className="bg-background">
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
      </Drawer>
    );
  }
);

export default CategoryDrawer;
