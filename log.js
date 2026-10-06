#!/usr/bin/env node
// Usage: log.js "what changed" | log.js (refresh) | log.js --session (hook: refresh + print)
//        log.js --decide "choice" "benefit" "cost" | log.js --board (open the floating decisions window)
// Context lives outside the repo (~/.claude/workflow/<project>.md): per-project, never committed.
const fs = require('fs'), os = require('os'), path = require('path');
const { execSync, spawn } = require('child_process');
const MAX_LOG = 20; // hard cap on log entries; oldest dropped
const MAX_WIN = 15; // hard cap on windows listed
const MAX_DEC = 15; // hard cap on decisions kept
const sh = (c) => { try { return execSync(c, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch { return ''; } };

const root = process.env.CLAUDE_PROJECT_DIR || sh('git rev-parse --show-toplevel').trim() || process.cwd();
const base = path.join(os.homedir(), '.claude', 'workflow', root.replace(/[\\/:]/g, '-'));
const file = base + '.md';

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
  board();
  return text;
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const decisions = () => { try { return JSON.parse(fs.readFileSync(base + '.decisions.json', 'utf8')); } catch { return []; } };

function decide(what, benefit = '', cost = '') {
  const list = decisions().concat({ t: new Date().toLocaleString('sv').slice(5, 16), what, benefit, cost }).slice(-MAX_DEC);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(base + '.decisions.json', JSON.stringify(list));
  board();
}

// Static page that refreshes itself; open it once (wf board) and leave the window floating.
function board() {
  let log = [];
  try { log = fs.readFileSync(file, 'utf8').split('## Log')[1].split('\n').filter((l) => l.startsWith('- ')); } catch { /* no log yet */ }
  const cards = decisions().reverse().map((d) => `<div class=c><b>${esc(d.what)}</b> <small>${d.t}</small>${d.benefit ? `<p class=g>+ ${esc(d.benefit)}</p>` : ''}${d.cost ? `<p class=r>&minus; ${esc(d.cost)}</p>` : ''}</div>`).join('') || '<p>No decisions yet.</p>';
  fs.writeFileSync(base + '.html', `<!doctype html><meta charset=utf-8><meta http-equiv=refresh content=3><meta name=viewport content="width=device-width"><title>${esc(path.basename(root))} decisions</title>
<style>:root{--bg:#fff;--fg:#1a1a1a;--card:#f3f3f3;--g:#1a7f37;--r:#b42318}@media(prefers-color-scheme:dark){:root{--bg:#161616;--fg:#e8e8e8;--card:#242424;--g:#56d364;--r:#ff7b72}}
body{background:var(--bg);color:var(--fg);font:14px system-ui;margin:12px}.c{background:var(--card);border-radius:8px;padding:8px 12px;margin:8px 0}p{margin:4px 0}.g{color:var(--g)}.r{color:var(--r)}small,h4{opacity:.6}</style>
<h3>${esc(path.basename(root))}: decisions</h3>${cards}<h4>Recent changes</h4>${log.slice(-8).reverse().map((l) => `<p>${esc(l.slice(2))}</p>`).join('')}`);
}

function open() {
  board();
  const page = base + '.html', w = process.platform === 'win32';
  const chrome = ['google-chrome', 'chromium', 'chromium-browser'].find((c) => sh(`command -v ${c}`).trim());
  const [cmd, args] = chrome ? [chrome, [`--app=file://${page}`, '--window-size=420,700']]
    : w ? ['cmd', ['/c', 'start', '', page]] : [process.platform === 'darwin' ? 'open' : 'xdg-open', [page]];
  spawn(cmd, args, { detached: true, stdio: 'ignore' }).unref();
  console.log(page);
}

const a = process.argv[2];
if (a === '--session') console.log(`## workflow context for this project (auto-loaded; do not hand-edit)\n${update()}Rules: after each meaningful change, run \`node "${__filename}" "<one-line summary, <100 chars>"\`. For each non-trivial choice (library, approach, tradeoff), run \`node "${__filename}" --decide "<choice>" "<benefit>" "<cost>"\` (each <80 chars); the user watches these in a floating window.`);
else if (a === '--decide') decide(...process.argv.slice(3, 6));
else if (a === '--board') open();
else update(a);
