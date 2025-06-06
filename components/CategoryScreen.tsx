import AppText from 'components/base/AppText';
import Drawer from 'components/base/Drawer';
import { View, ScrollView, Pressable } from 'react-native';
import { useState } from 'react';
import { Todo } from 'components/Todos/classes';
import { TodoList } from 'components/Todos/components/TodoList';
import { ChevronLeft, Plus } from 'lucide-react-native';
import { useTasksStore } from 'stores/tasksStore';

export default function CategoryScreen({
  category,
  onClose,
}: {
  category: string;
  onClose: () => void;
}) {
  const { tasks, addTask } = useTasksStore();
  const [lastAddedTodoId, setLastAddedTodoId] = useState<string>();

  // Filter tasks by category
  const categoryTasks = tasks.filter((task) => {
    if (task instanceof Todo) {
      return task.category?.toLowerCase() === category.toLowerCase();
    }
    // For TaskCategory items, you might want to include them based on some logic
    // For now, let's exclude them from category filtering
    return false;
  });

  console.log(categoryTasks);

  const categoryName = category?.charAt(0).toUpperCase() + category?.slice(1) || 'Category';

  const handleAddTask = () => {
    const newId = `new_${Date.now()}`;
    const newTask = new Todo({
      id: newId,
      title: '',
      completed: [false],
      category: category || '',
    });
    addTask(newTask);
    setLastAddedTodoId(newId);
  };

  const completedCount = categoryTasks.filter(
    (task) => task instanceof Todo && task.completed?.every(Boolean)
  ).length;

  const totalTodos = categoryTasks.filter((task) => task instanceof Todo).length;
  const pendingCount = totalTodos - completedCount;

  return (
    <Drawer isOpen={!!category} onClose={onClose}>
      <ScrollView
        className="flex-none rounded-t-3xl bg-background"
        style={{
          height: 2000,
        }}
        contentContainerClassName="px-6 pt-16 pb-6 flex-1 h-[100rem]"
        keyboardDismissMode="on-drag">
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
      </ScrollView>
    </Drawer>
  );
}
