---
description: "Use when editing the React + Vite frontend in frontend/. Covers component style, hooks, API client usage, optimistic updates, and interact.js drag/resize patterns."
applyTo: "frontend/**"
---

# Frontend Instructions

React 18 + TypeScript + Vite 5. No state library, no CSS framework, no component library — plain React, hand-written CSS in `src/styles.css`, `interactjs` for drag/resize.

## Structure

- `src/App.tsx` — top-level composition; pulls state from `useChart` and passes callbacks down.
- `src/hooks/useChart.ts` — single source of truth for chart state and all API calls. Components never call `api.*` directly.
- `src/api/client.ts` — thin `fetch` wrapper. Uses relative `/api/...` URLs (proxied by Vite to the backend in dev).
- `src/components/` — function components only, named exports, props typed inline as `type Props = { ... }`.
- `src/types.ts` — shared `Chart` / `Task` types. Mirrors backend shapes; update in lockstep.
- `src/utils/dates.ts` — date math on ISO `YYYY-MM-DD` strings (`addDays`, `daySpan`, `dayIndex`, `parseDate`, `clamp`, `isWeekend`).

## Conventions

- Function components with named exports (`export function GanttChart(...)`). No default exports for components.
- Dates are ISO `YYYY-MM-DD` strings end-to-end. Use helpers in `utils/dates.ts` instead of new `Date()` arithmetic. When parsing, treat values as UTC (see `parseDate`).
- Memoize derived arrays/objects with `useMemo`; wrap callbacks passed into effects or third-party libs with `useCallback`.
- Optimistic UI: mutations in `useChart` update local state first, then call the API, and re-`refresh()` on failure (see `updateTask`/`deleteTask`). Follow this pattern for new mutations.
- Errors surface via the `error` state in `useChart`; don't `alert()` or `throw` from event handlers.

## Styling

- Add styles to `src/styles.css`. Reuse existing CSS variables (e.g. `--day-width`, `--task-color-*`).
- When a layout constant is shared between JS and CSS (like `DAY_WIDTH` in `GanttChart.tsx`), keep both in sync and note it with a brief comment.

## Drag & resize (interact.js)

- Initialize `interact(el)` inside a `useEffect` and return `inst.unset()` from the cleanup.
- Keep mutable per-drag values in a `useRef` object (see `TaskBar.tsx`'s `stateRef`) so listeners closed over the initial render still see current props.
- Show transient drag state via local `useState`; commit final values with the `onCommit` callback only on `end`, and only if they actually changed.
- Constrain to chart bounds and a 1-day minimum inside the `move` handler.

## Don'ts

- No Redux/Zustand/Recoil/React Query — `useChart` is the state layer.
- Don't hardcode backend URLs in fetch calls; always use relative `/api/...` paths.
