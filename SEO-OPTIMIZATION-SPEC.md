# SemanticPipe — SEO Optimization Spec (SITE_NAME)
# Version: 1.0 | Created: 2026-03-05
# Single source of truth for what "optimized" means.

---

# 1. PURPOSE

Measurable requirements for SEO-optimized articles on SITE_DOMAIN.

---

# 2. STRUCTURAL REQUIREMENTS (hard pass/fail)

| # | Requirement | Test | Threshold |
|---|------------|------|-----------|
| S1 | Valid Markdown | Parses YAML frontmatter | — |
| S2 | Title present | `title` in frontmatter | non-empty |
| S3 | Title length | Character count | ≤70 |
| S4 | Description present | `description` in frontmatter | non-empty |
| S5 | Description length | Character count | ≤160 |
| S6 | No H1 in body | Absence of `# ` in body | 0 |
| S7 | H2 count | Count `## ` headings | varies by type |
| S8 | Word count floor | Strip markdown, count words | varies by type |
| S9 | No banned phrases | Text search against list | 0 matches |
| S10 | draft: false | Published | true |
| S11 | No mojibake | Encoding artifacts | 0 |

## Per-Collection Targets

| Collection | Min Words | Min H2s | Required Fields |
|-----------|----------|---------|-----------------|
| hubs | 2000 | 6 | topics |
| articles | 1200 | 4 | parentHub, category |

---

# 3. INTERNAL LINKING (hard pass/fail)

| # | Requirement | Threshold |
|---|------------|-----------|
| L1 | Body internal links | ≥3 (spokes), ≥5 (hubs), ≥2 (blog) |
| L2 | Parent hub link | ≥1 (if parentHub set) |
| L3 | Cross-link validity | 0 broken |
| L4 | No self-links | 0 |

---

# 4. ON-PAGE SEO (hard pass/fail)

| # | Requirement | Threshold |
|---|------------|-----------|
| P1 | AEO opener (definitional verb in sentence 1) | present |
| P2 | Question-format H2/H3 headings | ≥2 |
| P3 | Definition sentence ("X is Y") | ≥1 |
| P4 | Structured list | ≥1 |

---

# 5. SEMANTIC DEPTH SIGNALS

| # | Signal | Threshold |
|---|--------|-----------|
| D1 | Named entities | ≥5 |
| D2 | Unique years cited | ≥3 |
| D3 | Source/authority refs | ≥1 |
| D4 | H2 topic breadth | ≥8 unique terms |
| D5 | Entity density | ≥3.0 per 1k words |
| D6 | Evidence hedging | ≥1 |

---

# 6. GRADES

- **Optimized:** All structural + linking + on-page pass, all semantic signals met
- **Unoptimized:** Any structural fail OR 3+ semantic signals below threshold

---

# 7. BANNED PHRASES

```
unlock, game-changer, delve, realm, dive in,
furthermore, in conclusion, it's important to note
```

---

# MONETIZATION RULES

AFFILIATE_RULES
- Hub/authority pages: ZERO affiliate links
- Informational articles: ZERO affiliate links

---

# 8. AUDIT PROCESS

1. Run `python audit.py`
2. Log actions in AUDIT-LOG.md
3. Save snapshot as AUDIT-REPORT.md
4. Compare to previous runs

---

END OF SPEC
