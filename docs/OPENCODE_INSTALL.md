# OpenCode / OpenRedou Install Guide

MiniMax Bridge MCP is a local stdio MCP server. OpenCode, OpenRedou, or another agent starts it with `node dist/index.js` and communicates through MCP `tools/list` and `tools/call`.

The install step does not require a MiniMax API key. Configure the key later in your agent or OpenRedou UI.

## 1. Download A Release Bundle

Download the bundle for your system from GitHub Releases:

- Windows: `minimax-bridge-mcp-0.1.6-win-x64.zip`
- macOS: `minimax-bridge-mcp-0.1.6-macos-universal.tar.gz`
- Linux: `minimax-bridge-mcp-0.1.6-linux-x64.tar.gz`

Extract the bundle to a stable folder, for example:

```text
D:\Redou\plugins\minimax-bridge-mcp
```

## 2. Install Without API Key

Windows PowerShell:

```powershell
cd D:\Redou\plugins\minimax-bridge-mcp
.\install-opencode.ps1 -Yes
```

macOS / Linux:

```bash
cd ~/redou/plugins/minimax-bridge-mcp
chmod +x install.sh
./install.sh
```

The installer writes this kind of OpenCode config:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "minimax-bridge": {
      "type": "local",
      "command": ["node", "/absolute/path/to/minimax-bridge-mcp/dist/index.js"],
      "enabled": true,
      "environment": {
        "MINIMAX_API_HOST": "https://api.minimaxi.com",
        "MINIMAX_MCP_BASE_PATH": "/absolute/path/to/minimax-bridge-mcp/outputs/minimax",
        "MINIMAX_T2A_MODE": "async",
        "MINIMAX_ENABLE_TOKEN_PLAN_PROXY": "false"
      }
    }
  }
}
```

`MINIMAX_API_KEY` is intentionally absent.

## 3. Print Pasteable Agent Config

Run:

```bash
node dist/index.js --agent-config
```

Paste the JSON output into OpenRedou's MCP settings page. OpenRedou can parse the generated `mcp.minimax-bridge` object and then lets you enter the MiniMax API key in a separate field.

## 4. Verify Metadata Locally

These commands do not require an API key:

```bash
node dist/index.js --tools
node dist/index.js --manifest
node dist/index.js --agent-config
```

## 5. Configure API Key In The Agent

In OpenRedou:

1. Open Settings.
2. Open MCP settings.
3. Paste the `--agent-config` JSON.
4. Fill MiniMax API Key in the dedicated key field.
5. Save and run the connection, tool probe, and API key smoke test cards.

For other agents, add `MINIMAX_API_KEY` through that agent's local secret or environment setting.

## 6. Optional Token Plan Proxy

By default:

```text
MINIMAX_ENABLE_TOKEN_PLAN_PROXY=false
```

Enable it only when you want `web_search` and `understand_image` to forward to the MiniMax Token Plan MCP:

```powershell
.\install-opencode.ps1 -Yes -TokenPlan true
```

or:

```bash
./install-opencode.sh --yes --tokenPlan true
```

When enabled, configure `MINIMAX_PLAN_API_KEY` in the agent UI or pass it explicitly with `--planApiKey` on a private machine.

## FAQ

### Do I need to keep `node dist/index.js` running?

No. The agent starts and stops the stdio MCP server when needed.

### Is this an HTTP service?

No. This is stdio MCP, not a browser-accessible localhost HTTP server.

### Where are generated files saved?

By default they are written under `MINIMAX_MCP_BASE_PATH`, which the installer sets to `outputs/minimax` inside the extracted bundle.
