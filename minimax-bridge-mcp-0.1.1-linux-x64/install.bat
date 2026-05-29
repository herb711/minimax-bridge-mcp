@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

echo.
echo ═══════════════════════════════════════════════════════════════
echo    MiniMax Bridge MCP - 一键安装程序
echo ═══════════════════════════════════════════════════════════════
echo.

:: 检测 Node.js
echo [1/4] 检测 Node.js ...
where node >nul 2>&1
if errorlevel 1 (
    echo.
    echo [错误] 未检测到 Node.js！
    echo.
    echo 请先安装 Node.js 20 或更高版本：
    echo   https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: 检测 Node.js 版本
for /f "tokens=1 delims=." %%i in ('node -v') do set NODE_MAJOR=%%i
set NODE_MAJOR=%NODE_MAJOR:v=%
if %NODE_MAJOR% LSS 20 (
    echo.
    echo [错误] Node.js 版本过低！当前版本: 
    node -v
    echo 需要 Node.js 20 或更高版本。
    echo.
    pause
    exit /b 1
)
echo       Node.js 版本: 
node -v
echo.

:: 检测 npm
echo [2/4] 检测 npm ...
where npm >nul 2>&1
if errorlevel 1 (
    echo.
    echo [错误] 未检测到 npm！
    echo 请重新安装 Node.js 并确保 npm 可用。
    echo.
    pause
    exit /b 1
)
echo       npm 版本: 
npm -v
echo.

:: 安装依赖
echo [3/4] 安装项目依赖 ...
if not exist "node_modules" (
    call npm install
    if errorlevel 1 (
        echo.
        echo [错误] 依赖安装失败！
        echo.
        pause
        exit /b 1
    )
) else (
    echo       node_modules 已存在，跳过安装
)
echo.

:: 配置 OpenCode
echo [4/4] 配置 OpenCode ...
echo.
echo 请输入您的 MiniMax API Key:
set /p "API_KEY=^> "

if "%API_KEY%"=="" (
    echo.
    echo [错误] API Key 不能为空！
    echo.
    pause
    exit /b 1
)

node scripts/install-opencode.mjs --apiKey "%API_KEY%" --yes
if errorlevel 1 (
    echo.
    echo [错误] 配置失败！
    echo.
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo    安装完成！
echo ═══════════════════════════════════════════════════════════════
echo.
echo 请重启 OpenCode，然后可以使用以下工具：
echo   - text_to_image (文生图)
echo   - text_to_audio (文生语音)
echo   - web_search (网页搜索)
echo   - 等更多工具...
echo.
echo 详细文档请查看: README.md
echo.
pause