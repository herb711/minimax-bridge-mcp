param(
  [string]$ApiKey = $env:MINIMAX_API_KEY,
  [string]$Config,
  [string]$BasePath,
  [string]$TokenPlan = $env:MINIMAX_ENABLE_TOKEN_PLAN_PROXY,
  [switch]$Yes
)
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root
if (!(Test-Path "node_modules")) { npm install }
npm run build | Out-Host
$argsList = @("scripts/install-opencode.mjs")
if ($ApiKey) { $argsList += @("--apiKey", $ApiKey) }
if ($Config) { $argsList += @("--config", $Config) }
if ($BasePath) { $argsList += @("--basePath", $BasePath) }
if ($TokenPlan) { $argsList += @("--tokenPlan", $TokenPlan) }
if ($Yes) { $argsList += "--yes" }
node @argsList
