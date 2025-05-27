import AppText from 'components/AppText';
import { View } from 'react-native';
import { isToday } from 'utils/dateUtils';

export class Time {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;

  constructor(data?: Partial<Time>) {
    if (data) {
      this.years = data.years;
      this.months = data.months;
      this.weeks = data.weeks;
      this.days = data.days;
      this.hours = data.hours;
      this.minutes = data.minutes;
    }
  }

  toHours(): number {
    return this.toMilliseconds() / (1000 * 60 * 60);
  }

  toDays(): number {
    return this.toHours() / 24;
  }

  toWeeks(): number {
    return this.toDays() / 7;
  }

  // Convert to total milliseconds
  toMilliseconds(): number {
    let total = 0;
    if (this.years) total += this.years * 365.25 * 24 * 60 * 60 * 1000;
    if (this.months) total += this.months * 30.44 * 24 * 60 * 60 * 1000; // Average month
    if (this.weeks) total += this.weeks * 7 * 24 * 60 * 60 * 1000;
    if (this.days) total += this.days * 24 * 60 * 60 * 1000;
    if (this.hours) total += this.hours * 60 * 60 * 1000;
    if (this.minutes) total += this.minutes * 60 * 1000;
    return total;
  }

  // Add this time to a date
  addToDate(date: Date): Date {
    const result = new Date(date);
    if (this.years) result.setFullYear(result.getFullYear() + this.years);
    if (this.months) result.setMonth(result.getMonth() + this.months);
    if (this.weeks) result.setDate(result.getDate() + this.weeks * 7);
    if (this.days) result.setDate(result.getDate() + this.days);
    if (this.hours) result.setHours(result.getHours() + this.hours);
    if (this.minutes) result.setMinutes(result.getMinutes() + this.minutes);
    return result;
  }

  // Check if this time duration is zero/empty
  isEmpty(): boolean {
    return !this.years && !this.months && !this.weeks && !this.days && !this.hours && !this.minutes;
  }

  // Create a human-readable string representation
  toString(): string {
    const parts: string[] = [];
    if (this.years) parts.push(`${this.years} year${this.years !== 1 ? 's' : ''}`);
    if (this.months) parts.push(`${this.months} month${this.months !== 1 ? 's' : ''}`);
    if (this.weeks) parts.push(`${this.weeks} week${this.weeks !== 1 ? 's' : ''}`);
    if (this.days) parts.push(`${this.days} day${this.days !== 1 ? 's' : ''}`);
    if (this.hours) parts.push(`${this.hours} hour${this.hours !== 1 ? 's' : ''}`);
    if (this.minutes) parts.push(`${this.minutes} minute${this.minutes !== 1 ? 's' : ''}`);

    if (parts.length === 0) return '0 minutes';
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return parts.join(' and ');
    return parts.slice(0, -1).join(', ') + ', and ' + parts[parts.length - 1];
  }
}

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
    console.log('dis', dis);
    return new Time({
      minutes: dis / 1000 / 60,
    });
  }
}

export class Task {
  id: string;
  title: string;
  emoji?: string;
  note?: string;
  repeat?: Time; // Also resets completion on todos
  tags?: string[];

  constructor(data: Partial<Task> & { id: string; title: string }) {
    this.id = data.id;
    this.title = data.title;
    this.emoji = data.emoji;
    this.note = data.note;
    this.repeat = data.repeat;
    this.tags = data.tags;
  }

  get subtext() {
    return this.note;
  }

  getSubtextClasses = () => '';
  renderSubtext = () => (
    <AppText
      className={`-mt-0.5 font-medium italic text-foregroundMuted ${this.getSubtextClasses()}`}>
      {this.subtext}
    </AppText>
  );

  isToday = () => false;
  isPriority = () => false;
}

export class TaskCategory extends Task {
  constructor(data: Partial<TaskCategory> & { id: string; title: string }) {
    super(data);
  }

  isPriority = () => true;
}

export class Todo extends Task {
  start?: PartialDate;
  due?: PartialDate;
  remindAt?: PartialDate;
  lastDone?: PartialDate;
  softRepeat?: Time; // First repeats when finished
  completed?: boolean[];
  amount?: number;
  category?: string;

  constructor(data: Partial<Todo> & { id: string; title: string; note: string }) {
    super(data);
    this.note = data.note;
    this.start = data.start;
    this.due = data.due;
    this.remindAt = data.remindAt;
    this.lastDone = data.lastDone;
    this.softRepeat = data.softRepeat;
    this.completed = data.completed;
    this.amount = data.amount;
    this.category = data.category;
  }

  isToday = () => this.due?.isToday() || false;
  isPriority = () =>
    !!(this.softRepeat && this.lastDone && this.softRepeat.toDays() - this.daysSinceLastDone < 2);

  get daysSinceLastDone() {
    return this.lastDone?.timeTo(new PartialDate(new Date())).toDays() ?? 0;
  }

  // Tailwind classes used dynamically: bg-red-500
  getSubtextClasses = () => {
    if (!this.softRepeat || !this.lastDone) return '';
    const days = this.softRepeat.toDays() - this.daysSinceLastDone;
    if (days < -4) return 'text-red-500';
    if (days < 4) return 'text-[#FF6A00]/70';

    return '';
  };
  get subtext() {
    if (this.softRepeat && this.lastDone) {
      const days = this.softRepeat.toDays() - this.daysSinceLastDone;
      if (days < 4) {
        const rounded = Math.round(this.daysSinceLastDone);
        return `Done ${rounded} days ago`;
      }
    }
    return this.note;
  }
}

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
        <AppText>at</AppText>
        <View className="m-0 rounded-[4px] bg-accent/70 px-1.5 font-medium text-foreground">
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
