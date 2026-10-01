import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import type { Chart, Task } from '../types';

export function useChart() {
  const [chart, setChart] = useState<Chart | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const c = await api.getChart();
      setChart(c);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateTimeline = useCallback(async (startDate: string, endDate: string) => {
    try {
      const c = await api.updateChart(startDate, endDate);
      setChart(c);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  const addTask = useCallback(async (title: string) => {
    try {
      const t = await api.createTask(title);
      setChart((prev) => (prev ? { ...prev, tasks: [...prev.tasks, t] } : prev));
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  const updateTask = useCallback(
    async (id: number, fields: Partial<Pick<Task, 'title' | 'startDate' | 'endDate'>>) => {
      // optimistic
      setChart((prev) =>
        prev
          ? { ...prev, tasks: prev.tasks.map((t) => (t.id === id ? { ...t, ...fields } : t)) }
          : prev,
      );
      try {
        const updated = await api.updateTask(id, fields);
        setChart((prev) =>
          prev ? { ...prev, tasks: prev.tasks.map((t) => (t.id === id ? updated : t)) } : prev,
        );
      } catch (e) {
        setError((e as Error).message);
        await refresh();
      }
    },
    [refresh],
  );

  const deleteTask = useCallback(
    async (id: number) => {
      setChart((prev) =>
        prev ? { ...prev, tasks: prev.tasks.filter((t) => t.id !== id) } : prev,
      );
      try {
        await api.deleteTask(id);
      } catch (e) {
        setError((e as Error).message);
        await refresh();
      }
    },
    [refresh],
  );

  return { chart, loading, error, updateTimeline, addTask, updateTask, deleteTask };
}
