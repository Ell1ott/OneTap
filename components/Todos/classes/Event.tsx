import AppText from 'components/base/AppText';
import { View } from 'react-native';
import { isToday } from 'utils/dateUtils';
import { Task } from './Task';
import { HumanDate } from '../types';

export class Event extends Task {
  start: HumanDate[];
  end?: HumanDate[];
  cancelled?: boolean;

  constructor(
    data: Partial<Task> & {
      id: string;
      title: string;
      start: HumanDate | HumanDate[];
      end?: HumanDate | HumanDate[];
      cancelled?: boolean;
    }
  ) {
    super(data);
    if (data.start instanceof HumanDate) {
      this.start = [data.start];
    } else {
      this.start = data.start;
    }
    if (data.end instanceof HumanDate) {
      this.end = [data.end];
    } else {
      this.end = data.end;
    }

    this.cancelled = data.cancelled;
  }

  getNextStart = () => {
    const now = new Date();
    return this.start.sort((a, b) => -a.timeTo(now).toDays() - -b.timeTo(now).toDays())[0];
  };

  getNextEnd = () => {
    const now = new Date();
    const futureDates = this.end?.filter((date) => date.timeTo(now).toDays() > 0);
    return futureDates?.sort((a, b) => a.timeTo(now).toDays() - b.timeTo(now).toDays())[0];
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
          <AppText>At</AppText>
          <View className="m-0 -my-0.5 rounded-[4px] bg-accent/70 px-1 font-medium text-foreground">
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
          <AppText>Tomorrow{atString}</AppText>
        </>
      );
    }

    const daysToNow = -this.getNextStart().timeTo(new Date()).toDays();

    console.log('daysToNow', daysToNow);

    if (daysToNow < 7) {
      return (
        <AppText>
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
