import { useState } from 'react';
import { experimental_useObject } from '@ai-sdk/react';
import FadeInText from 'components/base/FadeInText';
import { useEffect } from 'react';
import { View } from 'react-native';
import { z } from 'zod';
import { TodoPreviewCard } from './TodoPreviewCard';

export const Response = ({ transcript }: { transcript: string }) => {
  const [responseMessage, setResponseMessage] = useState<string>('');
  const {
    object: _object,
    submit,
    isLoading,
  } = experimental_useObject({
    api: '/api/stream',
    schema: z.unknown(),
  });
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
      {object?.title && (
        <TodoPreviewCard
          title={object.title}
          type={object.type}
          emoji={object.emoji}
          note={object.note}
          start={object.start}
          end={object.end}
          due={object.due}
          softDue={object.softDue}
          remindAt={object.remindAt}
          repeat={object.repeat}
          amount={object.amount}
          category={object.category}
        />
      )}
    </View>
  );
};
