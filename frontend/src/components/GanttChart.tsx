import { useEffect, useMemo, useRef } from 'react';
import type { Chart, Task } from '../types';
import { addDays, daySpan, isWeekend, parseDate } from '../utils/dates';
import { TaskBar } from './TaskBar';

const DAY_WIDTH = 36; // keep in sync with --day-width in styles.css

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

type Props = {
  chart: Chart;
  onAddTask: (title: string) => void;
  onUpdateTask: (id: number, fields: Partial<Pick<Task, 'title' | 'startDate' | 'endDate'>>) => void;
  onDeleteTask: (id: number) => void;
};

export function GanttChart({ chart, onAddTask, onUpdateTask, onDeleteTask }: Props) {
  const totalDays = daySpan(chart.startDate, chart.endDate);
  const days = useMemo(
    () => Array.from({ length: totalDays }, (_, i) => addDays(chart.startDate, i)),
    [chart.startDate, totalDays],
  );

  // After clicking "+", focus & select the newly appended row's title input
  // so the user can immediately type the real name without any popup.
  const lastInputRef = useRef<HTMLInputElement>(null);
  const taskCount = chart.tasks.length;
  const pendingFocusCount = useRef<number | null>(null);
  useEffect(() => {
    if (pendingFocusCount.current !== null && taskCount > pendingFocusCount.current && lastInputRef.current) {
      lastInputRef.current.focus();
      lastInputRef.current.select();
      pendingFocusCount.current = null;
    }
  }, [taskCount]);

  // Group consecutive days by month for the header's month row.
  const months = useMemo(() => {
    const groups: { label: string; days: number }[] = [];
    for (const iso of days) {
      const d = parseDate(iso);
      const label = `${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
      const last = groups[groups.length - 1];
      if (last && last.label === label) last.days += 1;
      else groups.push({ label, days: 1 });
    }
    return groups;
  }, [days]);

  const laneStyle = {
    backgroundSize: `${DAY_WIDTH}px 100%`,
  } as React.CSSProperties;

  const handleAdd = () => {
    pendingFocusCount.current = taskCount;
    onAddTask('New task');
  };

  return (
    <div className="gantt" style={{ ['--day-width' as string]: `${DAY_WIDTH}px` }}>
      <div className="gantt-header">
        <div className="corner">
          <span>Task</span>
          <button
            className="add-task-btn"
            title="Add task"
            aria-label="Add task"
            onClick={handleAdd}
          >
            +
          </button>
        </div>
        <div className="timeline" style={{ width: `${totalDays * DAY_WIDTH}px` }}>
          <div className="months">
            {months.map((m, i) => (
              <div
                key={`${m.label}-${i}`}
                className="month"
                style={{ width: `${m.days * DAY_WIDTH}px` }}
                title={m.label}
              >
                {m.label}
              </div>
            ))}
          </div>
          <div className="days">
            {days.map((d) => (
              <div key={d} className={`day ${isWeekend(d) ? 'weekend' : ''}`} title={d}>
                {Number(d.slice(8, 10))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {chart.tasks.length === 0 ? (
        <div className="empty-state">No tasks yet. Click the “+” button to add one.</div>
      ) : (
        chart.tasks.map((task, i) => (
          <div
            className="gantt-row"
            key={task.id}
            style={{ ['--task-color' as string]: `var(--task-color-${(i % 5) + 1})` }}
          >
            <div className="label">
              <input
                ref={i === chart.tasks.length - 1 ? lastInputRef : undefined}
                defaultValue={task.title}
                title="Click to edit"
                onFocus={(e) => e.currentTarget.select()}
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  if (v && v !== task.title) onUpdateTask(task.id, { title: v });
                  else e.target.value = task.title;
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                  if (e.key === 'Escape') {
                    (e.target as HTMLInputElement).value = task.title;
                    (e.target as HTMLInputElement).blur();
                  }
                }}
              />
              <button
                className="delete-btn"
                title="Delete task"
                aria-label={`Delete ${task.title}`}
                onClick={() => onDeleteTask(task.id)}
              >
                ×
              </button>
            </div>
            <div
              className="lane"
              style={{ ...laneStyle, width: `${totalDays * DAY_WIDTH}px`, position: 'relative' }}
            >
              <TaskBar
                task={task}
                chartStart={chart.startDate}
                chartEnd={chart.endDate}
                totalDays={totalDays}
                dayWidth={DAY_WIDTH}
                onCommit={(fields) => onUpdateTask(task.id, fields)}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
