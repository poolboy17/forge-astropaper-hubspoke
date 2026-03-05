# Internal Linking Skill
# Version 1.0 (generic)

Silo-aware link audit, injection, and reciprocal suggestions.

## Rules by Architecture

### Hub-Spoke
- Spokes link UP to parent hub
- Hubs link DOWN to all children
- Siblings cross-link (1-2 per article)
- Min 3 links per spoke, 5 per hub

### Blog-Only
- Every post links to ≥2 other posts
- Tag/category pages serve as lightweight hubs

### Silo/Pyramid
- Support → cluster pillar → category hub (chain must be complete)
- Siblings cross-link within cluster

## Anchor Text
- Descriptive, 3-6 words
- ✅ "the [complete guide to X](/hubs/x/)"
- ❌ "click here" / "read more" / bare URLs

## Audit Process
1. Build site (npx astro build)
2. Scan dist/ for internal <a> tags
3. Flag: broken links, orphan pages, under-linked pages, missing hub connections
4. Fix top 10 per session

## Injection Safety
- Max 2 new links per edit
- Never link same target twice in one article
- Place in most relevant paragraph
- Verify target exists before adding

## Reciprocal Finding
After publishing new article: search existing articles for shared entities → suggest adding links FROM them TO the new one.
