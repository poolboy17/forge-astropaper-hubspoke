# GSC Scripts

These files are copied to `.forge/gsc/` in generated sites.

The GSC feedback loop is managed through CLI commands:
- `npx astro-seo-forge gsc-snapshot` — creates baseline
- `npx astro-seo-forge gsc-checkin` — runs 30/60/90 day comparison

When Desktop Commander + GSC MCP is connected, these scripts
will auto-query GSC data. Until then, they generate templates
for manual data entry.
