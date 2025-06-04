import { isToday, isTomorrow, parseNaturalDate } from 'utils/dateUtils';
import { Time } from './Time';

export class HumanDate {
  date: Date;
  isTimeKnown: boolean;

  constructor(date?: Date, isTimeKnown?: boolean) {
    this.date = date ?? new Date();
    this.isTimeKnown = isTimeKnown ?? false;
  }

  static fromNaturalString = (date: string) => {
    const dateObj = parseNaturalDate(date);
    if (!dateObj) return undefined;
    return new HumanDate(
      dateObj,
      date.includes(':') ||
        date.includes('am') ||
        date.includes('pm') ||
        date.includes('hour') ||
        date.includes('minute')
    );
  };

  timeTo(dateObj: HumanDate | Date): Time {
    // Calculate the this date and the function date
    const date = dateObj instanceof Date ? dateObj : dateObj.date;
    const dis = this.isTimeKnown
      ? date.getTime() - this.date.getTime()
      : date.setHours(0, 0, 0, 0) - this.date.setHours(0, 0, 0, 0);
    return new Time({
      minutes: dis / 1000 / 60,
    });
  }

  toLocaleString = () => {
    return this.date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: this.isTimeKnown ? '2-digit' : undefined,
      minute: this.isTimeKnown ? '2-digit' : undefined,
    });
  };

  isToday = () => isToday(this.date);
  isTomorrow = () => isTomorrow(this.date);
}
