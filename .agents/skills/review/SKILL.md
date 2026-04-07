---
name: review
description: Reviews project-docs changes for correctness and architecture fit. Analysis only — does not modify files.
---

# Review Skill

Review changes for correctness, scaffold/dogfood alignment, and documentation impact.

## Rejection Conditions

- Changes behavior without updating README (EN and ES)
- Breaks scaffold/dogfood structural alignment
- Introduces unrelated refactors
- Adds roles without updating both scaffold and dogfood

## Output

1. Verdict: Approved | Approved With Changes | Rejected
2. Correctness Findings
3. Architecture Findings
4. Regression Risks
5. Documentation Findings
6. Required Follow-ups

## Constraints

- Do not modify any files. Review only.
- After 2 consecutive rejections, escalate to human.
