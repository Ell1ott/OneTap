import * as React from 'react';
import { View } from 'react-native';
import AppText from '../AppText';
import { TodoList } from '../Todos/components/TodoList';
import { Todo, Event, TaskCategory, Task } from 'components/Todos/classes';
import { PartialDate } from 'components/Todos/types';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { HapticTab } from 'components/HapticTab';
interface TodoSectionProps {
  title: string;
  tasks: Task[];
  updateTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export const TodoSection: React.FC<TodoSectionProps> = ({ title, tasks, updateTasks }) => {
  const [lastAddedTodoId, setLastAddedTodoId] = useState<string | undefined>();

  const handleAddTodo = () => {
    const newId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    updateTasks((tasks) => [
      ...tasks,
      new Todo({
        id: newId,
        title: '',
        completed: [false],
        note: '',
        due: new PartialDate(new Date()),
      }),
    ]);
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
      <TodoList tasks={tasks} updateTasks={updateTasks} lastAddedTodoId={lastAddedTodoId} />
    </View>
  );
};
