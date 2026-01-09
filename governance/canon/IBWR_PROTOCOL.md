# In Between Wave Reconciliation (IBWR) Protocol

**Document ID**: IBWR-PROTOCOL-001  
**Version**: 2.0.0  
**Date**: 2026-01-09  
**Status**: Active  
**Authority**: Maturion Foreman Governance  
**Referenced In**: FM_EXECUTION_MANDATE.md, BUILD_PHILOSOPHY.md

---

## Purpose

This protocol defines the **mandatory reconciliation process** that FM (Foreman) MUST execute between implementation waves. IBWR ensures wave-to-wave continuity, prevents technical debt accumulation, validates Build-to-Green progress, and maintains governance compliance.

**FM Authority**: IBWR is **not optional**. No next wave may begin until IBWR for the current wave is complete and approved by FM.

---

## Constitutional Principle

**From BUILD_PHILOSOPHY.md**:
> "One-Time Fully Functional Builds require continuous validation. Each wave must be proven complete before the next wave begins."

**From FM_EXECUTION_MANDATE.md**:
> "FM has autonomous authority to enforce wave discipline. Skipping reconciliation violates One-Time Build Law."

**Wave Discipline Principle**:
> "A wave is not complete when code is written. A wave is complete when tests are GREEN, governance is satisfied, and evidence is documented."

---

## IBWR Overview

### What is IBWR?

**In Between Wave Reconciliation (IBWR)** is the mandatory checkpoint between implementation waves that validates:
1. Wave completion (all assigned tests GREEN)
2. Zero test debt (no skips, stubs, or TODOs)
3. Zero technical debt introduced
4. Architecture compliance maintained
5. Governance compliance maintained
6. Evidence documented
7. Learnings captured
8. Readiness for next wave validated

### Why IBWR?

**Without IBWR**:
- ❌ Test debt accumulates unnoticed
- ❌ Technical debt compounds across waves
- ❌ Architecture drift occurs
- ❌ Governance violations multiply
- ❌ Merge gate failures surprise teams
- ❌ Rework required (violates One-Time Build)

**With IBWR**:
- ✅ Continuous validation prevents surprises
- ✅ Test debt caught and eliminated immediately
- ✅ Technical debt blocked at source
- ✅ Architecture integrity maintained
- ✅ Governance compliance continuous
- ✅ Merge gate success predictable
- ✅ One-Time Build Law upheld

---

## IBWR Process (7 Phases)

### Phase 1: Wave Completion Validation

**Trigger**: Builder claims "wave complete" or final commit on wave branch

**FM Activities**:
1. [ ] Verify all assigned test cases GREEN
2. [ ] Run complete test suite (not just wave tests)
3. [ ] Validate test execution time acceptable
4. [ ] Check for test dodging (no .skip, .todo, commented tests)
5. [ ] Verify zero test failures
6. [ ] Confirm all wave acceptance criteria met
7. [ ] Review builder's completion report

**Pass Criteria**:
- ✅ All wave tests GREEN (100% passing)
- ✅ Full test suite still GREEN (no regression)
- ✅ Zero test dodging patterns
- ✅ All acceptance criteria met
- ✅ Builder completion report submitted

**Fail Criteria** (any one triggers FAIL):
- ❌ Any wave test not GREEN
- ❌ Any regression in previously GREEN tests
- ❌ Test dodging detected
- ❌ Incomplete acceptance criteria
- ❌ Missing completion report

**If FAIL**:
- Return to builder with specific gaps
- Builder remediates and resubmits
- Do NOT proceed to Phase 2

**Evidence Artifact**: `IBWR_PHASE1_WAVE_[X]_COMPLETION.md`

---

### Phase 2: Test Debt Inspection

**Trigger**: Phase 1 PASS

**FM Activities**:
1. [ ] Run test dodging detector (`qa/detect-test-dodging.js`)
2. [ ] Check QA parking registry (`qa/parking/registry.json`)
3. [ ] Grep test files for "TODO", "FIXME", "stub", "implement later"
4. [ ] Inspect test infrastructure for stub implementations
5. [ ] Verify test data factories generate varied data (not hardcoded)
6. [ ] Check for conditional test skipping
7. [ ] Validate test isolation (no shared mutable state)
8. [ ] Review test coverage (no gaps)

**Zero Test Debt Principle**:
> "Test debt is NEVER permitted. ANY test debt discovered = IMMEDIATE STOP."

**Pass Criteria**:
- ✅ Zero test dodging patterns
- ✅ QA parking registry empty or all entries valid
- ✅ No TODOs or stubs in test code
- ✅ Test infrastructure production-quality
- ✅ Test data realistic and varied
- ✅ No conditional test skipping
- ✅ Test isolation validated

**Fail Criteria** (any one triggers FAIL):
- ❌ Any test dodging pattern found
- ❌ Invalid QA parking entries
- ❌ TODOs or stubs in test code
- ❌ Stub test infrastructure
- ❌ Hardcoded/unrealistic test data
- ❌ Conditional test skipping
- ❌ Test isolation failures

**If FAIL**:
- Document all test debt found
- ESCALATE to builder as CATASTROPHIC FAILURE
- Builder must eliminate ALL test debt
- Re-run Phase 2 after remediation
- Do NOT proceed to Phase 3 until ZERO test debt

**Evidence Artifact**: `IBWR_PHASE2_WAVE_[X]_TESTDEBT.md`

---

### Phase 3: Technical Debt Assessment

**Trigger**: Phase 2 PASS

**FM Activities**:
1. [ ] Review code changes for technical debt indicators
2. [ ] Check for hardcoded values (should be configurable)
3. [ ] Check for commented-out code
4. [ ] Verify error handling implemented (not just happy path)
5. [ ] Check for security vulnerabilities introduced
6. [ ] Validate logging/audit trails implemented
7. [ ] Check for performance anti-patterns
8. [ ] Review TODO/FIXME in implementation code
9. [ ] Validate code follows implementation guide standards

**Pass Criteria**:
- ✅ No hardcoded credentials or secrets
- ✅ No commented-out code
- ✅ Error handling comprehensive
- ✅ No obvious security vulnerabilities
- ✅ Logging/audit implemented per architecture
- ✅ No performance anti-patterns
- ✅ TODOs limited and tracked
- ✅ Code quality acceptable

**Fail Criteria** (any one triggers FAIL):
- ❌ Hardcoded credentials/secrets
- ❌ Extensive commented-out code
- ❌ Missing error handling
- ❌ Security vulnerabilities
- ❌ Missing required logging
- ❌ Performance anti-patterns
- ❌ Excessive untracked TODOs
- ❌ Poor code quality

**If FAIL**:
- Document technical debt items
- Return to builder for remediation
- Builder fixes and resubmits
- Re-run Phase 3 after fixes
- Do NOT proceed to Phase 4

**Evidence Artifact**: `IBWR_PHASE3_WAVE_[X]_TECHDEBT.md`

---

### Phase 4: Architecture Compliance Validation

**Trigger**: Phase 3 PASS

**FM Activities**:
1. [ ] Verify component boundaries respected
2. [ ] Check for architectural drift (unauthorized changes)
3. [ ] Validate API contracts match specification
4. [ ] Verify database schema matches specification
5. [ ] Check for forbidden dependencies introduced
6. [ ] Validate data flows match architecture
7. [ ] Verify security controls implemented per architecture
8. [ ] Check integration patterns match specification
9. [ ] Review any architecture deviations (should be zero)

**Pass Criteria**:
- ✅ Component boundaries respected
- ✅ No architectural drift
- ✅ API contracts compliant
- ✅ Database schema compliant
- ✅ No forbidden dependencies
- ✅ Data flows match architecture
- ✅ Security controls match architecture
- ✅ Integration patterns compliant
- ✅ Zero unauthorized architecture changes

**Fail Criteria** (any one triggers FAIL):
- ❌ Component boundary violations
- ❌ Architectural drift detected
- ❌ API contract deviations
- ❌ Database schema deviations
- ❌ Forbidden dependencies introduced
- ❌ Data flow deviations
- ❌ Security control gaps
- ❌ Integration pattern deviations

**If FAIL**:
- Document architecture violations
- Assess severity (minor vs. major)
- Minor: Builder fixes and resubmits
- Major: ESCALATE to architecture review (may require FM exception)
- Do NOT proceed to Phase 5 until compliant

**Evidence Artifact**: `IBWR_PHASE4_WAVE_[X]_ARCHITECTURE.md`

---

### Phase 5: Governance Compliance Check

**Trigger**: Phase 4 PASS

**FM Activities**:
1. [ ] Run governance sync checker (`qa/governance/sync-checker.js`)
2. [ ] Verify governance version current
3. [ ] Check for governance policy violations
4. [ ] Validate CI/CD gates still passing
5. [ ] Verify no governance documents modified (unless authorized)
6. [ ] Check for catastrophic failure tracking compliance
7. [ ] Validate escalation procedures followed (if any issues)
8. [ ] Review agent boundary compliance (no cross-agent violations)

**Pass Criteria**:
- ✅ Governance synchronized
- ✅ Policy version current
- ✅ No policy violations
- ✅ All CI/CD gates passing
- ✅ No unauthorized governance changes
- ✅ Catastrophic failures tracked (if any)
- ✅ Escalations properly handled
- ✅ Agent boundaries respected

**Fail Criteria** (any one triggers FAIL):
- ❌ Governance out of sync
- ❌ Policy violations detected
- ❌ CI/CD gates failing
- ❌ Unauthorized governance changes
- ❌ Untracked catastrophic failures
- ❌ Improper escalation handling
- ❌ Agent boundary violations

**If FAIL**:
- Document governance violations
- Governance Liaison remediates governance issues
- Builder remediates code issues
- Re-run Phase 5 after remediation
- Do NOT proceed to Phase 6

**Evidence Artifact**: `IBWR_PHASE5_WAVE_[X]_GOVERNANCE.md`

---

### Phase 6: Learning Capture

**Trigger**: Phase 5 PASS

**FM Activities**:
1. [ ] Review wave execution for learnings
2. [ ] Document any failures encountered (even if fixed)
3. [ ] Capture prevention measures implemented
4. [ ] Update FAILURE_LEARNING_LOG.md if needed
5. [ ] Identify process improvements
6. [ ] Document builder feedback
7. [ ] Note any architecture clarifications needed
8. [ ] Record any QA plan adjustments needed
9. [ ] Assess if learnings should propagate to canonical governance

**Learning Categories**:
- **FL (Failure Learning)**: System failures and prevention
- **BL (Bootstrap Learning)**: Process and methodology learnings
- **CL (Configuration Learning)**: Environment/config learnings
- **AL (Architecture Learning)**: Architecture insights
- **QL (QA Learning)**: Testing and QA insights

**Pass Criteria**:
- ✅ Wave retrospective completed
- ✅ All learnings documented
- ✅ Prevention measures recorded
- ✅ Failure log updated (if failures occurred)
- ✅ Process improvements noted
- ✅ Builder feedback captured

**Always PASS** (learning capture never blocks progress)

**Evidence Artifact**: `IBWR_PHASE6_WAVE_[X]_LEARNINGS.md`

---

### Phase 7: Next Wave Readiness

**Trigger**: Phase 6 COMPLETE

**FM Activities**:
1. [ ] Validate current wave fully complete
2. [ ] Verify all IBWR phases passed
3. [ ] Review next wave requirements
4. [ ] Confirm test cases for next wave defined
5. [ ] Assess builder availability for next wave
6. [ ] Check for architectural prerequisites for next wave
7. [ ] Validate no blocking issues for next wave
8. [ ] Prepare next wave issue/assignment
9. [ ] Authorize next wave to begin

**Pass Criteria**:
- ✅ All IBWR phases 1-6 passed
- ✅ Current wave 100% complete
- ✅ Next wave requirements clear
- ✅ Next wave tests defined
- ✅ Builder capacity available
- ✅ No blocking prerequisites
- ✅ No blocking issues

**If NOT READY**:
- Document readiness gaps
- Resolve gaps before authorizing next wave
- May proceed to reconciliation summary while resolving gaps

**Authorization**:
```
NEXT WAVE AUTHORIZATION

Wave [X] Complete: ✅
Wave [X+1] Authorized: ✅
Authorization Date: [Date]
FM Authority: [FM Name/ID]

Next Wave: [Wave X+1 Name/Number]
Assigned Tests: TC-XXX through TC-YYY
Assigned Builder: [Builder Name/Type]
Expected Completion: [Date/Timeline]

Conditions: [Any conditions or notes]

Signed: [FM Authority]
```

**Evidence Artifact**: `IBWR_PHASE7_WAVE_[X]_NEXTWAVE_AUTH.md`

---

## IBWR Completion Report (Summary)

**After all 7 phases complete**, FM creates IBWR Completion Report:

```markdown
# IBWR Completion Report - Wave [X]

**Wave**: [Wave Number/Name]
**Completion Date**: [Date]
**FM Authority**: [FM Name/ID]
**Builder**: [Builder Name/Type]

---

## Wave Summary

**Wave Goal**: [What this wave intended to accomplish]
**Assigned Tests**: TC-XXX through TC-YYY ([N] tests)
**Tests GREEN**: [N] / [N] (100%)
**Acceptance Criteria**: [All met / Partial / Not met]

---

## IBWR Phase Results

| Phase | Status | Notes |
|-------|--------|-------|
| 1. Wave Completion | ✅ PASS | All tests GREEN, no regressions |
| 2. Test Debt | ✅ PASS | Zero test debt confirmed |
| 3. Technical Debt | ✅ PASS | No technical debt introduced |
| 4. Architecture Compliance | ✅ PASS | Fully compliant with architecture |
| 5. Governance Compliance | ✅ PASS | All governance checks passing |
| 6. Learning Capture | ✅ COMPLETE | [X] learnings documented |
| 7. Next Wave Readiness | ✅ AUTHORIZED | Wave [X+1] authorized to begin |

---

## Key Metrics

- **Test Count**: [N] tests
- **Pass Rate**: 100% (required)
- **Test Execution Time**: [X.X] seconds
- **Code Changes**: [+XXX/-YYY] lines
- **Files Modified**: [N] files
- **Technical Debt**: 0 items
- **Test Debt**: 0 items
- **Governance Violations**: 0

---

## Learnings Captured

1. [Learning 1 - category FL/BL/CL/AL/QL]
2. [Learning 2]
3. [Learning 3]
...

See: `IBWR_PHASE6_WAVE_[X]_LEARNINGS.md` for details

---

## Issues Encountered and Resolved

| Issue | Severity | Resolution | Prevention |
|-------|----------|------------|------------|
| [Issue 1] | [Low/Med/High] | [How fixed] | [How prevented] |

---

## Next Wave

**Wave [X+1] Authorized**: ✅ YES  
**Authorization Date**: [Date]  
**Assigned Tests**: TC-XXX through TC-YYY  
**Assigned Builder**: [Builder Name/Type]  
**Expected Completion**: [Date/Timeline]

---

## FM Approval

**Wave [X] IBWR Status**: ✅ COMPLETE  
**FM Authority**: [FM Name/ID]  
**Approval Date**: [Date]  
**Next Wave Authorized**: ✅ YES

**Signature**: [FM Authority]

---

**Evidence Location**: `governance/ibwr/wave-[X]/`  
**Artifacts**:
- IBWR_PHASE1_WAVE_[X]_COMPLETION.md
- IBWR_PHASE2_WAVE_[X]_TESTDEBT.md
- IBWR_PHASE3_WAVE_[X]_TECHDEBT.md
- IBWR_PHASE4_WAVE_[X]_ARCHITECTURE.md
- IBWR_PHASE5_WAVE_[X]_GOVERNANCE.md
- IBWR_PHASE6_WAVE_[X]_LEARNINGS.md
- IBWR_PHASE7_WAVE_[X]_NEXTWAVE_AUTH.md
- IBWR_SUMMARY_WAVE_[X].md (this document)
```

---

## IBWR Enforcement

### FM Authority

**FM MUST**:
- Execute IBWR for every wave (no exceptions)
- Block next wave if current IBWR not complete
- Reject waves that fail IBWR phases
- Enforce zero test debt (no waivers)
- Enforce zero technical debt (no waivers)
- Enforce architecture compliance (no waivers)
- Document all IBWR results
- Capture all learnings

**FM MUST NOT**:
- Skip IBWR phases
- Waive test debt
- Waive technical debt
- Allow architectural drift
- Proceed to next wave without IBWR completion
- Accept "good enough" (only 100% GREEN is acceptable)

### Governance Liaison Role

**Governance Liaison MUST**:
- Validate Phase 5 (Governance Compliance) independently
- Sign off on governance items before FM approval
- Escalate governance violations to FM
- Block wave progression if governance violations exist
- Update governance documentation if needed

### Builder Responsibilities

**Builders MUST**:
- Submit completion report when claiming "wave complete"
- Remediate all IBWR failures promptly
- Eliminate all test debt (no "will fix later")
- Maintain architecture compliance
- Follow escalation procedures for gaps
- Participate in learning capture

**Builders MUST NOT**:
- Skip IBWR or try to proceed to next wave without FM authorization
- Introduce test debt or technical debt
- Deviate from architecture without authorization
- Work around IBWR failures
- Pressure FM to waive requirements

---

## IBWR Failure Handling

### What if Wave Fails IBWR?

**Process**:
1. FM documents specific failures in phase evidence artifact
2. FM communicates failures to builder with clear remediation requirements
3. Builder remediates all failures
4. Builder resubmits wave for IBWR
5. FM re-runs failed IBWR phases
6. If PASS: proceed to next phase
7. If FAIL again: repeat OR escalate

### Escalation Triggers

**Escalate to Johan (Governance Authority) if**:
- Major architecture deviation discovered
- Systemic test debt pattern
- Repeated IBWR failures
- Builder unable to remediate
- Governance conflict prevents resolution
- FM needs authorization to modify architecture/QA plan

**Escalation Format**:
```
IBWR ESCALATION - Wave [X]

**Escalation Reason**: [Specific issue]
**Wave**: [X]
**Builder**: [Name/Type]
**Failed Phase**: [Phase number and name]
**Failure Details**: [Specific failures]
**Remediation Attempts**: [What was tried]
**Why Escalating**: [Why FM cannot resolve]
**Requested Resolution**: [What is needed]
**Impact if Unresolved**: [Consequences]

FM: [FM Name/ID]
Date: [Date]
```

---

## IBWR Templates

### File Structure

```
governance/
  ibwr/
    wave-1/
      IBWR_PHASE1_WAVE_1_COMPLETION.md
      IBWR_PHASE2_WAVE_1_TESTDEBT.md
      IBWR_PHASE3_WAVE_1_TECHDEBT.md
      IBWR_PHASE4_WAVE_1_ARCHITECTURE.md
      IBWR_PHASE5_WAVE_1_GOVERNANCE.md
      IBWR_PHASE6_WAVE_1_LEARNINGS.md
      IBWR_PHASE7_WAVE_1_NEXTWAVE_AUTH.md
      IBWR_SUMMARY_WAVE_1.md
    wave-2/
      [same structure]
    ...
```

### Template: Phase Evidence Artifact

```markdown
# IBWR Phase [X]: [Phase Name] - Wave [Y]

**Wave**: [Y]
**Phase**: [X] - [Phase Name]
**Date**: [YYYY-MM-DD]
**FM Validator**: [FM Name/ID]

---

## Phase Objective
[What this phase validates]

---

## Validation Checklist

- [ ] [Check 1]
- [ ] [Check 2]
- [ ] [Check 3]
...

---

## Validation Results

**Status**: [PASS | FAIL]

### Evidence
[Specific evidence, logs, screenshots, etc.]

### Issues Found
[List any issues - empty if PASS]

### Remediation Required
[List required fixes - empty if PASS]

---

## FM Notes
[Any additional observations or context]

---

**Validated By**: [FM Name/ID]  
**Validation Date**: [YYYY-MM-DD]  
**Next Action**: [Proceed to Phase X+1 | Return to Builder | Escalate]
```

---

## Benefits of IBWR

### For FM
- ✅ Continuous visibility into wave progress
- ✅ Early detection of problems
- ✅ Objective completion criteria
- ✅ Learning capture for process improvement
- ✅ Merge gate success predictability

### For Builders
- ✅ Clear completion criteria
- ✅ Immediate feedback on issues
- ✅ Protection from scope creep
- ✅ Objective "done" state (not subjective)
- ✅ Reduces merge gate surprises

### For Project
- ✅ One-Time Build Law upheld
- ✅ Zero test debt accumulation
- ✅ Zero technical debt accumulation
- ✅ Architecture integrity maintained
- ✅ Governance compliance continuous
- ✅ Predictable delivery
- ✅ High quality maintainable code

---

## Canonical Reference

**This document is canonical and authoritative.**

**Source**: Maturion Foreman Governance  
**Repository**: APGI-cmy/maturion-foreman-governance  
**Path**: /governance/canon/IBWR_PROTOCOL.md  
**Version**: 2.0.0  
**Last Updated**: 2026-01-09

**Referenced By**:
- FM_EXECUTION_MANDATE.md
- BUILD_PHILOSOPHY.md
- BYG_DOCTRINE.md
- ForemanApp Agent Contract
- Governance Liaison Agent Contract

---

## Approval

**Status**: ✅ APPROVED  
**Authority**: Maturion Foreman Governance  
**Effective Date**: 2026-01-09  
**Mandatory Compliance**: YES (Constitutional Requirement)

---

**Document Classification**: Constitutional - Tier 0 Canon  
**Cannot Be Waived**: IBWR is mandatory between all waves  
**Enforcement**: FM Authority (with Governance Liaison for Phase 5)
