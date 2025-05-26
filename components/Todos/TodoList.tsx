import { View } from 'react-native';
import { TodoItem } from './TodoItem';
import { Todo, Event, TaskCategory } from './types';
import { useEffect, useState } from 'react';

export const TodoList = ({
  tasks,
  updateTasks,
  lastAddedTodoId,
}: {
  tasks: (Todo | Event | TaskCategory)[];
  updateTasks: React.Dispatch<React.SetStateAction<(Todo | Event | TaskCategory)[]>>;
  lastAddedTodoId?: string;
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
    <View className="bg-middleground rounded-xl px-4">
      {tasks
        .sort((a, b) => {
          const av = a.type === 'event' ? a.start.getTime() : Number.MAX_SAFE_INTEGER;
          const bv = b.type === 'event' ? b.start.getTime() : Number.MAX_SAFE_INTEGER;
          return av - bv;
        })
        .map((task, i) => (
          <TodoItem
            key={task.id}
            item={task}
            shouldFocus={task.id === focusedTodoId}
            updateTasks={updateTasks}
            classname={i != 0 ? 'border-t-[1.5px] border-t-foregroundMuted/15' : ''}
          />
        ))}
    </View>
  );
};
