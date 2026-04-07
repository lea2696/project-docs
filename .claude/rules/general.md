# General Rules

## Core Principles

- Make the smallest coherent change that satisfies the task
- Do not expand scope without documenting the reason
- Do not silently refactor unrelated files
- Preserve the two-layer architecture: scaffold/ contains templates, root contains dogfood
- Follow conventions from `context/CONVENTIONS.md`

## Human Checkpoints

Pause for human review when:
- Deviating from the active plan
- Changing the scaffold directory structure
- Adding or removing agent roles
- Modifying the bootstrap flow

## Context Discipline

- Always read: `product/VISION.md`, `context/TECH_STACK.md`, `context/CONVENTIONS.md`
- Only load additional docs when the task requires them
- Do not load the entire documentation tree by default

## Conflict Resolution

- Plan deviation → document in Deviations section, pause for human review
- 2 consecutive rejections on same task → escalate to human
- Ambiguity → pause and ask human
- Architecture disagreements → always escalate to human
