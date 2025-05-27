import * as React from 'react';
import { View, Pressable, Text } from 'react-native';
import { theme } from 'tailwind.config';
import AppText from 'components/AppText';
import { TodoSection } from 'components/HomeScreen/TodoSection';
import { Greeting } from 'components/HomeScreen/Greeting';
import { Todo, Event, TaskCategory, PartialDate, Time } from 'components/Todos/types';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { isToday } from 'utils/dateUtils';

export function HomeScreen() {
  console.log('current theme', theme);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [tasks, setTasks] = useState<(Todo | Event | TaskCategory)[]>([
    {
      id: '1',
      title: 'Walk the dog',
      type: 'todo',
      subtext: 'Twice every day',
      completed: [true, false],
      repeat: {
        days: 1,
      },
      amount: 2,
      due: new PartialDate({
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        day: new Date().getDate(),
      }),
    },
    {
      id: '2',
      title: 'Volleyball practice',
      type: 'event',
      start: new Date(new Date().setHours(17, 0, 0, 0)),
    },
    {
      id: '4',
      title: 'Clean Room',
      type: 'todo',
      subtext: 'Done 4 days ago',
      completed: [true],
    },
    {
      id: '5',
      title: 'Catch up with Jake',
      subtext: 'Every 2 weeks',
      type: 'todo',
      due: undefined,
      remindAt: undefined,
      repeat: undefined,
      softRepeat: new Time({
        weeks: 2,
      }),
      lastDone: new PartialDate(new Date(new Date().setDate(3))),
      emoji: '👋',
    },

    {
      id: '2',
      title: 'Groceries',
      type: 'category',
      subtext: 'Recommended, 9 items',
    },
    {
      id: '3',
      title: 'Homework',
      type: 'category',
      subtext: '5 total, 3 urgent',
    },
  ]);

  tasks.forEach((t) => {
    if (t.type === 'todo' && t.softRepeat) {
      console.log('softRepeat', t.softRepeat.toDays());
      console.log('Days since last done', t.lastDone?.timeTo(new PartialDate(new Date())).toDays());
    }
  });

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-6 pt-16 pb-6"
      keyboardDismissMode="on-drag">
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
          tasks={tasks.filter(
            (t) =>
              (t.type === 'todo' && t.due?.isToday()) || (t.type === 'event' && isToday(t.start))
          )}
          updateTasks={setTasks}
        />
        <TodoSection
          title="Priority"
          tasks={tasks.filter(
            (t) =>
              t.type === 'category' ||
              (t.type === 'todo' &&
                t.softRepeat?.toDays()! -
                  t.lastDone?.timeTo(new PartialDate(new Date())).toDays()! <
                  2)
          )}
          updateTasks={setTasks}
        />
        <TodoSection
          title="Other"
          tasks={tasks.filter(
            (t) =>
              !(t.type === 'todo' && t.due?.isToday()) &&
              !(t.type === 'event' && isToday(t.start)) &&
              t.type !== 'category'
          )}
          updateTasks={setTasks}
        />
      </View>
    </ScrollView>
  );
}
