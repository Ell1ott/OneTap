import { Text, View } from 'react-native';
import AppText from '../AppText';
import { getRelativeDateString } from '../../utils/dateUtils';

export interface Task {
  id: string;
  text: string;
  note?: string;
  completed: boolean;
}

export interface Todo extends Task {
  subtext: string;
  type: 'todo';
}

export interface Event extends Task {
  startTime: Date;
  endTime?: Date;
  cancelled?: boolean;
  type: 'event';
}

export const TodoItem = ({ item }: { item: Todo | Event }) => {
  return (
    <View className="flex-row items-center justify-between border-t border-t-foregroundMuted/20 px-6 py-2.5">
      <View>
        <AppText className="text-xl font-medium">{item.text}</AppText>
        {item.type === 'todo' && (
          <AppText className="-mt-0.5 font-medium italic text-foregroundMuted">
            {item.subtext}
          </AppText>
        )}
        {item.type === 'event' && (
          <View className="mt-1 rounded-sm">
            <View className="flex-row items-center gap-x-1">
              <AppText>at</AppText>

              <View className="m-0 rounded-[4px] bg-accent/70 px-1.5 font-medium text-foreground">
                <AppText>
                  {item.startTime
                    .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                    .toLowerCase()}
                  {/*
                 {' ' + getRelativeDateString(item.startTime)} */}
                </AppText>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
