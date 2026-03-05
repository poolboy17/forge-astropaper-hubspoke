# SITE_NAME — Project Context

## Overview
Static site at **SITE_DOMAIN** built with Astro 5 + Tailwind.
Deployment: Netlify (configure later).


## Niche
NICHE_DESCRIPTION

## Content
- **Architecture:** Hub + Spoke
- **Voice:** VOICE_STYLE
- **Audience:** TARGET_AUDIENCE
- **Monetization:** MONETIZATION_TYPE

## SEO Pipeline
| File | Purpose |
|------|---------|
| `SEO-OPTIMIZATION-SPEC.md` | "Optimized" definition |
| `docs/ARTICLE-WRITER-CONFIG.md` | Voice, rules, QC checklist |
| `audit.py` | Automated audit |
| `AUDIT-LOG.md` | Change history (append-only) |
| `GSC-TRACKER.md` | Google feedback loop |
| `.forge/skills/` | Full SemanticPipe skill suite |

## Commands
```bash
python audit.py                    # SEO audit
python audit.py --verbose          # Full detail
npx astro dev                      # Dev server
npx astro build                    # Build
npx netlify deploy --prod --dir=dist  # Deploy
```

## Skills (.forge/skills/)
| Skill | Purpose |
|-------|---------|
| semantic-seo/ | 8-dimension evaluation + optimization pipeline |
| content-writer/ | Article writing framework (7-step) |
| internal-linking/ | Silo-aware link audit + injection |
| skeleton-builder/ | Astro scaffold rules |

## Targets
- Hub: 2000 words min
- Articles: 1200 words min

## Generated 2026-03-05 by astro-seo-forge v1.0
