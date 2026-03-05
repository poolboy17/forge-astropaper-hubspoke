#!/usr/bin/env node
// evaluate-article.mjs — Score article across 8 dimensions
// Usage: node evaluate-article.mjs path/to/article.md [--json]
import { readFileSync } from 'fs';
import { resolve } from 'path';

function parseFM(text) {
  if (!text.startsWith('---')) return { fm: {}, body: text };
  const end = text.indexOf('---', 3);
  if (end === -1) return { fm: {}, body: text };
  const fm = {}; let cl = null;
  for (const line of text.slice(3, end).trim().split('\n')) {
    const s = line.trim();
    if (!s || s.startsWith('#')) continue;
    if (s.startsWith('- ')) { if (cl) cl.push(s.slice(2).trim().replace(/^["']|["']$/g,'')); continue; }
    const m = s.match(/^(\w[\w-]*):\s*(.*)/);
    if (m) { const v = m[2].trim().replace(/^["']|["']$/g,'');
      if (v==='') { cl=[]; fm[m[1]]=cl; } else { cl=null; fm[m[1]]=v==='true'?true:v==='false'?false:/^\d+$/.test(v)?+v:v; }}
  }
  return { fm, body: text.slice(end+3).trim() };
}

function strip(t) { return t.replace(/!\[.*?\]\(.*?\)/g,'').replace(/\[([^\]]*)\]\([^)]*\)/g,'$1').replace(/[#*_`~>]/g,'').replace(/\s+/g,' ').trim(); }

function scoreEntities(b) { const c=new Set((strip(b).match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g)||[])).size; return {score:c>=15?5:c>=10?4:c>=5?3:c>=3?2:1,count:c}; }
function scoreTemporal(b) { const y=new Set(b.match(/\b[12]\d{3}\b/g)||[]).size+(new Set(b.match(/\b\d{1,2}(?:st|nd|rd|th)\s+century/gi)||[])).size; return {score:y>=10?5:y>=6?4:y>=3?3:y>=1?2:1,count:y}; }
function scoreSources(b) { const p=[/\baccording to\b/gi,/\bscholarship\b/gi,/\bresearch\b/gi,/\bProfessor\b/g,/\bDr\.\b/g,/\buniversity\b/gi,/\bmuseum\b/gi,/\bjournal\b/gi,/\bpublished\b/gi]; const c=p.filter(r=>r.test(b)).length; return {score:c>=7?5:c>=4?4:c>=2?3:c>=1?2:1,count:c}; }
function scoreBreadth(b) { const h2s=(b.match(/^##\s+(.+)$/gm)||[]); const stop=new Set('the a an and or of in to for on at by with from is are was were its this that'.split(' ')); const w=new Set(); h2s.forEach(h=>(h.replace(/^##\s+/,'').match(/[A-Za-z]+/g)||[]).forEach(x=>{if(!stop.has(x.toLowerCase())&&x.length>2)w.add(x.toLowerCase())})); return {score:w.size>=15&&h2s.length>=8?5:w.size>=10&&h2s.length>=6?4:w.size>=8&&h2s.length>=4?3:w.size>=5?2:1,count:w.size,h2s:h2s.length}; }
function scoreData(b) { const c=(b.match(/\b\d[\d,.]+\s*(%|percent|million|billion|km|miles|feet|meters|dollars|\$|€|£)/gi)||[]).length; return {score:c>=10?5:c>=6?4:c>=3?3:c>=1?2:1,count:c}; }
function scoreAEO(b) { let s=0; const fp=b.split('\n\n')[0]||''; if(/\b(is|was|are|were|refers?\s+to|dates?\s+to|represents?)\b/i.test((fp.split(/[.!?]/)[0]||'')))s++; const qh=(b.match(/^##?#?\s+(.+)$/gm)||[]).filter(h=>/^##?#?\s+(What|When|Where|Who|Why|How|Can|Did|Does|Is|Are)\b/i.test(h)).length; if(qh>=3)s+=2;else if(qh>=2)s++; if(/\b[A-Z][a-z]+(?:\s+[A-Z]?[a-z]+)*\s+(is|refers?\s+to|represents?)\s/m.test(b))s++; if(/^[-*]\s+/m.test(b)||/^\d+\.\s+/m.test(b))s++; return {score:Math.min(5,Math.max(1,s)),qh}; }
function scoreLinking(b) { const c=(b.match(/\[[^\]]*\]\(\/[^)]*\)/g)||[]).length; return {score:c>=6?5:c>=4?4:c>=3?3:c>=1?2:1,count:c}; }
function scoreHedging(b) { const p=[/tradition\s+holds/gi,/scholarship\s+suggests/gi,/evidence\s+indicates/gi,/scholars\s+believe/gi,/some\s+scholars/gi,/research\s+suggests/gi,/may\s+have\s+been/gi]; const c=p.filter(r=>r.test(b)).length; return {score:c>=5?5:c>=3?4:c>=2?3:c>=1?2:1,count:c}; }

const fp = process.argv[2];
if (!fp) { console.error('Usage: node evaluate-article.mjs <article.md> [--json]'); process.exit(1); }
const json = process.argv.includes('--json');
const text = readFileSync(resolve(fp), 'utf-8');
const { fm, body } = parseFM(text);
const wc = strip(body).split(/\s+/).length;
const dims = { entities:scoreEntities(body), temporal:scoreTemporal(body), sources:scoreSources(body), breadth:scoreBreadth(body), data:scoreData(body), aeo:scoreAEO(body), linking:scoreLinking(body), hedging:scoreHedging(body) };
const total = Object.values(dims).reduce((s,d)=>s+d.score,0);
const grade = total>=36?'A':total>=28?'B':total>=20?'C':'D';
const slug = fp.replace(/.*[/\\]/,'').replace(/\.mdx?$/,'');
const top3 = Object.entries(dims).sort(([,a],[,b])=>a.score-b.score).slice(0,3).map(([k,d])=>`${k} (${d.score}/5)`);

if (json) { console.log(JSON.stringify({slug,title:fm.title||'',wordCount:wc,total,grade,dimensions:dims,topActions:top3},null,2)); }
else {
  console.log(`\n  ${'═'.repeat(50)}\n  ${fm.title||slug}\n  ${'═'.repeat(50)}`);
  console.log(`  Words: ${wc}  Grade: ${grade} (${total}/40)\n`);
  for (const [k,d] of Object.entries(dims)) console.log(`  ${k.padEnd(12)} ${'█'.repeat(d.score)}${'░'.repeat(5-d.score)} ${d.score}/5`);
  console.log(`\n  Improve: ${top3.join(', ')}\n  ${'═'.repeat(50)}\n`);
}
