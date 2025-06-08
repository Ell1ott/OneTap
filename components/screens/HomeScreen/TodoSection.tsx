import * as React from 'react';
import { View } from 'react-native';
import AppText from '../../base/AppText';
import { TodoList } from '../../Todos/components/TodoList';
import { Todo, Event, TaskCategory, Task } from 'components/Todos/classes';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { HapticTab } from 'components/HapticTab';
import { useTasksStore } from 'stores/tasksStore';
import { addTodo, generateId } from 'utils/supabase/SupaLegend';

interface TodoSectionProps {
  title: string;
  tasks: Task[];
  onCategoryPress: (category: string) => void;
}

export const TodoSection: React.FC<TodoSectionProps> = ({ title, tasks, onCategoryPress }) => {
  const { addTask } = useTasksStore();
  const [lastAddedTodoId, setLastAddedTodoId] = useState<string | undefined>();

  const handleAddTodo = () => {
    const newId = generateId();
    addTodo({
      id: generateId(),
      title: '',
      completed: [false],
      note: '',
    });
    setLastAddedTodoId(newId);
  };

  return (
    <View>
      <View className="flex-row items-center justify-between">
        <AppText f className="mb-1 text-lg font-extrabold text-foreground/60">
          {title}
        </AppText>
        <HapticTab className="rounded-full text-foreground/60" onPress={handleAddTodo}>
          <Plus size={20} />
        </HapticTab>
      </View>
      <TodoList tasks={tasks} lastAddedTodoId={lastAddedTodoId} onCategoryPress={onCategoryPress} />
    </View>
  );
};
