#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const releaseRoot = path.join(root, 'release');
const stagingRoot = path.join(releaseRoot, 'staging');

fs.rmSync(releaseRoot, { recursive: true, force: true });
fs.mkdirSync(stagingRoot, { recursive: true });

const commonFiles = [
  'dist',
  'scripts',
  'examples',
  'docs',
  'agent.manifest.json',
  'README.md',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'install-opencode.sh',
  'install-opencode.ps1',
  'install.bat',
  'install.sh',
];

function copy(src, dst) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dst, { recursive: true });
    for (const item of fs.readdirSync(src)) {
      copy(path.join(src, item), path.join(dst, item));
    }
    return;
  }

  fs.mkdirSync(path.dirname(dst), { recursive: true });
  if (src.endsWith('.sh')) {
    const content = fs.readFileSync(src, 'utf8').replace(/\r\n/g, '\n');
    fs.writeFileSync(dst, content, 'utf8');
    return;
  }
  fs.copyFileSync(src, dst);
}

function installFirstText() {
  return `MiniMax Bridge MCP ${pkg.version}

Install first, configure API key later
======================================

Requirement:
  - Node.js 20 or newer: https://nodejs.org/

Windows:
  1. Extract this bundle to a stable folder.
  2. Double-click install.bat, or run:
       .\\install-opencode.ps1 -Yes

macOS / Linux:
  1. Extract this bundle to a stable folder.
  2. Run:
       chmod +x install.sh
       ./install.sh

The installer does not ask for a MiniMax API key and does not write
MINIMAX_API_KEY into the generated MCP config.

To print a pasteable agent/OpenRedou config block:
  node dist/index.js --agent-config

Paste that JSON into your agent or OpenRedou MCP settings, then enter
MINIMAX_API_KEY in the agent UI.

See README.md and docs/OPENCODE_INSTALL.md for details.
`;
}

function makeBundle(platform) {
  const dirName = `${pkg.name}-${pkg.version}-${platform}`;
  const dir = path.join(stagingRoot, dirName);
  fs.mkdirSync(dir, { recursive: true });

  for (const file of commonFiles) {
    if (fs.existsSync(file)) copy(file, path.join(dir, file));
  }

  fs.writeFileSync(path.join(dir, 'INSTALL_FIRST.txt'), installFirstText(), 'utf8');
  return { dir, dirName };
}

fs.mkdirSync(releaseRoot, { recursive: true });

for (const platform of ['win-x64', 'macos-universal', 'linux-x64']) {
  const { dir, dirName } = makeBundle(platform);
  if (platform === 'win-x64') {
    execFileSync('zip', ['-qr', path.join(releaseRoot, `${dirName}.zip`), dirName], {
      cwd: stagingRoot,
      stdio: 'inherit',
    });
  } else {
    execFileSync('tar', ['-czf', path.join(releaseRoot, `${dirName}.tar.gz`), '-C', stagingRoot, dirName], {
      stdio: 'inherit',
    });
  }
}

console.log(`Release bundles written to ${releaseRoot}`);
