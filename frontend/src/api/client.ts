import type { Chart, Task } from '../types';

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  getChart: (): Promise<Chart> => fetch('/api/chart').then((r) => handle<Chart>(r)),

  updateChart: (startDate: string, endDate: string): Promise<Chart> =>
    fetch('/api/chart', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ startDate, endDate }),
    }).then((r) => handle<Chart>(r)),

  createTask: (title: string): Promise<Task> =>
    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title }),
    }).then((r) => handle<Task>(r)),

  updateTask: (
    id: number,
    fields: Partial<Pick<Task, 'title' | 'startDate' | 'endDate'>>,
  ): Promise<Task> =>
    fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(fields),
    }).then((r) => handle<Task>(r)),

  deleteTask: (id: number): Promise<void> =>
    fetch(`/api/tasks/${id}`, { method: 'DELETE' }).then((r) => handle<void>(r)),
};
