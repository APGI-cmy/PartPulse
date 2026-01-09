# Codex Control Constitution

This repository is the **authoritative operating manual** for any AI execution
(Copilot Workspace / Codex agents / builders) working across Maturion repos.

## Non-Negotiables
- No self-governance: execution agents may not create or modify their own authority.
- Human is the release authority: all merges require human approval.
- No silent edits: all changes must be PR-based with clear diffs.
- No weakening gates: QA and governance controls must never be bypassed.
- Phase-aware enforcement: RED_QA vs BUILD_TO_GREEN must be respected.

## Required Outputs per Task
Each task must return:
- Summary of changes
- Files affected
- Expected behavior
- Risks
- Rollback plan
- Verification checklist
