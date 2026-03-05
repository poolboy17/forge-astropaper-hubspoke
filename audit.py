#!/usr/bin/env python3
"""SITE_NAME SEO Audit v1.0 — Generated 2026-03-05 by astro-seo-forge"""
import os, re, sys, datetime
from pathlib import Path
from collections import Counter

ROOT = Path(__file__).parent
BANNED = ["game-changer","delve","realm","dive in","furthermore","in conclusion","it's important to note",
]
BANNED_RE = re.compile("|".join(re.escape(b) for b in BANNED), re.IGNORECASE)
UNLOCK_RE = re.compile(r"\bunlock\b", re.IGNORECASE)
MOJIBAKE_RE = re.compile(r"â€|Ã©|Ã¨|Ã¼|Ã¶|Ã¤|â€™|â€œ|Â")

COLLECTIONS = {
    "hubs": {"min_words": 2000, "min_h2": 6, "required": ["topics"]},
    "articles": {"min_words": 1200, "min_h2": 4, "required": ["parentHub"]},
}
CONTENT_DIRS = {"hubs": ROOT/"src"/"content"/"hubs", "articles": ROOT/"src"/"content"/"articles"}

def parse_frontmatter(text):
    if not text.startswith("---"): return {}, text
    end = text.find("---", 3)
    if end == -1: return {}, text
    fm, body, cur_list = {}, text[end+3:].strip(), None
    for line in text[3:end].strip().split("\n"):
        s = line.strip()
        if not s or s.startswith("#"): continue
        if s.startswith("- "):
            if cur_list is not None: cur_list.append(s[2:].strip().strip('"').strip("'"))
            continue
        m = re.match(r'^(\w[\w\-]*):\s*(.*)', s)
        if m:
            k, v = m.group(1), m.group(2).strip().strip('"').strip("'")
            if v == "": cur_list = []; fm[k] = cur_list
            else:
                cur_list = None
                if v.lower() in ("true","false"): fm[k] = v.lower() == "true"
                elif re.match(r'^\d+$', v): fm[k] = int(v)
                else: fm[k] = v
    return fm, body

def strip_md(t):
    t = re.sub(r'!\[.*?\]\(.*?\)', '', t)
    t = re.sub(r'\[([^\]]*)\]\([^\)]*\)', r'\1', t)
    t = re.sub(r'[#*_`~>]', '', t)
    return re.sub(r'\s+', ' ', t).strip()

def count_words(t): return len(strip_md(t).split())
def count_h2(b): return len(re.findall(r'^##\s+', b, re.MULTILINE))
def has_h1(b): return bool(re.search(r'^#\s+[^#]', b, re.MULTILINE))
def get_h2_texts(b): return re.findall(r'^##\s+(.+)$', b, re.MULTILINE)
def get_links(b): return re.findall(r'\[([^\]]*)\]\((/[^\)]*)\)', b)
def count_entities(t):
    return len(set(re.findall(r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b', strip_md(t))))
def count_years(t):
    y = set(re.findall(r'\b([12]\d{3})\b', t))
    y |= set(re.findall(r'\b(\d{1,2}(?:st|nd|rd|th)\s+century)', t, re.IGNORECASE))
    return len(y)
def count_sources(t):
    pats = [r'\baccording to\b',r'\bscholarship\b',r'\bresearch\b',r'\bProfessor\b',
            r'\bDr\.\b',r'\buniversity\b',r'\bmuseum\b',r'\bjournal\b',r'\bpublished\b']
    return sum(1 for p in pats if re.search(p, t, re.IGNORECASE))
def has_aeo(b):
    fp = b.split("\n\n")[0] if b else ""
    fs = re.split(r'[.!?]', fp)[0] if fp else ""
    return bool(re.search(r'\b(is|was|are|were|refers?\s+to|dates?\s+to|represents?)\b', fs, re.IGNORECASE))
def count_q_heads(b):
    hs = re.findall(r'^##?#?\s+(.+)$', b, re.MULTILINE)
    return sum(1 for h in hs if re.search(r'^(What|When|Where|Who|Why|How|Can|Did|Does|Is|Are)\b', h.strip(), re.IGNORECASE))
def has_defn(b):
    return bool(re.search(r'\b[A-Z][a-z]+(?:\s+[A-Z]?[a-z]+)*\s+(is|refers?\s+to|represents?)\s', b))
def has_list(b):
    return bool(re.search(r'^[\-\*]\s+', b, re.MULTILINE)) or bool(re.search(r'^\d+\.\s+', b, re.MULTILINE))
def count_hedges(t):
    pats = [r'tradition\s+holds',r'scholarship\s+suggests',r'evidence\s+indicates',
            r'scholars\s+believe',r'according\s+to\s+tradition',r'some\s+scholars',
            r'research\s+suggests',r'studies\s+indicate',r'may\s+have\s+been']
    return sum(1 for p in pats if re.search(p, t, re.IGNORECASE))

def audit_article(filepath, collection):
    slug = filepath.stem
    rel = filepath.relative_to(ROOT)
    try: text = filepath.read_text(encoding="utf-8")
    except Exception as e: return {"slug":slug,"path":str(rel),"fails":["READ_ERROR"],"metrics":{},"collection":collection}
    fm, body = parse_frontmatter(text)
    fails, metrics = [], {}

    if not fm: fails.append("S1:no_frontmatter")
    title = fm.get("title","")
    if not title: fails.append("S2:no_title")
    elif len(title) > 70: fails.append(f"S3:title_len={len(title)}")
    desc = fm.get("description","")
    if not desc: fails.append("S4:no_description")
    elif len(desc) > 160: fails.append(f"S5:desc_len={len(desc)}")
    if has_h1(body): fails.append("S6:h1_in_body")

    h2c = count_h2(body); metrics["h2_count"] = h2c
    cc = COLLECTIONS.get(collection, {})
    mh = cc.get("min_h2", 4)
    if h2c < mh: fails.append(f"S7:h2={h2c}<{mh}")

    wc = count_words(body); metrics["word_count"] = wc
    mw = cc.get("min_words", 1200)
    if wc < mw: fails.append(f"S8:wc={wc}<{mw}")

    bf = BANNED_RE.findall(body)
    if UNLOCK_RE.search(body): bf.append("unlock")
    if bf: fails.append(f"S9:banned={','.join(set(b.lower() for b in bf))}")
    if fm.get("draft", False): fails.append("S10:draft=true")
    if MOJIBAKE_RE.search(body): fails.append("S11:mojibake")

    for field in cc.get("required", []):
        if not fm.get(field): fails.append(f"STRUCT:{field}_missing")

    links = get_links(body); link_count = len(links); metrics["internal_links"] = link_count
    min_links = 5 if collection == "hubs" else 3
    if link_count < min_links: fails.append(f"L1:links={link_count}<{min_links}")
    parent_hub = fm.get("parentHub", "")
    if parent_hub and collection != "hubs":
        if not any(parent_hub in p for _, p in links): fails.append("L2:no_parent_hub_link")

    metrics["aeo_opener"] = has_aeo(body)
    if not metrics["aeo_opener"]: fails.append("P1:no_aeo_opener")
    qh = count_q_heads(body); metrics["q_headings"] = qh
    if qh < 2: fails.append(f"P2:q_headings={qh}<2")
    if not has_defn(body): fails.append("P3:no_definition")
    if not has_list(body): fails.append("P4:no_list")

    ent = count_entities(body); metrics["entities"] = ent
    if ent < 5: fails.append(f"D1:entities={ent}<5")
    yrs = count_years(body); metrics["years"] = yrs
    if yrs < 3: fails.append(f"D2:years={yrs}<3")
    src = count_sources(body); metrics["sources"] = src
    if src < 1: fails.append(f"D3:sources={src}<1")

    stop = {"the","a","an","and","or","of","in","to","for","on","at","by","with","from","is","are","was","were","its","this","that"}
    hw = set()
    for h in get_h2_texts(body):
        for w in re.findall(r'[A-Za-z]+', h):
            if w.lower() not in stop and len(w) > 2: hw.add(w.lower())
    metrics["h2_breadth"] = len(hw)
    if len(hw) < 8: fails.append(f"D4:h2_breadth={len(hw)}<8")
    metrics["entity_density"] = round(ent / max(wc/1000, 0.1), 1)
    hdg = count_hedges(body); metrics["hedges"] = hdg
    if hdg < 1: fails.append("D6:no_hedge")

    return {"slug":slug,"path":str(rel),"collection":collection,"fails":fails,"metrics":metrics}

def scan_all(coll_filter=None):
    results = []
    for coll, coll_dir in CONTENT_DIRS.items():
        if not coll_dir.exists(): continue
        for f in sorted(coll_dir.rglob("*.md")):
            results.append(audit_article(f, coll))
    if coll_filter: results = [r for r in results if r["collection"] == coll_filter]
    return results

def print_report(results, verbose=False):
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    total = len(results)
    perfect = [r for r in results if not r.get("fails")]
    failing = [r for r in results if r.get("fails")]
    print(f"\n{'='*60}")
    print(f"  SITE_NAME SEO Audit — {now}")
    print(f"  Spec: v1.0 | Script: audit.py v1.0")
    print(f"{'='*60}")
    print(f"\n  Total: {total}  Perfect: {len(perfect)} ({100*len(perfect)//max(total,1)}%)  Failing: {len(failing)}")

    fc = Counter()
    for r in results:
        for f in r.get("fails",[]): fc[f.split(":")[0]] += 1
    print(f"\n  {'─'*50}\n  FAIL FREQUENCIES\n  {'─'*50}")
    for code, count in fc.most_common():
        print(f"  {code:<25} {count}/{total} ({100*count//total}%)")

    checks = {"title≤70": "S3", "desc≤160": "S5", "H2": "S7", "words": "S8",
              "banned": "S9", "AEO": "P1", "Q-heads": "P2", "entities": "D1",
              "years": "D2", "hedge": "D6", "links": "L1"}
    print(f"\n  {'─'*50}\n  PASS RATES\n  {'─'*50}")
    for name, code in checks.items():
        passing = sum(1 for r in results if not any(code+":" in f or f==code for f in r.get("fails",[])))
        print(f"  {name:<15} {passing:>4}/{total} ({100*passing//max(total,1):>3}%)")

    mkeys = ["entities","years","sources","h2_breadth","entity_density","hedges","word_count"]
    print(f"\n  {'─'*50}\n  AVERAGES\n  {'─'*50}")
    for k in mkeys:
        vals = [r["metrics"][k] for r in results if k in r.get("metrics",{})]
        if vals: print(f"  {k:<18} avg={sum(vals)/len(vals):.1f}  min={min(vals)}  max={max(vals)}")

    if verbose:
        print(f"\n  {'─'*50}\n  ALL FAILURES\n  {'─'*50}")
        for r in sorted(failing, key=lambda x: -len(x.get("fails",[]))):
            print(f"\n  [{len(r['fails'])} fails] {r['path']}")
            for f in r["fails"]: print(f"    ✗ {f}")
    else:
        print(f"\n  {'─'*50}\n  TOP 20 WORST\n  {'─'*50}")
        for r in sorted(failing, key=lambda x: -len(x.get("fails",[])))[:20]:
            print(f"  [{len(r['fails']):>2}] {r['slug']}")

    colls = Counter(r["collection"] for r in results)
    if len(colls) > 1:
        print(f"\n  {'─'*50}\n  BY COLLECTION\n  {'─'*50}")
        for c, n in sorted(colls.items()):
            p = sum(1 for r in results if r["collection"]==c and not r.get("fails"))
            print(f"  {c:<25} {n:>4} articles  {p:>4} perfect ({100*p//n}%)")
    print(f"\n{'='*60}\n")

if __name__ == "__main__":
    v = "--verbose" in sys.argv or "-v" in sys.argv
    cf = None
    for i, a in enumerate(sys.argv):
        if a == "--collection" and i+1 < len(sys.argv): cf = sys.argv[i+1]
    print_report(scan_all(cf), v)
