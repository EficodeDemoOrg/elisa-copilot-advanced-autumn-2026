import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import { z } from 'zod';
import { repo } from './repo.js';
import { withinChart } from './validation.js';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');

const chartSchema = z
  .object({ startDate: isoDate, endDate: isoDate })
  .refine((v) => v.startDate <= v.endDate, { message: 'endDate must be >= startDate' });

const newTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  startDate: isoDate.optional(),
  endDate: isoDate.optional(),
});

const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    startDate: isoDate.optional(),
    endDate: isoDate.optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'No fields provided' });

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/chart', (_req, res) => {
    res.json(repo.getChart());
  });

  app.put('/api/chart', (req, res) => {
    const parsed = chartSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const chart = repo.getChart();
    // Clamp existing tasks into new range.
    const { startDate, endDate } = parsed.data;
    for (const t of chart.tasks) {
      let s = t.startDate;
      let e = t.endDate;
      if (s < startDate) s = startDate;
      if (e > endDate) e = endDate;
      if (s > endDate) s = endDate;
      if (e < startDate) e = startDate;
      if (s > e) s = e;
      if (s !== t.startDate || e !== t.endDate) {
        repo.updateTask(t.id, { startDate: s, endDate: e });
      }
    }
    repo.updateChart(startDate, endDate);
    res.json(repo.getChart());
  });

  app.post('/api/tasks', (req, res) => {
    const parsed = newTaskSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const chart = repo.getChart();
    const startDate = parsed.data.startDate ?? chart.startDate;
    const endDate = parsed.data.endDate ?? startDate;
    if (!withinChart(startDate, endDate, chart.startDate, chart.endDate)) {
      return res.status(400).json({ error: 'Task dates must be within chart range' });
    }
    const task = repo.createTask(parsed.data.title, startDate, endDate);
    res.status(201).json(task);
  });

  app.patch('/api/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
    const parsed = updateTaskSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const current = repo.getTask(id);
    if (!current) return res.status(404).json({ error: 'Not found' });
    const next = { ...current, ...parsed.data };
    const chart = repo.getChart();
    if (!withinChart(next.startDate, next.endDate, chart.startDate, chart.endDate)) {
      return res.status(400).json({ error: 'Task dates must be within chart range and start <= end' });
    }
    const updated = repo.updateTask(id, parsed.data);
    res.json(updated);
  });

  app.delete('/api/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
    const ok = repo.deleteTask(id);
    if (!ok) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
