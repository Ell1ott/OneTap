import * as React from 'react';
import { Text } from 'react-native';
import AppText from '../../base/AppText';
import { user$ } from 'utils/supabase/SupaLegend';
import { observer } from '@legendapp/state/react';
interface GreetingProps {
  name?: string;
  className?: string;
}

const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour >= 2 && hour < 12) {
    return 'Good morning';
  } else if (hour >= 12 && hour < 18) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
};

export const Greeting: React.FC<GreetingProps> = observer(({ className = 'mb-3 text-[25px] font-bold text-foreground' }) => {
  const name = user$.get()?.first_name;
  return (
    <AppText f className={className}>
      {getTimeBasedGreeting()}, {name}!
    </AppText>
  );
});
