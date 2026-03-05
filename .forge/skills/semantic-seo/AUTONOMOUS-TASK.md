# Autonomous Article Optimization
# SemanticPipe v1.0 (generic)

## Phase 1: Read & Score
1. Read article (Markdown + YAML frontmatter)
2. Score all 8 dimensions per SKILL.md
3. Grade A/B/C/D — skip A articles

## Phase 2: Competitor Analysis (REQUIRED)
1. Identify target query from title/slug
2. web_search 2-3 variants
3. web_fetch top 3 editorial results (skip aggregators/forums)
4. Build subtopic checklist (8-15 items)
5. Build entity checklist (10-20 items)

## Phase 3: Implement Fixes
**Rules:** Expand don't rewrite. Keep voice. Don't break links. Update lastUpdated.

**Priority:** 1. AEO opener → 2. Missing entities → 3. Evidence hedging → 4. Question headings → 5. Year citations → 6. Internal links → 7. Banned phrases

## Phase 4: Self-Review
- Flow: can you spot insertions?
- Repetition: duplicates?
- Voice: tone match?
- Depth: new sections as substantial as existing?

## Phase 5: Commit & Log
1. Save file
2. Git commit: `Semantic SEO: optimize {slug} — {grade} to {new-grade}`
3. Append to learning/log.jsonl

## Rules
1. Never skip competitor analysis
2. Never rewrite >30% of an article
3. Never add unnatural entities
4. Never remove existing links
5. Never touch A-grade articles
6. Always log every evaluation
7. One article at a time
8. Verify uncertain facts with second search
9. Parallel Cowork: different files per role
10. Only Deployer builds and pushes
