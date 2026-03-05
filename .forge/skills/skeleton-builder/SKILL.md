# Skeleton Builder Skill
# Version 1.1 (generic)

Astro 5 site scaffold rules.

## Key Rules

### Content Collections
- Schemas in `src/content.config.ts` using Zod
- `entry.id` includes `.md` in Astro 5 — ALWAYS `.replace(/\.md$/, '')` for slugs/URLs
- Applies to: getStaticPaths params, canonical URLs, link hrefs

### Dynamic Routes
- `[slug].astro` per collection
- `[category]/[slug].astro` for nested
- Always filter `!entry.data.draft`

### Layouts
- BaseLayout: HTML shell, SEO head, header/footer
- ArticleLayout: prose styling
- HubLayout: child article listing
- HomepageLayout: hero/featured

### SEO Head
- Canonical URL every page
- OG title/description/image
- Twitter card
- JSON-LD (Article or WebPage)
- robots meta

## Known Bugs (Fixed)
**`.md` slug in URLs** — Astro 5 entry.id includes extension. Fix: `.replace(/\.md$/, '')` everywhere.
