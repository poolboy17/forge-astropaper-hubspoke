// preflight-audit.mjs — Check for encoding issues
// Usage: node preflight-audit.mjs <content-dir>
import { readdirSync, readFileSync } from 'fs';
import { join, relative } from 'path';

const MOJIBAKE = /â€|Ã©|Ã¨|Ã¼|Ã¶|Ã¤|â€™|â€œ|Â/;

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

const d = process.argv[2];
if (!d) { console.error('Usage: node preflight-audit.mjs <content-dir>'); process.exit(1); }
const files = walk(d);
let issues = 0;
console.log(`\nPreflight — ${files.length} files\n`);
for (const f of files) {
  const t = readFileSync(f, 'utf-8');
  const probs = [];
  if (MOJIBAKE.test(t)) probs.push('mojibake');
  if (t.includes('\0')) probs.push('null-bytes');
  if (t.charCodeAt(0) === 0xFEFF) probs.push('BOM');
  if (probs.length) { console.log(`  ✗ ${relative(d, f)}: ${probs.join(', ')}`); issues++; }
}
console.log(issues === 0 ? '  ✓ All clean\n' : `\n  ${issues} files with issues\n`);
