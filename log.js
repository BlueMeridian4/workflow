#!/usr/bin/env node
// Usage: log.js "what changed" | log.js (refresh) | log.js --session (hook: refresh + print)
//        log.js --decide "choice" "benefit" "cost" | log.js --review "PR" "tldr" "flag" | log.js --find "name" "what" "url" "take" | log.js --board [--research] [path] (open the floating window)
// Context lives outside the repo (~/.claude/workflow/<project>.md): per-project, never committed.
const fs = require('fs'), os = require('os'), path = require('path');
const { execSync, spawn } = require('child_process');
const MAX_LOG = 20; // hard cap on log entries; oldest dropped
const MAX_WIN = 15; // hard cap on windows listed
const MAX_DEC = 15; // hard cap on decisions kept
const MAX_REV = 10; // hard cap on review summaries kept
const MAX_FIND = 12; // hard cap on research findings kept
const sh = (c) => { try { return execSync(c, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch { return ''; } };

const home = path.join(os.homedir(), '.claude', 'workflow');
fs.mkdirSync(home, { recursive: true });
const detected = process.env.CLAUDE_PROJECT_DIR || sh('git rev-parse --show-toplevel').trim();
let root, base, file;
const use = (r) => { root = r; base = path.join(home, r.replace(/[\\/:]/g, '-')); file = base + '.md'; };
use(detected || process.cwd());

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
  fs.writeFileSync(file, text);
  return text;
}

const read = (k) => { try { return JSON.parse(fs.readFileSync(`${base}.${k}.json`, 'utf8')); } catch { return []; } };
function add(k, item, max) { // append to a capped list, then refresh the board
  fs.writeFileSync(`${base}.${k}.json`, JSON.stringify(read(k).concat({ t: new Date().toLocaleString('sv').slice(5, 16), ...item }).slice(-max)));
  board();
}
const decide = (what, benefit = '', cost = '') => add('decisions', { what, benefit, cost }, MAX_DEC);
const review = (ref, tldr = '', flag = '') => add('reviews', { ref, tldr, flag }, MAX_REV);
const find = (name, what = '', url = '', take = '') => add('research', { name, what, url, take }, MAX_FIND);

// Static page + data file. The page polls the data file (no reload), so scroll, pane size and expanded items survive.
function board() {
  fs.writeFileSync(base + '.board.js', 'window.BOARD=' + JSON.stringify({ name: path.basename(root), decisions: read('decisions'), reviews: read('reviews'), research: read('research') }));
  fs.writeFileSync(base + '.html', PAGE.replace('DATA.JS', path.basename(base) + '.board.js'));
}

const PAGE = `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width"><title>board</title>
<style>:root{--bg:#fff;--fg:#1a1a1a;--dim:#767676;--line:#e2e2e2;--g:#1a7f37;--r:#b42318}
@media(prefers-color-scheme:dark){:root{--bg:#161616;--fg:#e8e8e8;--dim:#8a8a8a;--line:#2e2e2e;--g:#56d364;--r:#ff7b72}}
*{box-sizing:border-box}body{background:var(--bg);color:var(--fg);font:14px/1.4 system-ui;margin:0;height:100vh;display:flex;flex-direction:column}
section{padding:10px 14px;overflow:auto}#d{height:50vh;min-height:20vh;resize:vertical;border-bottom:3px double var(--line)}#r,#x{flex:1}body[data-v=research] #d,body[data-v=research] #r,body[data-v=board] #x{display:none}
h2{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--dim);margin:0 0 8px;font-weight:600}
.i{padding:6px 0;border-bottom:1px solid var(--line)}.i:last-child{border:0}.i b{font-weight:600}.t{color:var(--dim);font-size:12px;margin-left:6px}
.g{color:var(--g)}.r{color:var(--r)}.s{color:var(--dim)}p{margin:2px 0}summary{cursor:pointer;list-style:none}a{color:inherit;text-decoration:none;border-bottom:1px dotted var(--dim)}details p{margin-left:2px}</style>
<section id=d></section><section id=r></section><section id=x></section>
<script>
const e=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
let last='';const v=new URLSearchParams(location.search).get('view')||'board';document.body.dataset.v=v;
function draw(b){const k=JSON.stringify(b);if(k===last)return;last=k;document.title=b.name+' '+v;
const open=new Set([...document.querySelectorAll('details[open]')].map(x=>x.id));
d.innerHTML='<h2>Decisions</h2>'+([...b.decisions].reverse().map(x=>'<div class=i><b>'+e(x.what)+'</b><span class=t>'+e(x.t)+'</span>'+(x.benefit?'<p class=g>+ '+e(x.benefit)+'</p>':'')+(x.cost?'<p class=r>&minus; '+e(x.cost)+'</p>':'')+'</div>').join('')||'<p class=s>None yet</p>');
r.innerHTML='<h2>Review</h2>'+([...b.reviews].reverse().map(x=>{const id='r'+x.t+x.ref;return '<details class=i id="'+e(id)+'"'+(open.has(id)?' open':'')+'><summary><b>'+e(x.ref)+'</b><span class=t>'+e(x.t)+'</span><p>'+e(x.tldr)+'</p></summary>'+(x.flag?'<p class=r>'+e(x.flag)+'</p>':'<p class=g>No flags</p>')+'</details>'}).join('')||'<p class=s>None yet</p>');
x.innerHTML='<h2>Research</h2>'+([...(b.research||[])].reverse().map(f=>{const n='<b>'+e(f.name)+'</b>';return '<div class=i>'+(/^https?:[/][/]/.test(f.url)?'<a href="'+e(f.url)+'" target=_blank rel=noopener>'+n+'</a>':n)+'<p>'+e(f.what)+'</p>'+(f.take?'<p class=s>&rarr; '+e(f.take)+'</p>':'')+'</div>'}).join('')||'<p class=s>None yet</p>');}
function poll(){const s=document.createElement('script');s.src='DATA.JS?'+Date.now();s.onload=()=>{draw(window.BOARD);s.remove()};s.onerror=()=>s.remove();document.head.append(s)}
poll();setInterval(poll,3000);
</script>`;

function open(argv) {
  const view = argv.includes("--research") ? 'research' : 'board', arg = argv.find((x) => !x.startsWith('--'));
  if (arg) { const r = path.resolve(arg); use(sh(`git -C ${JSON.stringify(r)} rev-parse --show-toplevel`).trim() || r); }
  else if (!detected) { // not in a project: fall back to the most recently updated one
    try {
      const md = fs.readdirSync(home).filter((f) => f.endsWith('.md')).map((f) => path.join(home, f)).sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
      use(fs.readFileSync(md, 'utf8').match(/^# Context: (.*) \(~/)[1]);
    } catch { /* no projects yet: empty board for cwd */ }
  }
  board();
  const page = `file://${base}.html?view=${view}`, w = process.platform === 'win32';
  const chrome = ['google-chrome', 'chromium', 'chromium-browser'].find((c) => sh(`command -v ${c}`).trim());
  const [cmd, args] = chrome ? [chrome, [`--app=${page}`, '--window-size=420,700']]
    : w ? ['cmd', ['/c', 'start', '', page]] : [process.platform === 'darwin' ? 'open' : 'xdg-open', [page]];
  spawn(cmd, args, { detached: true, stdio: 'ignore' }).unref();
  console.log(`${root}\n${page}`);
}

const a = process.argv[2];
if (a === '--session') console.log(`## workflow context for this project (auto-loaded; do not hand-edit)\n${update()}Rules: after each meaningful change, run \`node "${__filename}" "<one-line summary, <100 chars>"\`. For each non-trivial choice (library, approach, tradeoff), run \`node "${__filename}" --decide "<choice>" "<benefit>" "<cost>"\` (each <80 chars); the user watches these in a floating window.`);
else if (a === '--decide') decide(...process.argv.slice(3, 6));
else if (a === '--review') review(...process.argv.slice(3, 6));
else if (a === '--find') find(...process.argv.slice(3, 7));
else if (a === '--board') open(process.argv.slice(3));
else update(a);
