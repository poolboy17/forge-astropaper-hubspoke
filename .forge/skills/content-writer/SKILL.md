# Content Writer Skill
# Version 1.0 (generic)

7-step pipeline from brief to published article.

## Step 1: Load Context
Read ARTICLE-WRITER-CONFIG.md + SEO-OPTIMIZATION-SPEC.md + brief (if exists)

## Step 2: Research
web_search target keyword + 2-3 variants. web_fetch top 3 editorial results. Build subtopic checklist (8-15) and entity checklist (10-20). Note angles competitors miss.

## Step 3: Outline
Write H2s first (4-8). Include ≥2 question-format. Map entities to sections. Plan internal links.

## Step 4: Draft
AEO opener first (definitional verb). Draft each section hitting subtopic checklist. Weave entities naturally. Include ≥1 list, ≥1 definition sentence, hedges where appropriate.

## Step 5: Self-Review
- [ ] Word count meets target
- [ ] H2 count meets minimum
- [ ] AEO opener + ≥2 question headings + definition + list
- [ ] ≥3 dates, ≥3 entities, ≥1 source, ≥1 hedge
- [ ] Zero banned phrases
- [ ] Internal links meet minimum, all targets resolve

## Step 6: Finalize
YAML frontmatter (title ≤70, description ≤160), pubDate, draft: false. Save.

## Step 7: Log
Append to learning/log.jsonl (Schema B).

## Common Mistakes
- Vague opener instead of AEO-ready definition
- Entity stuffing in one paragraph
- Using banned phrases
- Forgetting parent hub link
- Under word count target
