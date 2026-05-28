# minimax-bridge-mcp

> 专为 MiniMax Token Plan 用户打造的 MCP 服务器，让 OpenCode、Codex 等 AI 编程助手直接调用 MiniMax 的全部 AI 能力。

## 这是什么？

一个桥接服务器，将 MiniMax 的 API 能力（文生图、文生语音、视频生成、音乐创作等）封装成 MCP 工具，让 AI 编程助手可以像使用内置工具一样调用。

**支持的工具：**
- 文生图 / 文生语音 / 语音克隆
- 视频生成 / 图生视频
- 音乐创作 / 歌词生成
- 网页搜索 / 图片理解

## 快速安装

### 前提条件

- Node.js 20+ ([下载](https://nodejs.org/))
- MiniMax API Key

### 一键安装

**Windows：**
```powershell
# 下载解压后，双击 install.bat 即可
```

**macOS / Linux：**
```bash
chmod +x install.sh
./install.sh
```

安装脚本会自动检测环境、安装依赖、配置 OpenCode。

### 手动安装

```bash
npm install
npm run build
node scripts/install-opencode.mjs --apiKey YOUR_API_KEY --yes
```

## 使用示例

安装完成后，重启 OpenCode，即可在对话中使用 MiniMax 的能力。

### 示例 1：文生图

```
用户：帮我生成一张赛博朋克风格的城市夜景图
OpenCode：[调用 text_to_image 工具]
```

### 示例 2：文生语音

```
用户：把这段代码的注释用语音读出来
OpenCode：[调用 text_to_audio 工具]
```

### 示例 3：视频生成

```
用户：根据这个动画效果生成一个演示视频
OpenCode：[调用 generate_video 工具]
```

### 示例 4：网页搜索

```
用户：搜索一下最新的 React 19 有什么新特性
OpenCode：[调用 web_search 工具]
```

## 配置说明

安装脚本会自动将以下配置写入 `~/.config/opencode/opencode.json`：

```json
{
  "mcp": {
    "minimax-bridge": {
      "type": "local",
      "command": ["node", "/path/to/minimax-bridge-mcp/dist/index.js"],
      "enabled": true,
      "environment": {
        "MINIMAX_API_KEY": "your_api_key"
      }
    }
  }
}
```

如需修改配置，可编辑该文件。

## 相关链接

- [详细安装指南](docs/OPENCODE_INSTALL.md)
- [GitHub Releases](https://github.com/herb711/minimax-bridge-mcp/releases)

---

# English

# minimax-bridge-mcp

> A bridge server that brings MiniMax's AI capabilities (text-to-image, text-to-speech, video generation, music creation, etc.) to AI coding assistants like OpenCode and Codex via MCP protocol.

## What is this?

A bridge server that wraps MiniMax's APIs as MCP tools, allowing AI coding assistants to use MiniMax's capabilities as if they were built-in tools.

**Supported tools:**
- Text-to-Image / Text-to-Speech / Voice Cloning
- Video Generation / Image-to-Video
- Music Creation / Lyrics Generation
- Web Search / Image Understanding

## Quick Install

### Prerequisites

- Node.js 20+ ([Download](https://nodejs.org/))
- MiniMax API Key

### One-click Install

**Windows:**
```powershell
# After downloading and extracting, double-click install.bat
```

**macOS / Linux:**
```bash
chmod +x install.sh
./install.sh
```

The install script automatically detects the environment, installs dependencies, and configures OpenCode.

### Manual Install

```bash
npm install
npm run build
node scripts/install-opencode.mjs --apiKey YOUR_API_KEY --yes
```

## Usage Examples

After installation, restart OpenCode and you can use MiniMax's capabilities in your conversations.

### Example 1: Text-to-Image

```
User: Generate a cyberpunk city nightscape image
OpenCode: [calls text_to_image tool]
```

### Example 2: Text-to-Speech

```
User: Read the code comments aloud
OpenCode: [calls text_to_audio tool]
```

### Example 3: Video Generation

```
User: Generate a demo video based on this animation effect
OpenCode: [calls generate_video tool]
```

### Example 4: Web Search

```
User: Search for the latest React 19 features
OpenCode: [calls web_search tool]
```

## Configuration

The install script automatically writes the following config to `~/.config/opencode/opencode.json`:

```json
{
  "mcp": {
    "minimax-bridge": {
      "type": "local",
      "command": ["node", "/path/to/minimax-bridge-mcp/dist/index.js"],
      "enabled": true,
      "environment": {
        "MINIMAX_API_KEY": "your_api_key"
      }
    }
  }
}
```

To modify the configuration, edit this file.

## Links

- [Detailed Installation Guide](docs/OPENCODE_INSTALL.md)
- [GitHub Releases](https://github.com/herb711/minimax-bridge-mcp/releases)