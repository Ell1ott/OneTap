import { View } from 'react-native';
import { TodoItem } from './TodoItem';
import { Task, Event } from '../classes';
import { useEffect, useState } from 'react';

export const TodoList = ({
  tasks,
  lastAddedTodoId,
  onCategoryPress,
}: {
  tasks: Task[];
  lastAddedTodoId?: string;
  onCategoryPress: (category: string) => void;
}) => {
  const [focusedTodoId, setFocusedTodoId] = useState<string | null>(null);

  useEffect(() => {
    if (lastAddedTodoId) {
      setFocusedTodoId(lastAddedTodoId);
      // Clear the focus after a short delay to prevent re-focusing on re-renders
      const timer = setTimeout(() => setFocusedTodoId(null), 100);
      return () => clearTimeout(timer);
    }
  }, [lastAddedTodoId]);

  return (
    <View className="overflow-hidden rounded-xl bg-middleground">
      {tasks
        .sort((a, b) => {
          const av = a instanceof Event ? a.start.getTime() : Number.MAX_SAFE_INTEGER;
          const bv = b instanceof Event ? b.start.getTime() : Number.MAX_SAFE_INTEGER;
          return av - bv;
        })
        .map((task, i) => (
          <TodoItem
            key={task.id}
            item={task}
            shouldFocus={task.id === focusedTodoId}
            classname={i != 0 ? 'border-t-[1.5px] border-t-foregroundMuted/15' : ''}
            onCategoryPress={onCategoryPress}
          />
        ))}
    </View>
  );
};
