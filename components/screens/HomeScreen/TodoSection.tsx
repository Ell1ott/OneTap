import * as React from 'react';
import { View } from 'react-native';
import AppText from '../../base/AppText';
import { TodoList } from '../../Todos/components/TodoList';
import { Task } from 'components/Todos/classes';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { HapticTab } from 'components/HapticTab';

interface TodoSectionProps {
  title: string;
  tasks: Task[];

  onCategoryPress: (category: string) => void;
  addAction?: () => void;
}

export const TodoSection: React.FC<TodoSectionProps> = ({
  title,
  tasks,
  addAction,

  onCategoryPress,
}) => {
  const [lastAddedTodoId, setLastAddedTodoId] = useState<string | undefined>();

  return (
    <View>
      <View className="flex-row items-center justify-between">
        <AppText f className="mb-1 text-lg font-extrabold text-foreground/60">
          {title}
        </AppText>
        {addAction && (
          <HapticTab className="rounded-full text-foreground/60" onPress={addAction}>
            <Plus size={20} className="text-foreground/60" />
          </HapticTab>
        )}
      </View>
      <TodoList tasks={tasks} lastAddedTodoId={lastAddedTodoId} onCategoryPress={onCategoryPress} />
    </View>
  );
};
