param(
  [string]$ApiKey,
  [string]$Config,
  [string]$BasePath,
  [string]$TokenPlan = $env:MINIMAX_ENABLE_TOKEN_PLAN_PROXY,
  [switch]$Yes
)
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

function Invoke-Checked {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Command)
  & $Command[0] @($Command[1..($Command.Length - 1)])
  if ($LASTEXITCODE -ne 0) {
    throw "Command failed: $($Command -join ' ')"
  }
}

if (!(Test-Path "node_modules")) {
  if (Test-Path "dist/index.js") {
    Invoke-Checked npm install --omit=dev
  } else {
    Invoke-Checked npm install
  }
}
if (!(Test-Path "dist/index.js")) {
  Invoke-Checked npm run build
}
$argsList = @("scripts/install-opencode.mjs")
if ($ApiKey) { $argsList += @("--apiKey", $ApiKey) }
if ($Config) { $argsList += @("--config", $Config) }
if ($BasePath) { $argsList += @("--basePath", $BasePath) }
if ($TokenPlan) { $argsList += @("--tokenPlan", $TokenPlan) }
if ($Yes) { $argsList += "--yes" }
Invoke-Checked node @argsList
