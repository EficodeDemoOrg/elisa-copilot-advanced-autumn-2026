#!/usr/bin/env bash
# ralph.sh — run a "Ralph loop" with GitHub Copilot CLI.
#
# The Ralph loop (popularised by Geoffrey Huntley) is the simple idea of
# repeatedly handing the same prompt to a coding agent until the work is done.
# Each iteration the agent looks at the current repo state, makes some progress,
# and exits; the next iteration picks up from where it left off.
#
# Usage (run from the repo root):
#   ralph/scripts/ralph.sh                       # use ralph/PROMPT.md, loop forever
#   ralph/scripts/ralph.sh path/to/prompt.md     # use a custom prompt file
#   MAX_ITER=10 ralph/scripts/ralph.sh           # stop after 10 iterations
#   MODEL=claude-sonnet-4.5 ralph/scripts/ralph.sh
#
# Stop conditions (any one ends the loop):
#   * Ctrl-C
#   * MAX_ITER iterations reached (if set)
#   * A file named STOP exists in the repo root
#
# Logs from each iteration are written to ralph/.logs/iteration-NNN.log

set -uo pipefail

# Resolve the ralph/ directory (parent of this script's directory) so the
# script can be invoked from anywhere — typically the repo root — and still
# find PROMPT.md, PRD.md, progress.md, and write logs next to them.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RALPH_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

PROMPT_FILE="${1:-$RALPH_DIR/PROMPT.md}"
MODEL="${MODEL:-}"
MAX_ITER="${MAX_ITER:-5}"   # 0 = unlimited
SLEEP_BETWEEN="${SLEEP_BETWEEN:-2}"

if ! command -v copilot >/dev/null 2>&1; then
  echo "error: 'copilot' CLI not found in PATH." >&2
  echo "Install it from https://github.com/github/copilot-cli" >&2
  exit 1
fi

if [[ ! -f "$PROMPT_FILE" ]]; then
  echo "error: prompt file not found: $PROMPT_FILE" >&2
  echo "Create one (e.g. PROMPT.md) describing the task you want Ralph to grind on." >&2
  exit 1
fi

LOG_DIR="$RALPH_DIR/.logs"
mkdir -p "$LOG_DIR"

copilot_args=(--allow-all-tools --autopilot)
if [[ -n "$MODEL" ]]; then
  copilot_args+=(--model "$MODEL")
fi

iter=0
trap 'echo; echo "Ralph stopped after $iter iteration(s)."; exit 0' INT TERM

echo "Ralph loop starting."
echo "  prompt:   $PROMPT_FILE"
echo "  model:    ${MODEL:-<copilot default>}"
echo "  max:      ${MAX_ITER:-unlimited} iteration(s)"
echo "  stop:     create a file named STOP to exit cleanly"
echo

while :; do
  if [[ -f STOP ]]; then
    echo "STOP file found — exiting after $iter iteration(s)."
    exit 0
  fi

  iter=$((iter + 1))
  log_file="$LOG_DIR/iteration-$(printf '%03d' "$iter").log"
  echo "── iteration $iter ── $(date '+%Y-%m-%d %H:%M:%S') ── log: $log_file"

  prompt_text="$(cat "$PROMPT_FILE")"

  copilot "${copilot_args[@]}" --yolo --autopilot -p "$prompt_text" 2>&1 | tee "$log_file"
  status=${PIPESTATUS[0]}
  echo "── iteration $iter exit=$status"

  if [[ "$MAX_ITER" -gt 0 && "$iter" -ge "$MAX_ITER" ]]; then
    echo "Reached MAX_ITER=$MAX_ITER — exiting."
    exit 0
  fi

  sleep "$SLEEP_BETWEEN"
done
