import * as React from 'react';
import { View, Pressable, Text, LayoutChangeEvent, findNodeHandle, UIManager } from 'react-native';
import AppText from 'components/base/AppText';
import { TodoSection } from 'components/HomeScreen/TodoSection';
import { Greeting } from 'components/HomeScreen/Greeting';
import { Todo, Event, TaskCategory, Task } from 'components/Todos/classes';
import { PartialDate, Time } from 'components/Todos/types';
import { useEffect, useState, useRef } from 'react';
import { ScrollView } from 'react-native';
import { isToday } from 'utils/dateUtils';
import CategoryScreen from 'components/CategoryScreen';

export function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([
    new Todo({
      id: '1',
      title: 'Walk the dog',

      note: 'Twice every day',
      completed: [true, false],
      repeat: new Time({
        days: 1,
      }),
      amount: 2,
      due: new PartialDate({
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        day: new Date().getDate(),
      }),
    }),
    new Event({
      id: '2',
      title: 'Volleyball practice',
      start: new Date(new Date().setHours(17, 0, 0, 0)),
    }),
    new Todo({
      id: '4',
      title: 'Clean Room',
      doneTimes: [new PartialDate(new Date(new Date().setDate(23)))],
      // note: 'Done 4 days ago',
      softRepeat: true,
      completed: [false],
    }),
    new Todo({
      id: '5',
      title: 'Catch up with Jake',
      note: 'Every 2 weeks',
      due: undefined,
      remindAt: undefined,
      repeat: undefined,
      softRepeat: new Time({
        weeks: 2,
      }),
      lastDone: new PartialDate(new Date(new Date().setDate(3))),
      emoji: '👋',
    }),
    new TaskCategory({
      id: '2',
      title: 'Groceries',
      note: 'Recommended, 9 items',
    }),
    new TaskCategory({
      id: '3',
      title: 'Homework',
      note: '5 total, 3 urgent',
    }),
  ]);

  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const textRef = useRef<React.ElementRef<typeof AppText>>(null);

  useEffect(() => {
    console.log(openCategory);
  }, [openCategory]);

  useEffect(() => {
    if (textRef.current) {
      const node = findNodeHandle(textRef.current);
      if (node) {
        UIManager.measure(node, (_x: number, _y: number, width: number, height: number, pageX: number, pageY: number) => {
          console.log('Text height:', height);
        });
      }
    }
  }, []);

  const handleLayout = (event: LayoutChangeEvent) => {
    console.log('Text height 2.0:', event.nativeEvent.layout.height);
  };

  return (
    <>
      {openCategory && (
        <CategoryScreen category={openCategory} onClose={() => setOpenCategory(null)} />
      )}
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="px-6 pt-16 pb-6"
        keyboardDismissMode="on-drag">
        <View className="mb-10">
          <View className="h-20 w-20 bg-red-500" style={{
            overflow: 'hidden',

          }}>
            <View className='bg-blue-500 h-80 w-10 ml-14' style={{ overflow: 'visible' }}>
              <AppText f ref={textRef} onLayout={handleLayout} className="text-base leading-5 text-foregroundMuted">Hello hello hello hello hello</AppText>
            </View>
          </View>
          <Greeting />
          <AppText f className="text-base leading-5 text-foregroundMuted">
            You have 3 assignments due today. And it's probably time for a trip to the grocery
            store, as you have 9 items on your shopping list.
          </AppText>
        </View>

        <View className="flex-1 gap-6">
          <TodoSection
            title="Today"
            tasks={tasks.filter((t) => t.isToday())}
            updateTasks={setTasks}
            onCategoryPress={(category) => setOpenCategory(category)}
          />
          <TodoSection
            title="Priority"
            tasks={tasks.filter((t) => t.isPriority())}
            updateTasks={setTasks}
            onCategoryPress={(category) => setOpenCategory(category)}
          />
          <TodoSection
            title="Other"
            tasks={tasks.filter((t) => !t.isToday() && !t.isPriority())}
            updateTasks={setTasks}
            onCategoryPress={(category) => setOpenCategory(category)}
          />
        </View>
      </ScrollView>
    </>
  );
}
