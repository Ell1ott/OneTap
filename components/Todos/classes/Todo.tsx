import { Task } from './Task';
import { PartialDate } from '../types/PartialDate';
import { Time } from '../types/Time';
import { View } from 'react-native';
import CheckBox from 'components/base/CheckBox';
import { HumanDate } from '../types/HumanDate';

export class Todo extends Task {
  start?: HumanDate;
  end?: HumanDate; // Due date if it is todo, and end of event if it's a event
  remindAt?: HumanDate;
  lastDone?: HumanDate;
  doneTimes?: HumanDate[];
  softRepeat?: Time | true; // First repeats when finished
  softDue?: HumanDate;
  completed?: boolean[];
  amount?: number;
  category?: string;

  constructor(data: Partial<Todo> & { id: string; title: string }) {
    super(data);
    Object.assign(this, data);

    if (this.doneTimes) {
      this.lastDone = this.doneTimes?.[this.doneTimes.length - 1];
    } else if (this.lastDone) {
      this.doneTimes = [this.lastDone];
    }
    this.completed = data.completed || (this.amount ? Array(this.amount).fill(false) : [false]);
  }

  isToday = () => this.end?.isToday() || this.softDue?.isToday() || false;

  isPriority = () => {
    // Check softRepeat priority
    const repeatPriority = !!(
      this.softRepeat instanceof Time &&
      this.lastDone &&
      this.softRepeat.toDays() - this.daysSinceLastDone < 2
    );

    // Check softDue priority (due within 2 days or overdue)
    const duePriority = !!(this.softDue && this.daysTillSoftDue <= 2);

    return repeatPriority || duePriority;
  };

  get daysSinceLastDone() {
    return this.lastDone?.timeTo(new Date()).toDays() ?? 0;
  }

  get daysTillSoftDue() {
    if (!this.softDue) return Infinity;
    return new HumanDate(new Date()).timeTo(this.softDue.date).toDays();
  }

  get isOverdue() {
    return this.softDue && this.daysTillSoftDue < 0;
  }

  // Tailwind classes used dynamically: bg-red-500
  getSubtextClasses = () => {
    // Check softDue styling first (higher priority)
    if (this.softDue) {
      const days = this.daysTillSoftDue;
      if (days < 0) return 'text-red-500'; // Overdue
      if (days <= 1) return 'text-[#FF6A00]/70'; // Due soon
      return '';
    }

    // Fall back to softRepeat styling
    if (!(this.softRepeat instanceof Time) || !this.lastDone) return '';
    const days = this.softRepeat.toDays() - this.daysSinceLastDone;
    if (days < -4) return 'text-red-500';
    if (days < 4) return 'text-[#FF6A00]/70';

    return '';
  };

  get subtext() {
    // Show softDue info first if available
    if (this.softDue) {
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
    if (this.softRepeat && this.lastDone) {
      const rounded = Math.round(this.daysSinceLastDone);
      if (rounded === 0) return 'Done today';
      if (rounded === 1) return 'Done yesterday';
      return `Done ${rounded} days ago`;
    }

    return this.note;
  }

  onToggle = (newCompleted: boolean[]) => {
    if (newCompleted.every(Boolean)) {
      this.doneTimes = [...(this.doneTimes || []), new HumanDate(new Date())];
      console.log(this.doneTimes);
    } else {
      this.doneTimes = this.doneTimes?.filter((doneTime) => !doneTime.isToday());
    }

    this.lastDone = this.doneTimes?.[this.doneTimes.length - 1];
    console.log(this.lastDone);
  };

  renderEndContent = (updateTodo: (updates: Partial<Todo>) => void) => (
    <View className="flex-row items-center">
      {this.completed?.map((completed, index) => (
        <CheckBox
          key={index}
          checked={completed}
          classname={` ${index === 0 ? 'pl-24 -ml-24' : ''} ${
            index === (this.completed?.length || 0) - 1 ? 'pr-6 -mr-6' : ''
          }`}
          onToggle={() => {
            console.log('toggle');
            const newCompleted = [...(this.completed || [])];
            newCompleted[index] = !newCompleted[index];
            updateTodo({ completed: newCompleted });

            this.onToggle(newCompleted);
          }}
        />
      ))}
    </View>
  );
}
