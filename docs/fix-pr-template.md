# Fix PR Template - PartPulse

## Purpose
This template provides the structure for defect fix Pull Requests in accordance with the Defect Resolution and Maintenance Canon.

---

## Fix PR Template Content

When creating a PR for a defect fix, use the following template:

```markdown
# Fix: [Brief Description]

## Defect Reference
**Issue**: #{issue-number}
**Classification**: [BUG | FEATURE | TECH_DEBT]
**Severity**: [CRITICAL | HIGH | MEDIUM | LOW]

## Root Cause Analysis Summary
<!-- Brief summary of what caused the defect -->

**Root Cause**: [Describe the underlying cause]

**Contributing Factors**:
- [Factor 1]
- [Factor 2]

## Fix Architecture Summary
<!-- Brief summary of the solution approach -->

**Solution Approach**: [Describe how the fix works]

**Alternatives Considered**:
- [Alternative 1] - Rejected because [reason]
- [Alternative 2] - Rejected because [reason]

**Files Changed**:
- `path/to/file1.ts` - [What changed and why]
- `path/to/file2.ts` - [What changed and why]

## Changes Made

### Code Changes
<!-- Describe the implementation changes -->
- [Change 1]
- [Change 2]

### Test Changes
<!-- Describe test additions/modifications -->
- [New test for defect reproduction]
- [Updated tests for edge cases]
- [Regression tests added]

### Documentation Changes
<!-- If applicable -->
- [Documentation updates]

## Test Evidence (Red → Green)

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

**Evidence Path**: `/evidence/fixes/ISSUE-{number}/`

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

- **Defect Issue**: #{issue-number}
- **Fix Architecture**: [Link to architecture doc or issue comment]
- **Canonical Process**: `/docs/defect-resolution-process.md`
- **Evidence**: `/evidence/fixes/ISSUE-{number}/`
```

---

## Usage Instructions

### 1. Creating a Fix PR

When you create a PR for a defect fix:
1. Use GitHub's PR template feature
2. Fill in all sections thoroughly
3. Link to the defect issue
4. Include test evidence (before/after)
5. Document rollback procedure
6. Complete all checklists

### 2. Required Sections

**MANDATORY sections** (must be complete):
- Defect Reference
- Root Cause Analysis Summary
- Fix Architecture Summary
- Test Evidence (Red → Green)
- Rollback Procedure
- Verification Checklist

**Optional sections** (complete if applicable):
- Breaking Changes
- Data Migration
- Configuration Changes
- Learning Promotion
- Ripple Awareness

### 3. Review Process

Fix PRs follow standard review process PLUS:
- FM validates 100% GREEN
- FM verifies evidence completeness
- FM confirms architecture followed
- Additional approvals for CRITICAL/security fixes

### 4. Merge Requirements

**Cannot merge until**:
- All verification checklist items checked
- All CI gates passing
- FM approval granted
- No test debt present
- Evidence complete

---

## Template Location

**File**: `.github/PULL_REQUEST_TEMPLATE/fix_pr_template.md`

To use this template when creating a PR:
```
https://github.com/APGI-cmy/PartPulse/compare/main...fix-branch?template=fix_pr_template.md
```

Or select "Fix PR" from the PR template dropdown when creating a PR.

---

## Maintenance

This template is maintained by the Governance Liaison and updated when:
- Canonical requirements change
- Process improvements identified
- Team feedback received

**Version**: 1.0.0  
**Last Updated**: 2026-01-09

---

**References**:
- **Canonical Source**: `maturion-foreman-governance/governance/canon/DEFECT_RESOLUTION_MAINTENANCE_CANON.md`
- **Process Documentation**: `/docs/defect-resolution-process.md`
- **Rollback Procedures**: `/docs/rollback-procedures.md`
