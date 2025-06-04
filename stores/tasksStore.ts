import { create } from 'zustand';
import { Todo, Event, TaskCategory, Task } from 'components/Todos/classes';
import { HumanDate, PartialDate, Time } from 'components/Todos/types';

interface TasksStore {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updater: (task: Task) => Task) => void;
  removeTask: (taskId: string) => void;
  toggleTaskCompleted: (taskId: string, index?: number) => void;
}

const createInitialTasks = (): Task[] => [
  // new Todo({
  //   id: '1',
  //   title: 'Walk the dog',
  //   note: 'Twice every day',
  //   completed: [true, false],
  //   repeat: new Time({
  //     days: 1,
  //   }),
  //   amount: 2,
  //   end: new HumanDate(),
  // }),
  // new Event({
  //   id: '2',
  //   title: 'Volleyball practice',
  //   start: new HumanDate(new Date(new Date().setHours(17, 0, 0, 0)), true),
  // }),
  // new Todo({
  //   id: '4',
  //   title: 'Clean Room',
  //   doneTimes: [new HumanDate(new Date(new Date().setDate(23)), true)],
  //   // note: 'Done 4 days ago',
  //   softRepeat: true,
  //   completed: [false],
  // }),
  // new Todo({
  //   id: '5',
  //   title: 'Catch up with Jake',
  //   note: 'Every 2 weeks',
  //   end: undefined,
  //   remindAt: undefined,
  //   repeat: undefined,
  //   softRepeat: new Time({
  //     weeks: 2,
  //   }),
  //   lastDone: new HumanDate(new Date(new Date().setDate(3))),
  //   emoji: '👋',
  // }),
  // new Todo({
  //   id: '6',
  //   title: 'Buy milk',
  //   note: 'Get the organic one',
  //   completed: [false],
  //   category: 'groceries',
  //   emoji: '🥛',
  // }),
  // new Todo({
  //   id: '7',
  //   title: 'Get fresh vegetables',
  //   note: 'Carrots, broccoli, spinach',
  //   completed: [false],
  //   category: 'groceries',
  //   emoji: '🥬',
  // }),
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
          task.completed = newCompleted;

          task.onToggle(newCompleted);
          return task;
        }
        return task;
      }),
    })),
}));
