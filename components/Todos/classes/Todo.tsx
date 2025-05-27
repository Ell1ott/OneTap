import { Task } from './Task';
import { PartialDate } from '../types/PartialDate';
import { Time } from '../types/Time';

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
