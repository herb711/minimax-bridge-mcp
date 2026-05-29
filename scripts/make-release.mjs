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
  'dist', 'scripts', 'examples', 'docs', 'agent.manifest.json',
  'README.md', 'package.json', 'package-lock.json', 'tsconfig.json',
  'install-opencode.sh', 'install-opencode.ps1'
];

function copy(src, dst) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dst, { recursive: true });
    for (const item of fs.readdirSync(src)) copy(path.join(src, item), path.join(dst, item));
  } else {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
  }
}

function makeBundle(platform) {
  const dirName = `${pkg.name}-${pkg.version}-${platform}`;
  const dir = path.join(stagingRoot, dirName);
  fs.mkdirSync(dir, { recursive: true });
  for (const file of commonFiles) {
    if (fs.existsSync(file)) copy(file, path.join(dir, file));
  }
  fs.writeFileSync(path.join(dir, 'INSTALL_FIRST.txt'), `MiniMax Bridge MCP ${pkg.version}\n\n1. Ensure Node.js 20+ is installed.\n2. Run ./install-opencode.sh on macOS/Linux or .\\install-opencode.ps1 on Windows.\n3. Restart OpenCode.\n\nThis is a stdio MCP server. The agent starts it automatically from its MCP config.\n`);
  return { dir, dirName };
}

fs.mkdirSync(releaseRoot, { recursive: true });
for (const platform of ['win-x64', 'macos-universal', 'linux-x64']) {
  const { dir, dirName } = makeBundle(platform);
  if (platform === 'win-x64') {
    execFileSync('zip', ['-qr', path.join(releaseRoot, `${dirName}.zip`), dir], { stdio: 'inherit' });
  } else {
    execFileSync('tar', ['-czf', path.join(releaseRoot, `${dirName}.tar.gz`), '-C', stagingRoot, dirName], { stdio: 'inherit' });
  }
}
console.log(`Release bundles written to ${releaseRoot}`);
