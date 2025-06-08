import AppText from 'components/base/AppText';
import { View } from 'react-native';
import { isToday } from 'utils/dateUtils';
import { Task } from './Task';
import { HumanDate } from '../types';
import { Tables } from 'utils/supabase/database.types';

export class Event extends Task {
  r: Tables<'events'>;

  constructor(data: Tables<'events'>) {
    super(data);
    this.r = data;
  }

  getNextStart = () => {
    const now = new Date();
    return this.r.start
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .filter((date) => new Date(date.date).getTime() > now.getTime())[0];
  };

  getNextEnd = () => {
    const now = new Date();
    if (!this.r.end) return null;
    return this.r.end
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .filter((date) => new Date(date.date).getTime() > now.getTime())[0];
  };

  isToday = () => this.getNextStart().isToday();

  renderSubtext = () => (
    <View className="rounded-sm">
      <View className="flex-row items-center gap-x-1">{this.renderTimeInfo()}</View>
    </View>
  );

  renderTimeInfo = () => {
    if (this.getNextStart().isToday()) {
      return (
        <>
          <AppText className="text-foregroundMuted">At</AppText>
          <View className="m-0 -my-0.5 rounded-[4px] bg-accent/70 px-1 font-medium text-foregroundMuted">
            <AppText>
              {this.getNextStart().date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
              {/*
           {' ' + getRelativeDateString(item.startTime)} */}
            </AppText>
          </View>
        </>
      );
    }

    const atString = this.getNextStart().isTimeKnown
      ? ' at ' +
        this.getNextStart().date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';
    if (this.getNextStart().isTomorrow()) {
      return (
        <>
          <AppText className="text-foregroundMuted">Tomorrow{atString}</AppText>
        </>
      );
    }

    const daysToNow = -this.getNextStart().timeTo(new Date()).toDays();

    console.log('daysToNow', daysToNow);

    if (daysToNow < 7) {
      return (
        <AppText className="text-foregroundMuted">
          {this.getNextStart().date.toLocaleDateString('en-US', { weekday: 'long' })}
          {atString}
        </AppText>
      );
    }

    const weeksToNow = Math.floor(daysToNow / 7);
    const days = Math.floor(daysToNow) % 7;

    return (
      <AppText>
        {this.getNextStart().toLocaleString()}
        {' - '}
        in {weeksToNow} weeks{days > 0 && ` and ${days} days`}
      </AppText>
    );
  };
}
