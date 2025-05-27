import { Task } from './Task';

export class TaskCategory extends Task {
  constructor(data: Partial<TaskCategory> & { id: string; title: string }) {
    super(data);
  }

  isPriority = () => true;
}
