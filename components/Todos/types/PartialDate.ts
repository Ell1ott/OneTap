import { Time } from './Time';

export class PartialDate {
  year?: number;
  month?: number; // 0-indexed
  day?: number;
  hour?: number;
  minute?: number;

  constructor(data?: Partial<PartialDate> | Date) {
    if (data instanceof Date) {
      this.year = data.getFullYear();
      this.month = data.getMonth();
      this.day = data.getDate();
      this.hour = data.getHours();
      this.minute = data.getMinutes();
    } else if (data) {
      this.year = data.year;
      this.month = data.month;
      this.day = data.day;
      this.hour = data.hour;
      this.minute = data.minute;
    }
  }

  toDate(): Date {
    const now = new Date();
    return new Date(
      this.year ?? now.getFullYear(),
      this.month ?? now.getMonth(),
      this.day ?? now.getDate(),
      this.hour ?? 0,
      this.minute ?? 0
    );
  }
  isToday(): boolean {
    const now = new Date();
    return (
      this.year === now.getFullYear() && this.month === now.getMonth() && this.day === now.getDate()
    );
  }

  timeTo(date: PartialDate): Time {
    // Calculate the this date and the function date
    const dis = date.toDate().getTime() - this.toDate().getTime();
    return new Time({
      minutes: dis / 1000 / 60,
    });
  }
}
