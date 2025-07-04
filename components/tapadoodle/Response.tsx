import { useEffect } from 'react';
import { experimental_useObject } from '@ai-sdk/react';
import { FadeInText } from 'components/base/FadeInText';
import { View } from 'react-native';
import { z } from 'zod';
import { TodoAIData, TodoPreviewCard } from './TodoPreviewCard';
import { HumanDate } from 'components/Todos/types';
import { fetch as expoFetch } from 'expo/fetch';
import { supabaseAnonAuthHeaders } from 'utils/supabase/supabaseAuth';
import { TablesInsert } from 'utils/supabase/database.types';
import { addEvent, addTodo } from 'utils/supabase/SupaLegend';
import { CustomJson } from 'utils/supabase/customJsonType';

export const Response = ({ transcript }: { transcript: string }) => {
  // const [responseMessage, setResponseMessage] = useState<string>('');
  const {
    object: _object,
    submit,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isLoading,
  } = experimental_useObject({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: 'https://pobfzmtkkaybunlhhmny.supabase.co/functions/v1/gemini-flash',
    headers: supabaseAnonAuthHeaders,
    schema: z.unknown(),
    onFinish: ({ object }) => {
      console.log(object);
      console.log(toTodoClass(object as any as TodoAIData));
      if (Array.isArray(object)) {
        object.forEach((o) => {
          if (o.type === 'todo') {
            const todo = toTodoClass(o as any as TodoAIData);
            if (todo) {
              addTodo(todo);
            }
          }
          if (o.type === 'event') {
            const event = toEventClass(o as any as TodoAIData);
            if (event) {
              addEvent(event);
            }
          }
        });
      }
      if (!(object as any).title) return;
      if ((object as any).type === 'todo') {
        const todo = toTodoClass(object as any as TodoAIData);
        if (todo) {
          addTodo(todo);
        } else {
          console.log('Error: Todo is null');
        }
      } else if ((object as any).type === 'event') {
        const event = toEventClass(object as any as TodoAIData);
        if (event) {
          addEvent(event);
        } else {
          console.log('Error: Event is null');
        }
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const toTodoClass = (todo: TodoAIData) => {
    console.log(todo);

    const start = todo.start
      ? HumanDate.fromNaturalString(
          Array.isArray(todo.start) ? todo.start[0] : todo.start
        )?.toDictionary()
      : undefined;
    const end = todo.due
      ? HumanDate.fromNaturalString(
          Array.isArray(todo.due) ? todo.due[0] : todo.due
        )?.toDictionary()
      : undefined;
    const remind_at = todo.remindAt
      ? HumanDate.fromNaturalString(
          Array.isArray(todo.remindAt) ? todo.remindAt[0] : todo.remindAt
        )?.toDictionary()
      : undefined;

    const r: TablesInsert<'todos'> = {
      title: todo.title,
      emoji: todo.emoji,
      note: todo.note,
      start: start,
      end: end,
      soft_due: todo.softDue
        ? HumanDate.fromNaturalString(todo.softDue)?.toDictionary()
        : undefined,
      remind_at: remind_at ? [remind_at] : undefined,
      repeat: todo.repeat,
      soft_repeat: todo.repeatSoftly ? todo.repeat : undefined,
      category: todo.category,
      completed: Array(todo.amount || 1).fill(false),
    };

    return r;
  };

  const toHumanDateArray = (date: string | string[] | null): CustomJson[] | undefined => {
    if (!date) return undefined;
    if (Array.isArray(date)) {
      return date
        .map((date) => HumanDate.fromNaturalString(date)?.toDictionary())
        .filter((date) => date !== undefined);
    }
    const humanDate = HumanDate.fromNaturalString(date);
    if (!humanDate) return undefined;
    return [humanDate.toDictionary()];
  };

  const toEventClass = (event: TodoAIData) => {
    if (!event.start) return null;

    const starts = toHumanDateArray(event.start);

    if (!starts) return null;
    const r: TablesInsert<'events'> = {
      title: event.title,
      emoji: event.emoji,
      note: event.note,
      start: starts,
      end: event.end ? toHumanDateArray(event.end) : undefined,
    };
    return r;
  };
  const object = _object as any;

  useEffect(() => {
    submit({
      input: transcript,
      currentDate: new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  useEffect(() => {
    console.log(object);
  }, [object]);

  return (
    <View>
      {Array.isArray(object) &&
        object.map((o: TodoAIData & { msg: string }, index: number) => (
          <View key={index}>
            {o.msg && index === 0 && (
              <FadeInText className="text-lg leading-5" endOpacity={0.7} text={o.msg || ''} />
            )}
            {o.title && <TodoPreviewCard todo={o as any} />}
          </View>
        ))}
    </View>
  );
};
