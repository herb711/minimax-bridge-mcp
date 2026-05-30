@echo off
chcp 65001 >nul 2>&1
setlocal

echo.
echo MiniMax Bridge MCP installer
echo.

echo [1/4] Checking Node.js...
where node >nul 2>&1
if errorlevel 1 (
    echo Node.js 20 or newer is required: https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=1 delims=." %%i in ('node -v') do set NODE_MAJOR=%%i
set NODE_MAJOR=%NODE_MAJOR:v=%
if %NODE_MAJOR% LSS 20 (
    echo Node.js 20 or newer is required. Current version:
    node -v
    pause
    exit /b 1
)
node -v

echo.
echo [2/4] Checking npm...
where npm >nul 2>&1
if errorlevel 1 (
    echo npm was not found. Reinstall Node.js and include npm.
    pause
    exit /b 1
)
npm -v

echo.
echo [3/4] Installing dependencies...
if not exist "node_modules" (
    if exist "dist\index.js" (
        call npm install --omit=dev
    ) else (
        call npm install
    )
    if errorlevel 1 exit /b 1
)
if not exist "dist\index.js" (
    echo.
    echo Building from source...
    call npm run build
    if errorlevel 1 exit /b 1
)

echo.
echo [4/4] Writing OpenCode MCP config without API key...
node scripts/install-opencode.mjs --yes
if errorlevel 1 exit /b 1

echo.
echo Installation complete.
echo No MiniMax API key was required. Configure MINIMAX_API_KEY later in your agent or OpenRedou UI.
echo To print pasteable agent config, run:
echo   node dist\index.js --agent-config
echo.
pause
