# Content Brief Skill
# Version 1.0 (generic — site-agnostic)

Structured process for creating, managing, and executing content briefs.
A brief is the bridge between "we should write about X" and a finished article.

## When to Use

- Planning new content for a site
- Filling a content calendar
- Assigning articles to Cowork writers
- After keyword research identifies a gap
- When GSC data shows queries with impressions but no matching page

## Brief Lifecycle

```
DRAFT → RESEARCHED → READY → ASSIGNED → IN PROGRESS → REVIEW → DONE
```

- **DRAFT:** Topic identified but not researched. Has keyword + content type only.
- **RESEARCHED:** Competitor analysis complete. Subtopics and entities filled.
- **READY:** All fields complete. Can be assigned to a writer.
- **ASSIGNED:** Writer is working on it.
- **IN PROGRESS:** First draft exists.
- **REVIEW:** Draft complete, awaiting QC check.
- **DONE:** Published and logged.

## Brief Schema

Save briefs as JSON in a `briefs/` directory (or `.forge/briefs/`):

```json
{
  "id": "site-name--article-slug",
  "status": "draft",
  "created": "2026-03-01",
  "updated": "2026-03-01",

  "target": {
    "slug": "article-slug",
    "contentType": "articles",
    "parentHub": "hub-slug",
    "primaryKeyword": "primary search keyword",
    "secondaryKeywords": ["keyword 2", "keyword 3"],
    "searchIntent": "informational",
    "wordCountTarget": [1200, 2500]
  },

  "research": {
    "competitors": [
      {
        "url": "https://example.com/article",
        "title": "Competitor Article Title",
        "wordCount": 2100,
        "strengths": "Deep historical context, 12 named sources",
        "weaknesses": "No modern relevance section, thin on dates"
      }
    ],
    "subtopicChecklist": [
      {"topic": "Historical origins", "competitorCount": 3, "priority": "must-have"},
      {"topic": "Key figures", "competitorCount": 3, "priority": "must-have"},
      {"topic": "Modern impact", "competitorCount": 1, "priority": "differentiator"},
      {"topic": "Common myths", "competitorCount": 0, "priority": "opportunity"}
    ],
    "entityChecklist": [
      {"entity": "Named Person", "type": "person", "competitorCount": 2},
      {"entity": "Named Place", "type": "place", "competitorCount": 3},
      {"entity": "Named Source", "type": "source", "competitorCount": 1}
    ]
  },

  "structure": {
    "proposedH2s": [
      "What Is [Topic]?",
      "Historical Background",
      "Key Figures and Their Roles",
      "How [Topic] Changed Over Time",
      "Common Misconceptions About [Topic]",
      "Why [Topic] Still Matters Today"
    ],
    "requiredInternalLinks": [
      {"target": "/hubs/parent-hub/", "context": "hub connection"},
      {"target": "/articles/related-article/", "context": "sibling cross-link"}
    ],
    "aeoTargets": {
      "openerDraft": "[Topic] is a [definition] that [key fact], dating to [year].",
      "questionHeadings": ["What Is [Topic]?", "Why Does [Topic] Matter?"],
      "faqQuestions": [
        "What is [topic]?",
        "When did [topic] happen?",
        "Why is [topic] significant?"
      ]
    }
  },

  "execution": {
    "assignedTo": null,
    "assignedDate": null,
    "draftPath": null,
    "publishedUrl": null,
    "logEntry": null
  }
}
```

## Creating a Brief

### Step 1: Identify the Topic

Sources for new topics:
- **GSC queries with no page:** Impressions for queries that don't have a matching article
- **Content map gaps:** Planned articles in CONTENT-MAP.md not yet written
- **Competitor gap analysis:** Topics competitors rank for that you don't cover
- **Hub completion:** Spoke articles needed to fill out a hub's topic cluster
- **Keyword research:** New opportunity keywords with favorable difficulty

### Step 2: Set Target Fields

```json
{
  "slug": "derive-from-primary-keyword",
  "contentType": "match site architecture (articles, posts, research, etc.)",
  "parentHub": "which hub does this belong under",
  "primaryKeyword": "the exact query you want to rank for",
  "searchIntent": "informational | commercial | navigational | transactional"
}
```

**Rules:**
- Slug should match the primary keyword closely
- Content type determines word count target and frontmatter schema
- parentHub determines internal linking requirements
- Search intent determines article structure:
  - Informational → educational, definition-led, evidence-heavy
  - Commercial → comparison-oriented, pros/cons, recommendation
  - Transactional → product/service-focused, CTAs, affiliate sections

### Step 3: Research (use competitor-analysis SKILL.md)

Run the 5-step competitor analysis process:
1. Build query set (2-4 variants)
2. Find 3-5 editorial competitors
3. Extract subtopic checklist (8-15)
4. Extract entity checklist (10-20)
5. Build gap map

Fill the `research` section of the brief with the results.

### Step 4: Plan Structure

Based on the subtopic checklist, draft:
- 4-8 proposed H2 headings
- At least 2 question-format headings
- An AEO opener draft (first sentence with definitional verb)
- 3 FAQ questions (for research articles)
- Required internal links (hub + siblings)

### Step 5: Set Status to READY

A brief is READY when:
- [ ] Primary keyword defined
- [ ] Content type and parent hub assigned
- [ ] 3+ competitors analyzed
- [ ] 8+ subtopics identified
- [ ] 10+ entities identified
- [ ] Proposed H2s drafted
- [ ] AEO opener drafted
- [ ] Internal links mapped
- [ ] Word count target set

## Batch Brief Generation

When planning a content sprint (e.g., 10 new articles for a hub):

1. List all topics needed to complete the hub's coverage
2. For each topic, create a DRAFT brief with just slug + keyword + content type
3. Prioritize by: search volume × gap severity × hub completion importance
4. Research the top 5 first (move to RESEARCHED)
5. Complete structure for top 3 (move to READY)
6. Assign 1-3 to the next Cowork session

**Priority scoring formula:**

```
priority = (search_volume_estimate / 10) + gap_severity + hub_importance

gap_severity:
  3 = no existing page at all
  2 = stub exists but thin (<500 words)
  1 = decent page exists but below audit threshold

hub_importance:
  3 = completes a hub cluster
  2 = adds depth to existing cluster
  1 = standalone / nice-to-have
```

## Brief Directory Structure

```
.forge/briefs/
├── site-name--article-slug-1.json   (status: done)
├── site-name--article-slug-2.json   (status: ready)
├── site-name--article-slug-3.json   (status: draft)
└── _index.md                        (brief inventory)
```

The `_index.md` is a human-readable summary:

```markdown
# Content Briefs — site-name

## Ready (3)
- article-slug-2: "Primary Keyword" (1200-2500 words, hub: parent-hub)
- article-slug-5: "Primary Keyword" (1000-2000 words, hub: parent-hub)
- article-slug-8: "Primary Keyword" (1200-2500 words, hub: parent-hub)

## Draft (5)
- article-slug-3: "Primary Keyword" (needs research)
...

## Done (12)
- article-slug-1: published 2026-03-01, 1847 words, grade B
...
```

## Handoff to Writer

When assigning a READY brief to a Cowork writer:

1. Set `execution.assignedTo` and `execution.assignedDate`
2. Set status to ASSIGNED
3. Include in the Cowork prompt:
   ```
   BRIEF: .forge/briefs/site-name--article-slug.json
   PRE-READING: content-writer SKILL.md + ARTICLE-WRITER-CONFIG.md
   PROCESS: Read brief → write article following proposed structure →
            hit all subtopics → weave in all entities → self-review → save → log
   ```

The writer should NOT need to redo competitor analysis — that's already in the brief.
They focus purely on writing quality content that hits the checklist.

## Common Mistakes

1. **Skipping the brief entirely** — writers who start from scratch waste 30%
   of their time on research that could have been done once upfront.

2. **Briefs that are too vague** — "write about topic X" is not a brief.
   A brief has subtopics, entities, structure, and links mapped out.

3. **Briefs that are too rigid** — the H2s and opener are proposals, not mandates.
   Writers should feel free to adjust based on what they learn during drafting.

4. **Never updating brief status** — if a brief sits at ASSIGNED for weeks,
   something is wrong. Track lifecycle in _index.md.

5. **Not connecting briefs to GSC data** — the best brief sources are queries
   where you already have impressions but no page. These are guaranteed demand.
