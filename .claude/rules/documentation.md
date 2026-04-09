# Documentation Rules

## When to Update

- Behavior changes (new agent roles, changed routing, modified templates)
- Architecture changes (scaffold structure, bootstrap flow)
- Conventions change (new patterns, deprecated approaches)

## Commit Policy

- Doc changes with code → same commit
- Pure state updates → `docs:` prefix commit
- ADRs → one commit per ADR
- Session/handoff notes → end of session
- Plan files → on status change

## Enforcement

A pre-commit hook runs `validate-docs.mjs --strict` on every commit. It will **block the commit** if:
- Required docs (VISION.md, CURRENT_STATE.md, TECH_STACK.md, CONVENTIONS.md, KNOWN_ISSUES.md) still contain template placeholders
- Frontmatter `last_updated` dates are invalid or placeholder values
- No session notes exist after 5+ commits

Do NOT use `--no-verify` or any other mechanism to bypass this hook.

## End-of-Session Protocol

1. Create a session note using `sessions/SESSION_TEMPLATE.md`
2. List all documentation files read during the session
3. Complete the compliance checklist
4. If work is incomplete, create a handoff note using `handoffs/HANDOFF_TEMPLATE.md`
5. Update `context/CURRENT_STATE.md` if project state changed
