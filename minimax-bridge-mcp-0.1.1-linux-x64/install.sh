#!/usr/bin/env bash
set -euo pipefail

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "   MiniMax Bridge MCP - 一键安装程序"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# 获取脚本所在目录
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

# 检测 Node.js
echo -e "${CYAN}[1/4]${NC} 检测 Node.js ..."
if ! command -v node &> /dev/null; then
    echo ""
    echo -e "${RED}[错误]${NC} 未检测到 Node.js！"
    echo ""
    echo "请先安装 Node.js 20 或更高版本："
    echo "  https://nodejs.org/"
    echo ""
    echo "macOS 用户可使用 Homebrew 安装："
    echo "  brew install node"
    echo ""
    exit 1
fi

# 检测 Node.js 版本
NODE_VERSION=$(node -v | sed 's/v//' | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo ""
    echo -e "${RED}[错误]${NC} Node.js 版本过低！当前版本: $(node -v)"
    echo "需要 Node.js 20 或更高版本。"
    echo ""
    exit 1
fi
echo "       Node.js 版本: $(node -v)"
echo ""

# 检测 npm
echo -e "${CYAN}[2/4]${NC} 检测 npm ..."
if ! command -v npm &> /dev/null; then
    echo ""
    echo -e "${RED}[错误]${NC} 未检测到 npm！"
    echo "请重新安装 Node.js 并确保 npm 可用。"
    echo ""
    exit 1
fi
echo "       npm 版本: $(npm -v)"
echo ""

# 安装依赖
echo -e "${CYAN}[3/4]${NC} 安装项目依赖 ..."
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo ""
        echo -e "${RED}[错误]${NC} 依赖安装失败！"
        echo ""
        exit 1
    fi
else
    echo "       node_modules 已存在，跳过安装"
fi
echo ""

# 配置 OpenCode
echo -e "${CYAN}[4/4]${NC} 配置 OpenCode ..."
echo ""

# 检查是否通过环境变量传入 API Key
if [ -z "${MINIMAX_API_KEY:-}" ]; then
    echo "请输入您的 MiniMax API Key:"
    read -r -p "> " API_KEY
    
    if [ -z "$API_KEY" ]; then
        echo ""
        echo -e "${RED}[错误]${NC} API Key 不能为空！"
        echo ""
        exit 1
    fi
else
    API_KEY="$MINIMAX_API_KEY"
    echo "       使用环境变量中的 API Key"
fi

node scripts/install-opencode.mjs --apiKey "$API_KEY" --yes
if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}[错误]${NC} 配置失败！"
    echo ""
    exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo -e "   ${GREEN}安装完成！${NC}"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "请重启 OpenCode，然后可以使用以下工具："
echo "  - text_to_image (文生图)"
echo "  - text_to_audio (文生语音)"
echo "  - web_search (网页搜索)"
echo "  - 等更多工具..."
echo ""
echo "详细文档请查看: README.md"
echo ""