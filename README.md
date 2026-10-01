# 🤖 GitHub Copilot Exercises

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/EficodeDemoOrg/copilot-training-advanced-TEMPLATE)

This repository is a hands-on playground for **GitHub Copilot exercises**.

The exercises live in the [exercises](exercises/) directory:

- [01-hooks.md](exercises/01-hooks.md)
- [02-agent-plugins.md](exercises/02-agent-plugins.md)
- [03-agent-package-manager.md](exercises/03-agent-package-manager.md)
- [04-plan-mode-and-CLI.md](exercises/04-plan-mode-and-CLI.md)
- [05-ralph-loops.md](exercises/05-ralph-loops.md)
- [06-spec-driven-development.md](exercises/06-spec-driven-development.md)

The exercises are performed against the small full-stack **Gantt chart application** included in this repo. The app is intentionally simple so you can focus on practicing Copilot workflows rather than learning a complex codebase.

> No prior knowledge of TypeScript or Node.js is required for the exercises.

---

# 📊 The Gantt Chart App

A full-stack Gantt chart app for planning and tracking tasks across time, used as the playground for the exercises above.

## 🛠️ Technology stack

- 🎨 **Frontend**: React + TypeScript + Vite
- ⚙️ **Backend**: Express + TypeScript
- 💾 **Storage**: JSON file via `lowdb` (single-file DB)

## ✅ Requirements

- Node.js **20+**

## 🚀 Getting started

### Option A — local development

Requirements: Node.js **20+**

```bash
npm install
npm run dev
```

Then open http://localhost:5177.

The Vite dev server proxies `/api` requests to the backend at http://localhost:3107.

### Option B — GitHub Codespaces

Click the badge at the top of this README (or go to **Code → Codespaces → Create codespace on main**). Dependencies are installed automatically; just run:

```bash
npm run dev
```

VS Code will prompt you to open the forwarded port 5177 in your browser.

## 📁 Project layout

```
backend/   Express + lowdb REST API
frontend/  Vite + React UI
```

## 📜 Scripts

- `npm run dev` — runs backend and frontend concurrently
- `npm run build` — builds both packages
- `npm run start` — starts the built backend (serves the API only)

## 🧪 Tests

Backend unit tests use [Vitest](https://vitest.dev/):

```bash
npm test -w backend           # run once
npm run test:watch -w backend # watch mode
```

## 🗑️ Resetting the data

The database lives at `backend/data/gantt.json`. Delete that file to start fresh; the backend will recreate it with a default chart on the next start.
