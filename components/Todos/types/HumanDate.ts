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
    return new HumanDate(dateObj, date.includes(':') || date.includes('am') || date.includes('pm'));
  };

  timeTo(dateObj: HumanDate | Date): Time {
    // Calculate the this date and the function date
    const date = dateObj instanceof Date ? dateObj : dateObj.date;
    const dis = date.getTime() - this.date.getTime();
    return new Time({
      minutes: dis / 1000 / 60,
    });
  }

  isToday = () => isToday(this.date);
  isTomorrow = () => isTomorrow(this.date);
}
