# FM Merge Gate Management Canon (T0-014)

**Document ID**: T0-014  
**Version**: 2.0.0  
**Date**: 2026-01-09  
**Status**: Active  
**Classification**: Tier-0 Constitutional  
**Authority**: Maturion Foreman Governance

---

## Purpose

This canonical document defines the **supreme authority and absolute requirements** for merge gate management under Foreman (FM) governance. The merge gate is the final constitutional checkpoint that enforces One-Time Build Law and prevents regression or technical debt from entering the main codebase.

**FM Authority**: FM has **exclusive authority** over merge gate preparation, readiness determination, and merge authorization. No builder, agent, or automation may bypass, weaken, or waive merge gate requirements.

---

## Constitutional Foundation

**From BUILD_PHILOSOPHY.md (Supreme Authority)**:
> "A build is not complete unless it is 100% GREEN. 100% GREEN means: Zero compilation errors, Zero type errors, Zero lint errors, Zero test failures, Zero runtime errors, Zero deployment failures, Zero warnings (unless explicitly whitelisted), All QA checks passing, All governance gates passing, Full functionality verified, All test infrastructure complete, ZERO TEST DEBT."

**Merge Gate Supremacy Invariant**:
> "A RED merge gate is a hard stop. ForemanApp either fixes the system or escalates for governed exception approval. No rationalization, deferral, or conditional proceed."

**One-Time Build Law**:
> "Every build must be a one-time, fully functional build. No iterations, no fixes after merge, no regression. The build works perfectly the first time, or it doesn't happen."

---

## 1. Merge Gate Definition

### 1.1 What is the Merge Gate?

**The Merge Gate** is the comprehensive validation checkpoint that must be **100% GREEN** before any code may be merged to the main branch.

**Merge Gate Components**:
1. **Build Gate**: Compilation, type checking, linting
2. **QA Gate**: All tests passing (100%)
3. **Governance Gate**: Policy compliance, test dodging detection, QA parking validation
4. **Architecture Gate**: Component boundary compliance, contract validation
5. **Security Gate**: No vulnerabilities introduced
6. **CI Gate**: All configured CI workflows passing

### 1.2 Gate-Eligible GREEN

**"Gate-Eligible GREEN"** is the state where:
- ✅ ALL tests passing (100% - no exceptions)
- ✅ Zero test dodging violations
- ✅ Zero test debt (no skips, stubs, TODOs)
- ✅ Zero technical debt (or explicitly tracked and approved)
- ✅ Zero governance violations
- ✅ Zero architecture violations
- ✅ Zero security vulnerabilities (or explicitly accepted risk)
- ✅ All CI workflows GREEN
- ✅ All documentation updated
- ✅ All evidence documented and committed

**NOT Gate-Eligible GREEN**:
- ❌ 99% tests passing (301/303 = FAIL, not acceptable)
- ❌ "Only 2 tests failing" (minimizing language = test dodging)
- ❌ "Just minor issues" (minimizing language = test dodging)
- ❌ Any test debt (skips, stubs, TODOs)
- ❌ Any governance violations
- ❌ Any CI workflow failures
- ❌ Undocumented changes
- ❌ Missing evidence

---

## 2. FM Exclusive Authority

### 2.1 FM Merge Gate Powers

**FM has EXCLUSIVE authority to**:
1. Define merge gate requirements per project
2. Determine Gate-Eligible GREEN status
3. Authorize or block merge
4. Request changes before merge
5. Require additional validation
6. Escalate merge gate failures
7. Grant governed exceptions (rare, documented)
8. Enforce merge gate supremacy

**No other agent, builder, or automation may**:
- Override FM merge decisions
- Weaken merge gate requirements
- Bypass merge gate checks
- Merge without FM authorization (unless explicitly delegated)
- Modify merge gate criteria without FM approval

### 2.2 FM Responsibilities

**FM MUST**:
- Validate all merge gate components before authorization
- Enforce 100% GREEN requirement (no waivers)
- Document all merge decisions
- Capture all learnings from merge gate failures
- Maintain merge gate integrity
- Escalate constitutional conflicts
- Protect main branch from regression

**FM MUST NOT**:
- Authorize merge if ANY gate component RED
- Waive test debt
- Waive technical debt without governed exception
- Accept "good enough" (only 100% GREEN acceptable)
- Delegate merge authority without clear criteria
- Weaken requirements under pressure

---

## 3. Merge Gate Requirements (Canonical)

### 3.1 Build Gate Requirements

**All MUST be GREEN**:
- [ ] Code compiles without errors
- [ ] Type checking passes (TypeScript, etc.)
- [ ] Linting passes with zero errors
- [ ] Zero warnings (unless explicitly whitelisted)
- [ ] Build process completes successfully
- [ ] No build artifacts corrupted

**Evidence Required**:
- Build log showing successful compilation
- Type check output showing no errors
- Lint output showing no errors/warnings
- Build artifacts validated

**Blocker if RED**: 🚫 CANNOT proceed to merge

---

### 3.2 QA Gate Requirements

**All MUST be GREEN**:
- [ ] 100% of tests passing (no exceptions)
- [ ] Zero test failures
- [ ] Zero test errors
- [ ] Zero test timeouts
- [ ] Zero skipped tests (.skip, .todo, commented out)
- [ ] Zero test debt (stubs, TODOs, incomplete tests)
- [ ] Test infrastructure complete (no stub helpers)
- [ ] Test execution time acceptable

**Evidence Required**:
- Test execution log: [X passed, 0 failed, X total]
- Test dodging check: PASS
- QA parking validation: PASS (registry empty or valid entries only)
- Test coverage report (if applicable)

**Blocker if RED**: 🚫 CANNOT proceed to merge (ABSOLUTE)

**Zero Test Debt Principle**:
> "Test debt is NEVER permitted. ANY test debt discovered = IMMEDIATE STOP. No merge until ALL test debt eliminated."

---

### 3.3 Governance Gate Requirements

**All MUST be GREEN**:
- [ ] No test dodging patterns detected
- [ ] QA parking registry valid (all entries properly authorized)
- [ ] Governance policy synchronized
- [ ] No governance violations
- [ ] All required documentation updated
- [ ] Catastrophic failures tracked (if any occurred)
- [ ] Escalations properly handled (if any occurred)
- [ ] Agent boundaries respected (no cross-agent violations)

**Evidence Required**:
- Test dodging detector: PASS
- QA parking watcher: PASS
- Governance sync checker: PASS
- Documentation completeness: VERIFIED
- Failure learning log: UPDATED (if failures occurred)

**Blocker if RED**: 🚫 CANNOT proceed to merge

---

### 3.4 Architecture Gate Requirements

**All MUST be GREEN**:
- [ ] Component boundaries respected
- [ ] No architectural drift
- [ ] API contracts match specification
- [ ] Database schema matches specification
- [ ] No forbidden dependencies introduced
- [ ] Data flows match architecture
- [ ] Security controls match architecture
- [ ] Integration patterns match specification

**Evidence Required**:
- Architecture compliance review
- Contract validation results
- Dependency analysis (no forbidden deps)
- Drift analysis (no unauthorized changes)

**Blocker if RED**: ⚠️ ESCALATE to FM for architectural review

---

### 3.5 Security Gate Requirements

**All MUST be GREEN**:
- [ ] No new security vulnerabilities introduced
- [ ] No hardcoded secrets or credentials
- [ ] Security controls implemented per architecture
- [ ] Input validation implemented
- [ ] Authentication/authorization implemented per spec
- [ ] Security tests passing
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] No CSRF vulnerabilities

**Evidence Required**:
- Security scan results
- Code review for security patterns
- Security test results: PASS

**Blocker if RED**: 🚫 CANNOT proceed to merge (security violations absolute blocker)

---

### 3.6 CI Gate Requirements

**All MUST be GREEN**:
- [ ] All configured CI workflows passing
- [ ] All required checks passing
- [ ] No workflow failures
- [ ] No flaky tests (tests pass consistently)
- [ ] Build succeeds on CI environment
- [ ] Tests pass on CI environment
- [ ] Deployment validation passes (if applicable)

**Evidence Required**:
- CI workflow run links
- All checks GREEN status
- Consistent test results across multiple runs

**Blocker if RED**: 🚫 CANNOT proceed to merge

---

## 4. Merge Gate Process

### Step 1: Pre-Merge Validation (FM)

**FM Activities**:
1. [ ] Review PR description and changes
2. [ ] Verify all required approvals obtained
3. [ ] Check Build Gate status
4. [ ] Check QA Gate status
5. [ ] Check Governance Gate status
6. [ ] Check Architecture Gate status
7. [ ] Check Security Gate status
8. [ ] Check CI Gate status
9. [ ] Review IBWR completion (if wave-based)
10. [ ] Verify all evidence documented

**Outcome**:
- **All GREEN**: Proceed to Step 2
- **Any RED**: Return to builder with specific requirements

---

### Step 2: Merge Readiness Declaration (FM)

**If all gates GREEN**, FM creates **Merge Readiness Declaration**:

```markdown
# Merge Readiness Declaration

**PR**: [PR number and title]
**Branch**: [feature/branch-name]
**FM Validator**: [FM Name/ID]
**Validation Date**: [YYYY-MM-DD]

---

## Gate Status Summary

| Gate | Status | Evidence |
|------|--------|----------|
| Build Gate | ✅ GREEN | [link to build log] |
| QA Gate | ✅ GREEN | [link to test results] |
| Governance Gate | ✅ GREEN | [link to governance checks] |
| Architecture Gate | ✅ GREEN | [link to compliance review] |
| Security Gate | ✅ GREEN | [link to security scan] |
| CI Gate | ✅ GREEN | [link to CI runs] |

---

## Validation Results

**Overall Status**: ✅ GATE-ELIGIBLE GREEN

- Total Tests: [X]
- Tests Passing: [X] (100%)
- Tests Failing: 0
- Test Dodging: None detected
- Test Debt: Zero
- Technical Debt: Zero (or tracked and approved)
- Governance Violations: Zero
- Architecture Violations: Zero
- Security Vulnerabilities: Zero
- CI Failures: Zero

---

## Evidence Package

1. Build Log: [link]
2. Test Results: [link]
3. Test Dodging Check: [link]
4. QA Parking Validation: [link]
5. Governance Sync Check: [link]
6. Architecture Review: [link]
7. Security Scan: [link]
8. CI Workflow Runs: [link]
9. IBWR Summary: [link] (if applicable)

---

## FM Merge Authorization

**Status**: ✅ AUTHORIZED TO MERGE

**Merge Authorized By**: [FM Name/ID]  
**Authorization Date**: [YYYY-MM-DD]  
**Authorization Time**: [HH:MM UTC]

**Conditions**: [Any conditions or post-merge actions required]

**Merge Method**: [Squash | Merge Commit | Rebase] (per project standards)

---

**This declaration authorizes merge of this PR to main branch.**

Signed: [FM Authority]
Date: [YYYY-MM-DD]
```

**Outcome**: Proceed to Step 3

---

### Step 3: Merge Execution

**Who May Merge**:
- FM (primary authority)
- Designated agent with explicit FM delegation
- Automated process (if FM has pre-authorized and all gates GREEN)

**Merge Process**:
1. Final confirmation all gates still GREEN
2. Execute merge (squash/merge/rebase per project standards)
3. Verify merge successful
4. Tag release (if release merge)
5. Trigger deployment (if configured)
6. Monitor post-merge validation

**Post-Merge Validation**:
- [ ] Main branch builds successfully
- [ ] All tests passing on main branch
- [ ] No regressions introduced
- [ ] Deployment successful (if triggered)
- [ ] Monitoring shows no errors

**If post-merge failures**:
- ESCALATE to FM immediately
- Categorize as CATASTROPHIC FAILURE
- Revert if necessary
- Investigate root cause
- Implement prevention
- Update failure learning log

---

### Step 4: Post-Merge Documentation

**FM MUST document**:
1. Merge completion record
2. Final gate status
3. Any post-merge actions taken
4. Any issues encountered and resolved
5. Learnings captured

**Update**:
- Project status
- Wave completion tracking
- IBWR summaries
- Failure learning log (if applicable)
- Governance event log (if significant)

---

## 5. Merge Gate Failures

### 5.1 Handling RED Gates

**When ANY gate is RED**:

1. **STOP**: No merge authorization
2. **DOCUMENT**: Specific gate failures
3. **COMMUNICATE**: Return to builder with clear requirements
4. **REMEDIATE**: Builder fixes all failures
5. **REVALIDATE**: Re-run all gates after fixes
6. **REPEAT**: Until all gates GREEN

**No Shortcuts**:
- Cannot merge with "just one test failing"
- Cannot merge with "minor warnings"
- Cannot merge with "will fix later"
- Cannot merge with any test debt
- Cannot merge with any governance violations

### 5.2 Repeated Merge Gate Failures

**If same gate fails 3+ times**:
- Categorize as systemic issue
- ESCALATE to FM for root cause analysis
- May indicate:
  - Insufficient QA planning (tests missed scenarios)
  - Architecture gaps (testability issues)
  - Builder skill gaps (training needed)
  - Process gaps (IBWR not catching issues)
- Implement systemic fix before continuing

### 5.3 Escalation Paths

**Escalate to Johan (Governance Authority) if**:
- Constitutional conflict (governance vs. requirement)
- Architecture requires modification to achieve GREEN
- Governed exception needed (rare)
- FM blocked by external constraint
- Security vulnerability cannot be fixed easily

**Escalation Format**:
```
MERGE GATE ESCALATION

**PR**: [PR number and title]
**Failed Gate**: [Specific gate]
**Failure Details**: [What is RED]
**Remediation Attempts**: [What was tried]
**Why Escalating**: [Why FM cannot resolve]
**Requested Resolution**: [What is needed]
**Impact if Unresolved**: [Consequences of not merging]
**Alternative Approaches**: [Other options considered]

FM: [FM Name/ID]
Date: [YYYY-MM-DD]
```

---

## 6. Governed Exceptions (Rare)

### 6.1 When Governed Exception May Be Considered

**ONLY in these rare circumstances**:
- External dependency failure (not under our control)
- Environmental issue (infrastructure, not code)
- Time-critical security patch (must deploy NOW)
- Documented false positive (test failure not real)

**NEVER for**:
- Test debt
- Technical debt
- "Will fix later" situations
- Incomplete implementation
- Missing features
- "Good enough" code

### 6.2 Governed Exception Process

**If FM determines exception needed**:

1. Document exception request with full justification
2. Escalate to Johan (Governance Authority)
3. Johan reviews and approves/rejects
4. If approved:
   - Exception documented and tracked
   - Expiry date set
   - Remediation plan required
   - Regular monitoring
   - Cannot become permanent

**Exception Record**:
```markdown
# Governed Exception Record

**Exception ID**: GE-YYYY-MM-DD-NNN
**Date Granted**: [YYYY-MM-DD]
**Granted By**: Johan (Governance Authority)
**Requested By**: [FM Name/ID]

**PR**: [PR number and title]
**Gate**: [Which gate has exception]
**Issue**: [What is RED]

**Justification**: [Why exception needed]
**Risk Assessment**: [What could go wrong]
**Mitigation**: [How risk is mitigated]

**Remediation Plan**:
- [ ] [Action 1 - by date]
- [ ] [Action 2 - by date]
- [ ] [Action 3 - by date]

**Expiry**: [Date by which this must be resolved]
**Monitoring**: [How will this be tracked]

**Status**: ACTIVE
**Resolved**: [Date resolved, or N/A]
```

---

## 7. Merge Gate Checklist Templates

### 7.1 FM Pre-Merge Validation Checklist

```markdown
# FM Pre-Merge Validation - PR [Number]

**PR**: [Number and title]
**Branch**: [branch-name]
**Builder**: [Builder name/type]
**Validation Date**: [YYYY-MM-DD]
**FM Validator**: [FM Name/ID]

---

## Build Gate
- [ ] Code compiles without errors
- [ ] Type checking passes
- [ ] Linting passes (zero errors/warnings)
- [ ] Build process completes successfully
- [ ] Build artifacts validated

**Status**: [✅ GREEN | ❌ RED]
**Evidence**: [link]

---

## QA Gate
- [ ] 100% tests passing
- [ ] Zero test failures/errors
- [ ] Zero skipped tests
- [ ] Zero test debt
- [ ] Test infrastructure complete
- [ ] Test execution time acceptable

**Status**: [✅ GREEN | ❌ RED]
**Evidence**: [link]
**Test Summary**: [X passed, 0 failed, X total]

---

## Governance Gate
- [ ] No test dodging patterns
- [ ] QA parking registry valid
- [ ] Governance policy synchronized
- [ ] No governance violations
- [ ] Documentation updated
- [ ] Failures tracked (if any)
- [ ] Escalations handled (if any)

**Status**: [✅ GREEN | ❌ RED]
**Evidence**: [links]

---

## Architecture Gate
- [ ] Component boundaries respected
- [ ] No architectural drift
- [ ] Contracts match specification
- [ ] No forbidden dependencies
- [ ] Data flows compliant

**Status**: [✅ GREEN | ❌ RED]
**Evidence**: [link]

---

## Security Gate
- [ ] No new vulnerabilities
- [ ] No hardcoded secrets
- [ ] Security controls implemented
- [ ] Security tests passing

**Status**: [✅ GREEN | ❌ RED]
**Evidence**: [link]

---

## CI Gate
- [ ] All CI workflows passing
- [ ] All required checks passing
- [ ] No flaky tests
- [ ] Build succeeds on CI
- [ ] Tests pass on CI

**Status**: [✅ GREEN | ❌ RED]
**Evidence**: [links to CI runs]

---

## Overall Assessment

**Gate-Eligible GREEN**: [✅ YES | ❌ NO]

**If NO, Blocking Issues**:
1. [Issue 1]
2. [Issue 2]
...

**Required Actions**:
1. [Action 1]
2. [Action 2]
...

---

## FM Decision

**Merge Authorization**: [✅ AUTHORIZED | ❌ BLOCKED | ⏳ PENDING]

**Authorized By**: [FM Name/ID]
**Date**: [YYYY-MM-DD]

**Next Steps**: [What happens next]

---

**Validation Complete**
```

### 7.2 Builder Pre-Handover Checklist

**Builders use this before requesting FM merge review**:

```markdown
# Builder Pre-Handover Checklist

**PR**: [Number and title]
**Builder**: [Name/Type]
**Date**: [YYYY-MM-DD]

Before requesting FM merge review, verify:

## Code Complete
- [ ] All assigned features implemented
- [ ] All assigned tests passing (GREEN)
- [ ] No TODO/FIXME in production code (or tracked)
- [ ] Code follows implementation guide standards
- [ ] Comments added where appropriate
- [ ] No commented-out code

## Testing Complete
- [ ] All tests GREEN locally
- [ ] No test dodging (.skip, .todo)
- [ ] No test debt (stubs, incomplete tests)
- [ ] Test infrastructure complete (no stubs)
- [ ] Tests pass consistently (run 3+ times)

## Documentation Complete
- [ ] Code changes documented
- [ ] API changes documented (if applicable)
- [ ] Architecture changes documented (if applicable)
- [ ] README updated (if needed)
- [ ] PR description comprehensive

## Validation Complete
- [ ] Build passes locally
- [ ] Tests pass locally (100%)
- [ ] Linting passes (zero errors/warnings)
- [ ] Type checking passes
- [ ] No security vulnerabilities introduced
- [ ] CI workflows passing

## Governance Complete
- [ ] No governance violations
- [ ] Test dodging check passes locally
- [ ] QA parking valid (if used)
- [ ] Escalations handled (if any occurred)
- [ ] Learnings documented (if any failures)

## Evidence Collected
- [ ] Test execution logs
- [ ] Build logs
- [ ] Validation evidence
- [ ] IBWR summary (if wave work)

---

**Self-Assessment**: [READY | NOT READY]

**If READY**: Request FM merge review
**If NOT READY**: Complete missing items above

Builder: [Name/Type]
Date: [YYYY-MM-DD]
```

---

## 8. Builder Guidance: STOP and ESCALATE

### 8.1 When to STOP

**Builders MUST STOP work and ESCALATE if**:
- Cannot achieve GREEN (tests keep failing)
- Architecture gap discovered (unclear how to implement)
- Test debt temptation (want to .skip or stub)
- Merge gate failure doesn't make sense
- Security concern discovered
- Performance issue discovered
- External dependency failing
- Scope ambiguity (unclear what to implement)

**Do NOT**:
- Work around problems
- Add test debt (hoping to fix later)
- Skip tests to achieve GREEN
- Deviate from architecture without authorization
- Merge with known issues
- Hide problems from FM

### 8.2 How to ESCALATE

**Escalation Process**:
1. STOP work immediately
2. Document problem clearly:
   - What is the issue?
   - When did it occur?
   - What have you tried?
   - Why are you blocked?
3. Create escalation issue or comment on PR
4. Tag FM in escalation
5. Wait for FM guidance
6. Do NOT proceed until FM responds

**Escalation Template**:
```
BUILDER ESCALATION

**PR**: [PR number]
**Builder**: [Name/Type]
**Wave/Task**: [What you're working on]

**Issue**: [Clear description of problem]
**When**: [When did this occur?]
**Attempted Solutions**:
1. [What did you try?]
2. [What was the result?]

**Why Blocked**: [Why can't you proceed?]
**Impact**: [What is blocked?]

**Request**: [What do you need from FM?]

Builder: [Name/Type]
Date: [YYYY-MM-DD]
```

---

## 9. Canonical Reference

**This document is canonical and authoritative.**

**Source**: Maturion Foreman Governance  
**Repository**: APGI-cmy/maturion-foreman-governance  
**Path**: /governance/canon/T0-014_FM_MERGE_GATE_MANAGEMENT_CANON.md  
**Tier**: 0 (Constitutional)  
**Version**: 2.0.0  
**Last Updated**: 2026-01-09

**Referenced By**:
- BUILD_PHILOSOPHY.md (Supreme Authority)
- FM_EXECUTION_MANDATE.md
- ForemanApp Agent Contract
- Governance Liaison Agent Contract
- All Builder Agent Contracts

**Supersedes**:
- Previous merge gate policies
- Informal merge processes
- Ad-hoc merge decisions

---

## 10. Approval

**Status**: ✅ APPROVED  
**Authority**: Maturion Foreman Governance  
**Effective Date**: 2026-01-09  
**Mandatory Compliance**: YES (Tier-0 Constitutional)

---

**Document Classification**: Tier-0 Constitutional Canon  
**Cannot Be Waived**: Merge gate requirements are absolute  
**Enforcement**: FM Authority (exclusive)  
**Escalation**: Johan (Governance Authority) for constitutional conflicts

---

**MERGE GATE SUPREMACY**: A RED merge gate is a hard stop. No exceptions. No waivers. No "just this once". 100% GREEN or no merge.
