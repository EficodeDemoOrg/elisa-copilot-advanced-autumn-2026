import { db, type Task } from './db.js';

export type { Task } from './db.js';

export type Chart = {
  startDate: string;
  endDate: string;
  tasks: Task[];
};

const sortTasks = (tasks: Task[]): Task[] =>
  [...tasks].sort((a, b) => a.position - b.position || a.id - b.id);

export const repo = {
  getChart(): Chart {
    return {
      startDate: db.data.chart.startDate,
      endDate: db.data.chart.endDate,
      tasks: sortTasks(db.data.tasks),
    };
  },

  updateChart(startDate: string, endDate: string): void {
    db.data.chart.startDate = startDate;
    db.data.chart.endDate = endDate;
    db.write();
  },

  createTask(title: string, startDate: string, endDate: string): Task {
    const maxPos = db.data.tasks.reduce((m, t) => Math.max(m, t.position), -1);
    const task: Task = {
      id: db.data.nextTaskId,
      title,
      startDate,
      endDate,
      position: maxPos + 1,
    };
    db.data.nextTaskId += 1;
    db.data.tasks.push(task);
    db.write();
    return task;
  },

  getTask(id: number): Task | undefined {
    return db.data.tasks.find((t) => t.id === id);
  },

  updateTask(id: number, fields: Partial<Pick<Task, 'title' | 'startDate' | 'endDate'>>): Task | undefined {
    const task = db.data.tasks.find((t) => t.id === id);
    if (!task) return undefined;
    Object.assign(task, fields);
    db.write();
    return task;
  },

  deleteTask(id: number): boolean {
    const idx = db.data.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    db.data.tasks.splice(idx, 1);
    db.write();
    return true;
  },
};
