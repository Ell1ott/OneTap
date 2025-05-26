export interface Time {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
}

export interface Task {
  id: string;
  title: string;
  emoji?: string;
  note?: string;
  repeat?: Time; // Also resets completion on todos
  tags?: string[];
}

export interface TaskCategory {
  id: string;
  title: string;
  subtext?: string;
  type: 'category';
  emoji?: string;
}

export interface Todo extends Task {
  subtext: string;
  type: 'todo';
  start?: Date;
  due?: Date;
  remindAt?: Date;
  softRepeat?: Time; // First repeats when finished
  completed?: boolean[];
  amount?: number;
  category?: string;
}

export interface Event extends Task {
  start: Date;
  end?: Date;
  cancelled?: boolean;
  type: 'event';
}
