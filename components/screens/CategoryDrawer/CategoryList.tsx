import AppText, { fontStyle } from 'components/base/AppText';
import { View, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { Event, TaskCategory, Todo } from 'components/Todos/classes';
import { TodoList } from 'components/Todos/components/TodoList';
import { ChevronLeft, Plus } from 'lucide-react-native';
import { addTodo, categories$, tasks$, todos$ } from 'utils/supabase/SupaLegend';
import { observer } from '@legendapp/state/react';
import { Tables } from 'utils/supabase/database.types';
import { observable } from '@legendapp/state';

const CategoryList = observer(({ id, onClose }: { id: string; onClose: () => void }) => {
  const tasks = tasks$.get();
  const category$ = categories$[id];
  const category = category$.get();

  console.log('tasks', tasks);
  const [lastAddedTodoId, setLastAddedTodoId] = useState<string>();

  // Filter tasks by category
  const categoryTasks = tasks.filter((task: Todo | Event | TaskCategory) => {
    if (task instanceof Todo) {
      return (
        task.r.category?.toLowerCase() === category?.title?.toLowerCase() ||
        task.r.category?.toLowerCase() === category?.id?.toLowerCase()
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
      completed: [false],
    });
    setLastAddedTodoId(newId);
  };

  const completedCount$ = observable(() => {
    const todos = todos$.get();
    if (!todos$.get()) return 0;
    return Object.values(todos$.get())
      .filter(
        (todo: Tables<'todos'>) =>
          todo.category?.toLowerCase() === category?.title?.toLowerCase() ||
          todo.category?.toLowerCase() === category?.id?.toLowerCase()
      )
      .filter((todo: Tables<'todos'>) => todo.completed?.every(Boolean)).length;
  });

  const totalTodos = categoryTasks.filter(
    (task: Todo | Event | TaskCategory) => task instanceof Todo
  ).length;
  const completedCount = completedCount$.get();
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
        className=" mt-auto flex-row items-center justify-center rounded-xl bg-card p-4">
        <Plus size={20} className="mr-2 text-foregroundMuted" />
        <AppText className="text-foregroundMuted">Add new task</AppText>
      </Pressable>
    </>
  );
});

export default CategoryList;
