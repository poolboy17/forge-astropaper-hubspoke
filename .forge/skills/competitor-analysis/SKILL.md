# Competitor Analysis Skill
# Version 1.0 (generic — site-agnostic)

Structured process for analyzing what ranks for your target queries
and extracting actionable gaps. This is the step that separates
generic optimization from content that actually competes.

## When to Use

- Before optimizing an existing article (Phase 2 of AUTONOMOUS-TASK.md)
- Before writing a new article (Step 2 of content-writer SKILL.md)
- When building a content brief
- When investigating why an article isn't ranking

## The 5-Step Process

### Step 1: Build Your Query Set

Every article targets a primary query. But Google serves results for
clusters of related queries, not just one. Build 2-4 variants:

**From the article title/slug, generate:**
- The exact-match query: `salem witch trials timeline`
- A broader parent query: `salem witch trials history`
- A question variant: `when did the salem witch trials happen`
- A long-tail variant: `complete timeline of salem witch trials 1692`

**Rules:**
- Never use just one query — you'll miss how Google interprets the topic
- Include at least one question-format query (mirrors PAA boxes)
- If the article is a hub/pillar, use the broader query as primary

### Step 2: Find the Right Competitors

Search each query variant. From the results, select 3-5 editorial competitors.

**Good competitors (USE these):**
- Long-form editorial content (1000+ words)
- Sites with topical authority in the niche
- Content that ranks positions 1-10 for your target queries
- Pages with rich content structure (H2s, lists, images, data)

**Bad competitors (SKIP these):**
- Aggregators: TripAdvisor, Yelp, Booking.com, Amazon
- Forums: Reddit, Quora, StackExchange
- User-generated: Wikipedia (OK for fact-checking, not for subtopic extraction)
- Thin content: <500 words, listicles without depth
- AI slop: obviously generated content with no original research
- Video-only results: YouTube, TikTok (unless you're doing video SEO)

**How to identify good competitors quickly:**
- Look at the domain — is it a publication, blog, or authority site?
- Check the word count — is it substantial?
- Scan the headings — do they cover multiple angles?
- If unsure, web_fetch the page and skim the first 500 words

### Step 3: Extract the Subtopic Checklist

For each competitor page, extract the **distinct subtopics** it covers.
A subtopic is a discrete angle or facet of the main topic, usually
represented by an H2 or a major content section.

**Process:**
1. web_fetch each competitor page
2. List every H2/H3 heading
3. Note any major topics covered in body text without their own heading
4. Deduplicate across all competitors
5. Merge similar subtopics into canonical names

**Output: 8-15 subtopics** formatted as:

```
SUBTOPIC CHECKLIST
─────────────────
[x] Origins / background         — covered by 3/3 competitors
[x] Key figures involved          — covered by 3/3 competitors
[x] Timeline of events            — covered by 2/3 competitors
[x] Causes and contributing factors — covered by 2/3 competitors
[ ] Modern legacy / impact today  — covered by 1/3 competitors ← GAP
[ ] Common misconceptions         — covered by 0/3 competitors ← OPPORTUNITY
```

**Key insight:** Subtopics covered by ALL competitors are **table stakes** —
you must have them. Subtopics covered by NONE are **differentiation opportunities** —
these are where you win.

### Step 4: Extract the Entity Checklist

Entities are named people, places, institutions, dates, sources, and
specific data points. They're what give content semantic depth.

**Process:**
1. From each competitor page, extract:
   - Named people (historical figures, researchers, officials)
   - Named places (specific locations, not just regions)
   - Named institutions (universities, museums, organizations)
   - Specific dates and years
   - Named primary sources (books, documents, studies)
   - Specific data points (measurements, statistics, counts)
2. Deduplicate and count frequency across competitors
3. Flag entities that appear in 2+ competitors (these are expected by Google)

**Output: 10-20 entities** formatted as:

```
ENTITY CHECKLIST
────────────────
[x] Judge Samuel Sewall          — in 2/3 competitors
[x] Cotton Mather                — in 3/3 competitors
[x] Gallows Hill                 — in 2/3 competitors
[x] Court of Oyer and Terminer   — in 2/3 competitors
[ ] Rev. George Burroughs        — in 1/3 competitors
[ ] Increase Mather              — in 0/3 competitors ← DEPTH OPPORTUNITY
```

**Rules:**
- Minimum 10 entities per analysis
- Include at least 3 people, 2 places, 2 dates
- If a competitor cites a primary source, include it
- Entities from 0/3 competitors that you know are relevant = competitive edge

### Step 5: Identify the Gap Map

Compare your article against the subtopic and entity checklists.

**Output:**

```
GAP MAP
───────
MISSING SUBTOPICS (competitors have, we don't):
  → [subtopic] — add as new H2 section
  → [subtopic] — weave into existing section on [X]

MISSING ENTITIES (competitors mention, we don't):
  → [entity] — naturally fits in section [X]
  → [entity] — needs 1-2 sentences of context

DIFFERENTIATION (we could have, nobody does):
  → [angle] — unique subtopic competitors miss
  → [entity] — deeper expertise we can demonstrate

ALREADY STRONG (we have, competitors have):
  → [subtopic] — no action needed
  → [entity] — already present
```

## Output Format

Save competitor analysis as a structured note, either:

**Inline in log.jsonl** (Schema A, in the `notes` field):
```json
{
  "notes": "Competitors: [url1], [url2], [url3]. Missing subtopics: X, Y. Missing entities: A, B, C. Differentiation: Z."
}
```

**Or as a standalone brief** (if creating new content — see content-brief SKILL.md):
```json
{
  "competitors": ["url1", "url2", "url3"],
  "subtopicChecklist": ["topic1", "topic2"],
  "entityChecklist": ["entity1", "entity2"],
  "gaps": ["gap1", "gap2"],
  "differentiation": ["angle1"]
}
```

## Common Mistakes

1. **Skipping this step entirely** — the #1 mistake. Generic optimization without
   competitor context produces content that's "good" but not competitive.

2. **Using only one query** — Google groups related queries. Searching just one
   misses how the topic is actually structured in the SERP.

3. **Picking bad competitors** — analyzing Reddit threads or Amazon listings
   tells you nothing about what editorial content Google rewards.

4. **Copying subtopics without understanding them** — if a competitor has an H2
   you don't understand, research it before adding it to your article.

5. **Entity stuffing** — adding 20 entities to one paragraph. They need to be
   distributed naturally across sections, not crammed in.

6. **Ignoring differentiation** — if all 3 competitors cover the same 8 subtopics,
   your 9th subtopic is what makes you worth ranking above them.

## Speed Tips

- For a quick analysis (existing article optimization): 15-20 minutes
  - 2 queries, 3 competitors, skim headings, 8 subtopics, 10 entities

- For a deep analysis (new high-priority article): 30-45 minutes
  - 4 queries, 5 competitors, full read, 15 subtopics, 20 entities

- For batch triage (prioritizing a backlog): 5 minutes per article
  - 1 query, top 3 results, heading scan only, flag obvious gaps
