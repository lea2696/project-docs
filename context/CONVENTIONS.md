# Conventions

> Project-wide coding and workflow conventions.

## Code Style

<!-- TODO: Specify linter, formatter, and style guide. -->

## Naming Conventions

<!-- TODO: Define naming patterns for files, variables, functions, classes, and modules. -->

## File Organization

<!-- TODO: Describe the expected directory structure for application code. -->

## Git Conventions

- **Branch naming:** `type/short-description` (e.g., `feat/user-auth`, `fix/login-redirect`)
- **Commit format:** imperative mood, concise subject line
- **PR process:** description required, link to plan or task

## Testing Conventions

<!-- TODO: Define where tests live, naming patterns, and minimum coverage expectations. -->

## Documentation Conventions

- Update documentation when behavior, architecture, contracts, or workflows change.
- Keep documents concise and navigable.
- Use templates from `project-docs/plans/`, `sessions/`, and `handoffs/`.

## Session Tracking

- Every work session must produce a session note using `sessions/SESSION_TEMPLATE.md`.
- Each session note must list which documentation files were read during the session.
- Each session note must complete the compliance checklist before closing.

## Documentation Commits

- Documentation changes that accompany code changes go in the same commit as the code.
- Pure state updates (CURRENT_STATE.md, ROADMAP.md status changes) go in separate commits with prefix `docs:`.
- Architecture Decision Records (DECISIONS.md entries) are committed atomically — one commit per ADR.
- Session notes and handoff notes are committed at end of session, not during active work.
- Plan files are committed when status changes (Draft → Active, Active → Completed).
