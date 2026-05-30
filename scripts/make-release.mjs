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
  'install-opencode.sh', 'install-opencode.ps1', 'install.bat', 'install.sh'
];

function copy(src, dst) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dst, { recursive: true });
    for (const item of fs.readdirSync(src)) copy(path.join(src, item), path.join(dst, item));
  } else {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    // 修复 .sh 文件的换行符：CRLF -> LF
    if (src.endsWith('.sh')) {
      let content = fs.readFileSync(src, 'utf8');
      content = content.replace(/\r\n/g, '\n');
      fs.writeFileSync(dst, content, 'utf8');
    } else {
      fs.copyFileSync(src, dst);
    }
  }
}

function makeBundle(platform) {
  const dirName = `${pkg.name}-${pkg.version}-${platform}`;
  const dir = path.join(stagingRoot, dirName);
  fs.mkdirSync(dir, { recursive: true });
  for (const file of commonFiles) {
    if (fs.existsSync(file)) copy(file, path.join(dir, file));
  }
  fs.writeFileSync(path.join(dir, 'INSTALL_FIRST.txt'), `MiniMax Bridge MCP ${pkg.version}\n\n═══════════════════════════════════════════════════════════════\n  一键安装指南\n═══════════════════════════════════════════════════════════════\n\n前提条件：\n  - 已安装 Node.js 20 或更高版本 (https://nodejs.org/)\n\nWindows 用户：\n  双击运行 install.bat，然后按提示输入 API Key 即可。\n\nmacOS / Linux 用户：\n  打开终端，执行以下命令：\n    chmod +x install.sh\n    ./install.sh\n  然后按提示输入 API Key 即可。\n\n安装完成后：\n  重启 OpenCode，即可使用 MiniMax 的各种 AI 工具。\n\n这是一个 stdio MCP 服务器，OpenCode 会自动启动和管理它。\n\n详细文档请查看 README.md\n`);
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
