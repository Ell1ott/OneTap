import { useState } from 'react';
import { experimental_useObject } from '@ai-sdk/react';
import FadeInText from 'components/base/FadeInText';
import { useEffect } from 'react';
import { View } from 'react-native';
import { z } from 'zod';
import { TodoAIData, TodoPreviewCard } from './TodoPreviewCard';
import { generateAPIUrl } from 'utils/apiUrlHandler';
import { Event, Todo } from 'components/Todos/classes';
import { HumanDate, Time } from 'components/Todos/types';
import { parseNaturalDate } from 'utils/dateUtils';
import { useTasksStore } from 'stores/tasksStore';
export const Response = ({ transcript }: { transcript: string }) => {
  const { addTask } = useTasksStore();
  const [responseMessage, setResponseMessage] = useState<string>('');
  const {
    object: _object,
    submit,
    isLoading,
  } = experimental_useObject({
    api: generateAPIUrl('/api/stream'),
    schema: z.unknown(),
    onFinish: ({ object }) => {
      console.log(object);
      console.log(toTodoClass(object as any as TodoAIData));
      if ((object as any).type === 'todo') {
        addTask(toTodoClass(object as any as TodoAIData));
      } else if ((object as any).type === 'event') {
        const event = toEventClass(object as any as TodoAIData);
        if (event) {
          addTask(event);
        } else {
          console.log('Error: Event is null');
        }
      }
    },
  });

  const toTodoClass = (todo: TodoAIData) => {
    console.log(todo);
    return new Todo({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: todo.title,
      emoji: todo.emoji,
      note: todo.note,
      start: todo.start
        ? HumanDate.fromNaturalString(Array.isArray(todo.start) ? todo.start[0] : todo.start)
        : undefined,
      end: todo.end
        ? HumanDate.fromNaturalString(Array.isArray(todo.end) ? todo.end[0] : todo.end)
        : undefined,
      softDue: todo.softDue ? HumanDate.fromNaturalString(todo.softDue) : undefined,
      remindAt: todo.remindAt ? HumanDate.fromNaturalString(todo.remindAt) : undefined,
      repeat: todo.repeat && !todo.repeatSoftly ? new Time(todo.repeat) : undefined,
      softRepeat: todo.repeatSoftly && todo.repeat ? new Time(todo.repeat) : undefined,
      amount: todo.amount || undefined,
      category: todo.category || undefined,
    });
  };

  const toHumanDateArray = (date: string | string[] | null): HumanDate[] | undefined => {
    if (!date) return undefined;
    if (Array.isArray(date)) {
      return date
        .map((date) => HumanDate.fromNaturalString(date))
        .filter((date) => date !== undefined);
    }
    const humanDate = HumanDate.fromNaturalString(date);
    if (!humanDate) return undefined;
    return [humanDate];
  };

  const toEventClass = (event: TodoAIData) => {
    if (!event.start) return null;

    const starts = toHumanDateArray(event.start);

    if (!starts) return null;
    return new Event({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: event.title,
      emoji: event.emoji,
      note: event.note,
      start: starts,
      end: event.end ? toHumanDateArray(event.end) : undefined,
    });
  };
  const object = _object as any;

  useEffect(() => {
    submit(transcript);
  }, []);

  useEffect(() => {
    console.log(object);
  }, [object]);

  return (
    <View>
      {object?.msg && (
        <FadeInText className="text-lg leading-5" endOpacity={0.7} text={object?.msg || ''} />
      )}
      {object?.title && <TodoPreviewCard todo={object} />}
    </View>
  );
};
