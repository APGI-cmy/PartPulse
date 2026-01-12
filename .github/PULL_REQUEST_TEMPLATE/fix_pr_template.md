# Fix: [Brief Description]

## Defect Reference
**Issue**: #[issue-number]
**Classification**: [BUG | FEATURE | TECH_DEBT]
**Severity**: [CRITICAL | HIGH | MEDIUM | LOW]

## Root Cause Analysis Summary

**Root Cause**: [Describe the underlying cause]

**Contributing Factors**:
- [Factor 1]
- [Factor 2]

## Fix Architecture Summary

**Solution Approach**: [Describe how the fix works]

**Alternatives Considered**:
- [Alternative 1] - Rejected because [reason]
- [Alternative 2] - Rejected because [reason]

**Files Changed**:
- `path/to/file1.ts` - [What changed and why]
- `path/to/file2.ts` - [What changed and why]

## Changes Made

### Code Changes
- [Change 1]
- [Change 2]

### Test Changes
- [New test for defect reproduction]
- [Updated tests for edge cases]
- [Regression tests added]

### Documentation Changes
- [Documentation updates if applicable]

## Test Evidence (Red → Green)

### PREHANDOVER_PROOF (v2.0.0+)

**Required If**: This PR modifies workflows, CI gates, build scripts, or execution artifacts

- [ ] PREHANDOVER_PROOF provided as comment (see governance/templates/PREHANDOVER_PROOF_TEMPLATE.md)
- [ ] Not Required (this PR does not modify execution artifacts)

**If Required**: Complete 7-step verification protocol and post PREHANDOVER_PROOF comment before requesting review.

**Authority**: governance/canon/EXECUTION_BOOTSTRAP_PROTOCOL.md

---

### Defect Reproduction Test
**Before Fix** (Red):
```
[Paste test output showing failure that reproduces the defect]
```

**After Fix** (Green):
```
[Paste test output showing all tests passing]
```

### Test Summary
- Total Tests: [number]
- Passing: [number]
- Failed: 0 ✅
- Skipped: 0 ✅
- New Tests Added: [number]

### CI Status
- [ ] All CI checks passing
- [ ] No new warnings introduced
- [ ] Test coverage maintained or improved
- [ ] Security scans clean

## Rollback Procedure

### Rollback Trigger Conditions
[What conditions would indicate this fix needs to be rolled back]

### Rollback Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Rollback Verification
[How to verify rollback was successful]

## Production Impact Assessment

### Affected Components
- [Component 1]: [Impact description]
- [Component 2]: [Impact description]

### Breaking Changes
- [ ] No breaking changes
- [ ] Breaking changes (describe below)

**Breaking Changes Description** (if applicable):
[Describe any breaking changes]

### Data Migration
- [ ] No data migration required
- [ ] Data migration required (describe below)

**Migration Details** (if applicable):
[Describe migration approach and safety measures]

### Configuration Changes
- [ ] No configuration changes
- [ ] Configuration changes required (describe below)

**Configuration Changes** (if applicable):
[Describe required configuration updates]

### Deployment Considerations
[Any special considerations for deployment]

## Verification Checklist

### Pre-Merge Validation
- [ ] Defect reproduction test passes
- [ ] All existing tests pass (zero regression)
- [ ] No test debt introduced (no skips, todos, stubs)
- [ ] No compilation errors
- [ ] No type errors
- [ ] No lint errors
- [ ] No new warnings (or justified)
- [ ] Code review completed
- [ ] Architecture approved (if CS2 required)
- [ ] All CI gates passing
- [ ] Security scans clean

### Production Readiness
- [ ] Rollback procedure documented and tested
- [ ] Production impact assessed
- [ ] Configuration changes documented
- [ ] Monitoring/alerting configured
- [ ] Communication plan ready (if needed)
- [ ] Deployment window scheduled

### Post-Deployment Verification
- [ ] Fix verified in production
- [ ] No regression observed
- [ ] User impact resolved (if applicable)
- [ ] Monitoring shows expected behavior

## Evidence Location

**Evidence Path**: `/evidence/fixes/ISSUE-[number]/`

- Discovery: [Link to evidence]
- Triage: [Link to evidence]
- Architecture: [Link to evidence]
- Implementation: [This PR]
- Validation: [Link to test results]
- Deployment: [Will be added after deployment]
- Closure: [Will be added after verification]

## Learning Promotion

### Governance Impact
- [ ] No governance impact
- [ ] Requires governance learning promotion (describe below)

**Learning to Promote** (if applicable):
[Describe what governance gap this defect revealed]

### Ripple Awareness
- [ ] Defect is specific to PartPulse
- [ ] Defect pattern may exist in other repos (describe below)

**Ripple Assessment** (if applicable):
[Describe which repos should be notified]

## Additional Notes

[Any additional context, concerns, or information]

---

## Approval Requirements

**FM Validation Required**:
- [ ] FM has validated 100% GREEN
- [ ] FM has reviewed evidence completeness
- [ ] FM has verified fix architecture followed
- [ ] FM approves merge

**Human Approval Required** (if applicable):
- [ ] CRITICAL defect - human owner approval
- [ ] Security defect - security review
- [ ] Breaking changes - business owner approval

---

## References

- **Defect Issue**: #[issue-number]
- **Fix Architecture**: [Link to architecture doc or issue comment]
- **Canonical Process**: `/docs/defect-resolution-process.md`
- **Evidence**: `/evidence/fixes/ISSUE-[number]/`
