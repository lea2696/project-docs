---
name: bootstrap
description: Initializes project documentation interactively after installation.
---

# Bootstrap Skill

Initialize project documentation by gathering project information and generating core files.

## Process

1. Ask about the project: name, purpose, target users, tech stack, conventions, current state
2. Generate the 3 always-read files:
   - `{{PROJECT_DOCS_PATH}}/product/VISION.md`
   - `{{PROJECT_DOCS_PATH}}/context/TECH_STACK.md`
   - `{{PROJECT_DOCS_PATH}}/context/CONVENTIONS.md`
3. Optionally generate: SCOPE.md, SYSTEM_OVERVIEW.md, REPO_MAP.md, KEY_FILES.md
4. Verify by reading back generated files and confirming with the user

## Rules

- Do not invent information — ask clarifying questions
- Leave uncertain sections with `NEEDS_HUMAN_INPUT` markers
- Use existing templates as base structure

## Output

1. Files created or updated
2. Sections left as NEEDS_HUMAN_INPUT (with reason)
3. Suggested next steps
