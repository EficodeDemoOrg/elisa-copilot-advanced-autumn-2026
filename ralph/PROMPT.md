# Ralph prompt

You are working on this repository in a Ralph loop: you will be invoked
repeatedly with this same prompt and are expected to make **one** small,
verifiable step of progress on each invocation.

Repo-wide conventions live in `.github/copilot-instructions.md` — follow them.

## Source of truth

- **`PRD.md`** is the product requirements document. It contains the full list
  of stories / tasks for this project, each with a checkbox:
  - `- [ ]` = not yet implemented
  - `- [x]` = implemented and verified
- **`progress.md`** is the running log of what has been done and what was
  learned. You append to it every iteration.

If `PRD.md` does not exist, stop immediately and do nothing — the loop has
nothing to work on.

## What to do each iteration

1. **Read `PRD.md`.** Identify all items still marked `- [ ]`.
2. **Stop condition:** If there are **no** unchecked items left in `PRD.md`,
   then:
   - Append a final entry to `progress.md` noting that all PRD items are
     complete.
   - Create an empty file named `STOP` in the repo root.
   - Exit without making any other changes. Do not invent new work.
3. **Otherwise, pick exactly ONE unchecked item** — the next logical one
   (respect any ordering or dependencies stated in `PRD.md`; otherwise take
   the topmost unchecked item).
4. **Implement that single item end-to-end.** Make the minimal, focused changes
   required. Do not start additional items in the same iteration.
5. **Verify your work.** Run the project's build and any existing tests
   (e.g. `npm run build`). Do not consider the item done if verification fails
   — fix it before proceeding.
6. **Mark the item complete in `PRD.md`** by changing its checkbox from
   `- [ ]` to `- [x]`. This step is mandatory: the loop relies on `PRD.md`
   being the accurate record of what is done.
7. **Append an entry to `progress.md`** (create the file with a top-level
   heading if it does not yet exist). The entry must include:
   - A timestamp and the title of the PRD item you completed.
   - A short summary of **what was implemented** (files touched, key changes).
   - **Anything significant noticed** during the iteration (surprises,
     gotchas, deviations from the plan).
   - **Lessons learned** that would help future iterations.
   - **Design decisions made** and the reasoning behind them.
   - Any **follow-up work** worth considering (do not act on it now; only note
     it).

## Rules

- Touch only what is needed for the chosen PRD item plus the required updates
  to `PRD.md` and `progress.md`.
- Never check off an item you did not actually implement and verify.
- Never remove or rewrite history in `progress.md` — only append.
- Do not add new requirements to `PRD.md` on your own. If you discover a gap,
  record it under "follow-up" in `progress.md` so a human can decide.
- Keep going across iterations **only as long as `PRD.md` has unchecked
  items.** Once all are checked, the very next iteration must hit the stop
  condition above and create the `STOP` file.
