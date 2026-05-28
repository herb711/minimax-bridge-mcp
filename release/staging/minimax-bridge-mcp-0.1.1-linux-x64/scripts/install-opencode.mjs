#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) out[key] = true;
    else { out[key] = next; i++; }
  }
  return out;
}

function defaultOpenCodeConfigPath() {
  if (process.env.OPENCODE_CONFIG) return process.env.OPENCODE_CONFIG;
  return path.join(os.homedir(), '.config', 'opencode', 'opencode.json');
}

function readJsonC(file) {
  if (!fs.existsSync(file)) return {};
  const text = fs.readFileSync(file, 'utf8').trim();
  if (!text) return {};
  // Minimal JSONC cleanup for common comments/trailing commas.
  const clean = text
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/,\s*([}\]])/g, '$1');
  return JSON.parse(clean);
}

function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }

function posixOrWinPath(p) { return path.resolve(p); }

const args = parseArgs(process.argv);
const nonInteractive = Boolean(args.yes || args.y);
const configPath = posixOrWinPath(args.config || defaultOpenCodeConfigPath());
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const installDir = posixOrWinPath(args.installDir || path.resolve(__dirname, '..'));
const entry = path.join(installDir, 'dist', 'index.js');

if (!fs.existsSync(entry)) {
  console.error(`Cannot find MCP entry: ${entry}`);
  console.error('Run npm install && npm run build first, or use a prebuilt release bundle.');
  process.exit(1);
}

let apiKey = args.apiKey || process.env.MINIMAX_API_KEY || '';
let basePath = args.basePath || process.env.MINIMAX_MCP_BASE_PATH || path.join(installDir, 'outputs', 'minimax');
let enableTokenPlan = String(args.tokenPlan ?? process.env.MINIMAX_ENABLE_TOKEN_PLAN_PROXY ?? 'false');
let planApiKey = args.planApiKey || process.env.MINIMAX_PLAN_API_KEY || '';

if (!nonInteractive) {
  const rl = readline.createInterface({ input, output });
  if (!apiKey) apiKey = await rl.question('MiniMax API Key: ');
  const baseAns = await rl.question(`Artifact output directory [${basePath}]: `);
  if (baseAns.trim()) basePath = baseAns.trim();
  const tokenAns = await rl.question(`Enable Token Plan MCP proxy? true/false [${enableTokenPlan}]: `);
  if (tokenAns.trim()) enableTokenPlan = tokenAns.trim();
  if (enableTokenPlan === 'true' && !planApiKey) planApiKey = await rl.question('MiniMax Token Plan API Key: ');
  rl.close();
}

if (!apiKey) {
  console.error('MINIMAX_API_KEY is required. Pass --apiKey or set the environment variable.');
  process.exit(1);
}

ensureDir(path.dirname(configPath));
const config = readJsonC(configPath);
config.$schema ||= 'https://opencode.ai/config.json';
config.mcp ||= {};

config.mcp['minimax-bridge'] = {
  type: 'local',
  command: ['node', entry],
  enabled: true,
  environment: {
    MINIMAX_API_KEY: apiKey,
    MINIMAX_API_HOST: args.apiHost || process.env.MINIMAX_API_HOST || 'https://api.minimaxi.com',
    MINIMAX_MCP_BASE_PATH: basePath,
    MINIMAX_T2A_MODE: args.t2aMode || process.env.MINIMAX_T2A_MODE || 'async',
    MINIMAX_ENABLE_TOKEN_PLAN_PROXY: enableTokenPlan,
    ...(enableTokenPlan === 'true' ? {
      MINIMAX_PLAN_API_KEY: planApiKey || apiKey,
      MINIMAX_PLAN_MCP_COMMAND: args.planCommand || process.env.MINIMAX_PLAN_MCP_COMMAND || 'uvx',
      MINIMAX_PLAN_MCP_ARGS: args.planArgs || process.env.MINIMAX_PLAN_MCP_ARGS || '["minimax-coding-plan-mcp", "-y"]',
    } : {}),
  },
};

if (fs.existsSync(configPath)) {
  const backup = `${configPath}.bak-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  fs.copyFileSync(configPath, backup);
  console.log(`Backed up existing OpenCode config to ${backup}`);
}
fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
console.log(`Installed minimax-bridge MCP into OpenCode config: ${configPath}`);
console.log('Restart OpenCode, then ask it to list MCP tools or use text_to_image/text_to_audio.');
