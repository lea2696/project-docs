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

## End-of-Session Protocol

1. Create a session note using `sessions/SESSION_TEMPLATE.md`
2. List all documentation files read during the session
3. Complete the compliance checklist
4. If work is incomplete, create a handoff note using `handoffs/HANDOFF_TEMPLATE.md`
5. Update `context/CURRENT_STATE.md` if project state changed
