# 4. 🚀 Plan mode and Copilot CLI Exercices

In these exercises, you will:
- Use Plan mode to design features iteratively
- Get feedback from the rubber-duck critic agent
- Refine plans before implementation

## 🗺️ Exercise 4.1: Plan Mode

In this exercise we use Copilot CLI's **Plan mode** to design a feature, then use the experimental **rubber-duck** agent to get a second-opinion critique on the plan from a different model. Only after revising the plan based on that feedback do we let Copilot implement it.

The feature we'll plan and build is **task reordering by drag-and-drop**.

### Why rubber-duck?

The rubber-duck agent (added in Copilot CLI 1.0.42, available behind `/experimental`) reviews the current plan with a *complementary model* from a different model family.

### Steps

1. Make sure you have the latest Copilot CLI:
    ```bash
    copilot --version
    copilot update   # or: npm i -g @github/copilot@latest
    ```

1. From the repo root, launch the CLI:
    ```bash
    copilot
    ```

1. Enable experimental features (this unlocks the rubber-duck / critic agent):
    ```
    /experimental on
    ```
    The CLI restarts automatically. Run `/experimental` afterwards to confirm the feature list.

1. Enter Plan mode and describe the feature. Either press `Shift+Tab` until the mode indicator shows **Plan**, or use the slash command in one go:
    ```
    /plan Enable reordering tasks within a chart by dragging task rows vertically.
    ```
    Plan mode will analyze the codebase, ask clarifying questions, and produce a structured plan instead of writing code.

1. Answer any clarifying questions Copilot may asks.

1. **Do not accept the plan yet.** When the plan approval menu appears, dismiss it (Esc) so the plan stays in context for review.

1. Ask Copilot to critique the plan. This is the step that triggers the rubber-duck / critic review:
    ```
    Critique this plan with the rubber-duck agent.
    ```
    A complementary model now reviews the plan and reports its findings inline. Read the critique carefully.

1. Revise the plan based on the critique. For example:
    ```
    Update the plan to address the rubber-duck feedback. Specifically: <one or two of the most useful points from the critique, in your own words>.
    ```
    You can iterate: critique again, revise again, until the plan looks solid.

1. Once you're happy, accept the plan from the approval menu (or press `Ctrl+Y` to edit it in your terminal editor first). Continue implementation in the same session, or restart in autopilot for hands-off execution:
    ```bash
    copilot --autopilot --allow-all --max-autopilot-continues 10
    ```
    Then:
    ```
    Implement the approved plan that's saved in this session's memory.
    ```

1. After Copilot finishes, verify manually:
    ```bash
    npm run dev
    ```
    Try dragging tasks vertically in the chart, refresh the browser, and confirm the new order persists. Run the tests:
    ```bash
    npm test -w backend
    ```

### Reflection

- Did the rubber-duck critique surface anything your initial plan missed?
- How did the revised plan compare to the original in terms of completeness and risk?
- Was the implementation closer to "first try works" because of the planning round?
