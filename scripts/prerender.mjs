#!/usr/bin/env node
/* Bakes the English text of /docs/* and the blog posts into their HTML shells.

   docs.js and landing.js own those bodies as strings and paint them after the
   page loads, so a crawler that does not run scripts (most AI search bots, and
   Google's first pass) used to see ~25 words and no H1 on every docs page and
   an empty post body on every blog post. This script runs the SAME two files
   in a sandbox with a minimal fake DOM, captures what they would paint for
   English, and writes it inside the shell. The scripts still run in the
   browser and still repaint (Spanish, or English again), so nothing changes
   for a visitor; the shell just stops being empty.

   Run after editing a docs/blog string in docs.js or landing.js:
     node scripts/prerender.mjs          # rewrite the shells
     node scripts/prerender.mjs --check  # exit 1 if a shell is stale (CI)

   No dependencies: node:vm only. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WEB = path.join(ROOT, 'website');
const CHECK = process.argv.includes('--check');

function fakeNode(attrs = {}) {
  return {
    attrs, innerHTML: '', textContent: '',
    getAttribute(name) { return name in this.attrs ? this.attrs[name] : null; },
    hasAttribute(name) { return name in this.attrs; },
    setAttribute(name, value) { this.attrs[name] = String(value); },
    removeAttribute(name) { delete this.attrs[name]; },
    addEventListener() {},
    querySelector() { return null; },
    querySelectorAll() { return []; },
    closest() { return null; },
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
  };
}

/* Runs `file` with a document whose querySelector/querySelectorAll answer from
   `nodes` ({selector: node | [nodes]}); everything else is absent. */
function run(file, nodes, pathname = '/') {
  const one = (sel) => { const v = nodes[sel]; return Array.isArray(v) ? v[0] || null : v || null; };
  const all = (sel) => { const v = nodes[sel]; return Array.isArray(v) ? v : v ? [v] : []; };
  const documentElement = fakeNode();
  const document = {
    readyState: 'complete', title: '', documentElement, body: fakeNode(),
    querySelector: one, querySelectorAll: all,
    addEventListener() {}, createElement: () => fakeNode(),
  };
  const window = { addEventListener() {}, dispatchEvent() {}, HumanRoundsI18n: undefined };
  const sandbox = {
    window, document,
    location: { pathname, search: '', href: 'https://humanrounds.org' + pathname },
    localStorage: { getItem: () => null, setItem() {} },
    navigator: { languages: ['en'] },
    URL, URLSearchParams, console,
    CustomEvent: function CustomEvent(type, init) { this.type = type; this.detail = init && init.detail; },
  };
  window.document = document;
  vm.runInNewContext(fs.readFileSync(path.join(WEB, file), 'utf8'), sandbox, { filename: file });
  return document;
}

const START = '<!-- prerendered: scripts/prerender.mjs -->';
const END = '<!-- /prerendered -->';
const strip = (s) => s.replace(new RegExp(`${START}[\\s\\S]*?${END}`, 'g'), '');

let stale = 0;
function write(rel, before, after) {
  if (before === after) return;
  stale++;
  if (CHECK) { console.error(`stale: website/${rel}`); return; }
  fs.writeFileSync(path.join(WEB, rel), after);
  console.log(`prerendered: website/${rel}`);
}

/* ---- docs: nav + article body, exactly what docs.js paints for English ---- */
for (const name of fs.readdirSync(path.join(WEB, 'docs')).filter((f) => f.endsWith('.html')).sort()) {
  const rel = `docs/${name}`;
  const html = fs.readFileSync(path.join(WEB, rel), 'utf8');
  const id = (html.match(/data-docs-page="([^"]+)"/) || [])[1];
  if (!id) continue;
  const nav = fakeNode();
  const article = fakeNode({ 'data-docs-page': id });
  run('docs.js', { '[data-docs-nav]': nav, '[data-docs-page]': article });
  if (!article.innerHTML) throw new Error(`docs.js painted nothing for "${id}" (${rel})`);
  let out = strip(html);
  out = out.replace(/(<nav\b[^>]*\bdata-docs-nav\b[^>]*>)(<\/nav>)/,
    (_, open, close) => open + START + nav.innerHTML + END + close);
  out = out.replace(/(<article\b[^>]*\bdata-docs-page="[^"]+"[^>]*>)(<\/article>)/,
    (_, open, close) => open + START + article.innerHTML + END + close);
  write(rel, html, out);
}

/* ---- blog: every empty data-i18n-html element gets landing.js's English ---- */
for (const name of fs.readdirSync(path.join(WEB, 'blog')).filter((f) => f.endsWith('.html')).sort()) {
  const rel = `blog/${name}`;
  const html = fs.readFileSync(path.join(WEB, rel), 'utf8');
  const base = strip(html);
  const re = /(<(\w+)\b[^>]*\bdata-i18n="([^"]+)"[^>]*\bdata-i18n-html\b[^>]*>)(<\/\2>)/g;
  const keys = [...base.matchAll(re)].map((m) => m[3]);
  if (!keys.length) continue;
  const nodes = keys.map((k) => fakeNode({ 'data-i18n': k, 'data-i18n-html': '' }));
  run('landing.js', { '[data-i18n]': nodes }, `/blog/${name}`);
  const byKey = Object.fromEntries(nodes.map((n) => [n.attrs['data-i18n'], n.innerHTML]));
  const out = base.replace(re, (all, open, _tag, key, close) =>
    byKey[key] ? open + START + byKey[key] + END + close : all);
  write(rel, html, out);
}

if (CHECK && stale) {
  console.error(`${stale} shell(s) out of date — run: node scripts/prerender.mjs`);
  process.exit(1);
}
if (!CHECK && !stale) console.log('prerender: every shell already up to date');
