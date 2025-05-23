import * as React from 'react';
import { View, Pressable, Text } from 'react-native';
import { theme } from 'tailwind.config';
import { AudioRecorder } from '../AudioRecorder';
import { Greeting } from './Greeting';
import FontLoader from '../FontLoader';
import AppText from '../AppText';
import { Todos } from './Todos';
import { TodoList } from 'components/Todos/TodoList';
import { TodoSection } from './TodoSection';

export const HomeScreen: React.FC = () => {
  console.log('current theme', theme);

  return (
    <View className="flex-1 bg-background px-6 py-16">
      <View className="mb-10">
        <Greeting />
        <AppText f className="text-base leading-5 text-foregroundMuted">
          You have 3 assignments due today. And it's probably time for a trip to the grocery store,
          as you have 9 items on your shopping list.
        </AppText>
      </View>

      <View className="flex-1 gap-6">
        <TodoSection
          title="Today"
          tasks={[
            {
              id: '1',
              text: 'Walk the dog',
              type: 'todo',
              subtext: 'Twice every day',
              completed: true,
            },
            {
              id: '2',
              text: 'Volleyball practice',
              type: 'event',
              startTime: new Date(new Date().setHours(17, 0, 0, 0)),
              completed: true,
            },
          ]}
        />
        <TodoSection
          title="Priority"
          tasks={[
            {
              id: '2',
              text: 'Groceries',
              type: 'todo',
              subtext: 'Recommended, 9 items',
              completed: false,
            },
            {
              id: '3',
              text: 'Homework',
              type: 'todo',
              subtext: '5 total, 3 urgent',
              completed: false,
            },
          ]}
        />
        <TodoSection
          title="Other"
          tasks={[
            {
              id: '4',
              text: 'Clean Room',
              type: 'todo',
              subtext: 'Done 4 days ago',
              completed: true,
            },
          ]}
        />
      </View>
    </View>
  );
};
