import * as React from 'react';
import { Text } from 'react-native';
import AppText from '../../base/AppText';
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

export const Greeting: React.FC<GreetingProps> = ({
  name = 'Elliott',
  className = 'mb-3 text-[25px] font-bold text-foreground',
}) => {
  return (
    <AppText f className={className}>
      {getTimeBasedGreeting()}, {name}!
    </AppText>
  );
};
