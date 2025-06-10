import AppText from 'components/base/AppText';
import { View } from 'react-native';
import { isToday, isTomorrow, timeBetween } from 'utils/dateUtils';
import { Task } from './Task';
import { HumanDate } from '../types';
import { Tables } from 'utils/supabase/database.types';
import { events$ } from 'utils/supabase/SupaLegend';

export class Event extends Task {
  r: Tables<'events'>;

  constructor(data: Tables<'events'>) {
    super(data);
    this.r = data;
    console.log('new event', data);
  }

  $ = () => events$[this.r.id as string];

  getNextStart = () => {
    const now = new Date();
    console.log('this.r.start', this.r.start);

    const nextStart = this.r.start.sort(
      (a, b) => new Date(a.date as string).getTime() - new Date(b.date as string).getTime()
    )[0];
    // .filter((date) => date.date.getTime() > now.getTime())[0];
    console.log('nextStart', nextStart);
    return {
      date: new Date(nextStart.date as string),
      isTimeKnown: nextStart.isTimeKnown,
    };
  };

  getNextEnd = () => {
    const startOfToday = new Date().setHours(0, 0, 0, 0);
    if (!this.r.end) return null;
    return this.r.end
      .map((e) => ({
        date: new Date(e.date as string),
        isTimeKnown: e.isTimeKnown,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .filter((date) => date.date.getTime() > startOfToday)[0];
  };

  isToday = () =>
    this.r.start.length > 0 && this.r.start.some((s) => isToday(new Date(s.date as string)));

  renderSubtext = () => (
    <View className="rounded-sm">
      <View className="flex-row items-center gap-x-1">{this.renderTimeInfo()}</View>
    </View>
  );

  renderTimeInfo = () => {
    const nextStart = this.getNextStart();
    if (!nextStart) return <AppText>No start date</AppText>;
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

    const atString = nextStart.isTimeKnown
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
        {nextStart.date.toLocaleString()}
        {' - '}
        in {weeksToNow} weeks{days > 0 && ` and ${days} days`}
      </AppText>
    );
  };
}
