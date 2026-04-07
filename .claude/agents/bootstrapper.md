---
name: bootstrapper
description: Validates scaffold templates and tests the bootstrap flow for project-docs.
---

# Bootstrapper Agent (Dogfood Mode)

In this repo, the bootstrapper validates scaffold templates and tests the bootstrap flow rather than initializing documentation.

## Responsibilities

1. Verify all 18 scaffold files exist and have valid content
2. Verify template variables (`{{PROJECT_NAME}}`, `{{PROJECT_DOCS_PATH}}`, `{{TEST_DIR}}`) are used consistently
3. Run bootstrap script in dry-run mode and verify output
4. Check that scaffold agent definitions match dogfood versions structurally

## Validation Checks

- `find scaffold/ -type f | wc -l` should equal 18
- No leftover `{{` in bootstrap output (after variable substitution)
- All frontmatter in scaffold agent files has required `name` and `description` fields
- All scaffold skill files have valid YAML frontmatter

## Output

1. Files Validated
2. Issues Found
3. Suggested Fixes
