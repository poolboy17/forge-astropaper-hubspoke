#!/usr/bin/env node
// suggest-links.mjs — Find reciprocal link opportunities
// Usage: node suggest-links.mjs <site-root> <target-slug>
import { readdirSync, readFileSync } from 'fs';
import { join, relative } from 'path';

function walk(dir) {
  const r = [];
  for (const i of readdirSync(dir, { withFileTypes: true })) {
    if (i.name.startsWith('.') || i.name === 'node_modules') continue;
    const f = join(dir, i.name);
    if (i.isDirectory()) r.push(...walk(f));
    else if (i.name.endsWith('.md') || i.name.endsWith('.mdx')) r.push(f);
  }
  return r;
}

function getTitle(text) {
  const m = text.match(/title:\s*["']?(.+?)["']?\s*$/m);
  return m ? m[1] : '';
}

function getEntities(text) {
  return [...new Set((text.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g) || []))];
}

const [,, siteRoot, targetSlug] = process.argv;
if (!siteRoot || !targetSlug) { console.error('Usage: node suggest-links.mjs <site-root> <slug>'); process.exit(1); }

let allFiles = [];
for (const d of ['src/content', 'src/data'].map(x => join(siteRoot, x))) {
  try { allFiles.push(...walk(d)); } catch {}
}

const targetFile = allFiles.find(f => f.includes(targetSlug));
if (!targetFile) { console.error(`Not found: ${targetSlug}`); process.exit(1); }

const targetText = readFileSync(targetFile, 'utf-8');
const targetTitle = getTitle(targetText) || targetSlug;
const targetEntities = getEntities(targetText);

console.log(`\nSuggestions for: ${targetTitle}`);
console.log(`Entities: ${targetEntities.slice(0, 8).join(', ')}\n${'─'.repeat(50)}\n`);

const suggestions = [];
for (const f of allFiles) {
  if (f === targetFile) continue;
  const text = readFileSync(f, 'utf-8');
  if (text.includes(targetSlug)) continue; // already links
  const matched = targetEntities.filter(e => text.toLowerCase().includes(e.toLowerCase()));
  if (matched.length >= 2) {
    suggestions.push({ slug: f.replace(/.*[/\\]/, '').replace(/\.mdx?$/, ''), title: getTitle(text), file: relative(siteRoot, f), matched: matched.length, terms: matched.slice(0, 5) });
  }
}

suggestions.sort((a, b) => b.matched - a.matched);
if (!suggestions.length) console.log('  No opportunities found.\n');
else {
  console.log(`  ${suggestions.length} articles could link to ${targetSlug}:\n`);
  for (const s of suggestions.slice(0, 15)) {
    console.log(`  → ${s.title || s.slug}`);
    console.log(`    ${s.file} (${s.matched} shared: ${s.terms.join(', ')})\n`);
  }
}
