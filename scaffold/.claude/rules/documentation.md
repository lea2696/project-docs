# Documentation Rules

## When to Update

Update documentation when:
- Behavior changes (user-facing or internal contracts)
- Architecture changes (new modules, changed boundaries, new dependencies)
- Conventions change (new patterns, deprecated approaches)
- Workflows change (deployment, testing, development setup)

## Commit Policy

- Doc changes WITH code → same commit
- Pure state updates → separate commit with `docs:` prefix
- Architecture Decision Records → one commit per ADR
- Session/handoff notes → committed at end of session
- Plan files → committed on status change (Draft → Active, Active → Completed)

## End-of-Session Protocol

Before ending any work session:
1. Create a session note using `{{PROJECT_DOCS_PATH}}/sessions/SESSION_TEMPLATE.md`
2. List all documentation files read during the session
3. Complete the compliance checklist
4. If work is incomplete, create a handoff note using `{{PROJECT_DOCS_PATH}}/handoffs/HANDOFF_TEMPLATE.md`
5. Update `{{PROJECT_DOCS_PATH}}/context/CURRENT_STATE.md` if project state changed
