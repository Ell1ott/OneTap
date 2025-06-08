import AppText from 'components/base/AppText';
import { View } from 'react-native';
import { isToday, isTomorrow, timeBetween } from 'utils/dateUtils';
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
      .map((s) => ({
        date: new Date(s.date),
        isTimeKnown: s.isTimeKnown,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .filter((date) => date.date.getTime() > now.getTime())[0];
  };

  getNextEnd = () => {
    const now = new Date();
    if (!this.r.end) return null;
    return this.r.end
      .map((e) => ({
        date: new Date(e.date),
        isTimeKnown: e.isTimeKnown,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .filter((date) => date.date.getTime() > now.getTime())[0];
  };

  isToday = () => isToday(this.getNextStart().date);

  renderSubtext = () => (
    <View className="rounded-sm">
      <View className="flex-row items-center gap-x-1">{this.renderTimeInfo()}</View>
    </View>
  );

  renderTimeInfo = () => {
    const nextStart = this.getNextStart();
    if (isToday(nextStart.date)) {
      return (
        <>
          <AppText className="text-foregroundMuted">At</AppText>
          <View className="m-0 -my-0.5 rounded-[4px] bg-accent/70 px-1 font-medium text-foregroundMuted">
            <AppText>
              {nextStart.date.toLocaleTimeString('en-US', {
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
        nextStart.date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';
    if (isTomorrow(nextStart.date)) {
      return (
        <>
          <AppText className="text-foregroundMuted">Tomorrow{atString}</AppText>
        </>
      );
    }

    const daysToNow = timeBetween(new Date(), nextStart.date).toDays();

    console.log('daysToNow', daysToNow);

    if (daysToNow < 7) {
      return (
        <AppText className="text-foregroundMuted">
          {nextStart.date.toLocaleDateString('en-US', { weekday: 'long' })}
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
