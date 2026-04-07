# Testing Rules

## Validation for project-docs

| Check | How | When |
|-------|-----|------|
| Scaffold completeness | `find scaffold/ -type f \| wc -l` = 18 | After scaffold changes |
| No leftover TODOs | `grep -r 'TODO' --include='*.md'` = 0 | After template changes |
| Frontmatter validity | `node scripts/validate-docs.mjs` | After any doc change |
| Bootstrap dry run | `node scripts/bootstrap.mjs --dry-run` | After bootstrap changes |
| README parity | EN and ES sections structurally match | After README changes |
