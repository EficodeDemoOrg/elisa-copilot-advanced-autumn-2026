# Gantt Chart Copilot — Repository Instructions

Minimal full-stack Gantt chart app used as a basis for developer exercises. Keep changes small, focused, and consistent with existing patterns.

> **Note:** Anything under the `EXERCISES/` directory must always be excluded from the context. Do not read, search, or reference its contents unless the user explicitly requests it.

## Stack

- **Monorepo**: npm workspaces (`backend`, `frontend`) at the root.
- **Backend**: Node.js 20+, Express 4, TypeScript (ESM), `lowdb`, `zod`.
- **Frontend**: React 18, TypeScript, Vite 5, `interactjs`.
- **Storage**: Single JSON file at `backend/data/gantt.json` (no Docker, no external services).

## Conventions

- **TypeScript everywhere.** No plain `.js` source files. Use `import type { ... }` for type-only imports.
- **ESM only.** Both packages use `"type": "module"`. In backend imports, include the `.js` extension when importing local files (e.g. `import { repo } from './repo.js'`) — required for Node ESM resolution of compiled output.
- **Dates are ISO `YYYY-MM-DD` strings**, never `Date` objects, in API payloads, DB rows, and shared types.
- **Shared shapes (`Chart`, `Task`)** are duplicated intentionally between backend (`backend/src/repo.ts`) and frontend (`frontend/src/types.ts`). Keep them in sync when fields change.
- **API contract**: REST under `/api`, JSON request/response bodies, `camelCase` fields (e.g. `startDate`, `endDate`). The Vite dev server proxies `/api` → `http://localhost:3107`.

## Workflow

- Run everything from the repo root: `npm install`, `npm run dev` (concurrent backend + frontend), `npm run build`, `npm run start`.
- Use workspace flags for package-scoped commands: `npm run <script> -w backend` / `-w frontend`. Do not `cd` into a workspace to install dependencies — run `npm install <pkg> -w <workspace>` from the root.
- To reset data, delete `backend/data/gantt.json`; the backend recreates it with a default chart on startup.

## Implementation guidance

- Match the existing code style: small functions, no unnecessary abstractions, no docstrings/comments on unchanged code.
- Validate at boundaries only (HTTP requests in the backend). Trust internal callers.
- Don't add error handling for impossible cases.

## Commits

- All commit messages must follow Conventional Commits.