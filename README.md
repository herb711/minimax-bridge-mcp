# minimax-bridge-mcp

MiniMax Bridge MCP is a local stdio MCP server that exposes MiniMax multimodal tools to OpenRedou, OpenCode, Codex, and other MCP-capable agents.

The installer no longer asks for a MiniMax API key. Install the bridge first, then paste the generated agent config into your agent or OpenRedou MCP settings and enter the API key in that UI.

## Tools

- `text_to_audio`, `query_text_to_audio`, `list_voices`, `voice_clone`
- `text_to_image`
- `generate_video`, `image_to_video`, `query_video_generation`
- `video_template_generation`, `query_video_template_generation`
- `lyrics_generation`, `music_generation`, `music_cover_preprocess`
- `web_search`, `understand_image` when the optional MiniMax Token Plan proxy is enabled

## Requirements

- Node.js 20 or newer
- A MiniMax API key, configured later in the agent/OpenRedou UI

## Install From Release

1. Download the bundle for your system from GitHub Releases:
   - Windows: `minimax-bridge-mcp-0.1.6-win-x64.zip`
   - macOS: `minimax-bridge-mcp-0.1.6-macos-universal.tar.gz`
   - Linux: `minimax-bridge-mcp-0.1.6-linux-x64.tar.gz`
2. Extract it to a stable local folder.
3. Run the installer.

Windows PowerShell:

```powershell
cd D:\Redou\plugins\minimax-bridge-mcp
.\install-opencode.ps1 -Yes
```

Windows double-click:

```text
Double-click install.bat
```

macOS / Linux:

```bash
cd ~/redou/plugins/minimax-bridge-mcp
chmod +x install.sh
./install.sh
```

The installer writes a local MCP entry without `MINIMAX_API_KEY`. It is safe to run on a shared machine because no secret is required at install time.

## Print Agent Config

After install or build, print a pasteable config block:

```bash
node dist/index.js --agent-config
```

The output looks like this:

```json
{
  "schemaVersion": "redou.agent.mcp.config/v1",
  "mcp": {
    "minimax-bridge": {
      "type": "local",
      "command": ["node", "D:\\Redou\\plugins\\minimax-bridge-mcp\\dist\\index.js"],
      "enabled": true,
      "environment": {
        "MINIMAX_API_HOST": "https://api.minimaxi.com",
        "MINIMAX_MCP_BASE_PATH": "D:\\Redou\\plugins\\minimax-bridge-mcp\\outputs\\minimax",
        "MINIMAX_T2A_MODE": "async",
        "MINIMAX_ENABLE_TOKEN_PLAN_PROXY": "false"
      }
    }
  },
  "secrets": {
    "MINIMAX_API_KEY": {
      "required": true
    }
  }
}
```

Paste this block into OpenRedou's MCP settings page, then fill the separate MiniMax API Key field. Do not paste the API key into shared config files.

## Manual OpenCode Install

```bash
npm install
npm run build
node scripts/install-opencode.mjs --yes
```

Optional advanced install with a key explicitly written to OpenCode:

```bash
node scripts/install-opencode.mjs --yes --apiKey YOUR_MINIMAX_API_KEY
```

Only use `--apiKey` on a private machine where storing the key in the local OpenCode config is acceptable.

## Verify

```bash
npm run build
node dist/index.js --tools
node dist/index.js --manifest
node dist/index.js --agent-config
```

`--tools`, `--manifest`, and `--agent-config` do not require an API key.

## OpenRedou Configuration

1. Open OpenRedou settings.
2. Go to MCP settings.
3. Paste the JSON printed by `node dist/index.js --agent-config`.
4. Enter the MiniMax API key in the MiniMax API Key field.
5. Save, then run the connection and tool probe tests.

## Optional Token Plan Proxy

The Token Plan branch is disabled by default:

```text
MINIMAX_ENABLE_TOKEN_PLAN_PROXY=false
```

Enable it only if you have the MiniMax Token Plan MCP available and you have configured `MINIMAX_PLAN_API_KEY`.

## Links

- [Detailed OpenCode install guide](docs/OPENCODE_INSTALL.md)
- [GitHub Releases](https://github.com/herb711/minimax-bridge-mcp/releases)
