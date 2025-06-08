import { isToday, isTomorrow, parseNaturalDate } from 'utils/dateUtils';
import { Time } from './Time';

export type HumanDateType = {
  date: Date;
  isTimeKnown: boolean;
};

export class HumanDate {
  date: Date;
  isTimeKnown: boolean;

  constructor(date?: Date, isTimeKnown?: boolean) {
    this.date = date ?? new Date();
    this.isTimeKnown = isTimeKnown ?? false;
  }

  setDate = (date: Date) => {
    this.date = date;
    return this;
  };

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

  static timeBetween(_date1: HumanDateType | Date, _date2: HumanDateType | Date): Time {
    const date1 = _date1 instanceof Date ? _date1 : _date1.date;
    const date2 = _date2 instanceof Date ? _date2 : _date2.date;

    return new Time({
      minutes: date1.getTime() - date2.getTime(),
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
  static isToday = ({ date }: HumanDateType) => isToday(date);
  isTomorrow = () => isTomorrow(this.date);
  static isTomorrow = ({ date }: HumanDateType) => isTomorrow(date);
}
