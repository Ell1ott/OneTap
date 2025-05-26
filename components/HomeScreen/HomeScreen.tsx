import * as React from 'react';
import { View, Pressable, Text } from 'react-native';
import { theme } from 'tailwind.config';
import AppText from 'components/AppText';
import { TodoSection } from 'components/HomeScreen/TodoSection';
import { Greeting } from 'components/HomeScreen/Greeting';
import { Todo, Event } from 'components/Todos/TodoItem';
import { useState } from 'react';
import { ScrollView } from 'react-native';

export function HomeScreen() {
  console.log('current theme', theme);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [tasksToday, setTasksToday] = useState<(Todo | Event)[]>([
    {
      id: '1',
      title: 'Walk the dog',
      type: 'todo',
      subtext: 'Twice every day',
      completed: true,
    },
    {
      id: '2',
      title: 'Volleyball practice',
      type: 'event',
      start: new Date(new Date().setHours(17, 0, 0, 0)),
    },
  ]);

  return (
    <ScrollView className="flex-1 bg-background px-6 py-16" keyboardDismissMode="on-drag">
      <View className="mb-10">
        <Greeting />
        <AppText f className="text-base leading-5 text-foregroundMuted">
          You have 3 assignments due today. And it's probably time for a trip to the grocery store,
          as you have 9 items on your shopping list.
        </AppText>
      </View>

      <View className="flex-1 gap-6">
        <TodoSection title="Today" tasks={tasksToday} updateTasks={setTasksToday} />
        <TodoSection
          title="Priority"
          tasks={[
            {
              id: '2',
              title: 'Groceries',
              type: 'todo',
              subtext: 'Recommended, 9 items',
              completed: false,
            },
            {
              id: '3',
              title: 'Homework',
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
              title: 'Clean Room',
              type: 'todo',
              subtext: 'Done 4 days ago',
              completed: true,
            },
          ]}
        />
      </View>
    </ScrollView>
  );
}
