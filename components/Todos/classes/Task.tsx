import AppText from 'components/AppText';
import { Time } from '../types/Time';

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
