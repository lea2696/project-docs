---
name: review
description: Reviews completed work for correctness, architecture fit, and regression risk. Analysis only — does not modify files.
---

# Review Skill

Review completed work for correctness, architecture fit, regression risk, and documentation impact.

## Rejection Conditions

Reject if:
- Changes behavior without validation or documentation
- Introduces unrelated refactors in a scoped task
- Violates architecture or conventions without a decision record

## Before Reviewing

Read: active plan from `plans/`, `context/CONVENTIONS.md`, `architecture/SYSTEM_OVERVIEW.md`, the diff

## Output

1. Verdict: Approved | Approved With Changes | Rejected
2. Correctness Findings
3. Architecture Findings
4. Regression Risks
5. Validation Findings
6. Documentation Findings
7. Required Follow-ups

## Constraints

- Do not modify any files. Review only.
- Provide specific actionable feedback on rejections.
- After 2 consecutive rejections, escalate to human.
