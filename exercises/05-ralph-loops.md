# 5. 🔁 Ralph Loop Exercise

In these exercises, you will:
- Create a PRD with implementation tasks
- Run automated iterative loops with Copilot CLI
- Track progress across multiple agent iterations

Ralph Loop is a technique where an AI coding agent is invoked repeatedly with the same prompt, making one small verifiable step of progress per iteration until all work is done.

All files required by the Ralph loop are already included:

| File | Purpose |
|---|---|
| `PROMPT.md` | The agent prompt handed to Copilot on every iteration. Describes the loop's rules and workflow. You **DO NOT** need change this, nor should you.|
| `PRD.md` | Product Requirements Document. The agent reads this to find unchecked tasks and marks them done when complete. In this exercise, we will use the plan mode to create contents for this file.|
| `progress.md` | Running log appended by the agent each iteration — what was done, decisions made, and lessons learned. |
| `scripts/ralph.sh` | The bash script that drives the loop, calling the Copilot CLI repeatedly until all work is done. |
| `.ralph/` | Per-iteration log files written by the script (created at runtime). |

## 🤖 Exercise 5.1: About the Ralph Loop script

`scripts/ralph.sh` runs the loop by calling `copilot` (GitHub Copilot CLI) repeatedly with the contents of `PROMPT.md` as the prompt. Each iteration the agent inspects the current repo state, implements exactly one unchecked PRD item, marks it done, updates `progress.md`, and exits. The script then starts a fresh iteration.

> **Windows users:** you can use e.g. Git Bash to run the script.

**Usage:**

```bash
# Default: use ./PROMPT.md, run up to 5 iterations
ralph/scripts/ralph.sh

# Limit iterations or change the model
MAX_ITER=5 ralph/scripts/ralph.sh
MODEL=claude-sonnet-4.5 ralph/scripts/ralph.sh
```

**Key defaults:**

| Variable | Default | Description |
|---|---|---|
| `MAX_ITER` | `5` | Maximum number of iterations before stopping (`0` = unlimited) |
| `MODEL` | Copilot default | The model passed to the Copilot CLI |
| `SLEEP_BETWEEN` | `2` | Seconds to wait between iterations |

**Stop conditions** (any one ends the loop):
- `Ctrl-C`
- `MAX_ITER` iterations reached
- A file named `STOP` exists in the repo root (the agent creates this when all PRD items are checked off)

Iteration logs are written to `.ralph/iteration-NNN.log`.

## 📋 Exercise 5.2: Steps

1. **Familiarize yourself** with `PROMPT.md` and `scripts/ralph.sh`. Notice that the prompt only describes the agent's workflow — it does not hard-code any specific feature. All requirements live in `PRD.md`.

1. **Create a feature plan** in `PRD.md` using Copilot in Plan mode. Ask Copilot to plan a couple of new features, using the checkbox task format expected by `PROMPT.md` (`- [ ] Task description`). An example prompt:
   ```markdown
   Create an implementation plan for a feature that enables users to reorder the tasks in the Gantt chart simply by dragging the rows vertically. Create the plan using the format expected by #file:PROMPT.md 
   ```
1. **Save the plan.**
Once the plan looks good, ask Copilot to open it in an editor and copy the contents into `PRD.md`.

1. **Start the Ralph loop.**
   With `PRD.md` ready, kick off the implementation by running the loop script. You can *configure the model and iteration limit* via environment variables.

   ```bash
   scripts/ralph.sh
   ```

   By default the loop runs for up to **5 iterations**. If your plan has more tasks, increase the limit with `MAX_ITER` or simply restart the script. 

1. **Follow the progress.**
The script prints status information to stdout for each iteration.

   Watch how the agent:
      - Starts a new Copilot session with fresh context after each iteration
      - Ticks off completed items in `PRD.md`
      - Appends entries to `progress.md`
      - Creates `STOP` when all work is done
      - Saves detailed logs in `.ralph/`

1. **Try the finished app:**

   ```bash
   npm run dev
   ```
