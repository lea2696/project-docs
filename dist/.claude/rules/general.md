# General Rules

## Core Principles

- Make the smallest coherent change that satisfies the task
- Do not expand scope without documenting the reason
- Do not silently refactor unrelated files
- Follow established project conventions before introducing new patterns

## Human Checkpoints

Pause for human review when:
- Deviating from the active plan
- Making architecture-level decisions
- Touching security, authentication, or billing logic
- Performing destructive operations (database migrations, file deletions)

## Context Discipline

- Always read: `product/VISION.md`, `context/TECH_STACK.md`, `context/CONVENTIONS.md`
- Only load additional docs when the task requires them
- Do not load the entire documentation tree by default
- Reference specific doc sections rather than quoting entire files

## Conflict Resolution

- Plan deviation → document in Deviations section, pause for human review
- 2 consecutive rejections on same task → escalate to human
- Ambiguity or contradictory requirements → pause and ask human
- Architecture disagreements → always escalate to human

## Dependency Management

- Justify every new dependency
- Prefer well-maintained libraries with active communities
- Pin versions for reproducibility
- Review dependency updates before merging
