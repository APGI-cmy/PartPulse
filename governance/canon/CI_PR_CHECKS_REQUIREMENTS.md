# Required CI/PR Checks - Merge Gate Enforcement

**Document ID**: CI-PR-CHECKS-001  
**Version**: 2.0.0  
**Date**: 2026-01-09  
**Status**: Active  
**Authority**: Maturion Foreman Governance  
**Purpose**: Define all required CI/PR checks that MUST be GREEN before merge

---

## Purpose

This document defines the **mandatory CI/PR checks** that constitute the automated merge gate. All checks listed here MUST be GREEN before FM can authorize merge. These checks are the first line of defense against regression, test debt, and governance violations.

**FM Authority**: These checks are **non-negotiable**. If ANY check is RED, merge is BLOCKED until resolved.

---

## Required CI Workflows

### 1. Test Execution Workflow

**Workflow File**: `.github/workflows/qa-enforcement.yml`  
**Purpose**: Execute complete test suite and validate 100% passing  
**Frequency**: On every push to PR branch, on PR creation/update

**Checks**:
- ✅ All tests execute successfully (no infrastructure errors)
- ✅ 100% tests passing (0 failures)
- ✅ 0 skipped tests
- ✅ Test execution time acceptable (< threshold)
- ✅ No test errors or timeouts

**Pass Criteria**: All tests GREEN (100% passing rate)  
**Fail Actions**: PR blocked, builder notified, must remediate all test failures  
**Status Check Name**: `test-execution` or `qa-enforcement`

**Blocker**: 🚫 ABSOLUTE - Cannot merge with any test failures

---

### 2. Test Dodging Detection Workflow

**Workflow File**: `.github/workflows/qa-enforcement.yml` (sub-check)  
**Purpose**: Detect and prevent test dodging patterns  
**Frequency**: On every push to PR branch, on PR creation/update

**Checks**:
- ✅ No `.skip()` patterns in test files
- ✅ No `.todo()` patterns in test files
- ✅ No commented-out tests (e.g., `// it('should...`)
- ✅ No `|| true` test bypasses
- ✅ No conditional test skipping (e.g., `if (condition) { skip }`)
- ✅ No `xit()`, `xdescribe()`, `xtest()` patterns

**Pass Criteria**: Zero test dodging patterns detected  
**Fail Actions**: PR blocked, builder notified, must eliminate all test dodging  
**Status Check Name**: `test-dodging-detection`

**Blocker**: 🚫 ABSOLUTE - Test dodging is governance violation

---

### 3. QA Parking Validation Workflow

**Workflow File**: `.github/workflows/qa-enforcement.yml` (sub-check)  
**Purpose**: Validate QA parking registry integrity  
**Frequency**: On every push to PR branch, on PR creation/update

**Checks**:
- ✅ QA parking registry JSON valid
- ✅ All parking entries have required fields (owner, expiry, issue, reason)
- ✅ All parking entries have valid expiry dates (not expired)
- ✅ All parking entries reference valid tracking issues
- ✅ No unauthorized parking entries (all must be FM-approved)

**Pass Criteria**: Registry valid and all entries approved  
**Fail Actions**: PR blocked, must fix invalid entries or remove unauthorized parking  
**Status Check Name**: `qa-parking-validation`

**Blocker**: 🚫 HIGH - Governance violation if invalid entries

---

### 4. Governance Policy Sync Check Workflow

**Workflow File**: `.github/workflows/qa-enforcement.yml` (sub-check)  
**Purpose**: Ensure governance policy synchronized with canonical  
**Frequency**: On every push to PR branch, on PR creation/update

**Checks**:
- ✅ GOVERNANCE_VERSION.md present
- ✅ Governance version documented
- ✅ Policy version synchronized
- ✅ All required governance files present
- ✅ No governance version drift

**Pass Criteria**: Governance synchronized  
**Fail Actions**: PR blocked, Governance Liaison must sync governance  
**Status Check Name**: `governance-sync-check`

**Blocker**: ⚠️ HIGH - Must resolve before merge

---

### 5. Build/Compilation Workflow

**Workflow File**: `.github/workflows/minimum-build-to-red.yml` or separate build workflow  
**Purpose**: Ensure code compiles successfully  
**Frequency**: On every push to PR branch, on PR creation/update

**Checks**:
- ✅ Code compiles without errors
- ✅ No build failures
- ✅ Build artifacts generated successfully
- ✅ Build completes within time threshold

**Pass Criteria**: Build succeeds  
**Fail Actions**: PR blocked, builder must fix compilation errors  
**Status Check Name**: `build` or `compile`

**Blocker**: 🚫 ABSOLUTE - Cannot merge broken code

---

### 6. Type Checking Workflow

**Workflow File**: `.github/workflows/minimum-build-to-red.yml` or separate workflow  
**Purpose**: Ensure TypeScript type safety  
**Frequency**: On every push to PR branch, on PR creation/update

**Checks**:
- ✅ TypeScript type checking passes
- ✅ Zero type errors
- ✅ No `any` types (unless explicitly justified)
- ✅ All type definitions valid

**Pass Criteria**: Zero type errors  
**Fail Actions**: PR blocked, builder must fix type errors  
**Status Check Name**: `typecheck` or `typescript`

**Blocker**: 🚫 ABSOLUTE - Type safety required

---

### 7. Linting Workflow

**Workflow File**: `.github/workflows/minimum-build-to-red.yml` or separate workflow  
**Purpose**: Enforce code quality standards  
**Frequency**: On every push to PR branch, on PR creation/update

**Checks**:
- ✅ ESLint passes with zero errors
- ✅ ESLint passes with zero warnings (unless whitelisted)
- ✅ Code style consistent
- ✅ No disabled linting rules (unless justified)

**Pass Criteria**: Zero lint errors/warnings  
**Fail Actions**: PR blocked, builder must fix lint issues  
**Status Check Name**: `lint` or `eslint`

**Blocker**: 🚫 HIGH - Code quality required

---

### 8. Security Scanning Workflow (Optional but Recommended)

**Workflow File**: `.github/workflows/security-scan.yml` (if configured)  
**Purpose**: Detect security vulnerabilities  
**Frequency**: On every push to PR branch, on PR creation/update

**Checks**:
- ✅ No critical vulnerabilities
- ✅ No high vulnerabilities
- ✅ Dependencies scanned
- ✅ Code scanned for common vulnerabilities

**Pass Criteria**: No critical/high vulnerabilities  
**Fail Actions**: PR blocked, builder must address vulnerabilities  
**Status Check Name**: `security-scan` or `vulnerability-check`

**Blocker**: 🚫 CRITICAL for security issues

---

### 9. Dependency Lockfile Check

**Workflow File**: `.github/workflows/minimum-build-to-red.yml` (sub-check)  
**Purpose**: Ensure dependency consistency  
**Frequency**: On every push to PR branch, on PR creation/update

**Checks**:
- ✅ package-lock.json present (for npm projects)
- ✅ Lockfile synchronized with package.json
- ✅ No lockfile conflicts
- ✅ Dependencies installable

**Pass Criteria**: Lockfile valid and synchronized  
**Fail Actions**: PR blocked, must regenerate/fix lockfile  
**Status Check Name**: `lockfile-check`

**Blocker**: ⚠️ MEDIUM - Dependency consistency required

---

## Required PR Checks (Non-Workflow)

### 10. PR Approvals

**Configuration**: Branch protection rules  
**Purpose**: Human review and approval  
**Required**: At least 1 approval (FM or designated reviewer)

**Checks**:
- ✅ PR has required number of approvals
- ✅ Approvals not stale (no new commits after approval)
- ✅ FM or authorized reviewer approved

**Pass Criteria**: Required approvals obtained  
**Fail Actions**: Cannot merge without approval  
**Status**: GitHub native PR approval system

**Blocker**: 🚫 ABSOLUTE - FM approval required

---

### 11. PR Up to Date with Base

**Configuration**: Branch protection rules  
**Purpose**: Prevent merge conflicts and ensure latest code tested  
**Required**: Yes

**Checks**:
- ✅ PR branch up to date with main/base branch
- ✅ No merge conflicts
- ✅ Latest main/base changes incorporated

**Pass Criteria**: Branch up to date, no conflicts  
**Fail Actions**: Must update branch and re-run checks  
**Status**: GitHub native branch protection

**Blocker**: 🚫 HIGH - Latest code must be tested

---

### 12. All Required Status Checks Pass

**Configuration**: Branch protection rules  
**Purpose**: Aggregate gate - all checks must be GREEN  
**Required**: Yes

**Checks**:
- ✅ All workflow checks GREEN
- ✅ All required checks completed
- ✅ No failing checks
- ✅ No pending checks

**Pass Criteria**: All checks GREEN  
**Fail Actions**: Cannot merge until all GREEN  
**Status**: GitHub native status check aggregation

**Blocker**: 🚫 ABSOLUTE - All checks must pass

---

## CI/PR Check Summary Table

| # | Check Name | Workflow File | Frequency | Blocker Level | Can Waive? |
|---|------------|---------------|-----------|---------------|------------|
| 1 | Test Execution | qa-enforcement.yml | Every push | 🚫 ABSOLUTE | NO |
| 2 | Test Dodging Detection | qa-enforcement.yml | Every push | 🚫 ABSOLUTE | NO |
| 3 | QA Parking Validation | qa-enforcement.yml | Every push | 🚫 HIGH | NO |
| 4 | Governance Sync Check | qa-enforcement.yml | Every push | ⚠️ HIGH | NO |
| 5 | Build/Compilation | minimum-build-to-red.yml | Every push | 🚫 ABSOLUTE | NO |
| 6 | Type Checking | minimum-build-to-red.yml | Every push | 🚫 ABSOLUTE | NO |
| 7 | Linting | minimum-build-to-red.yml | Every push | 🚫 HIGH | NO |
| 8 | Security Scanning | security-scan.yml | Every push | 🚫 CRITICAL | NO |
| 9 | Lockfile Check | minimum-build-to-red.yml | Every push | ⚠️ MEDIUM | NO |
| 10 | PR Approvals | Branch protection | On PR | 🚫 ABSOLUTE | NO |
| 11 | Branch Up to Date | Branch protection | On PR | 🚫 HIGH | NO |
| 12 | All Checks Pass | Branch protection | On PR | 🚫 ABSOLUTE | NO |

**Summary**: 12 required checks, 9 ABSOLUTE blockers, 0 waivable.

---

## Failure Response Matrix

| Check Failed | Responsible Party | Remediation Action | Can Merge? |
|-------------|-------------------|-------------------|------------|
| Test Execution | Builder | Fix failing tests | NO |
| Test Dodging | Builder | Remove dodging patterns | NO |
| QA Parking | Builder or FM | Fix registry or remove invalid entries | NO |
| Governance Sync | Governance Liaison | Sync governance files | NO |
| Build/Compilation | Builder | Fix compilation errors | NO |
| Type Checking | Builder | Fix type errors | NO |
| Linting | Builder | Fix lint errors/warnings | NO |
| Security | Builder | Address vulnerabilities | NO |
| Lockfile | Builder | Regenerate/fix lockfile | NO |
| PR Approvals | N/A | Wait for FM approval | NO |
| Branch Update | Builder | Update branch with main | NO |
| Any Check | N/A | Remediate specific failure | NO |

**Key Principle**: NO CHECK FAILURES ARE ACCEPTABLE FOR MERGE.

---

## Builder Actions When Checks Fail

**If ANY CI/PR check fails**:

1. **STOP**: Do not attempt merge
2. **REVIEW**: Check CI logs for specific failure details
3. **REMEDIATE**:
   - Fix the specific issue causing failure
   - Run checks locally to validate fix
   - Push fix to PR branch
4. **REVALIDATE**: Wait for all checks to re-run and turn GREEN
5. **ESCALATE**: If cannot resolve, use Builder Escalation Guidance

**DO NOT**:
- ❌ Try to merge anyway
- ❌ Disable or skip checks
- ❌ Modify workflow files to weaken checks
- ❌ Work around check failures
- ❌ Pressure FM to override failing checks

---

## FM Actions When Checks Fail

**If ANY CI/PR check fails during merge review**:

1. **VERIFY**: Confirm check failure is legitimate (not infrastructure)
2. **BLOCK**: Explicitly block merge authorization
3. **COMMUNICATE**: Notify builder of specific failure(s)
4. **SUPPORT**: Provide guidance if builder escalates
5. **MONITOR**: Track remediation progress
6. **REVALIDATE**: Review again after all checks GREEN

**FM MUST NOT**:
- ❌ Authorize merge with failing checks
- ❌ Disable checks to allow merge
- ❌ Waive check failures
- ❌ Accept "good enough" with some failures

---

## Governance Enforcement

**Governance Liaison Responsibilities**:
- Ensure all governance-related checks configured
- Validate governance sync check functioning
- Monitor for attempts to weaken checks
- Escalate any check bypass attempts to FM and Johan

**Constitutional Requirement**:
> "All checks MUST be GREEN before merge. No exceptions. No waivers. No 'just this once'."

**From T0-014 (Merge Gate Canon)**:
> "MERGE GATE SUPREMACY: A RED merge gate is a hard stop. 100% GREEN or no merge."

---

## Check Configuration Reference

**For Implementers/FM**:

**To configure these checks**:
1. Create workflow files in `.github/workflows/`
2. Configure branch protection rules
3. Set required status checks
4. Test all checks on feature branch
5. Validate checks block merge when failing
6. Document check configuration in FM records

**Example Branch Protection Configuration**:
```yaml
protection:
  required_status_checks:
    strict: true  # Must be up to date with base
    contexts:
      - test-execution
      - test-dodging-detection
      - qa-parking-validation
      - governance-sync-check
      - build
      - typecheck
      - lint
      - security-scan (if configured)
  required_pull_request_reviews:
    required_approving_review_count: 1
    dismiss_stale_reviews: true
  enforce_admins: true
  restrictions: null  # Or specific users/teams
```

---

## Canonical Reference

**Source**: Maturion Foreman Governance  
**Repository**: APGI-cmy/maturion-foreman-governance  
**Path**: /governance/canon/CI_PR_CHECKS_REQUIREMENTS.md  
**Version**: 2.0.0  
**Last Updated**: 2026-01-09

**Referenced By**:
- T0-014: FM Merge Gate Management Canon
- FM_GATE_READINESS_CHECKLIST.md
- FM_EXECUTION_MANDATE.md
- BUILD_PHILOSOPHY.md

---

## Approval

**Status**: ✅ APPROVED  
**Authority**: Maturion Foreman Governance  
**Effective Date**: 2026-01-09  
**Mandatory Compliance**: YES (Constitutional)

---

**All Checks GREEN or No Merge**: This is the law.
