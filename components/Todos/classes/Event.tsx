import AppText from 'components/base/AppText';
import { View } from 'react-native';
import { isToday } from 'utils/dateUtils';
import { Task } from './Task';

export class Event extends Task {
  start: Date;
  end?: Date;
  cancelled?: boolean;

  constructor(data: Partial<Event> & { id: string; title: string; start: Date }) {
    super(data);
    this.start = data.start;
    this.end = data.end;
    this.cancelled = data.cancelled;
  }

  isToday = () => isToday(this.start);

  renderSubtext = () => (
    <View className="mt-1 rounded-sm">
      <View className="flex-row items-center gap-x-1">
        <AppText>At</AppText>
        <View className="m-0 -my-0.5 rounded-[4px] bg-accent/70 px-1 font-medium text-foreground">
          <AppText>
            {this.start
              .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
              .toLowerCase()}
            {/*
           {' ' + getRelativeDateString(item.startTime)} */}
          </AppText>
        </View>
      </View>
    </View>
  );
}
