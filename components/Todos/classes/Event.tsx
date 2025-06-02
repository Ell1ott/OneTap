import AppText from 'components/base/AppText';
import { View } from 'react-native';
import { isToday } from 'utils/dateUtils';
import { Task } from './Task';
import { HumanDate } from '../types';

export class Event extends Task {
  start: HumanDate;
  end?: HumanDate;
  cancelled?: boolean;

  constructor(data: Partial<Event> & { id: string; title: string; start: HumanDate }) {
    super(data);
    this.start = data.start;
    this.end = data.end;
    this.cancelled = data.cancelled;
  }

  isToday = () => this.start.isToday();

  renderSubtext = () => (
    <View className="mt-1 rounded-sm">
      <View className="flex-row items-center gap-x-1">
        <AppText>At</AppText>
        <View className="m-0 -my-0.5 rounded-[4px] bg-accent/70 px-1 font-medium text-foreground">
          <AppText>
            {this.start.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            {/*
           {' ' + getRelativeDateString(item.startTime)} */}
          </AppText>
        </View>
      </View>
    </View>
  );
}
