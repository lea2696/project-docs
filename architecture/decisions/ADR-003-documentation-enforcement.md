---
status: accepted
owner: human
last_updated: 2026-04-09
read_policy: never-default
---

# ADR-003: Documentation Enforcement Layer

**Status:** Accepted
**Date:** 2026-04-09
**Participants:** Project maintainer

## Context

The project-docs framework defines rules for documentation maintenance (session notes, CURRENT_STATE updates, handoffs, frontmatter freshness) in CLAUDE.md and `.claude/rules/`. However, all enforcement was honor-system: nothing prevented an agent from ignoring the rules.

In the cube-trainer case study, an agent completed 4 development phases (~25 commits) while creating zero session notes, zero handoff notes, and leaving CURRENT_STATE.md and VISION.md as empty templates. The existing `validate-docs.mjs` passed because it only checked that files existed and had frontmatter fields — not that those fields contained real values.

## Decision

Add three enforcement layers:

1. **Enhanced validator** (`validate-docs.mjs --strict`): Content-aware validation that detects placeholder patterns, validates frontmatter dates, and checks session note activity relative to commit count. Uses exit code 2 to block Claude Code hooks.

2. **Pre-commit hook** (`scaffold/.claude/settings.json.template`): Claude Code `PreToolUse` hook that intercepts `git commit` commands and runs the strict validator. Blocks the commit if validation fails.

3. **CI enforcement** (`docs-lint.yml` with `--strict`): Safety net at PR time for commits that bypass the hook.

Key design decisions:
- `--strict` is opt-in for the CLI but default in scaffold CI workflows (new projects get strict by default)
- Exit code 2 (not 1) blocks Claude Code hooks — this is a Claude Code-specific behavior
- Template files (SESSION_TEMPLATE.md, etc.) are exempt from placeholder date checks
- Init grace period: repos with < 3 commits skip content checks to allow bootstrapping
- Scaffold file count check uses minimum (>= 18) instead of exact match for extensibility
- No `--fix` mode — agents must write meaningful documentation, not auto-stubs

## Consequences

**Positive:**
- Agents cannot commit code without documentation being current
- Template placeholder content is detected and flagged
- Missing session notes are detected relative to commit activity
- Enforcement ships as part of the scaffold (new consumers get it automatically)

**Negative:**
- Adds ~100ms overhead per commit (file I/O only, acceptable)
- Agents that genuinely cannot update docs (e.g., no project knowledge yet) must work through the grace period or be given explicit instructions
- Only enforces on Claude Code (Codex users rely on CI only)

**Neutral:**
- Existing projects are unaffected unless they opt into `--strict`
- The validator remains backwards compatible without the flag

## Alternatives Considered

- **PostToolUse reminder hook**: Dropped — non-blocking reminders add noise without enforcement power
- **Separate `session-check.yml` CI workflow**: Dropped — session checks are part of `--strict`, one workflow suffices
- **`--fix` auto-populate mode**: Dropped — defeats the purpose of forcing agents to write real documentation
- **Exact scaffold file count**: Changed to minimum — avoids updating three places every time a file is added
