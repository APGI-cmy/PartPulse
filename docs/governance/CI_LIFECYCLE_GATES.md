# CI Lifecycle Gates — PartPulse

## Document Authority

**Authority**: ForemanApp Agent Contract  
**Status**: ACTIVE  
**Version**: 1.0.0  
**Date**: 2025-12-16  
**Related Issue**: Align CI Gates with Build-to-Green Lifecycle State

---

## Purpose

This document defines how GitHub Actions CI gates behave across the Build-to-Green lifecycle. It ensures that temporary scaffolding checks (Minimum Build-to-Red) do not block merges after BUILD-TO-GREEN is achieved, while maintaining full governance enforcement through QA Enforcement gates.

---

## Lifecycle States

### State 1: Pre-BUILD-TO-GREEN (Development Phase)

**Marker**: `.governance/BUILD_TO_GREEN_COMPLETE` does NOT exist  
**Status**: 🔴 RED (tests being implemented)

**Active Gates**:
1. ✅ **Minimum Build-to-Red Gate** (`.github/workflows/minimum-build-to-red.yml`) - ENFORCED
   - Lockfile verification
   - Test dodging detection
   - Lint checks
   - TypeScript type checking
   - Build validation

2. ✅ **QA Enforcement Gate** (`.github/workflows/qa-enforcement.yml`) - ENFORCED
   - Test dodging detection
   - QA parking validation
   - Governance sync checking
   - Test suite execution
   - Merge gate aggregation

**Purpose**: During BUILD-TO-GREEN, both workflows enforce basic hygiene and governance to prevent common issues while the full test suite is being implemented.

---

### State 2: Post-BUILD-TO-GREEN (Production Phase)

**Marker**: `.governance/BUILD_TO_GREEN_COMPLETE` EXISTS  
**Status**: 🟢 GREEN (all tests passing)

**Active Gates**:
1. ✅ **Minimum Build-to-Red Gate** (`.github/workflows/minimum-build-to-red.yml`) - ADVISORY ONLY
   - Automatically passes (all checks skipped)
   - Shows lifecycle complete message
   - No enforcement or blocking
   - Indicates enforcement is via qa-enforcement.yml

2. ✅ **QA Enforcement Gate** (`.github/workflows/qa-enforcement.yml`) - FULLY ENFORCED
   - Test dodging detection (enforced)
   - QA parking validation (enforced)
   - Governance sync checking (enforced)
   - Test suite execution (all 37+ tests must pass)
   - Merge gate aggregation (blocks on any failure)

**Purpose**: After BUILD-TO-GREEN, the temporary Minimum Build-to-Red scaffolding becomes advisory, and full enforcement responsibility shifts to the comprehensive QA Enforcement gate.

---

## Workflow Behaviors

### Minimum Build-to-Red Gate

#### Pre-BUILD-TO-GREEN Behavior
- **Lockfile Check**: Blocks if `package-lock.json` is missing
- **Test Dodging Check**: Blocks if forbidden patterns detected (`.skip()`, `.only()`, etc.)
- **Lint Check**: Blocks if ESLint fails with warnings
- **TypeScript Check**: Blocks if type checking fails
- **Build Check**: Blocks if Next.js build fails
- **Final Gate**: Aggregates all results, blocks merge on any failure

#### Post-BUILD-TO-GREEN Behavior
- **Lifecycle Check**: Detects `.governance/BUILD_TO_GREEN_COMPLETE`
- **All Jobs**: Skip actual checks, exit 0 immediately
- **Final Gate**: Shows advisory message, always passes
- **Output**: Clearly indicates lifecycle complete and that enforcement is via qa-enforcement.yml

**Code Example**:
```yaml
lifecycle-check:
  name: Build-to-Green Lifecycle Check
  runs-on: ubuntu-latest
  outputs:
    build_to_green_complete: ${{ steps.check.outputs.complete }}
  steps:
    - uses: actions/checkout@v4
    - name: Check BUILD_TO_GREEN_COMPLETE marker
      id: check
      run: |
        if [ -f ".governance/BUILD_TO_GREEN_COMPLETE" ]; then
          echo "✅ BUILD-TO-GREEN COMPLETE marker found"
          echo "complete=true" >> $GITHUB_OUTPUT
        else
          echo "⚠️  BUILD-TO-GREEN in progress (marker not found)"
          echo "complete=false" >> $GITHUB_OUTPUT
        fi
```

---

### QA Enforcement Gate

#### All Lifecycle States Behavior
- **Always Active**: No lifecycle awareness
- **Always Enforced**: Blocks merge on any failure
- **Test Dodging**: Forbidden patterns always cause failure
- **QA Parking**: Validates all parking entries
- **Governance Sync**: Ensures policy synchronization
- **Test Execution**: All tests must pass (37+ tests)
- **Merge Gate**: Aggregates all results, blocks on RED

**Rationale**: QA Enforcement is the permanent, comprehensive governance mechanism. It must always be active regardless of lifecycle state to ensure:
- No test dodging ever occurs
- QA parking is properly managed
- Governance policy stays synchronized
- All tests pass on every merge
- Full BUILD-TO-GREEN invariants are maintained

---

## Governance Invariants

### 1. No Weakening of Enforcement Post-BUILD-TO-GREEN
✅ **Maintained**: The Minimum Build-to-Red workflow becomes advisory, but QA Enforcement remains fully active. This maintains or increases enforcement rigor.

### 2. Lifecycle Marker Integrity
✅ **Maintained**: The `.governance/BUILD_TO_GREEN_COMPLETE` file is the single source of truth for lifecycle state. It must be:
- Committed to the repository
- Immutable once created (only removed if returning to development)
- Traceable in git history

### 3. Zero Test Dodging Rule
✅ **Maintained**: Test dodging detection is:
- Enforced by Minimum Build-to-Red pre-BUILD-TO-GREEN
- Always enforced by QA Enforcement in all states
- No gaps in enforcement exist

### 4. Merge Gate Supremacy
✅ **Maintained**: A RED merge gate always blocks:
- Pre-BUILD-TO-GREEN: Either workflow can block
- Post-BUILD-TO-GREEN: QA Enforcement blocks
- No lifecycle state bypasses merge blocking

### 5. Transparent State Transitions
✅ **Maintained**: The lifecycle state is:
- Explicitly checked in workflows
- Clearly communicated in workflow outputs
- Auditable via git history and workflow logs

---

## Lifecycle Transition Process

### Entering Post-BUILD-TO-GREEN State

**Prerequisites**:
1. All 37+ tests implemented and passing
2. No test dodging violations
3. No governance policy violations
4. All QA parking entries approved
5. Build succeeds without warnings
6. All security checks pass

**Transition Steps**:
1. Create `.governance/BUILD_TO_GREEN_COMPLETE` file
2. Add content: `PP-TN-06 COMPLETE` (or relevant tracking number)
3. Commit file to repository
4. Push to main branch
5. Verify in next PR that Minimum Build-to-Red shows advisory mode

**Validation**:
```bash
# Check lifecycle state
if [ -f ".governance/BUILD_TO_GREEN_COMPLETE" ]; then
  echo "✅ Post-BUILD-TO-GREEN (Production Phase)"
else
  echo "⚠️ Pre-BUILD-TO-GREEN (Development Phase)"
fi
```

### Reverting to Pre-BUILD-TO-GREEN State (Emergency)

**Use Case**: Major architectural change requires new test implementation

**Process**:
1. Document reason for reversion (governance issue)
2. Remove `.governance/BUILD_TO_GREEN_COMPLETE` file
3. Update BUILD_TO_GREEN.md with new test requirements
4. Commit changes
5. Implement new tests
6. Return to Post-BUILD-TO-GREEN state when complete

**Note**: This should be rare. Most changes should not require lifecycle reversion.

---

## CI Workflow Outputs

### Pre-BUILD-TO-GREEN (Development Phase)

**Minimum Build-to-Red Output**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Minimum Build-to-Red Gate - Hygiene Enforcement
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Dependency lockfile check passed
✅ Test dodging check passed
✅ Lint check passed
✅ TypeScript type check passed
✅ Build check passed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ HYGIENE GATE PASSED - Basic checks complete

⚠️  NOTE: This is hygiene scaffolding only.
⚠️  BUILD-TO-GREEN governance is mandatory and unaltered.
⚠️  Full enforcement: qa-enforcement.yml
⚠️  QA Plan status: npm run qa:plan-status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Post-BUILD-TO-GREEN (Production Phase)

**Minimum Build-to-Red Output**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Minimum Build-to-Red Gate - LIFECYCLE COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ BUILD-TO-GREEN phase complete
✅ This workflow is now advisory only
✅ Full enforcement via qa-enforcement.yml

Marker file: .governance/BUILD_TO_GREEN_COMPLETE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ HYGIENE GATE PASSED (advisory mode)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Benefits of Lifecycle-Aware Gates

### 1. Reduced CI Noise
- Post-BUILD-TO-GREEN: No redundant hygiene checks
- Faster PR feedback (fewer jobs to run)
- Clear focus on comprehensive QA Enforcement

### 2. Maintained Rigor
- All enforcement transferred to QA Enforcement
- No gaps in governance coverage
- Clear transition markers

### 3. Improved Developer Experience
- Clear lifecycle state in every PR
- No confusion about which gates enforce what
- Transparent enforcement model

### 4. Governance Compliance
- Lifecycle transitions are auditable
- State markers committed to repository
- Clear documentation of behavior changes

### 5. Scalability
- Pattern can extend to other repositories
- Clear precedent for future projects
- Documented best practice

---

## Troubleshooting

### Issue: Minimum Build-to-Red still enforcing after BUILD-TO-GREEN

**Diagnosis**:
```bash
# Check if marker file exists
ls -la .governance/BUILD_TO_GREEN_COMPLETE

# Check workflow output for lifecycle check
# Look for "✅ BUILD-TO-GREEN COMPLETE marker found"
```

**Solutions**:
1. Verify `.governance/BUILD_TO_GREEN_COMPLETE` file exists in main branch
2. Ensure PR is based on latest main with the marker file
3. Check workflow logs for lifecycle-check job output

---

### Issue: QA Enforcement not running

**Diagnosis**:
```bash
# Check workflow trigger
# qa-enforcement.yml triggers on: pull_request to main/develop

# Check for .github/workflows/qa-enforcement.yml file
ls -la .github/workflows/qa-enforcement.yml
```

**Solutions**:
1. Verify qa-enforcement.yml exists and is valid YAML
2. Check that PR targets main or develop branch
3. Review GitHub Actions logs for error messages

---

### Issue: Need to revert to Pre-BUILD-TO-GREEN state

**Process**:
```bash
# Remove marker file
git rm .governance/BUILD_TO_GREEN_COMPLETE

# Document reason
echo "Reverted for [reason]" > .governance/BUILD_TO_GREEN_STATUS.txt

# Commit and push
git commit -m "Revert to Pre-BUILD-TO-GREEN for [reason]"
git push
```

---

## Related Documents

- [BUILD_TO_GREEN.md](../../BUILD_TO_GREEN.md) - Build-to-Green plan and progress
- [QA_GOVERNANCE_GUIDE.md](QA_GOVERNANCE_GUIDE.md) - Governance compliance guide
- [GOVERNANCE_STATUS.md](../../GOVERNANCE_STATUS.md) - Current governance status
- [minimum-build-to-red.yml](../../.github/workflows/minimum-build-to-red.yml) - Lifecycle-aware workflow
- [qa-enforcement.yml](../../.github/workflows/qa-enforcement.yml) - Permanent enforcement workflow

---

## Audit Trail

| Date | Event | Details |
|------|-------|---------|
| 2025-12-16 | CI Lifecycle Gates Implemented | Added lifecycle awareness to minimum-build-to-red.yml |
| 2025-12-16 | Documentation Created | CI_LIFECYCLE_GATES.md created |

---

## Approval

**Document Status**: ✅ APPROVED  
**Approved By**: ForemanApp Agent Contract  
**Authority**: Canonical Governance Policy 1.1.0  
**Date**: 2025-12-16  

**This document is authoritative for CI lifecycle gate behavior in PartPulse.**

---

*For questions about CI gates, lifecycle transitions, or enforcement, refer to the governance team or ForemanApp agent.*
