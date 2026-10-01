#!/bin/bash
set -e

# Install monorepo workspace dependencies
npm install

# Install GitHub Copilot CLI
npm install -g @github/copilot@latest

# Install APM (Agent Package Manager)
sudo apt-get update
sudo apt-get install -y pipx
pipx install apm-cli
pipx ensurepath
