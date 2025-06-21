import AppText, { fontStyle } from 'components/base/AppText';
import {
  View,
  Pressable,
  TextInput,
  TouchableOpacity,
  Modal,
  Clipboard,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { Event, TaskCategory, Todo } from 'components/Todos/classes';
import { TodoList } from 'components/Todos/components/TodoList';
import { ChevronLeft, Plus, Share, Share2, Copy, X } from 'lucide-react-native';
import { addTodo, categories$, tasks$, todos$ } from 'utils/supabase/SupaLegend';
import { observer } from '@legendapp/state/react';
import { Tables } from 'utils/supabase/database.types';
import { observable } from '@legendapp/state';
import { Icon } from 'components/base/LucideIcon';
import * as Sharing from 'expo-sharing';

const CategoryList = observer(({ id, onClose }: { id: string; onClose: () => void }) => {
  const tasks = tasks$.get();
  const category$ = categories$[id];
  const category = category$.get();

  if (!category) {
    return (
      <View className="flex-1 items-center justify-center">
        <AppText>Category not found</AppText>
      </View>
    );
  }

  const [lastAddedTodoId, setLastAddedTodoId] = useState<string>();
  const [shareModalVisible, setShareModalVisible] = useState(false);

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

  // Generate share URL and content
  const shareUrl = `https://onetap.elliottf.dk/category?id=${id}&action=share`;
  const shareText = `Check out my "${categoryName}" category with ${totalTodos} task${totalTodos !== 1 ? 's' : ''}!`;

  const handleCopyLink = async () => {
    try {
      await Clipboard.setString(shareUrl);
      Alert.alert('Copied!', 'Category link copied to clipboard');
      setShareModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy link');
    }
  };

  const handleShare = async () => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(shareUrl, {
          mimeType: 'text/plain',
          dialogTitle: `Share "${categoryName}" Category`,
        });
      } else {
        // Fallback to copy if sharing is not available
        await handleCopyLink();
      }
    } catch (error) {
      console.error('Sharing error:', error);
      Alert.alert('Error', 'Failed to share category');
    }
  };

  return (
    <>
      {/* Share Modal */}
      <Modal
        visible={shareModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShareModalVisible(false)}>
        <View className="flex-1 items-center justify-center bg-black/50 p-4">
          <View className="mx-6 w-full max-w-[20rem] rounded-2xl bg-card p-6">
            {/* Modal Header */}
            <View className="mb-4 flex-row items-center justify-between">
              <AppText className="text-xl font-semibold">Share Category</AppText>
              <TouchableOpacity onPress={() => setShareModalVisible(false)} className="p-1">
                <Icon icon={X} size={20} className="text-foregroundMuted" />
              </TouchableOpacity>
            </View>

            {/* Category Info */}
            <View className="mb-6">
              <AppText className="mb-2 text-lg font-medium">{categoryName}</AppText>
              <AppText className="text-sm text-foregroundMuted">
                {pendingCount > 0
                  ? `${pendingCount} task${pendingCount !== 1 ? 's' : ''} remaining`
                  : totalTodos > 0
                    ? 'All tasks completed!'
                    : 'No tasks yet'}
              </AppText>
            </View>

            {/* Share Link */}
            <View className="mb-6">
              <AppText className="mb-2 text-sm font-medium text-foregroundMuted">
                Share Link
              </AppText>
              <View className="rounded-lg bg-background p-3">
                <AppText className="text-xs text-foregroundMuted" numberOfLines={1}>
                  {shareUrl}
                </AppText>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="gap-3">
              <TouchableOpacity
                onPress={handleShare}
                className="flex-row items-center justify-center rounded-xl bg-blue-500 p-4">
                <Icon icon={Share} size={18} className="mr-2 text-white" />
                <AppText className="font-medium text-white">Share Category</AppText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCopyLink}
                className="flex-row items-center justify-center rounded-xl bg-background p-4">
                <Icon icon={Copy} size={18} className="mr-2 text-foregroundMuted" />
                <AppText className="font-medium text-foregroundMuted">Copy Link</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
          className="mb-4"
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
      <View className="mt-auto flex-row items-center justify-between">
        <TouchableOpacity onPress={() => setShareModalVisible(true)}>
          <Icon icon={Share2} size={20} className="text-foregroundMuted" />
        </TouchableOpacity>
        <Pressable
          onPress={handleAddTask}
          className=" mt-auto flex-row items-center justify-center rounded-xl bg-card p-4">
          <Plus size={20} className="mr-2 text-foregroundMuted" />
          <AppText className="text-foregroundMuted">Add new task</AppText>
        </Pressable>
      </View>
    </>
  );
});

export default CategoryList;
