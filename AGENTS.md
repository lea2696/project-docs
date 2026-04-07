# project-docs — Agent Routing

> Agent policy for the project-docs framework.

## Available Skills

| Skill | Directory | Purpose |
|-------|-----------|---------|
| planning | `.agents/skills/planning/` | Design implementation plans |
| implementation | `.agents/skills/implementation/` | Write scaffold templates, docs, scripts |
| testing | `.agents/skills/testing/` | Validate structure and scaffold output |
| review | `.agents/skills/review/` | Review changes for correctness and fit |
| documentation | `.agents/skills/documentation/` | Keep docs synchronized with reality |

## Task Routing

| Path | Skills | When |
|------|--------|------|
| Fast | implementation only | Typos, formatting, config |
| Standard | planning → implementation → testing → review | New templates, doc improvements |
| Full | all + human checkpoints | Structure changes, new roles |

When in doubt, use the standard path.

## Context Policy

**Always read**: `product/VISION.md`, `context/TECH_STACK.md`, `context/CONVENTIONS.md`

**Read when relevant**: SCOPE, ROADMAP, SYSTEM_OVERVIEW, CURRENT_STATE, KNOWN_ISSUES, CRITICAL_FLOWS, KEY_FILES, REPO_MAP, active plans/sessions/handoffs, scaffold/.

**Never load by default**: completed plans, historical sessions, memory files.

## Conflict Resolution

- Plan deviation → document and pause for human review
- 2x rejection on same task → escalate to human
- Ambiguity → pause and ask human
- Architecture disagreements → always escalate to human
