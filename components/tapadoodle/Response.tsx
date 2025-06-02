import { useState } from 'react';
import { experimental_useObject } from '@ai-sdk/react';
import FadeInText from 'components/base/FadeInText';
import { useEffect } from 'react';
import { View } from 'react-native';
import { z } from 'zod';
import { TodoAIData, TodoPreviewCard } from './TodoPreviewCard';
import { generateAPIUrl } from 'utils/apiUrlHandler';
import { Todo } from 'components/Todos/classes';
import { PartialDate, Time } from 'components/Todos/types';
import { parseDate } from 'utils/dateUtils';
export const Response = ({ transcript }: { transcript: string }) => {
  const [responseMessage, setResponseMessage] = useState<string>('');
  const {
    object: _object,
    submit,
    isLoading,
  } = experimental_useObject({
    api: generateAPIUrl('/api/stream'),
    schema: z.unknown(),
    onFinish: (object) => {
      console.log(object);
      console.log(toTodoClass(object as any as TodoAIData));
    },
  });

  const toTodoClass = (todo: TodoAIData) => {
    return new Todo({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: todo.title,
      emoji: todo.emoji,
      note: todo.note,
      start: todo.start ? new PartialDate(parseDate(todo.start) || undefined) : undefined,
      end: todo.end ? new PartialDate(parseDate(todo.end) || undefined) : undefined,
      softDue: todo.softDue ? new PartialDate(parseDate(todo.softDue) || undefined) : undefined,
      remindAt: todo.remindAt ? new PartialDate(parseDate(todo.remindAt) || undefined) : undefined,
      repeat: todo.repeat && !todo.repeatSoftly ? new Time(todo.repeat) : undefined,
      softRepeat: todo.repeatSoftly && todo.repeat ? new Time(todo.repeat) : undefined,
      amount: todo.amount || undefined,
      category: todo.category || undefined,
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
