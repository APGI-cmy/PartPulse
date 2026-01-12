# PREHANDOVER_PROOF Template

**Purpose**: Evidence that all execution checks passed before agent handover  
**Version**: 2.0.0  
**Authority**: Execution Bootstrap Protocol (governance/canon/EXECUTION_BOOTSTRAP_PROTOCOL.md)  
**Required For**: All PRs creating/modifying workflows, gates, or execution artifacts

---

## Instructions

Copy this template and fill in all sections. Post as a PR comment before requesting review.

---

# PREHANDOVER_PROOF

**Date**: [YYYY-MM-DD]  
**Agent**: [agent-name]  
**PR**: [#PR-number]  
**Commit SHA**: [commit-hash]

---

## 1. CI Jobs Identified

List ALL jobs from relevant workflow files. Use this format:

### [workflow-name].yml ([N] jobs)
1. [ ] job-name → command
2. [ ] job-name → command
3. [ ] job-name → command

**Example**:
### qa-enforcement.yml (6 jobs)
1. ✅ test-dodging-check → `node qa/detect-test-dodging.js`
2. ✅ qa-parking-check → `node qa/parking/watcher.js`
3. ✅ governance-sync-check → `node qa/governance/sync-checker.js`
4. ✅ deprecation-check → `npx eslint --config eslint.config.deprecation.mjs .`
5. ⚠️ test-execution → `npm run test:ci`
6. ✅ merge-gate → (aggregates all above)

---

## 2. Local Execution Results

For EACH command, show:
- Command executed
- Exit code (0 = pass, non-zero = fail)
- Relevant output or summary
- Pass/Fail status

**Format**:
```
Command: [exact command]
Exit Code: [0 or error code]
Output: [summary or error message]
Status: ✅ PASSED / ❌ FAILED / ⚠️ CANNOT REPLICATE
```

### Example Results

```bash
$ node qa/detect-test-dodging.js
Exit Code: 0
Output: ✓ No test dodging patterns detected
Status: ✅ PASSED

$ node qa/parking/watcher.js
Exit Code: 0
Output: ✓ QA parking registry validated
Status: ✅ PASSED

$ npm run lint
Exit Code: 0
Output: ✓ No linting errors (0 errors, 0 warnings)
Status: ✅ PASSED

$ npm run test:ci
Exit Code: 1
Output: Error: Cannot connect to database at localhost:5432
Status: ⚠️ CANNOT REPLICATE (requires PostgreSQL service container)
Reason: Test suite requires PostgreSQL which is provided as service in CI
Attempted: Ran command but database connection failed
Verification: No test files modified in this PR, test structure validated
```

---

## 3. CI Workflow Runs

List URLs to completed GitHub Actions workflow runs that verify ALL checks passed.

**Format**:
- Workflow Name: [URL to run]
- Status: ✅ All jobs passed
- Date: [run date/time]

### Example

- **QA Enforcement**: https://github.com/APGI-cmy/PartPulse/actions/runs/12345678
  - Status: ✅ All 6 jobs passed
  - Date: 2026-01-12 14:30 UTC

- **Deprecation Detection**: https://github.com/APGI-cmy/PartPulse/actions/runs/12345679
  - Status: ✅ All jobs passed
  - Date: 2026-01-12 14:32 UTC

---

## 4. Limitations and Exceptions

Document any commands that could NOT be replicated locally and explain why:

**Format**:
```
Command: [command]
Reason: [why it cannot be replicated locally]
Attempted: [what you tried]
CI Verification: [how you confirmed it will pass in CI]
CI Run URL: [link to successful CI run]
```

### Example

**Command**: `npm run test:ci`  
**Reason**: Requires PostgreSQL service container (port 5432) which CI provides via service configuration  
**Attempted**: Ran command locally, confirmed database connection error  
**Verification**: 
- No test files modified in this PR
- Test structure validated manually
- No changes to test configuration
- CI run shows 220/220 tests passing  
**CI Run URL**: https://github.com/APGI-cmy/PartPulse/actions/runs/12345678

---

## 5. Fixes Applied

If any local checks initially failed, document what was fixed:

**Format**:
```
Issue: [what failed]
Root Cause: [why it failed]
Fix Applied: [what was changed]
Verification: [re-run results showing fix worked]
```

### Example

**Issue**: ESLint deprecation check failed with 24 errors  
**Root Cause**: Utility scripts in `scripts/**/*.js` use CommonJS but ESLint expected ES modules  
**Fix Applied**: Added `scripts/**/*.js` to `globalIgnores` in `eslint.config.mjs`  
**Verification**: Re-ran `npm run lint:deprecation` → Exit code 0, 0 errors

---

## 6. Verification Summary

Complete this checklist:

- [ ] **Step 1**: All CI jobs identified from workflow files
- [ ] **Step 2**: Every command executed locally (or limitation documented)
- [ ] **Step 3**: Results documented for each command
- [ ] **Step 4**: All failures fixed (or legitimate exceptions documented)
- [ ] **Step 5**: 100% pass rate achieved (locally or with CI proof)
- [ ] **Step 6**: GitHub Actions workflow runs completed and verified
- [ ] **Step 7**: This PREHANDOVER_PROOF created with all evidence

### Pass Rate Calculation

**Total Commands**: [N]  
**Passed Locally**: [N]  
**Cannot Replicate (Legitimate)**: [N]  
**Failed**: 0 (must be zero)  

**Pass Rate**: 100% ✅

---

## 7. Authorization Statement

**I hereby certify that**:

1. ✅ All required CI jobs have been identified from workflow files
2. ✅ All replicable commands have been executed locally and passed
3. ✅ All non-replicable commands have legitimate reasons documented
4. ✅ All GitHub Actions workflow runs have completed successfully
5. ✅ Evidence URLs provided above link to green CI runs
6. ✅ No failures remain unresolved
7. ✅ This PR is ready for handover

**Handover authorized, all checks green.**

---

**Agent**: [agent-name]  
**Signature**: [agent role and version]  
**Date**: [YYYY-MM-DD HH:MM UTC]

---

## Notes

[Any additional context, concerns, or information relevant to handover]

---

## References

- **Protocol**: governance/canon/EXECUTION_BOOTSTRAP_PROTOCOL.md
- **Agent Contract**: .github/agents/[agent-name].md
- **Failure Learning**: qa/FAILURE_LEARNING_LOG.md (Failure #3)
- **CI Workflows**: .github/workflows/

---

**This proof is MANDATORY before handover. Incomplete or missing proof blocks merge.**
