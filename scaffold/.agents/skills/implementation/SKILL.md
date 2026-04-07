---
name: implementation
description: Performs scoped code changes based on the active plan.
---

# Implementation Skill

Make the smallest coherent code changes that satisfy the current task.

## Before Implementing

Read: active plan from `{{PROJECT_DOCS_PATH}}/plans/`, `{{PROJECT_DOCS_PATH}}/context/CONVENTIONS.md`, `{{PROJECT_DOCS_PATH}}/context/TECH_STACK.md`, `{{PROJECT_DOCS_PATH}}/references/KEY_FILES.md`

## Rules

- Make the smallest coherent change
- Follow established conventions
- Preserve architectural boundaries unless the plan says otherwise
- Do not expand scope without recording the reason
- Do not silently refactor unrelated files
- Stop and request support if confidence is low

## Output

1. Files Changed
2. Behavior Changed
3. Validation Run
4. Risks Remaining
5. Documentation Touched
