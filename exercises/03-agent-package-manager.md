# 3. 📦 APM Exercises

In these exercises, you will:
- Install and manage APM packages
- Configure agent and skill dependencies
- Create and distribute your own APM package

APM, the Agent Package Manager, enables versioning, packaging, and distribution of agentic primitives (custom agents, skills, instructions, prompt files, and MCP server configurations) across projects.

For details, see the official [APM documentation](https://microsoft.github.io/apm/).

## ⚙️ Exercise 3.1: APM Setup

Install APM by following the [installation instructions](https://microsoft.github.io/apm/quickstart/).

## 📥 Exercise 3.2: Install an APM package

Let's use APM to install an APM package.

1. Investigate the [repository for the Microsoft example APM package](https://github.com/microsoft/apm-sample-package). Open its `apm.yml` file and note the dependency on a skill from the Awesome Copilot repository.
1. Install the Microsoft example APM package:
    ```bash
    apm install microsoft/apm-sample-package#v1.0.0 --target copilot
    ```
1. Inspect the files created in the `skills` and `agents` folders. You should now be able to use the agents and skills installed by APM.
1. Notice that APM also created an `apm.yml` file to track APM dependencies. You could commit this file to the repository to share the same set of dependencies across the team.

## ➕ Exercise 3.3: Add more dependencies

Let's add another dependency to the APM configuration file.

1. Open `apm.yml` in this project.
1. Add the following line under `dependencies.apm`:
    ```yml
    - eficodedemoorg/demo-apm-package
    ```
1. Run `apm install`. Did APM install any additional agents and skills?
1. Now let's add an MCP server to the file. Update the file to look like this:
    ```yml
    author: ...
    dependencies:
        apm:
        - eficodedemoorg/demo-apm-package
        - microsoft/apm-sample-package#v1.0.0
        mcp:
        - microsoft/playwright-mcp
    ```
1. Run `apm install` and check `.vscode/mcp.json`: it should now contain the Playwright MCP configuration.

## 🛠️ Exercise 3.4: Creating an APM package

An APM package can be released simply by creating a Git repository with a specific structure.

1. Create a new directory called `my-apm-package`.
1. Add the following subdirectories:
    - `.apm`
    - `.apm/skills`
    - `.apm/agents`
    - `.apm/instructions`
1. Add one skill, one agent, and one instructions file to their respective directories.
1. Create an `apm.yml` file with the following contents:
    ```yml
    name: my-apm-package
    version: 1.0.0
    description: My APM Package
    author: John Doe
    targets:
    - copilot
    dependencies:
        apm:
            - eficodedemoorg/demo-apm-package
        mcp:
            - microsoft/playwright-mcp
    ```
1. This repository could now be pushed to GitHub and shared as a dependency across any number of projects. You can also create a local bundle:
    ```bash
    apm pack --archive -o ./dist
    ```
1. Check the resulting archive under `dist`.
1. Switch back to the Copilot training project and install the local bundle:
    ```bash
    apm install path/to/my-apm-package-1.0.0.tar.gz
    ```
1. Verify that the agentic primitives defined in your APM package were added to the project.
