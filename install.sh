#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

echo
echo "MiniMax Bridge MCP installer"
echo

echo "[1/4] Checking Node.js..."
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js 20 or newer is required: https://nodejs.org/"
  exit 1
fi
NODE_MAJOR="$(node -v | sed 's/^v//' | cut -d. -f1)"
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "Node.js 20 or newer is required. Current version: $(node -v)"
  exit 1
fi
node -v

echo
echo "[2/4] Checking npm..."
if ! command -v npm >/dev/null 2>&1; then
  echo "npm was not found. Reinstall Node.js and include npm."
  exit 1
fi
npm -v

echo
echo "[3/4] Installing dependencies..."
if [ ! -d node_modules ]; then
  if [ -f dist/index.js ]; then
    npm install --omit=dev
  else
    npm install
  fi
fi
if [ ! -f dist/index.js ]; then
  echo
  echo "Building from source..."
  npm run build
fi

echo
echo "[4/4] Writing OpenCode MCP config without API key..."
node scripts/install-opencode.mjs --yes

echo
echo "Installation complete."
echo "No MiniMax API key was required. Configure MINIMAX_API_KEY later in your agent or OpenRedou UI."
echo "To print pasteable agent config, run:"
echo "  node dist/index.js --agent-config"
