import { useEffect, useRef, useState } from 'react';
import interact from 'interactjs';
import type { Task } from '../types';
import { addDays, clamp, dayIndex } from '../utils/dates';

type Props = {
  task: Task;
  chartStart: string;
  chartEnd: string;
  totalDays: number;
  dayWidth: number;
  onCommit: (fields: Partial<Pick<Task, 'startDate' | 'endDate'>>) => void;
};

export function TaskBar({ task, chartStart, chartEnd, totalDays, dayWidth, onCommit }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{ left: number; width: number } | null>(null);

  // Keep mutable drag state in a ref so interact.js listeners (which close over
  // the initial render) always see the current values without needing to be
  // re-bound on every state update.
  const stateRef = useRef({
    baseLeft: 0,
    baseWidth: 0,
    curLeft: 0,
    curWidth: 0,
    maxLeft: 0,
    task,
  });

  const baseLeft = dayIndex(chartStart, task.startDate) * dayWidth;
  const baseWidth =
    (dayIndex(chartStart, task.endDate) - dayIndex(chartStart, task.startDate) + 1) * dayWidth;

  // Sync the ref with the latest props on every render.
  stateRef.current.baseLeft = baseLeft;
  stateRef.current.baseWidth = baseWidth;
  stateRef.current.maxLeft = totalDays * dayWidth;
  stateRef.current.task = task;

  const left = drag?.left ?? baseLeft;
  const width = drag?.width ?? baseWidth;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const inst = interact(el)
      .draggable({
        // Don't start a drag when the user grabs a resize handle.
        ignoreFrom: '.resize-handle',
        listeners: {
          start() {
            const s = stateRef.current;
            s.curLeft = s.baseLeft;
            s.curWidth = s.baseWidth;
            el.classList.add('dragging');
            setDrag({ left: s.curLeft, width: s.curWidth });
          },
          move(event) {
            const s = stateRef.current;
            s.curLeft = clamp(s.curLeft + event.dx, 0, s.maxLeft - s.curWidth);
            setDrag({ left: s.curLeft, width: s.curWidth });
          },
          end() {
            const s = stateRef.current;
            el.classList.remove('dragging');
            const days = Math.max(1, Math.round(s.curWidth / dayWidth));
            const startIdx = clamp(Math.round(s.curLeft / dayWidth), 0, totalDays - days);
            const newStart = addDays(chartStart, startIdx);
            const newEnd = addDays(newStart, days - 1);
            setDrag(null);
            if (newStart !== s.task.startDate || newEnd !== s.task.endDate) {
              onCommit({ startDate: newStart, endDate: newEnd });
            }
          },
        },
      })
      .resizable({
        edges: { left: '.resize-handle.left', right: '.resize-handle.right' },
        margin: 6,
        listeners: {
          start() {
            const s = stateRef.current;
            s.curLeft = s.baseLeft;
            s.curWidth = s.baseWidth;
            el.classList.add('dragging');
            setDrag({ left: s.curLeft, width: s.curWidth });
          },
          move(event) {
            const s = stateRef.current;
            const dr = event.deltaRect ?? { left: 0, right: 0 };
            let newLeft = s.curLeft;
            let newWidth = s.curWidth;
            if (event.edges?.left) {
              newLeft = s.curLeft + dr.left;
              newWidth = s.curWidth - dr.left;
            }
            if (event.edges?.right) {
              newWidth = s.curWidth + dr.right;
            }
            // Constrain: minimum 1 day, stay within chart bounds.
            if (newWidth < dayWidth) {
              if (event.edges?.left) {
                newLeft = s.curLeft + (s.curWidth - dayWidth);
              }
              newWidth = dayWidth;
            }
            if (newLeft < 0) {
              newWidth += newLeft;
              newLeft = 0;
            }
            if (newLeft + newWidth > s.maxLeft) {
              newWidth = s.maxLeft - newLeft;
            }
            s.curLeft = newLeft;
            s.curWidth = newWidth;
            setDrag({ left: newLeft, width: newWidth });
          },
          end() {
            const s = stateRef.current;
            el.classList.remove('dragging');
            const startIdx = clamp(Math.round(s.curLeft / dayWidth), 0, totalDays - 1);
            const days = clamp(Math.round(s.curWidth / dayWidth), 1, totalDays - startIdx);
            const newStart = addDays(chartStart, startIdx);
            const newEnd = addDays(newStart, days - 1);
            setDrag(null);
            if (newStart !== s.task.startDate || newEnd !== s.task.endDate) {
              onCommit({ startDate: newStart, endDate: newEnd });
            }
          },
        },
      });

    return () => {
      inst.unset();
    };
  }, [chartStart, dayWidth, totalDays, onCommit]);

  return (
    <div
      ref={ref}
      className="task-bar"
      style={{ left: `${left}px`, width: `${width}px` }}
      title={`${task.title}: ${task.startDate} → ${task.endDate}`}
    >
      <div className="resize-handle left" />
      <span style={{ pointerEvents: 'none' }}>{task.title}</span>
      <div className="resize-handle right" />
    </div>
  );
}
