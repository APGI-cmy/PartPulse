# Defect Resolution Process - PartPulse

## Authority
This process implements the **Defect Resolution and Maintenance Canon** from the maturion-foreman-governance repository.

**Canonical Reference**: `maturion-foreman-governance/governance/canon/DEFECT_RESOLUTION_MAINTENANCE_CANON.md` v1.0.0  
**Effective Date**: 2026-01-09  
**Repository**: PartPulse (APGI-cmy/PartPulse)

---

## 1. Overview

This document defines the mandatory process for resolving defects in the PartPulse application, ensuring that maintenance work maintains the same quality standards as initial builds.

### Core Principles

1. **Maintenance is not exempt from governance** - Same 100% GREEN requirement, zero test debt, architecture-first
2. **One-Time Fix Law** - Fixes must work correctly the first time
3. **Production Safety First** - Additional safety validation for published systems
4. **Defect Learning Promotion** - Every defect improves governance permanently

---

## 2. Defect Classification

Every issue must be classified into ONE primary category:

### 2.1 BUG (Functional Defect)
**Definition**: Implemented behavior does not match specification or user expectation.

**Examples**:
- Form validation accepts invalid data
- Calculation produces wrong result
- API returns incorrect HTTP status code
- Authentication allows unauthorized access
- Data corruption or loss

**GitHub Label**: `defect-bug`

### 2.2 FEATURE (Missing Capability)
**Definition**: Required functionality does not exist but was specified or reasonably expected.

**Examples**:
- Specified report not available
- Required API endpoint missing
- Export functionality not working
- Mobile responsiveness not implemented

**GitHub Label**: `defect-feature`

### 2.3 TECH_DEBT (Architectural or Quality Issue)
**Definition**: Implementation works but violates quality standards, creates maintenance burden, or accumulates risk.

**Examples**:
- Code quality issues (complexity, duplication)
- Performance degradation
- Incomplete error handling
- Test coverage gaps
- Deprecated dependency usage
- Security vulnerability in dependencies

**GitHub Label**: `defect-tech-debt`

---

## 3. Severity Assessment

Every defect must be assigned a severity level:

- **CRITICAL**: Production down, data loss, security breach, blocking users
  - Label: `severity-critical`
  - Response: Immediate
  
- **HIGH**: Major functionality broken, significant user impact, workaround difficult
  - Label: `severity-high`
  - Response: Within 24 hours
  
- **MEDIUM**: Functionality degraded, moderate user impact, workaround available
  - Label: `severity-medium`
  - Response: Next sprint
  
- **LOW**: Minor issue, cosmetic, limited impact, easy workaround
  - Label: `severity-low`
  - Response: Backlog prioritization

---

## 4. Defect Triage Process

**Triage Ownership**: Foreman (FM) is responsible for defect triage.

**Timeline**: Must be completed within 24 hours of defect discovery.

### 4.1 Triage Steps

1. **Verify and Classify**
   - Reproduce defect in controlled environment
   - Classify into BUG, FEATURE, or TECH_DEBT
   - Determine root cause category

2. **Assess Severity and Priority**
   - Assign severity level (CRITICAL/HIGH/MEDIUM/LOW)
   - Determine impact scope (affected users, functionality, business impact)
   - Assess technical impact (stability, performance, scalability)

3. **Create Defect Record**
   - Use appropriate GitHub issue template
   - Apply classification and severity labels
   - Document reproduction steps
   - Link evidence in `/evidence/fixes/{issue-number}/discovery/`

### 4.2 Defect Traceability

Every defect MUST have:
- ✅ Unique identifier (GitHub issue number)
- ✅ Classification label (BUG/FEATURE/TECH_DEBT)
- ✅ Severity label (CRITICAL/HIGH/MEDIUM/LOW)
- ✅ Discovery date and discoverer
- ✅ Reproduction steps
- ✅ Expected vs. actual behavior
- ✅ Impact assessment
- ✅ Fix assignment and status

---

## 5. Fix Planning and Authorization

### 5.1 Fix Architecture (Mandatory)

**Every defect fix requires architecture before implementation.**

Architecture MUST include:

1. **Root Cause Analysis (RCA)**
   - Precise defect cause identified
   - Contributing factors documented
   - Assumption failures catalogued

2. **Fix Design**
   - Solution approach defined
   - Alternative approaches considered
   - Success criteria specified
   - Edge cases and error handling designed

3. **Impact Assessment**
   - Files and components affected
   - Breaking change risk evaluated
   - Dependency changes identified
   - Database migrations specified

4. **Test Strategy**
   - New tests required for defect coverage
   - Existing tests requiring updates
   - Regression test scope defined

5. **Deployment Strategy**
   - Deployment sequence specified
   - Configuration changes documented
   - Rollback procedure defined (see `/docs/rollback-procedures.md`)
   - Verification steps listed

**Documentation**: Architecture must be captured in issue comments or dedicated document in `/evidence/fixes/{issue-number}/architecture/`

### 5.2 Fix Authorization Gate

**Before builder appointment, FM MUST verify:**

✅ **Architecture Complete**
- Root cause analysis documented
- Fix design specified
- Impact assessment complete
- Test strategy defined
- Deployment strategy ready

✅ **Safety Validation**
- Rollback plan exists
- Production impact understood
- Resource availability confirmed
- Governance readiness verified

✅ **Priority and Sequencing**
- Fix priority justified
- Dependencies identified
- Sequencing conflicts resolved

**Authorization Evidence**: FM creates "Fix Authorization" comment on defect issue documenting gate completion.

---

## 6. Branch Strategy for Fixes

### 6.1 Branch Types

**Hotfix Branches** (`hotfix/ISSUE-{number}-{description}`)
- For CRITICAL production defects requiring immediate fix
- Branch from production tag or main
- Merge to main via standard PR process
- Deploy immediately after merge

**Fix Branches** (`fix/ISSUE-{number}-{description}`)
- For HIGH/MEDIUM/LOW defects in normal fix cycle
- Branch from main
- Merge to main via standard PR process
- Deploy in scheduled maintenance window

**Tech Debt Branches** (`tech-debt/ISSUE-{number}-{description}`)
- For accumulated tech debt remediation
- Branch from main
- Merge via standard PR process
- Deploy when convenient

### 6.2 Branch Naming Examples

```
hotfix/ISSUE-1234-auth-bypass-vulnerability
fix/ISSUE-5678-payment-calculation-error
tech-debt/ISSUE-9012-remove-deprecated-api
```

---

## 7. Quality Gates and Test Requirements

### 7.1 Fix QA Requirements (Red-to-Green)

**Principle**: Fixes follow QA-to-Red → Build-to-Green same as new builds.

**Fix QA Creation** (FM responsibility):

1. **Defect Reproduction Test**
   - Test that reproduces defect (MUST FAIL before fix)
   - Demonstrates exact failure condition
   - Validates expected behavior after fix

2. **Regression Tests**
   - Existing tests MUST continue passing
   - Edge cases around defect area covered
   - Related functionality validated

3. **Integration Tests**
   - System integration preserved
   - Downstream dependencies not broken
   - API contracts maintained

### 7.2 Zero Test Debt for Fixes

**Absolute Requirement**: Fix PRs MUST have ZERO test debt.

**Forbidden in Fix PRs**:
- ❌ Skipped tests (`.skip()`, `.todo()`, commented out)
- ❌ Incomplete tests (stubs, no assertions, TODO comments)
- ❌ Reduced test coverage (removing tests to "fix" failing tests)
- ❌ Test configuration changes that hide failures
- ❌ "Will test later" or deferred test creation

### 7.3 Fix Validation Requirements

**Before Merge Approval**:

1. ✅ All tests passing in development environment
2. ✅ No compilation/lint/type errors
3. ✅ No warnings (unless whitelisted)
4. ✅ All CI gates passing
5. ✅ All governance checks passing
6. ✅ Integration tests passing
7. ✅ Security scans clean
8. ✅ Manual verification complete
9. ✅ Defect reproduction test now passes
10. ✅ No observable regression

---

## 8. Version Control for Fixes

### 8.1 Semantic Versioning

**Version Increment Rules**:

- **PATCH version** (`x.y.Z`): Backward-compatible bug fixes
  - Standard for most defect fixes
  - No API changes
  - Internal implementation corrections
  - Security patches (non-breaking)

- **MINOR version** (`x.Y.0`): Backward-compatible additions
  - New features during fix cycle (rare, requires approval)
  - Deprecation notices

- **MAJOR version** (`X.0.0`): Breaking changes
  - Breaking API changes (requires extraordinary approval)
  - Incompatible behavior changes

**Standard Fix Cycle**: PATCH version increment

### 8.2 Version Tagging

- Tag format: `vMAJOR.MINOR.PATCH`
- Tag creation: After merge, before deployment
- Tag message: Reference defect issue and brief description

Example:
```bash
git tag -a v1.2.3 -m "Fix: Payment calculation error (ISSUE-5678)"
```

---

## 9. Evidence and Audit Trail

### 9.1 Required Evidence Documents

Store in `/evidence/fixes/{issue-number}/`:

1. **discovery/** - Initial defect report, screenshots, logs
2. **triage/** - Classification, RCA, priority assessment
3. **architecture/** - Fix design, impact analysis
4. **implementation/** - PR links, code review evidence
5. **validation/** - Test results, CI logs
6. **deployment/** - Deployment logs, verification
7. **closure/** - Final evidence, lessons learned

### 9.2 Audit Trail Requirements

Every fix MUST have auditable:
- Who discovered defect
- Who triaged and classified
- Who designed fix architecture
- Who implemented fix
- Who validated fix
- Who approved deployment
- Who verified in production
- When each step occurred
- Why decisions were made

---

## 10. Communication and Status Tracking

### 10.1 Status Labels

Track fix progress with labels:
- `fix-in-progress` - Fix work underway
- `fix-deployed` - Fix in production
- `fix-verified` - Defect confirmed resolved

### 10.2 Internal Communication

**Defect Discovery** (CRITICAL/HIGH):
- Notify team in communication channel
- Document in issue with full context

**Fix Deployment**:
- Notify team before deployment
- Share deployment window
- Provide rollback contacts

**Fix Completion**:
- Notify team when fix deployed
- Share release notes
- Document lessons learned

---

## 11. Escalation Procedures

### 11.1 Escalation Triggers

Fix cycle MUST escalate when:

1. **Fix Attempt Fails**
   - Fix PR does not resolve defect
   - Fix PR introduces new defect
   - Fix PR fails governance gates repeatedly (3+ attempts)

2. **Architecture Insufficient**
   - Root cause cannot be identified
   - Fix design complexity exceeds capability
   - Breaking changes required but not approved

3. **Governance Conflict**
   - Fix requires governance exemption
   - Resource availability insufficient

4. **Production Risk Excessive**
   - Fix blast radius too large
   - Rollback not feasible
   - Data loss risk unmitigated

**Escalation Target**: Human owner (Johan Ras) or designated authority.

---

## 12. Step-by-Step Playbooks

### 12.1 Critical Production Defect

Use **Playbook 1: Critical Production Defect** from canonical document:
1. Immediate Response (0-15 minutes)
2. Triage and Planning (15-60 minutes)
3. Fix Implementation (1-4 hours)
4. Deployment (30-60 minutes)
5. Post-Fix (24-72 hours)

### 12.2 Standard Defect Fix

Use **Playbook 2: Standard Defect Fix** from canonical document:
1. Defect Triage (within 24 hours)
2. Fix Planning (when prioritized)
3. Fix Implementation (standard timeline)
4. Review and Merge (standard PR cycle)
5. Deployment (scheduled window)
6. Closure (within 48 hours)

### 12.3 Tech Debt Remediation

Use **Playbook 3: Tech Debt Remediation** from canonical document:
1. Tech Debt Assessment (quarterly)
2. Remediation Planning (per item)
3. Implementation (standard process)
4. Review and Merge
5. Deployment and Verification

### 12.4 Security Vulnerability Fix

Use **Playbook 4: Security Vulnerability Fix** from canonical document:
1. Security Assessment (immediate)
2. Security Planning (urgent)
3. Secure Implementation (priority)
4. Security Validation (thorough)
5. Secure Deployment (controlled)
6. Post-Security Fix (critical)

---

## 13. Governance Compliance

### 13.1 Absolute Requirements

**MANDATORY for all fix PRs**:
- ✅ 100% GREEN (zero errors, warnings, failures)
- ✅ Zero test debt
- ✅ All existing tests passing (zero regression)
- ✅ Architecture-first (no shortcuts)
- ✅ Complete audit trail
- ✅ All governance gates pass

**FORBIDDEN**:
- ❌ "It's just a small fix" (minimizing language)
- ❌ Bypassing architecture review
- ❌ Skipping tests
- ❌ Direct production edits without PR/gates
- ❌ "Will test later"

### 13.2 PR Gates

Fix PRs pass through SAME governance gates as new build PRs:
- Governance compliance validation
- Agent role and contract validation
- Test coverage requirements
- Code quality standards
- Security vulnerability scanning
- Breaking change detection

**No gate exemptions for "production urgency"**

---

## 14. References

### 14.1 Canonical Documents

- **Primary Canon**: `maturion-foreman-governance/governance/canon/DEFECT_RESOLUTION_MAINTENANCE_CANON.md`
- **Layer-Down Instructions**: `maturion-foreman-governance/governance/reports/DEFECT_RESOLUTION_CANON_LAYER_DOWN_INSTRUCTIONS.md`
- **Build Philosophy**: `BUILD_PHILOSOPHY.md`
- **QA Policy**: `governance/policy/QA_POLICY_MASTER.md` (if exists)

### 14.2 Local Documentation

- **Fix PR Template**: `/docs/fix-pr-template.md`
- **Rollback Procedures**: `/docs/rollback-procedures.md`
- **Evidence Storage**: `/evidence/fixes/README.md`
- **Issue Templates**: `.github/ISSUE_TEMPLATE/defect-*.yml`

### 14.3 GitHub Resources

- **Labels**: See Section 2 (Classification) and Section 3 (Severity)
- **Issue Templates**: `.github/ISSUE_TEMPLATE/`
- **PR Template**: `.github/PULL_REQUEST_TEMPLATE/fix_pr_template.md`

---

## 15. Maintenance and Updates

This document is maintained by the Governance Liaison and must be updated when:
- Canonical document is updated in governance repo
- Local process improvements are identified
- Governance feedback is received
- Team learnings require documentation

**Version**: 1.0.0  
**Last Updated**: 2026-01-09  
**Next Review**: 2026-04-09 (Quarterly)

---

**END OF PROCESS DOCUMENT**
