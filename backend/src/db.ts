import { JSONFileSyncPreset } from 'lowdb/node';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export type Task = {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  position: number;
};

export type Data = {
  chart: { startDate: string; endDate: string };
  tasks: Task[];
  nextTaskId: number;
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = resolve(__dirname, '../data/gantt.json');
mkdirSync(dirname(dbPath), { recursive: true });

const today = new Date();
const plus30 = new Date(today);
plus30.setDate(today.getDate() + 30);
const iso = (d: Date) => d.toISOString().slice(0, 10);

const defaultData: Data = {
  chart: { startDate: iso(today), endDate: iso(plus30) },
  tasks: [],
  nextTaskId: 1,
};

export const db = JSONFileSyncPreset<Data>(dbPath, defaultData);
