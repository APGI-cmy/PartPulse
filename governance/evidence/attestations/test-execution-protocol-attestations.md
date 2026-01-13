# Builder Attestations: Test Execution Protocol & BL-026

**Purpose**: Track builder attestations for Agent Test Execution Protocol and BL-026 (Automated Deprecation Detection)  
**Authority**: governance/runbooks/AGENT_TEST_EXECUTION_PROTOCOL.md, governance/policy/AUTOMATED_DEPRECATION_DETECTION_GATE.md  
**Status**: Active  
**Enforcement**: Builders without attestation CANNOT be assigned new tasks

---

## Attestation Requirements

All builders MUST attest to understanding and compliance with:
1. **Agent Test Execution Protocol** (governance/runbooks/AGENT_TEST_EXECUTION_PROTOCOL.md)
   - Core principle: CI is confirmation, NOT diagnostic
   - Local test execution required before PR creation
   - PREHANDOVER_PROOF evidence required
   - 100% pass rate or documented exceptions

2. **BL-026: Automated Deprecation Detection** (governance/policy/AUTOMATED_DEPRECATION_DETECTION_GATE.md)
   - Zero deprecated APIs without FM approval
   - `npm run lint:deprecation` MUST pass locally
   - Pre-commit and CI gates enforced
   - Constitutional requirement (Tier-0)

---

## Attestation Template

```markdown
### [Builder Name] - [Builder Role]

**Date**: [YYYY-MM-DD]  
**Agent Role**: [api-builder/ui-builder/qa-builder/schema-builder/integration-builder]  
**Training Completed**: [YYYY-MM-DD]

#### Attestation Statement

I, [Builder Name], understand and acknowledge:

**Agent Test Execution Protocol**:
1. ✅ I must execute ALL tests locally before creating any PR
2. ✅ CI is for confirmation only, NOT diagnostics
3. ✅ I must document test execution results in PREHANDOVER_PROOF (Section 3)
4. ✅ I must achieve 100% pass rate or document legitimate exceptions
5. ✅ I may NOT create PRs with known test failures
6. ✅ I understand violations will result in PR rejection and may block future task assignments

**BL-026 Deprecation Detection (T0-015)**:
1. ✅ I must run `npm run lint:deprecation` locally before every commit
2. ✅ I understand deprecated APIs are BLOCKED (Tier-0 constitutional requirement)
3. ✅ I may NOT use deprecated APIs without explicit FM approval
4. ✅ I must include migration plan for any approved deprecation exceptions
5. ✅ I understand deprecation violations are catastrophic and block merges
6. ✅ I will escalate to FM if I discover deprecated API usage

**Signed**: [Builder Name]  
**Role**: [Builder Role]  
**Date**: [YYYY-MM-DD]  
**Witnessed by**: [FM or Governance Liaison]

---
```

---

## Active Builder Attestations

### API Builder

**Status**: ⚠️ ATTESTATION REQUIRED  
**Training Scheduled**: 2026-01-27 (compliance deadline)  
**Task Assignment**: BLOCKED until attestation complete

---

### UI Builder

**Status**: ⚠️ ATTESTATION REQUIRED  
**Training Scheduled**: 2026-01-27 (compliance deadline)  
**Task Assignment**: BLOCKED until attestation complete

---

### QA Builder

**Status**: ⚠️ ATTESTATION REQUIRED  
**Training Scheduled**: 2026-01-27 (compliance deadline)  
**Task Assignment**: BLOCKED until attestation complete

---

### Schema Builder

**Status**: ⚠️ ATTESTATION REQUIRED  
**Training Scheduled**: 2026-01-27 (compliance deadline)  
**Task Assignment**: BLOCKED until attestation complete

---

### Integration Builder

**Status**: ⚠️ ATTESTATION REQUIRED  
**Training Scheduled**: 2026-01-27 (compliance deadline)  
**Task Assignment**: BLOCKED until attestation complete

---

## Training Schedule

**Training Session**: To be scheduled by FM  
**Format**: Synchronous session with all builders  
**Duration**: 45-60 minutes  
**Agenda**:
1. Agent Test Execution Protocol overview (20 min)
2. BL-026 Deprecation Detection overview (15 min)
3. PREHANDOVER_PROOF walkthrough (10 min)
4. Q&A and practical examples (10 min)
5. Attestation signing (5 min)

**Trainer**: Governance Liaison or FM  
**Completion Deadline**: 2026-01-27

---

## Attestation Enforcement

### Before Task Assignment

FM MUST verify:
- [ ] Builder has completed training
- [ ] Builder has signed attestation
- [ ] Attestation includes both protocols
- [ ] Attestation is dated and witnessed

**If attestation missing**: Task assignment BLOCKED

### During PR Review

FM MUST verify:
- [ ] PREHANDOVER_PROOF includes Section 3 (Test Execution Evidence)
- [ ] All tests executed locally (or exceptions documented)
- [ ] Deprecation check passed (`npm run lint:deprecation`)
- [ ] Attestation statement included in PREHANDOVER_PROOF

**If evidence missing**: PR REJECTED

### After Protocol Violations

If builder creates PR without proper test execution:
1. PR immediately rejected
2. Builder re-training required
3. New attestation required
4. Task assignment BLOCKED until re-training complete
5. Escalation to Governance Liaison
6. Pattern tracking for repeated violations

---

## Attestation Status Summary

**Total Builders**: 5  
**Attestations Complete**: 0  
**Attestations Pending**: 5  
**Training Date**: To be scheduled  
**Compliance Deadline**: 2026-01-27

**Status**: ⚠️ ALL BUILDERS REQUIRE ATTESTATION

---

## Re-Attestation Requirements

Builders MUST re-attest when:
- Protocol is significantly updated (version change)
- Builder commits protocol violation (remediation)
- Annual governance review (yearly)
- New builder joins team (onboarding)

---

## Notes

This attestation process is **MANDATORY** and **NON-NEGOTIABLE**.

- Attestations are binding commitments by builders
- Violations have immediate consequences
- FM is responsible for enforcement
- Governance Liaison audits compliance
- No exceptions without Johan escalation

---

**Document Status**: Active  
**Last Updated**: 2026-01-13  
**Next Review**: After training session completion  
**Owner**: Governance Liaison  
**Enforcer**: FM

---

**END OF ATTESTATION TRACKING**
