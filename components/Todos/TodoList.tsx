import { View } from 'react-native';
import { Todo, Event, TodoItem } from './TodoItem';

export const TodoList = ({ tasks }: { tasks: (Todo | Event)[] }) => {
  return (
    <View className="-mx-6 border-b border-b-foregroundMuted/20">
      {tasks
        .sort((a, b) => {
          const av = a.type === 'event' ? a.startTime.getTime() : Number.MAX_SAFE_INTEGER;
          const bv = b.type === 'event' ? b.startTime.getTime() : Number.MAX_SAFE_INTEGER;
          return av - bv;
        })
        .map((task) => (
          <TodoItem key={task.id} item={task} />
        ))}
    </View>
  );
};
