import * as React from 'react';
import { View } from 'react-native';
import AppText from '../AppText';
import { TodoList } from '../Todos/TodoList';
import { Todo, Event } from 'components/Todos/TodoItem';

interface TodoSectionProps {
  title: string;
  tasks: (Todo | Event)[];
}

export const TodoSection: React.FC<TodoSectionProps> = ({ title, tasks }) => {
  return (
    <View>
      <AppText f className="mb-1 text-lg font-extrabold text-foreground/60">
        {title}
      </AppText>
      <TodoList tasks={tasks} />
    </View>
  );
};
