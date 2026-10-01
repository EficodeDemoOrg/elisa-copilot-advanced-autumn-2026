# 1. 🪝 Hooks Exercise

In these exercises, you will:
- Enable Copilot hooks for lifecycle events
- Log session activity and user prompts
- Create an audit trail for observability

Hooks are scripts Copilot runs on lifecycle events (`sessionStart`, `sessionEnd`, `userPromptSubmitted`, `preToolUse`, `postToolUse`, `errorOccurred`), defined in `.github/hooks/*.json`. Use them for observability, automation, and guardrails.

A starter file is included at [.github/hooks/hook_demo.json](../.github/hooks/hook_demo.json) with a commented-out `sessionStart` entry. Each entry provides cross-platform `bash` / `powershell` commands, a `cwd`, and a `timeoutSec`.

## 📋 Exercise 1.1: Hooks

1. **Enable the starter hook.** Uncomment the `sessionStart` block in `hook_demo.json`, start a fresh Copilot Chat session, and confirm a new line appears in `logs/session.log`.

1. **Log every prompt.** Add a `userPromptSubmitted` hook that appends a timestamped line to `logs/session.log`. Ask Copilot to help:
    ```
    Add a userPromptSubmitted hook to #file:hook_demo.json that appends
    a timestamped line to logs/session.log, with bash and powershell variants.
    ```

1. **Close the loop.** Add a `sessionEnd` hook that appends `Session ended: ...` to `logs/session.log`. End the session and review the full audit trail.

