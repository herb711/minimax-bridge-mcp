# minimax-bridge-mcp

A publishable MiniMax Bridge MCP server for Redou, OpenCode, Codex and other MCP-compatible agents.

The agent sees **one MCP server**. Internally, this bridge routes different tools to different MiniMax backends:

```text
Agent / Redou / OpenCode / Codex
  ↓ MCP tools/list + tools/call
minimax-bridge-mcp
  ├─ Token Plan MCP proxy branch
  │    ├─ web_search
  │    └─ understand_image
  └─ MiniMax HTTP/WebSocket branch
       ├─ text_to_audio / voice_clone / list_voices
       ├─ text_to_image
       ├─ generate_video / image_to_video / video templates
       └─ lyrics_generation / music_generation / music cover
```

## Tool list

- `web_search`
- `understand_image`
- `text_to_audio`
- `query_text_to_audio`
- `list_voices`
- `voice_clone`
- `text_to_image`
- `generate_video`
- `image_to_video`
- `query_video_generation`
- `video_template_generation`
- `query_video_template_generation`
- `lyrics_generation`
- `music_generation`
- `music_cover_preprocess`

## Requirements

- Node.js 20+
- MiniMax API key
- Optional: `uvx` if you enable the Token Plan MCP proxy branch

## Quick install into OpenCode

### Windows

```powershell
cd D:\Redou\plugins\minimax-bridge-mcp
$env:MINIMAX_API_KEY="your_minimax_api_key"
.\install-opencode.ps1 -Yes
```

### macOS / Linux

```bash
cd ~/redou/plugins/minimax-bridge-mcp
export MINIMAX_API_KEY="your_minimax_api_key"
./install-opencode.sh --yes
```

The script writes the MCP config to:

```text
~/.config/opencode/opencode.json
```

Then restart OpenCode.

Detailed guide with operation diagrams: [docs/OPENCODE_INSTALL.md](docs/OPENCODE_INSTALL.md)

## Manual install

```bash
npm install
npm run build
```

Run locally for diagnostics only:

```bash
node dist/index.js
```

This is a stdio MCP server, not a browser HTTP service. In normal use, the agent starts and stops it automatically.

## Agent manifest

For Redou-style plugin stores or installers, the project exposes a manifest interface:

```bash
node dist/index.js --manifest
```

Tool schema only:

```bash
node dist/index.js --tools
```

The release build also includes:

```text
agent.manifest.json
```

This lets an agent know:

- service id and display name
- start command and environment variables
- lifecycle strategy
- available MCP tools
- required permissions
- artifact types

## Environment variables

```bash
# Required for HTTP/WebSocket branch
export MINIMAX_API_KEY="your_minimax_api_key"

# Optional
export MINIMAX_API_HOST="https://api.minimaxi.com"
export MINIMAX_MCP_BASE_PATH="./outputs/minimax"
export MINIMAX_T2A_MODE="async"          # async | websocket
export MINIMAX_POLL_INTERVAL_SECONDS="10"
export MINIMAX_MAX_WAIT_SECONDS="600"

# Token Plan MCP proxy branch
export MINIMAX_ENABLE_TOKEN_PLAN_PROXY="false"
export MINIMAX_PLAN_API_KEY="your_token_plan_key_or_same_key"
export MINIMAX_PLAN_MCP_COMMAND="uvx"
export MINIMAX_PLAN_MCP_ARGS='["minimax-coding-plan-mcp", "-y"]'
```

## OpenCode config example

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "minimax-bridge": {
      "type": "local",
      "command": ["node", "/absolute/path/to/minimax-bridge-mcp/dist/index.js"],
      "enabled": true,
      "environment": {
        "MINIMAX_API_KEY": "your_minimax_api_key",
        "MINIMAX_API_HOST": "https://api.minimaxi.com",
        "MINIMAX_MCP_BASE_PATH": "/absolute/path/to/outputs/minimax",
        "MINIMAX_T2A_MODE": "async",
        "MINIMAX_ENABLE_TOKEN_PLAN_PROXY": "false"
      }
    }
  }
}
```

## Codex config example

```toml
[mcp_servers.minimax_bridge]
command = "node"
args = ["/absolute/path/to/minimax-bridge-mcp/dist/index.js"]

[mcp_servers.minimax_bridge.env]
MINIMAX_API_KEY = "your_minimax_api_key"
MINIMAX_API_HOST = "https://api.minimaxi.com"
MINIMAX_MCP_BASE_PATH = "/absolute/path/to/outputs/minimax"
MINIMAX_T2A_MODE = "async"
MINIMAX_ENABLE_TOKEN_PLAN_PROXY = "false"
```

## GitHub release build

This repository includes:

```text
.github/workflows/release.yml
scripts/make-release.mjs
scripts/generate-agent-manifest.mjs
```

When you push a tag, GitHub Actions builds release bundles:

```bash
git tag v0.2.0
git push origin v0.2.0
```

Generated artifacts:

```text
minimax-bridge-mcp-0.2.0-win-x64.zip
minimax-bridge-mcp-0.2.0-macos-universal.tar.gz
minimax-bridge-mcp-0.2.0-linux-x64.tar.gz
```

For a local release build:

```bash
npm run prepare:release
```

Outputs are written to:

```text
release/
```
