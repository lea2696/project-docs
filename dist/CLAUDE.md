# {{PROJECT_NAME}}

> Agent-ready project powered by [project-docs](https://github.com/lea2696/project-docs).

## Context Loading

Always read before every task:
- `product/VISION.md`
- `context/TECH_STACK.md`
- `context/CONVENTIONS.md`

Read when relevant to the task:
- `product/SCOPE.md` — when scope questions arise
- `product/ROADMAP.md` — when prioritizing work
- `architecture/SYSTEM_OVERVIEW.md` — when touching architecture
- `context/CURRENT_STATE.md` — when starting a session
- `context/KNOWN_ISSUES.md` — when debugging
- `references/CRITICAL_FLOWS.md` — when modifying user journeys
- `references/KEY_FILES.md` — when locating entry points
- `references/REPO_MAP.md` — when navigating the codebase
- Active plans in `plans/`
- Active sessions in `sessions/`
- Active handoffs in `handoffs/`

Never load by default (only on explicit request):
- Completed plans, historical sessions, `memory/`

## Agent Delegation

Use subagents from `.claude/agents/` for structured work:

| Agent | When to use |
|-------|-------------|
| planner | Converting goals into implementation plans |
| implementer | Making scoped code changes based on a plan |
| tester | Defining validation strategy for changes |
| reviewer | Reviewing completed work for correctness |
| docs-maintainer | Updating documentation after changes |
| bootstrapper | Initial project documentation setup |

## Task Routing

| Path | Agents | When |
|------|--------|------|
| **Fast** | implementer only | Typo fixes, formatting, config with no behavior impact |
| **Standard** | planner → implementer → tester → reviewer | Features, bug fixes, refactors, behavior changes |
| **Full** | all + human checkpoints | Architecture, security, auth, billing, migrations, destructive ops |

When in doubt, use the standard path.

## Conflict Resolution

- **Plan deviation**: Document in the plan's Deviations section and pause for human review
- **Repeated rejection**: If reviewer rejects 2x on same task, escalate to human
- **Ambiguity**: Pause and request human intervention
- **Architecture disagreements**: Always escalate to human

## Documentation Enforcement

**BLOCKING REQUIREMENT**: A pre-commit hook runs `validate-docs.mjs --strict` and will **REJECT commits** if:
- Required docs (VISION.md, CURRENT_STATE.md, TECH_STACK.md, CONVENTIONS.md, KNOWN_ISSUES.md) still contain template placeholders
- Frontmatter `last_updated` dates are invalid or placeholder values (`YYYY-MM-DD`)
- No session notes exist after 5+ commits

Do NOT use `--no-verify` or any other mechanism to bypass this hook.

## Session Protocol

At the end of every work session:
1. Create a session note using `sessions/SESSION_TEMPLATE.md`
2. Complete the compliance checklist
3. If work is incomplete, create a handoff using `handoffs/HANDOFF_TEMPLATE.md`
4. Commit documentation changes per conventions
