# 2. 📦 Agent Plugins

Plugins are installable packages that extend Copilot with reusable agents, skills, hooks, and integrations. For details, see the official [GitHub documentation](https://docs.github.com/en/copilot/concepts/agents/about-plugins).

In the following exercises, you will learn how to:
- Install and manage agent plugins
- Create and distribute your own plugins

## 📥 Exercise 2.1: Install an agentic plugin

**VS Code**
1. Open extensions and type `@agentplugins`.
1. You should see a list appear. Type `azure` at the end to further filter the search results and try to install the `azure-cloud-development` plugin as a test.
1. Open the plugin description by clicking it on the list and see what kind of slash commands, agents etc. it provides. Check in the chat panle that these features are now available for you.
1. Uninstall the plugin.

**Copilot CLI**
1. Install a plugin as a test:
    ```bash
    $ copilot plugin install azure-cloud-development@awesome-copilot
    ```
1. List installed plugins and verify that the plugin is now installed: 
    ```bash
    $ copilot plugin list
    ```
1. Open Copilot CLI interactive UI and study the `/plugin` slash command and its subcommands.
1. Verify that you are able to use one of the commands provided by the plugin:
    ```text
    > /azure-cloud-development:az-cost-optimize
    ```
1. Uninstall the plugin:
    ```text
    > /plugin uninstall azure-cloud-development@awesome-copilot
    ```

## 🏪 Exercise 2.2: Setting up marketplaces

By default, VS Code discovers plugins from copilot-plugins and awesome-copilot marketplaces. You can configure additional marketplaces.

**Note: Feel free to use [Elisa's own agent plugin marketplace](https://github.com/elisa-actions/agent-plugins) instead of the demo marketplace mentioned in the exercises.**

**Understand the demo marketplace**
1. Study the structure of [Eficode's demo agent plugin marketplace](https://github.com/EficodeDemoOrg/demo-agent-plugin-marketplace)
1. Examine the marketplace configuration in the file `.github/plugin/marketplace.json`.
1. There's one plugin in this marketplace. Study the structure of it.
1. Take a note of the folder `com.github.copilot` in the plugin folder that contains custom agent and hook configurations. This is not part of the official Agent Plugins 1.0 standard and thus is placed in a separate, GitHub-specific folder that is ignored by other plugin-consuming agents.

**Add marketplace in VS Code**
1. Open settings and search for the setting called "chat.plugins.marketplaces"
1. Add `EficodeDemoOrg/demo-agent-plugin-marketplace`

**Add marketplace in Copilot CLI**
1. List current marketplaces and notice that the default ones are included:
    ```bash
    $ copilot plugin marketplace list

    Included with GitHub Copilot:
        ◆ copilot-plugins (GitHub: github/copilot-plugins)
        ◆ awesome-copilot (GitHub: github/awesome-copilot)
    ```
1. Add the demo marketplace
    ```bash
    $ copilot plugin marketplace add EficodeDemoOrg/demo-agent-plugin-marketplace
    ````

## 🛒 Exercise 2.3: Install a plugin from the marketplace
**VS Code**
1. Open extensions and use the following search key words: `@agentPlugins eficode`.
1. Try to install the ui-test-engineer plugin provided by the Eficode demo marketplace.
1. Open the plugin description and check that you have the agent primitives offered by it available in VS Code.
1. Uninstall the plugin.

**Copilot CLI**
1. Browse the plugins offered by the new marketplace:
    ```bash
    $ copilot plugin marketplace browse eficode-demo-agent-plugin-marketplace
    ```
1. Install the only plugin in the marketplace according to the instructions of the previous exercise
1. Verify the installation and uninstall the plugin.

## 🛠️ Exercise 2.4: Create an agentic plugin

Let's create a local plugin (resides only on your filesystem) and install it in VS Code.

**Create the local plugin**

1. Create the following directory structure, for example, in your home directory:
    ```
    ~/pirate-plugin/
    ├── plugin.json
    ├── README.md
    ├── LICENSE
    └── skills/
        └── pirate-review/
            └── SKILL.md
    ```

1. Create `plugin.json` with the following content:
    ```json
    {
      "name": "pirate-plugin",
      "version": "1.0.0",
      "displayName": "Pirate Plugin",
      "description": "Hoist pirate code skills aboard yer projects like treasure in a chest, ye scallywag!",
      "publisher": "Blackbeard Studios",
      "license": "Buccaneer Public License",
      "skills": [
        {
          "name": "pirate-review",
          "path": "./skills/pirate-review/SKILL.md"
        }
      ]
    }
    ```

1. Create `skills/pirate-review/SKILL.md` with the following content:
    ```text
    ---
    name: pirate-review
    description: Reviews code and provides feedback in pirate speak
    ---

    # Pirate Review Skill

    This skill reviews any code submission and provides feedback using authentic pirate vernacular.

    ## Usage

    Provide any code snippet or pull request diff, and this skill will:
    - Identify code quality issues
    - Suggest improvements
    - Deliver all feedback in pirate speak (Arrr, ye scurvy dog, etc.)

    ## Examples

    - "Review this function with pirate feedback"
    - "Give me a pirate code review of this PR"
    - "/pirate-review my TypeScript code"
    ```

**Install your plugin in VS Code**

1. In VS Code, open the command palette (`Cmd+Shift+P` on Mac or `Ctrl+Shift+P` on Windows/Linux).
1. Type `Chat: install plugin from source` and select the command.
1. When prompted, provide the path to your local plugin folder: `~/pirate-plugin`
1. The plugin will be installed and available in your chat.
1. Try it out by typing `/pirate-review` in the chat to see the skill in action.
1. Uninstall the plugin in the extensions panel.
