#!/usr/bin/env node
// PostToolUse(Edit|Write): auto-fix the edited file with the project's linter. Reads the path from stdin JSON.
// Exit 2 + stderr hands unfixable errors back to Claude. Silent if the tool isn't installed.
const fs = require('fs'), path = require('path');
const { spawnSync } = require('child_process');

let file;
try { file = JSON.parse(fs.readFileSync(0, 'utf8')).tool_input.file_path; } catch { process.exit(0); }
if (!file || !fs.existsSync(file)) process.exit(0);

const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { encoding: 'utf8', cwd: path.dirname(file) });
  if (r.error) return; // tool missing
  if (r.status) { process.stderr.write(`${path.basename(cmd)} ${path.basename(file)}:\n${r.stdout}${r.stderr}`); process.exit(2); }
};
const localBin = (name) => { // nearest node_modules/.bin/<name> above the file
  for (let d = path.dirname(path.resolve(file)); ; d = path.dirname(d)) {
    const p = path.join(d, 'node_modules', '.bin', name);
    if (fs.existsSync(p)) return p;
    if (d === path.dirname(d)) return null;
  }
};

const ext = path.extname(file);
if (ext === '.py') run('ruff', ['check', '--fix', file]);
else if (/^\.(js|jsx|ts|tsx|mjs|cjs)$/.test(ext)) { const e = localBin('eslint'); if (e) run(e, ['--fix', file]); }
else if (ext === '.sh') run('shellcheck', [file]); // ponytail: shellcheck has no safe auto-fix, report only
