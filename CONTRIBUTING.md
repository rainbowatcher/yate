# Contributing Guide

Thanks for contributing to yate! To keep collaboration efficient and traceable, please follow the conventions below.

## Issue & PR Template Policy

This repository provides standardized templates for Issues and Pull Requests.

- Issue templates:
  - `.github/ISSUE_TEMPLATE/bug_report.yml`
  - `.github/ISSUE_TEMPLATE/feature_request.yml`
- PR template:
  - `.github/pull_request_template.md`

### Mandatory Rule (Human & Agent)

When creating Issues or PRs, **you must use the provided templates and fully complete required sections**.

- This rule applies to both human contributors and Agents.
- For Agent-created Issues/PRs, the `Agent` related sections are mandatory and must include enough context to review decisions and validation outcomes.
- Submissions with missing required content may be asked to update before further review.

## Development Validation

Before opening a PR, run:

```bash
pnpm run lint
pnpm run compile
```

## Scope Discipline

- Keep changes focused on the current task/issue.
- Avoid unrelated refactors.
- Document risk and rollback strategy in PR when applicable.
