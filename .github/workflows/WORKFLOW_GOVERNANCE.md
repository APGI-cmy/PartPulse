# Workflow Governance Policy

**Version**: 1.0  
**Date**: 2025-12-18  
**Authority**: ForemanApp Agent Contract  
**Status**: CANONICAL

---

## Purpose

This document defines **non-negotiable rules** for GitHub Actions workflows in the PartPulse repository, preventing post-merge failures and ensuring CI/CD integrity.

---

## Invariants (Non-Negotiable)

### 1. All Workflows MUST Have Valid Triggers

**Rule**: Every workflow file in `.github/workflows/` MUST have a valid `on:` block with at least one trigger.

**Minimum Required**:
```yaml
on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]
```

**Rationale**: Workflows without triggers, or with push-only triggers, bypass PR checks and cause post-merge failures.

**Enforcement**: Automated validation in pre-commit hooks and PR checks.

---

### 2. PR Check Parity

**Rule**: If a workflow runs on `push` to `main`, it MUST also run on `pull_request` to `main`.

**Violation Pattern**:
```yaml
# ❌ FORBIDDEN - Runs only after merge
on:
  push:
    branches: [main]
```

**Correct Pattern**:
```yaml
# ✅ REQUIRED - Runs before AND after merge
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
```

**Rationale**: Post-merge-only workflows violate governance - all quality gates MUST execute before merge.

---

### 3. No Orphaned or Experimental Workflows

**Rule**: Every workflow in `.github/workflows/` MUST be:
- **Active**: Runs on defined events
- **Required**: Enforces a quality gate, OR
- **Documented**: Has clear purpose in `README.md`

**Forbidden**:
- Duplicate workflows (e.g., `*-v1-frozen.yml`, `*-backup.yml`)
- Experimental workflows without `.experimental` suffix
- Workflows with no purpose documentation

**Enforcement**: All workflows reviewed during PR checks.

---

### 4. No Surprise Failures

**Rule**: If PR checks pass, the merge to `main` MUST NOT introduce new failures from existing workflows.

**Prevention**:
1. All workflows trigger on `pull_request`
2. Branch protection requires all workflows to pass
3. No conditional logic that bypasses PR execution

---

### 5. Workflow Naming Convention

**Rule**: Workflow files MUST follow this naming convention:

- **Active workflows**: `<name>.yml` (e.g., `qa-enforcement.yml`)
- **Experimental workflows**: `<name>.experimental.yml` (ignored by branch protection)
- **Deprecated workflows**: Delete immediately, do not rename

**Forbidden**:
- `*-v1.yml`, `*-v2.yml` (use Git history for versions)
- `*-frozen.yml`, `*-backup.yml` (use Git for backups)
- `*-old.yml`, `*-new.yml` (delete or activate)

---

## Required Workflows

The following workflows are **mandatory** and MUST pass before merge:

### 1. Minimum Build-to-Red Gate
- **File**: `minimum-build-to-red.yml`
- **Purpose**: Hygiene enforcement (lockfile, no test dodging, lint, typecheck, build)
- **Triggers**: `pull_request`, `push` on `[main, develop]`

### 2. QA Enforcement
- **File**: `qa-enforcement.yml`
- **Purpose**: Full BUILD-TO-GREEN governance (test execution, QA parking, governance sync)
- **Triggers**: `pull_request` on `[main, develop]`, `push` on `[main, develop, copilot/**]`

### 3. Model Scaling Check
- **File**: `model-scaling-check.yml`
- **Purpose**: GitHub Copilot model scaling policy compliance
- **Triggers**: `pull_request`, `push` on `[main]`

---

## Branch Protection Requirements

The `main` branch MUST have these protections:

- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
- ✅ Required checks:
  - `Minimum Build-to-Red Gate / Hygiene Gate`
  - `QA Enforcement / Merge Gate (Build-to-GREEN)`
  - `Model Scaling Check / placeholder`

---

## Failure Handling (FL/CI Policy)

When a workflow fails:

1. **Immediate**: Stop forward progress
2. **Root Cause**: Identify why it failed
3. **Prevention**: Add checks to prevent recurrence
4. **Documentation**: Update this policy if needed
5. **Propagation**: Share lessons across repositories

**One-Time Failure Doctrine**: A failure mode may occur once. Recurrence is catastrophic.

---

## Audit Log

### 2025-12-18: Initial Policy Creation
- **Trigger**: Post-merge failure after PR #107
- **Issue**: Duplicate workflow file (`qa-enforcement-v1-frozen.yml`)
- **Resolution**: Removed duplicate, created this governance document
- **Prevention**: Added rules against duplicate workflows

---

## Validation Checklist

Before merging ANY workflow changes:

- [ ] All workflows have valid `on:` triggers
- [ ] No workflow runs only on `push` without `pull_request`
- [ ] No duplicate or orphaned workflow files
- [ ] All workflows documented in `README.md`
- [ ] Branch protection includes all required workflows
- [ ] Workflow changes tested in PR (not just merged to main)

---

## Enforcement

This policy is enforced by:
1. **ForemanApp Agent**: Reviews all PRs for violations
2. **Pre-commit hooks**: Validates workflow syntax
3. **Branch protection**: Requires all workflows to pass
4. **Manual review**: Required for `.github/workflows/` changes

---

## References

- **ForemanApp Agent Contract**: `.github/agents/foremanapp/contract.md`
- **FL/CI Policy**: `qa/FAILURE_LEARNING_LOG.md`
- **Workflow README**: `.github/workflows/README.md`
- **One-Time Build Doctrine**: Issue #[TBD]

---

**END OF WORKFLOW GOVERNANCE POLICY**
