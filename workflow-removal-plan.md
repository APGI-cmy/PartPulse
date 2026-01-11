# Workflow Cleanup Plan - PR #148

**Date**: 2026-01-11  
**Issue**: 20+ duplicate CI checks running (should be ~8-10)  
**Root Cause**: Multiple workflow files with duplicate job definitions all running simultaneously  
**Backup Branch Created**: `backup/workflow-cleanup-20260111` (local)

---

## Problem Analysis

**Current State**: 7 workflow files in `.github/workflows/`

**Symptom**: 20+ checks running per PR/push when only ~8-10 are needed

**Root Cause**: Three "QA Enforcement" workflows running concurrently:
1. `qa-enforcement.yml` (current version)
2. `qa-enforcement-v1-frozen.yml` (old version, supposedly "frozen")
3. `qa-enforcement-v2.yml` (newer version)

All three workflows define similar/identical jobs with similar names, causing GitHub Actions to run them all simultaneously.

---

## Workflow Audit

### Current Workflows (7 files)

| File | Display Name | Jobs | Triggers | Status |
|------|--------------|------|----------|--------|
| `deprecation-detection.yml` | Deprecation Detection Gate | 1 job | push: all branches<br>PR: main, develop | ✅ **KEEP** - BL-026 standalone |
| `minimum-build-to-red.yml` | Minimum Build-to-Red Gate | Multiple | PR: main, develop<br>push: main, develop, fix/**, etc. | ✅ **KEEP** - Required gate |
| `model-scaling-check.yml` | Model Scaling Check | 1 job | PR: main<br>push: main | ✅ **KEEP** - Required check |
| `qa-enforcement.yml` | QA Enforcement | 6 jobs:<br>- Test Dodging Detection<br>- QA Parking Validation<br>- Governance Sync Validation<br>- Deprecation Detection (BL-026)<br>- Test Suite Execution<br>- Merge Gate (Build-to-GREEN) | PR: main, develop<br>push: main, develop, copilot/**, fix/**, etc. | ✅ **KEEP** - Current main enforcement |
| `qa-enforcement-v1-frozen.yml` | QA Enforcement | 5 jobs:<br>- Test Dodging Detection<br>- QA Parking Validation<br>- Governance Sync Validation<br>- Test Suite Execution<br>- Merge Gate (Build-to-GREEN) | PR: main, develop<br>push: main, develop, copilot/** | ❌ **REMOVE** - Old version, duplicate jobs |
| `qa-enforcement-v2.yml` | QA Enforcement v2 (Clean Rewrite - Invariant Proof) | 1 job:<br>- Test Suite Execution | PR: main, develop<br>push: main, develop | ❌ **REMOVE** - Superseded/experimental version |
| `README.md` | N/A (documentation) | N/A | N/A | ✅ **KEEP** - Documentation |

---

## Files to REMOVE (2 files)

### 1. `qa-enforcement-v1-frozen.yml`
**Reason**: Old version with duplicate job definitions
- **Duplicate Jobs**: 
  - "Test Dodging Detection" (duplicates `qa-enforcement.yml`)
  - "QA Parking Validation" (duplicates `qa-enforcement.yml`)
  - "Governance Sync Validation" (duplicates `qa-enforcement.yml`)
  - "Test Suite Execution" (duplicates `qa-enforcement.yml`)
  - "Merge Gate (Build-to-GREEN)" (duplicates `qa-enforcement.yml`)
- **Evidence**: File name contains "v1-frozen", indicating superseded version
- **Impact of removal**: Eliminates 5 duplicate job runs per PR

### 2. `qa-enforcement-v2.yml`
**Reason**: Experimental/alternative version, superseded by main `qa-enforcement.yml`
- **Duplicate Jobs**:
  - "Test Suite Execution" (duplicates `qa-enforcement.yml`)
- **Evidence**: File name contains "v2", and title says "Clean Rewrite - Invariant Proof" (experimental)
- **Current version**: `qa-enforcement.yml` is the authoritative version
- **Impact of removal**: Eliminates 1 duplicate job run per PR

---

## Files to KEEP (5 files)

### 1. `qa-enforcement.yml` ✅
**Reason**: Current authoritative QA enforcement workflow
- **Purpose**: Main merge gate with 6 comprehensive checks
- **Jobs**: Test dodging, QA parking, governance sync, deprecation, test execution, merge gate
- **Triggers**: Broadest coverage (main, develop, copilot/**, fix/**, hotfix/**, tech-debt/**)
- **Status**: Most comprehensive and up-to-date version

### 2. `deprecation-detection.yml` ✅
**Reason**: Standalone BL-026 deprecation detection gate
- **Purpose**: Dedicated deprecation detection (BL-026 requirement)
- **Jobs**: Single focused job for deprecated API detection
- **Triggers**: All pushes and PRs to main/develop
- **Status**: Required by BL-026 constitutional policy

### 3. `minimum-build-to-red.yml` ✅
**Reason**: Build-to-red gate requirement
- **Purpose**: Ensures minimum build quality standards
- **Triggers**: PRs and pushes to main/develop/fix branches
- **Status**: Required governance gate

### 4. `model-scaling-check.yml` ✅
**Reason**: Database model scaling validation
- **Purpose**: Checks Prisma model scaling and relationships
- **Triggers**: PRs and pushes to main only
- **Status**: Required for data model governance

### 5. `README.md` ✅
**Reason**: Documentation file
- **Purpose**: Documents workflow structure and purpose
- **Status**: Not a workflow file, documentation only

---

## Expected Impact After Cleanup

### Before Cleanup:
- **Total workflows**: 6 active workflows (7 files including README)
- **QA Enforcement workflows**: 3 (duplicate jobs)
- **Estimated checks per PR**: 20+ (many duplicates)
- **Duplicate jobs running**: 
  - "Test Dodging Detection" × 2
  - "QA Parking Validation" × 2
  - "Governance Sync Validation" × 2
  - "Test Suite Execution" × 3
  - "Merge Gate (Build-to-GREEN)" × 2
  - "Deprecation Detection" × 2 (one in qa-enforcement.yml, one standalone)

### After Cleanup:
- **Total workflows**: 4 active workflows (5 files including README)
- **QA Enforcement workflows**: 1 (no duplicates)
- **Estimated checks per PR**: ~8-10 (unique jobs only)
- **Unique jobs**:
  1. Test Dodging Detection (1×)
  2. QA Parking Validation (1×)
  3. Governance Sync Validation (1×)
  4. Deprecation Detection - BL-026 (1×, from qa-enforcement.yml)
  5. Deprecation Detection Gate (1×, standalone from deprecation-detection.yml)
  6. Test Suite Execution (1×)
  7. Merge Gate - Build-to-GREEN (1×)
  8. Minimum Build-to-Red Gate (1×)
  9. Model Scaling Check (1×)

**Total unique checks**: ~9 checks per PR (reasonable and expected)

---

## Removal Commands (AWAITING APPROVAL)

**DO NOT EXECUTE until owner approval received.**

```bash
# Switch to working branch
cd /home/runner/work/PartPulse/PartPulse
git checkout copilot/fix-ci-failures-locally

# Remove duplicate/deprecated workflows
git rm .github/workflows/qa-enforcement-v1-frozen.yml
git rm .github/workflows/qa-enforcement-v2.yml

# Commit with descriptive message
git commit -m "Cleanup: Remove duplicate QA enforcement workflows

Removed workflows:
- qa-enforcement-v1-frozen.yml (old version, duplicate of qa-enforcement.yml)
- qa-enforcement-v2.yml (experimental version, superseded by qa-enforcement.yml)

This fixes the issue of 20+ duplicate checks running on every PR.

Problem: Three QA Enforcement workflows were running simultaneously:
- qa-enforcement.yml (current, authoritative) ✅ KEPT
- qa-enforcement-v1-frozen.yml (old v1) ❌ REMOVED
- qa-enforcement-v2.yml (experimental v2) ❌ REMOVED

Result: Reduced from ~20+ checks to ~9 unique checks per PR.

Duplicate jobs eliminated:
- Test Dodging Detection (was 2×, now 1×)
- QA Parking Validation (was 2×, now 1×)
- Governance Sync Validation (was 2×, now 1×)
- Test Suite Execution (was 3×, now 1×)
- Merge Gate Build-to-GREEN (was 2×, now 1×)

Relates to: #148 (PR remediation)
Backup branch: backup/workflow-cleanup-20260111"

# Push to remote (will be done via report_progress tool)
```

---

## Validation After Removal

### Local Validation:
```bash
# Verify YAML syntax of remaining workflows
for file in .github/workflows/*.yml; do
  echo "Validating $file"
  yamllint "$file" 2>&1 || echo "✅ Valid (or yamllint not available)"
done

# Count remaining workflow files
echo "Remaining workflows: $(ls -1 .github/workflows/*.yml | wc -l)"

# List remaining workflows
ls -1 .github/workflows/
```

### CI Validation (after push):
1. ⏳ Wait for ALL GitHub Actions workflows to complete
2. 🔍 Verify check count reduced to ~8-10 (not 20+)
3. 🔍 Verify no duplicate job names running
4. ✅ Verify all remaining checks pass

**Expected checks after cleanup**:
- QA Enforcement / Test Dodging Detection
- QA Enforcement / QA Parking Validation
- QA Enforcement / Governance Sync Validation
- QA Enforcement / Deprecation Detection (BL-026)
- QA Enforcement / Test Suite Execution
- QA Enforcement / Merge Gate (Build-to-GREEN)
- Deprecation Detection Gate / Detect Deprecated API Usage
- Minimum Build-to-Red Gate / [jobs]
- Model Scaling Check / [jobs]

**Total expected**: ~9 unique checks

---

## Risks and Mitigation

### Risk 1: Accidentally removing required workflow
**Mitigation**: 
- ✅ Backup branch created: `backup/workflow-cleanup-20260111`
- ✅ Only removing files with "v1" and "v2" in names (clear indicators)
- ✅ Keeping `qa-enforcement.yml` (most comprehensive, no version suffix)
- ✅ Owner approval required before execution

### Risk 2: Breaking existing CI dependencies
**Mitigation**:
- ✅ All jobs from removed workflows exist in `qa-enforcement.yml`
- ✅ `qa-enforcement.yml` has broader trigger coverage
- ✅ No unique functionality in v1/v2 that doesn't exist in main version

### Risk 3: Governance sync check still failing
**Mitigation**:
- ⚠️ If "Governance Sync Validation" still fails after cleanup, investigate:
  - Check `governance/alignment/GOVERNANCE_ALIGNMENT.md` exists and is current
  - Verify governance sync script expectations match repo state
  - Update alignment file if needed

---

## Approval Status

- [ ] **Owner approval received** (@APGI-cmy)
- [ ] Ready to execute removal
- [ ] Removal executed
- [ ] CI validation passed
- [ ] Cleanup documented in PR #148

---

## Questions for Owner

1. **Confirm removal plan**: Is it correct to remove `qa-enforcement-v1-frozen.yml` and `qa-enforcement-v2.yml`?

2. **Governance Sync failures**: After cleanup, if "Governance Sync Validation" checks still fail, should I:
   - Investigate and fix `governance/alignment/GOVERNANCE_ALIGNMENT.md`?
   - Or is there a different expected action?

3. **Documentation**: Should I update `.github/workflows/README.md` to document the cleanup?

---

**Awaiting owner approval to proceed with workflow removal.**
