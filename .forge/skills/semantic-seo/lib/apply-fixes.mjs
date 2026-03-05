// apply-fixes.mjs — Search/replace with orphaned cap repair
export function applyFixes(body, replacements) {
  const changes = [];
  for (const { pattern, replacement, flags } of replacements) {
    const regex = new RegExp(pattern, flags || 'gi');
    const matches = body.match(regex);
    if (matches && matches.length > 0) {
      body = body.replace(regex, replacement);
      changes.push({ pattern, count: matches.length });
    }
  }
  if (changes.length > 0) {
    body = body.replace(/(\.\s+)([a-z])/g, (_, pre, c) => pre + c.toUpperCase());
    body = body.replace(/(\n\n)([a-z])/g, (_, pre, c) => pre + c.toUpperCase());
    body = body.replace(/ {2,}/g, ' ');
    body = body.replace(/\n /g, '\n');
  }
  return { body, changes };
}

export function normalizeApostrophes(text) {
  return text.replace(/\u2018/g, "'").replace(/\u2019/g, "'").replace(/\u201C/g, '"').replace(/\u201D/g, '"');
}
