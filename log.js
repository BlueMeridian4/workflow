#!/usr/bin/env node
// Usage: log.js "what changed" | log.js (refresh snapshot) | log.js --session (hook: refresh + print)
// Context lives outside the repo (~/.claude/workflow/<project>.md): per-project, never committed.
const fs = require('fs'), os = require('os'), path = require('path');
const { execSync } = require('child_process');
const MAX_LOG = 20; // hard cap on log entries; oldest dropped
const MAX_WIN = 15; // hard cap on windows listed
const sh = (c) => { try { return execSync(c, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch { return ''; } };

const root = process.env.CLAUDE_PROJECT_DIR || sh('git rev-parse --show-toplevel').trim() || process.cwd();
const file = path.join(os.homedir(), '.claude', 'workflow', root.replace(/[\\/:]/g, '-') + '.md');

// ponytail: window titles only (active browser tab, not all tabs); Mac/Windows commands untested
function windows() {
  const p = process.platform;
  const out = p === 'win32' ? sh('powershell -NoProfile -Command "Get-Process | ? MainWindowTitle | % MainWindowTitle"')
    : p === 'darwin' ? sh(`osascript -e 'tell application "System Events" to get name of (processes where background only is false)'`).replace(/, /g, '\n')
    : sh('wmctrl -l').split('\n').map((l) => l.split(/\s+/).slice(3).join(' ')).join('\n');
  return out.split('\n').map((s) => s.trim().slice(0, 80)).filter((s) => s && !s.startsWith('Desktop Icons')).slice(0, MAX_WIN);
}

function update(msg) {
  let old = [];
  try { old = fs.readFileSync(file, 'utf8').split('## Log')[1].split('\n').filter((l) => l.startsWith("- ")); } catch { /* first run, no file yet */ }
  if (msg) { const d = new Date(), z = (n) => String(n).padStart(2, '0'); old.push(`- ${z(d.getMonth() + 1)}-${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())} ${msg}`); }
  const text = [`# Context: ${root} (~${MAX_LOG + MAX_WIN + 3} lines max)`, `## Open now (${new Date().toLocaleString("sv").slice(0, 16)}, ${os.hostname()})`,
    ...windows().map((w) => '- ' + w), '## Log', ...old.slice(-MAX_LOG)].join('\n') + '\n';
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
  return text;
}

const a = process.argv[2];
if (a === '--session') console.log(`## workflow context for this project (auto-loaded; do not hand-edit)\n${update()}Rule: after each meaningful change/iteration, run \`node "${__filename}" "<one-line summary, <100 chars>"\`.`);
else update(a);
