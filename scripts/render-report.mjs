#!/usr/bin/env node
// deep-tester: render evidence.json into self-contained report.html and map.html.
// Evidence model adapted from MIT-licensed material; this renderer is new code. See THIRD-PARTY-NOTICES.md. Node 18+, no dependencies.
import fs from 'node:fs';
import path from 'node:path';

const STATUS = new Set(['planned', 'running', 'passed', 'failed', 'blocked', 'deferred']);
const RUN_STATUS = new Set(['running', 'completed', 'partial', 'blocked', 'canceled']);
const STRENGTH = new Set(['demonstrated', 'source-proven', 'suspected']);
const SEVERITY = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const MAX_IMAGE = 5 * 1024 * 1024;
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };

const file = process.argv[2];
if (!file) {
  console.error('Usage: node render-report.mjs <path/to/evidence.json> [--out <dir>]');
  process.exit(2);
}
const outIdx = process.argv.indexOf('--out');
const runDir = path.dirname(path.resolve(file));
const outDir = outIdx > -1 ? path.resolve(process.argv[outIdx + 1]) : runDir;

let s;
try { s = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { fail(`Cannot read ${file}: ${e.message}`); }

const problems = [];
const arr = k => (Array.isArray(s[k]) ? s[k] : []);
for (const k of ['checks', 'findings', 'pages', 'journeys', 'personas', 'blockers']) s[k] = arr(k);
if (s.schema !== 'deep-tester.evidence/v1') problems.push('schema must be "deep-tester.evidence/v1"');
if (!s.title) problems.push('title is required');
if (s.status && !RUN_STATUS.has(s.status)) problems.push(`run status "${s.status}" is not one of ${[...RUN_STATUS].join(', ')}`);
const ids = new Set();
for (const c of s.checks) {
  const label = `check "${c.id || c.title || '?'}"`;
  if (!c.id || !c.title) problems.push(`${label}: id and title are required`);
  if (c.id && ids.has(c.id)) problems.push(`${label}: duplicate id`);
  ids.add(c.id);
  c.status = c.status || 'planned';
  if (!STATUS.has(c.status)) problems.push(`${label}: status "${c.status}" is not allowed`);
  if (['passed', 'failed'].includes(c.status) && (!str(c.actual) || !str(c.evidence)))
    problems.push(`${label}: ${c.status} needs both "actual" and "evidence"`);
}
if (s.status === 'completed' && s.checks.some(c => ['planned', 'running'].includes(c.status)))
  problems.push('run is "completed" but some checks are still planned/running: mark them deferred or blocked');
for (const f of s.findings) {
  const label = `finding "${f.id || f.title || '?'}"`;
  if (!f.title || !f.consequence) problems.push(`${label}: title and consequence are required`);
  if (f.severity && !SEVERITY.includes(String(f.severity).toUpperCase())) problems.push(`${label}: severity must be ${SEVERITY.join('/')}`);
  if (f.strength && !STRENGTH.has(f.strength)) problems.push(`${label}: strength must be ${[...STRENGTH].join('/')}`);
}
for (const j of s.journeys) {
  if (!j.id || !j.title || !Array.isArray(j.steps)) { problems.push(`journey "${j.id || '?'}": id, title and steps are required`); continue; }
  for (const st of j.steps) {
    st.status = STATUS.has(st.status) ? st.status : 'planned';
    if (['passed', 'failed'].includes(st.status) && !str(st.evidence)) problems.push(`journey "${j.id}" step "${st.title}": ${st.status} needs evidence`);
  }
}
if (s.confidence) {
  const c = s.confidence;
  if (!str(c.scope) || !str(c.rationale)) problems.push('confidence needs scope and rationale');
  if (c.score !== undefined && !(Number.isFinite(c.score) && c.score >= 0 && c.score <= 100)) problems.push('confidence score must be 0-100, or left out');
}
const images = new Map();
for (const p of s.pages) {
  if (!p.title) problems.push(`page "${p.id || '?'}": title is required`);
  if (p.screenshot) {
    const img = path.resolve(runDir, p.screenshot);
    const ext = path.extname(img).toLowerCase();
    if (!img.startsWith(runDir + path.sep)) problems.push(`page "${p.id}": screenshot must be inside the run folder`);
    else if (!MIME[ext]) problems.push(`page "${p.id}": screenshot must be PNG, JPEG or WebP`);
    else if (!fs.existsSync(img)) problems.push(`page "${p.id}": screenshot not found: ${p.screenshot}`);
    else if (fs.statSync(img).size > MAX_IMAGE) problems.push(`page "${p.id}": screenshot over 5 MB`);
    else images.set(p.id, `data:${MIME[ext]};base64,${fs.readFileSync(img).toString('base64')}`);
  }
}
if (problems.length) fail('Evidence file has problems:\n- ' + problems.join('\n- '));

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'report.html'), page('report'));
fs.writeFileSync(path.join(outDir, 'map.html'), page('map'));
console.log(JSON.stringify({ report: path.join(outDir, 'report.html'), map: path.join(outDir, 'map.html'),
  checks: s.checks.length, findings: s.findings.length, pages: s.pages.length }));

function fail(msg) { console.error(msg); process.exit(1); }
function str(v) { return typeof v === 'string' ? v.trim() : v == null ? '' : String(v); }
function esc(v) { return str(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function fact(label, v) { return str(v) ? `<div class="fact"><b>${esc(label)}</b><pre>${esc(v)}</pre></div>` : ''; }
function badge(text, cls = '') { return `<span class="badge ${esc(cls)}">${esc(text)}</span>`; }
function onPage(item, p) { return item.page && (item.page === p.id || (p.url && item.page === p.url)); }

function checkRow(c) {
  return `<div class="item"><div class="spread"><strong>${esc(c.title)}</strong>${badge(c.status, c.status)}</div>
<small class="muted">${esc([c.domain, c.type, c.lane].filter(Boolean).join(' · '))}</small>
<details><summary>Steps and evidence</summary>${fact('Why it matters', c.risk)}${fact('Steps / inputs', c.steps)}${fact('Expected', c.expected)}${fact('Actual', c.actual)}${fact('Evidence', c.evidence)}</details></div>`;
}
function findingCard(f) {
  const sev = String(f.severity || 'MEDIUM').toUpperCase();
  return `<article class="card">${badge(sev, 'sev-' + sev.toLowerCase())} ${badge(f.strength || 'suspected')}
<h3>${esc(f.title)}</h3><p>${esc(f.consequence)}</p>
<details><summary>Reproduce, fix and verify</summary>${fact('Reproduction', f.steps)}${fact('Evidence', f.evidence)}${fact('Suggested fix', f.remediation)}${fact('Verify the fix', f.verification)}</details></article>`;
}

function reportBody() {
  const count = {};
  for (const c of s.checks) count[c.status] = (count[c.status] || 0) + 1;
  const order = ['passed', 'failed', 'blocked', 'deferred', 'running', 'planned'].filter(k => count[k]);
  const findings = [...s.findings].sort((a, b) => SEVERITY.indexOf(String(a.severity || 'MEDIUM').toUpperCase()) - SEVERITY.indexOf(String(b.severity || 'MEDIUM').toUpperCase()));
  const c = s.confidence;
  return `
${s.current ? `<section class="card"><small class="muted">${s.status === 'running' ? 'WORKING ON NOW' : 'LAST ACTIVITY'}</small><h2>${esc(s.current)}</h2>${s.why ? `<p>${esc(s.why)}</p>` : ''}</section>` : ''}
${s.summary ? `<p class="lead">${esc(s.summary)}</p>` : ''}
${s.blockers.length ? `<section class="card warn"><h2>Needs attention</h2>${s.blockers.map(b => `<p>${esc(b)}</p>`).join('')}</section>` : ''}
${s.checks.length ? `<section class="card"><h2>Coverage of the selected scope</h2>
<div class="bar" role="img" aria-label="${esc(order.map(k => count[k] + ' ' + k).join(', '))}">${order.map(k => `<span class="${k}" style="flex:${count[k]}"></span>`).join('')}</div>
<p>${order.map(k => badge(count[k] + ' ' + k, k)).join(' ')}</p>
<p class="muted">Counts of the checks selected for this run, not a percentage of the whole app.</p></section>` : ''}
<section class="card"><h2>Confidence in the tested scope${c && c.score !== undefined ? ` · ${esc(c.score)}/100` : ''}</h2>
${c ? `${fact('Scope', c.scope)}${fact('Rationale', c.rationale)}${fact('Limitations', c.limitations)}` : '<p>Not assessed.</p>'}
<p class="muted">An evidence-qualified judgement, not a probability of correctness or a certification.</p></section>
<h2>Findings · ${findings.length}</h2>${findings.length ? findings.map(findingCard).join('') : '<p class="muted">No findings recorded.</p>'}
${s.checks.length ? `<details class="card" open><summary><h2 class="inline">Checks · ${s.checks.length}</h2></summary>${s.checks.map(checkRow).join('')}</details>` : ''}
${s.journeys.length ? `<h2>Journeys</h2>${s.journeys.map(j => `<article class="card"><h3>${esc(j.title)}</h3>${j.intent ? `<p class="muted">${esc(j.intent)}</p>` : ''}<ol>${j.steps.map(st => `<li>${esc(st.title)} ${badge(st.status, st.status)}${st.evidence ? `<br><small class="muted">${esc(st.evidence)}</small>` : ''}</li>`).join('')}</ol></article>`).join('')}` : ''}
${s.personas.length ? `<h2>Persona journeys</h2><p class="muted">Simulated perspectives grounded in observed behaviour, not user research.</p><div class="grid">${s.personas.map(p => `<article class="card"><h3>${esc(p.lens || 'Persona')}</h3>${fact('Intent', p.intent)}${fact('Journey', p.journey)}${fact('Reaction', p.reaction)}${fact('Evidence', p.evidence)}</article>`).join('')}</div>` : ''}`;
}

function mapBody() {
  const cards = s.pages.map(p => {
    const checks = s.checks.filter(c => onPage(c, p));
    const finds = s.findings.filter(f => onPage(f, p));
    return `<article class="card"><h3>${esc(p.title)}</h3>${p.url ? `<p class="muted">${esc(p.url)}</p>` : ''}
${images.has(p.id) ? `<a href="#shot-${esc(p.id)}"><img class="shot" src="${images.get(p.id)}" alt="Screenshot of ${esc(p.title)} captured during testing"></a>
<div class="zoom" id="shot-${esc(p.id)}"><a href="#" aria-label="Close"><img src="${images.get(p.id)}" alt="Screenshot of ${esc(p.title)}, enlarged"></a></div>` : '<p class="muted">No screenshot captured.</p>'}
${fact('Observed', p.description)}
${finds.length ? `<h4>Findings</h4>${finds.map(f => `<p>${badge(String(f.severity || 'MEDIUM').toUpperCase(), 'sev-' + String(f.severity || 'medium').toLowerCase())} ${esc(f.title)}</p>`).join('')}` : ''}
${checks.length ? `<h4>Checks</h4>${checks.map(c => `<p>${badge(c.status, c.status)} ${esc(c.title)}</p>`).join('')}` : ''}</article>`;
  }).join('');
  const orphan = s.checks.filter(c => !s.pages.some(p => onPage(c, p)));
  return `<h2>Map of this run</h2><p class="muted">Pages and states captured in this run only; it does not compare runs.</p>
<div class="grid">${cards || '<p>No pages were captured in this run. Capture approved pages in a new run to build a map.</p>'}</div>
${orphan.length ? `<details class="card"><summary>Checks without a captured page · ${orphan.length}</summary>${orphan.map(checkRow).join('')}</details>` : ''}`;
}

function page(mode) {
  const other = mode === 'map' ? 'report' : 'map';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="referrer" content="no-referrer"><title>${esc(s.title)} · ${mode}</title><style>
:root{--bg:#f7f8f7;--fg:#17201c;--muted:#5b6862;--card:#fff;--line:#d9dfdb;--pass:#2f7d4f;--fail:#b3261e;--block:#9a6400;--defer:#6b6f86;--accent:#255f85}
@media (prefers-color-scheme:dark){:root{--bg:#101514;--fg:#e8eee9;--muted:#9fb0a7;--card:#18201d;--line:#2d3a34;--pass:#5fbf86;--fail:#ff8a80;--block:#e2b45c;--defer:#a5a9c4;--accent:#7fb7dd}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,-apple-system,Segoe UI,sans-serif}
header,main{max-width:1060px;margin:auto;padding:16px}header{border-bottom:1px solid var(--line);display:flex;flex-wrap:wrap;gap:8px;justify-content:space-between;align-items:center}
h1{font-size:1.5rem;margin:.2rem 0}h2{font-size:1.15rem;margin:1.2rem 0 .5rem}h2.inline{display:inline;margin:0}h3{margin:.4rem 0}h4{margin:.8rem 0 .2rem}
.muted{color:var(--muted)}.lead{font-size:1.05rem}a{color:var(--accent)}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px;margin:10px 0}.warn{border-color:var(--block)}
.item{border-top:1px solid var(--line);padding:8px 0}.spread{display:flex;justify-content:space-between;gap:8px;align-items:center}
.badge{display:inline-block;border:1px solid var(--line);border-radius:999px;padding:1px 9px;font-size:.8rem;white-space:nowrap}
.passed{color:var(--pass);border-color:var(--pass)}.failed,.sev-critical,.sev-high{color:var(--fail);border-color:var(--fail)}
.blocked,.sev-medium{color:var(--block);border-color:var(--block)}.deferred,.planned,.running,.sev-low{color:var(--defer);border-color:var(--defer)}
.bar{display:flex;height:12px;border-radius:6px;overflow:hidden;margin:8px 0;gap:2px}.bar span{background:currentColor}
.bar .passed{background:var(--pass)}.bar .failed{background:var(--fail)}.bar .blocked{background:var(--block)}.bar .deferred,.bar .planned,.bar .running{background:var(--defer)}
.fact pre{white-space:pre-wrap;word-break:break-word;margin:.2rem 0 .6rem;font:inherit;color:var(--fg)}.fact b{font-size:.85rem;color:var(--muted)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px}
.shot{width:100%;border:1px solid var(--line);border-radius:6px}.zoom{display:none}.zoom:target{display:flex;position:fixed;inset:0;background:rgba(0,0,0,.85);align-items:center;justify-content:center;padding:16px;z-index:9}
.zoom img{max-width:100%;max-height:100%}details summary{cursor:pointer}nav a{margin-left:12px}
</style></head><body><header><div><small class="muted">deep-tester · ${esc(s.mode || 'run')} · ${esc(s.status || 'running')}</small><h1>${esc(s.title)}</h1>
${s.target ? `<small class="muted">${esc(s.target)}</small>` : ''}</div><nav><strong>${mode === 'map' ? 'Map' : 'Report'}</strong><a href="${other}.html">${other === 'map' ? 'Map' : 'Report'}</a></nav></header>
<main>${mode === 'map' ? mapBody() : reportBody()}
<p class="muted"><small>Run ${esc(s.id || '')} · updated ${esc(s.updatedAt || '')}. Review for sensitive data before sharing.</small></p></main></body></html>`;
}
