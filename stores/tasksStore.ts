import { create } from 'zustand';
import { Todo, Event, TaskCategory, Task } from 'components/Todos/classes';
import { PartialDate, Time } from 'components/Todos/types';

interface TasksStore {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updater: (task: Task) => Task) => void;
  removeTask: (taskId: string) => void;
  toggleTaskCompleted: (taskId: string, index?: number) => void;
}

const createInitialTasks = (): Task[] => [
  new Todo({
    id: '1',
    title: 'Walk the dog',
    note: 'Twice every day',
    completed: [true, false],
    repeat: new Time({
      days: 1,
    }),
    amount: 2,
    end: new PartialDate({
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      day: new Date().getDate(),
    }),
  }),
  new Event({
    id: '2',
    title: 'Volleyball practice',
    start: new Date(new Date().setHours(17, 0, 0, 0)),
  }),
  new Todo({
    id: '4',
    title: 'Clean Room',
    doneTimes: [new PartialDate(new Date(new Date().setDate(23)))],
    // note: 'Done 4 days ago',
    softRepeat: true,
    completed: [false],
  }),
  new Todo({
    id: '5',
    title: 'Catch up with Jake',
    note: 'Every 2 weeks',
    end: undefined,
    remindAt: undefined,
    repeat: undefined,
    softRepeat: new Time({
      weeks: 2,
    }),
    lastDone: new PartialDate(new Date(new Date().setDate(3))),
    emoji: '👋',
  }),
  new TaskCategory({
    id: '2',
    title: 'Groceries',
    note: 'Recommended, 9 items',
  }),
  new TaskCategory({
    id: '3',
    title: 'Homework',
    note: '5 total, 3 urgent',
  }),
];

export const useTasksStore = create<TasksStore>((set, get) => ({
  tasks: createInitialTasks(),

  setTasks: (tasks) => set({ tasks }),

  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),

  updateTask: (taskId, updater) =>
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === taskId ? updater(task) : task)),
    })),

  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),

  toggleTaskCompleted: (taskId, index = 0) =>
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id === taskId && task instanceof Todo && task.completed) {
          const newCompleted = [...task.completed];
          newCompleted[index] = !newCompleted[index];
          const updatedTodo = new Todo({
            id: task.id,
            title: task.title,
            note: task.note,
            emoji: task.emoji,
            repeat: task.repeat,
            tags: task.tags,
            start: task.start,
            end: task.end,
            remindAt: task.remindAt,
            lastDone: task.lastDone,
            doneTimes: task.doneTimes,
            softRepeat: task.softRepeat,
            softDue: task.softDue,
            completed: newCompleted,
            amount: task.amount,
            category: task.category,
          });
          updatedTodo.onToggle(newCompleted);
          return updatedTodo;
        }
        return task;
      }),
    })),
}));
