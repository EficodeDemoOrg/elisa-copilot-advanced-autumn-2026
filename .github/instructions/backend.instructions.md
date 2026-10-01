---
description: "Use when editing the Express + lowdb backend in backend/. Covers route handler style, zod validation, repo/db layering, and ESM import rules."
applyTo: "backend/**"
---

# Backend Instructions

Express 4 + TypeScript (ESM) + `lowdb` + `zod`. Single-process, synchronous JSON-file store — no async DB layer.

## Layering

- `src/index.ts` — boots the server. Keep it tiny.
- `src/app.ts` — builds the Express app, declares routes, validates input with `zod`, enforces business rules.
- `src/repo.ts` — only place that touches `db.data`. Exposes a typed `repo` object that returns domain types (`Chart`, `Task`).
- `src/db.ts` — opens the lowdb JSON file via `JSONFileSyncPreset`, declares the `Data` shape and `Task` type, seeds default chart.

Keep these boundaries: route handlers must not read/write `db.data` directly, and `repo` must not know about HTTP.

## Routes & validation

- All API routes live under `/api` and return JSON. Use status codes `200`, `201`, `204`, `400`, `404`, `500`.
- Validate every request body with a `zod` schema and `safeParse`. On failure return `res.status(400).json({ error: parsed.error.flatten() })`.
- Validate IDs from `req.params` with `Number.isInteger` before use.
- Dates are ISO `YYYY-MM-DD` strings. Reuse the `isoDate` regex schema. Never accept or return `Date` objects.
- Enforce chart-range invariants in the route layer (see `withinChart`); the repo trusts its inputs.

## Database

- Use the synchronous lowdb API (`db.data`, `db.write()`). Don't introduce async wrappers, ORMs, or migration tools.
- Mutations must call `db.write()` before returning so changes are persisted.
- Schema changes go in the `Data` type in `src/db.ts`. New optional fields read fine from older files; for required fields, extend `defaultData` and consider lazy backfill on read.

## ESM specifics

- Local imports must include the `.js` extension (e.g. `import { repo } from './repo.js'`) so the compiled output resolves under Node ESM.
- Use `import type` for type-only imports from `express` (`type Request`, `type Response`, `type NextFunction`).
