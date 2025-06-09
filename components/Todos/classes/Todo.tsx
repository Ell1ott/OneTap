import { Task } from './Task';
import { PartialDate } from '../types/PartialDate';
import { Time } from '../types/Time';
import { View } from 'react-native';
import CheckBox from 'components/base/CheckBox';
import { HumanDate } from '../types/HumanDate';
import { JSX } from 'react';
import { Tables } from 'utils/supabase/database.types';
import { todos$ } from 'utils/supabase/SupaLegend';
import { isToday } from 'utils/dateUtils';

export class Todo extends Task {
  r: Tables<'todos'>;

  constructor(data: Tables<'todos'>) {
    super(data);
    this.r = data;
  }

  $ = () => todos$[this.r.id as string];

  isToday = () =>
    (this.r.end && HumanDate.isToday(this.r.end)) ||
    (this.r.soft_due && HumanDate.isToday(this.r.soft_due)) ||
    false;

  isPriority = () => {
    // Check softRepeat priority
    const repeatPriority = !!(
      this.r.soft_repeat &&
      this.r.done_times?.length &&
      this.r.done_times.length > 0 &&
      new Time(this.r.soft_repeat).toDays() - this.daysSinceLastDone < 2
    );

    // Check softDue priority (due within 2 days or overdue)
    const duePriority = !!(this.r.soft_due && this.daysTillSoftDue <= 2);

    return repeatPriority || duePriority;
  };

  get daysSinceLastDone() {
    const lastDone = new Date(this.r.done_times?.[this.r.done_times.length - 1]);
    return HumanDate.timeBetween(lastDone, new Date()).toDays();
  }

  get daysTillSoftDue() {
    if (!this.r.soft_due) return Infinity;
    return HumanDate.timeBetween(new Date(this.r.soft_due), new Date()).toDays();
  }

  get isOverdue() {
    return this.r.soft_due && this.daysTillSoftDue < 0;
  }

  // Tailwind classes used dynamically: bg-red-500
  getSubtextClasses = () => {
    // Check softDue styling first (higher priority)
    if (this.r.soft_due) {
      const days = this.daysTillSoftDue;
      if (days < 0) return 'text-red-500'; // Overdue
      if (days <= 1) return 'text-[#FF6A00]/70'; // Due soon
      return '';
    }

    // Fall back to softRepeat styling
    if (!this.r.soft_repeat || !this.r.done_times?.length) return '';
    const days = new Time(this.r.soft_repeat).toDays() - this.daysSinceLastDone;
    if (days < -4) return 'text-red-500';
    if (days < 4) return 'text-[#FF6A00]/70';

    return '';
  };

  get subtext() {
    // Show softDue info first if available
    if (this.r.soft_due) {
      const days = this.daysTillSoftDue;
      if (days < 0) {
        const overdueDays = Math.abs(Math.round(days));
        if (overdueDays === 1) return 'Overdue by 1 day';
        return `Overdue by ${overdueDays} days`;
      }
      if (days === 0) return 'Due today';
      if (days === 1) return 'Due tomorrow';
      const roundedDays = Math.round(days);
      return `Due in ${roundedDays} days`;
    }

    // Fall back to softRepeat info
    if (this.r.soft_repeat && this.r.done_times?.length) {
      const rounded = Math.round(this.daysSinceLastDone);
      if (rounded === 0) return 'Done today';
      if (rounded === 1) return 'Done yesterday';
      return `Done ${rounded} days ago`;
    }

    return this.r.note;
  }

  onToggle = (newCompleted: boolean[]) => {
    if (newCompleted.every(Boolean)) {
      todos$[this.r.id].done_times.set([...(this.r.done_times || []), new Date().toISOString()]);
      console.log(this.r.done_times);
    } else {
      const newDoneTimes = this.r.done_times?.filter((doneTime) => !isToday(new Date(doneTime)));
      todos$[this.r.id].done_times.set(newDoneTimes);
    }
  };

  EndContent = (): JSX.Element => (
    <View className="flex-row items-center">
      {this.r.completed?.map((completed, index) => (
        <CheckBox
          key={index}
          checked={completed}
          classname={` ${index === 0 ? 'pl-24 -ml-24' : ''} ${
            index === (this.r.completed?.length || 0) - 1 ? 'pr-6 -mr-6' : ''
          }`}
          onToggle={() => {
            const newCompleted = [...(this.r.completed || [])];
            newCompleted[index] = !newCompleted[index];
            todos$[this.r.id].completed.set(newCompleted);

            this.onToggle(newCompleted);
          }}
        />
      ))}
    </View>
  );
}
