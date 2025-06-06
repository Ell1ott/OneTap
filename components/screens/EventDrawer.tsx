import AppText from 'components/base/AppText';
import Drawer from 'components/base/Drawer';
import { View, ScrollView, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { Todo } from 'components/Todos/classes';
import { TodoList } from 'components/Todos/components/TodoList';
import { ChevronLeft, Plus } from 'lucide-react-native';
import { useTasksStore } from 'stores/tasksStore';

export default function EventDrawer({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');

  return (
    <Drawer isOpen={true} onClose={onClose}>
      <ScrollView
        className="flex-none rounded-t-3xl bg-card"
        style={{
          height: 2000,
        }}
        contentContainerClassName="px-6 pt-16 pb-6 flex-1 h-[100rem]"
        keyboardDismissMode="on-drag">
        {/* Header */}
        <View className="mb-6">
          <View className="mb-4 flex-row items-center">
            <TextInput
              className="text-3xl font-bold outline-none placeholder:text-foreground/40"
              value={title}
              onChangeText={setTitle}
              placeholder="Title"
            />
          </View>
        </View>
      </ScrollView>
    </Drawer>
  );
}
