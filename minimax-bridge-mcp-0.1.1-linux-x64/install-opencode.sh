#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"
if [ ! -d node_modules ]; then npm install; fi
npm run build >/dev/null
node scripts/install-opencode.mjs "$@"
