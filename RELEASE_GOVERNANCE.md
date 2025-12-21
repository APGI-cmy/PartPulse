# Release Governance

## Purpose

This document establishes the canonical release governance framework for PartPulse, defining what constitutes a release, the release process, and governance requirements for maintaining production integrity.

## Release Definition

A **release** is:
- An explicitly tagged commit on the `main` branch
- A stable, CI-GREEN baseline approved for production deployment
- A formally marked snapshot representing a verified system state
- The source of truth for production deployments

**Untagged commits are NOT releases** and must not be deployed to production environments.

## Tag-Based Release Authority

### Release Identification
- All releases **must** be explicitly tagged using semantic versioning
- Tag format: `vMAJOR.MINOR.PATCH[-LABEL]`
  - Example: `v0.1.0-baseline`, `v1.0.0`, `v1.2.3-hotfix`
- Tags are immutable once pushed to origin
- No releases may occur without a corresponding Git tag

### Baseline Release
The first production-ready release is designated as:
```
v0.1.0-baseline
```

This tag represents:
- Initial stable system state following Unit A remediation
- CI-GREEN status with all QA enforcement passing
- Verified core workflows (internal transfers, warranty submissions, email notifications)
- No governance or QA regressions

## Production Deployment Source

### Deployment Authority
- Production deploys **exclusively** from the `main` branch
- The `main` branch represents the authoritative production state
- Only tagged commits on `main` are eligible for production deployment

### Deployment Process
1. Verify target commit is on `main` branch
2. Confirm Git tag exists for the release
3. Validate CI status is GREEN for the tagged commit
4. Deploy using the explicit tag reference
5. Verify deployment health via UI and CI checks

**No deployments from feature branches, untagged commits, or non-main branches.**

## Post-Release Change Requirements

### Change Authority
After a release is tagged and deployed, any subsequent changes require:

1. **Pull Request (PR)**
   - All changes must go through PR workflow
   - No direct commits to `main`
   - Branch must be up-to-date with `main`

2. **CI GREEN Validation**
   - All CI checks must pass
   - QA Enforcement workflow must be GREEN
   - No test dodging violations
   - No governance policy violations
   - Full test suite passing (37+ tests)

3. **Verification Method**
   - Verification is performed via CI automation and UI behavior validation
   - Code review is supplementary; CI and QA gates are authoritative
   - Human approval does NOT override RED gates

### RED Gate Supremacy
- A RED CI gate is a hard stop
- No merge may proceed with failing CI checks
- Explanations, justifications, or "unrelated failure" claims do NOT constitute resolution
- Resolution paths:
  - Fix code to achieve GREEN
  - Request governed exception (QA Parking / DP-RED) per [QA Governance Guide](docs/governance/QA_GOVERNANCE_GUIDE.md)

## Verification Standards

### Authoritative Validation Sources
1. **CI Pipeline Status**
   - GitHub Actions workflow results
   - QA Enforcement gate status
   - Test suite execution results

2. **UI Behavior Validation**
   - Core workflow execution (transfers, warranties, emails)
   - User interaction verification
   - Feature functionality confirmation

3. **Governance Compliance Checks**
   - Test dodging detection results
   - QA parking registry status
   - Governance policy synchronization

### Non-Authoritative Inputs
- Code review comments (advisory only)
- Manual code inspection (supplementary)
- Subjective quality assessments (informative)

**If CI is GREEN and UI behavior is correct, the system is verified.**

## Governance Enforcement Expectations

### Mandatory Compliance
All releases and post-release changes must comply with:

1. **Zero Test Dodging**
   - No `.skip()`, `.only()`, or test bypasses
   - All tests must execute
   - Governed exceptions require explicit approval

2. **QA Parking Registry**
   - Any intentional RED states must be registered
   - Owner approval required
   - Expiry condition mandatory
   - Tracking issue linked

3. **One-Time Failure Doctrine**
   - First occurrence: capture, analyze, prevent
   - Repeat occurrence: catastrophic failure
   - Permanent prevention measures required

4. **Merge Gate Supremacy**
   - RED gates block all merges
   - No rationalization or deferral allowed
   - Fix-to-GREEN or governed exception required

### Governance Documentation
For complete governance requirements, see:
- [GOVERNANCE_STATUS.md](GOVERNANCE_STATUS.md) - Official governance declaration
- [QA Governance Guide](docs/governance/QA_GOVERNANCE_GUIDE.md) - Complete compliance guide
- [BUILD_TO_GREEN.md](BUILD_TO_GREEN.md) - Test implementation plan
- [QA_PLAN.md](qa/QA_PLAN.md) - QA strategy and test definitions

## Release Lifecycle

### 1. Pre-Release
- Feature development on feature branches
- PR submission with CI validation
- Review and approval process
- Merge to `main` after GREEN gates

### 2. Release Creation
- Identify stable commit on `main`
- Verify CI GREEN status
- Create Git tag with semantic version
- Push tag to origin
- Update release documentation

### 3. Production Deployment
- Deploy tagged commit to production
- Verify deployment health
- Monitor for issues
- Document deployment in audit trail

### 4. Post-Release Maintenance
- Bug fixes via PR + CI GREEN
- Feature additions via PR + CI GREEN
- Emergency hotfixes follow same governance
- All changes require new release tag for production deployment

## Accidental Modification Prevention

### Protected Branch Requirements
- `main` branch must have GitHub branch protection enabled
- Required status checks: QA Enforcement workflow
- No force pushes allowed
- No deletion allowed
- Require PR before merge

### Tag Immutability
- Once pushed, tags must not be deleted or moved
- Tag history is permanent audit trail
- Corrections require new tags, not tag modification

### Deployment Guards
- Production deployment scripts must verify tag existence
- Deployment must fail if target commit is untagged
- Automated deployment must validate CI GREEN status

## Governance Violations

### Prohibited Actions
The following are governance violations:

- ❌ Deploying untagged commits to production
- ❌ Deploying from non-main branches
- ❌ Merging with RED CI gates
- ❌ Bypassing required status checks
- ❌ Test dodging to achieve GREEN
- ❌ Deleting or moving existing tags
- ❌ Force pushing to protected branches

### Violation Response
When a governance violation is detected:

1. **Immediate Halt**
   - Stop deployment process
   - Rollback if violation reached production
   - Notify responsible parties

2. **Root Cause Analysis**
   - Document what happened and why
   - Identify gap in governance enforcement
   - Determine prevention measures

3. **Permanent Prevention**
   - Implement technical controls to prevent recurrence
   - Update governance documentation
   - Add CI checks if applicable
   - Update training materials

4. **Audit Trail**
   - Log violation in governance audit trail
   - Document resolution and prevention measures
   - Update failure learning log

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12-20 | Initial release governance document |

## Approval

**Document Status**: ✅ APPROVED  
**Authority**: Maturion Governance Framework  
**Effective Date**: 2025-12-20  

**This document is the canonical release governance policy for PartPulse.**

---

*For questions about release governance, refer to [GOVERNANCE_STATUS.md](GOVERNANCE_STATUS.md) or escalate to Foreman.*
