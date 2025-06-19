import AppText, { fontStyle } from 'components/base/AppText';
import Drawer from 'components/base/Drawer';
import { View, Pressable, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { Event, TaskCategory, Todo } from 'components/Todos/classes';
import { TodoList } from 'components/Todos/components/TodoList';
import { ChevronLeft, Plus, Users } from 'lucide-react-native';
import { addTodo, categories$, supabase, tasks$ } from 'utils/supabase/SupaLegend';
import { observer } from '@legendapp/state/react';
import { Tables } from 'utils/supabase/database.types';
import { TextInput } from 'react-native';
import { Observable } from '@legendapp/state';

const CategoryDrawer = ({
  id,
  onClose,
  action,
}: {
  id: string;
  onClose: () => void;
  action: 'share' | null;
}) => {
  return (
    <Drawer isOpen={!!id} onClose={onClose} scrollEnabled={true} className="bg-background">
      <CategoryContent id={id} action={action} onClose={onClose} />
    </Drawer>
  );
};

const CategoryContent = observer(
  ({ id, action, onClose }: { id: string; action: 'share' | null; onClose: () => void }) => {
    const category$ = categories$[id];
    const category = category$.get();

    if (action === 'share') {
      useEffect(() => {
        const addPermission = async () => {
          const { data, error } = await supabase.from('permissions').insert({
            category: id,
          });
          if (error) {
            console.error(error);
          }
        };
        addPermission();
      }, []);
      return (
        <View className="h-[30%] items-center justify-center px-8">
          {/* Loading Animation Container */}

          {/* Icon and Spinner */}

          <View className="mb-2">
            <ActivityIndicator size={40} color="#007AFF" />
          </View>

          {/* Main Text */}
          <AppText className="mb-2 text-center text-xl font-semibold text-foreground">
            Joining Category
          </AppText>

          {/* Subtitle */}
          <AppText className="text-center text-base leading-6 text-foregroundMuted">
            Adding you to the shared category...{'\n'}
          </AppText>
        </View>
      );
    }
    if (!category) {
      return (
        <View className="flex-1 items-center justify-center">
          <AppText className="text-center text-foregroundMuted">Category not found</AppText>
        </View>
      );
    }
    return <CategoryList category$={category$} onClose={onClose} />;
  }
);

const CategoryList = observer(
  ({
    category$,
    onClose,
  }: {
    category$: Observable<Tables<'categories'>>;
    onClose: () => void;
  }) => {
    const tasks = tasks$.get();
    const category = category$.get();
    if (!category) {
      return (
        <View className="flex-1 items-center justify-center">
          <AppText className="text-center text-foregroundMuted">Category not found</AppText>
        </View>
      );
    }
    console.log('tasks', tasks);
    const [lastAddedTodoId, setLastAddedTodoId] = useState<string>();

    // Filter tasks by category
    const categoryTasks = tasks.filter((task: Todo | Event | TaskCategory) => {
      if (task instanceof Todo) {
        return (
          task.r.category?.toLowerCase() === category?.title?.toLowerCase() ||
          task.r.category?.toLowerCase() === category?.id
        );
      }
      return false;
    });

    console.log(categoryTasks);

    const categoryName = category.title;

    const handleAddTask = () => {
      const newId = addTodo({
        title: '',
        category: category.id,
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
      <>
        {/* Header */}
        <View className="mb-6">
          <View className="mb-4 flex-row items-center">
            <Pressable onPress={onClose} className="-ml-2 mr-4 p-2">
              <ChevronLeft size={24} className="text-foregroundMuted" />
            </Pressable>
            <TextInput
              placeholder="Category name"
              style={fontStyle}
              className="text-3xl font-bold outline-none placeholder:text-foreground/40"
              value={category.title}
              onChangeText={(text) => {
                category$.updated_at.set(new Date().toISOString());
                category$.title.set(text);
              }}
            />
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
      </>
    );
  }
);

export default CategoryDrawer;
