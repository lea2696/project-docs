# project-docs

Agent-ready documentation framework for AI coding agents (Claude Code, Codex).

## Context Loading

Always read before every task:
- `product/VISION.md`
- `context/TECH_STACK.md`
- `context/CONVENTIONS.md`

Read when relevant:
- `product/SCOPE.md` — when scope questions arise
- `product/ROADMAP.md` — when prioritizing work
- `architecture/SYSTEM_OVERVIEW.md` — when touching architecture
- `context/CURRENT_STATE.md` — when starting a session
- `context/KNOWN_ISSUES.md` — when debugging
- `references/CRITICAL_FLOWS.md` — when modifying user journeys
- `references/KEY_FILES.md` — when locating entry points
- `references/REPO_MAP.md` — when navigating the codebase
- `scaffold/` — when modifying scaffold templates
- Active plans in `plans/`
- Active sessions in `sessions/`
- Active handoffs in `handoffs/`

Never load by default:
- Completed plans, historical sessions, `memory/`

## Agent Delegation

| Agent | When to use |
|-------|-------------|
| planner | Designing new phases, features, or structural changes |
| implementer | Writing scaffold templates, docs, scripts |
| tester | Validating scaffold output, structure checks |
| reviewer | Reviewing changes to scaffold or core docs |
| docs-maintainer | Keeping README, REPO_MAP, and internal docs current |
| bootstrapper | Validating scaffold templates and testing bootstrap flow |

## Task Routing

| Path | Agents | When |
|------|--------|------|
| **Fast** | implementer only | Typo fixes, formatting, minor doc edits |
| **Standard** | planner → implementer → tester → reviewer | New scaffold templates, doc improvements, script changes |
| **Full** | all + human checkpoints | Structural changes, new agent roles, bootstrap flow changes |

When in doubt, use the standard path.

## Conflict Resolution

- Plan deviation → document and pause for human review
- 2x rejection on same task → escalate to human
- Ambiguity → pause and ask human
- Architecture disagreements → always escalate to human

## Session Protocol

At the end of every work session:
1. Create a session note using `sessions/SESSION_TEMPLATE.md`
2. Complete the compliance checklist
3. If work is incomplete, create a handoff using `handoffs/HANDOFF_TEMPLATE.md`
4. Commit documentation changes per conventions
