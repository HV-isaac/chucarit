#!/usr/bin/env node
// PostToolUse hook: formats the file Claude just edited with the repo's Prettier.
// Exits silently when Prettier is not installed yet or the file is not supported.
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const SUPPORTED = /\.(c|m)?(j|t)sx?$|\.(json|jsonc|css|scss|md|mdx|ya?ml|html)$/i;

let raw = '';
for await (const chunk of process.stdin) raw += chunk;

let filePath;
try {
  const input = JSON.parse(raw);
  filePath = input?.tool_input?.file_path;
} catch {
  process.exit(0);
}

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const prettier = path.join(root, 'node_modules', '.bin', 'prettier');

if (!filePath || !SUPPORTED.test(filePath) || !existsSync(filePath) || !existsSync(prettier)) {
  process.exit(0);
}

const relative = path.relative(root, filePath);
if (relative.startsWith('..') || relative.split(path.sep).includes('node_modules')) {
  process.exit(0);
}

spawnSync(prettier, ['--write', '--ignore-unknown', '--log-level', 'silent', filePath], {
  cwd: root,
  stdio: 'ignore',
});
process.exit(0);
