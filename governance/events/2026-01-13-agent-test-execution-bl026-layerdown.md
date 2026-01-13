# Governance Event: Agent Test Execution Protocol & BL-026 Layer-Down

**Event ID**: 2026-01-13-agent-test-execution-bl026-layerdown  
**Date**: 2026-01-13  
**Type**: Policy Layer-Down  
**Status**: In Progress  
**Authority**: Governance Liaison  
**Urgency**: High (compliance deadline: 2026-01-27)

---

## Summary

Simultaneous layer-down of two critical governance protocols across the PartPulse repository:

1. **Agent Test Execution Protocol** (CI-Confirmatory-Not-Diagnostic)
   - Core principle: CI is confirmation, NOT diagnostic
   - Requires local test execution before PR creation
   - Mandates PREHANDOVER_PROOF evidence

2. **BL-026 (T0-015): Automated Deprecation Detection**
   - Constitutional Tier-0 requirement
   - Zero deprecated APIs without FM approval
   - Pre-commit and CI gate enforcement

Both protocols require mandatory builder training and attestation.

---

## What Changed

### 1. New Documents Created

- **governance/runbooks/AGENT_TEST_EXECUTION_PROTOCOL.md**
  - Comprehensive protocol for local test execution
  - Exception process for non-replicable tests
  - Integration with PREHANDOVER_PROOF template
  - Builder attestation requirements

- **governance/evidence/attestations/test-execution-protocol-attestations.md**
  - Attestation tracking for all builders
  - Training schedule and enforcement rules
  - Status tracking per builder

### 2. Updated Documents

- **.agent file**
  - Added `runbooks` section with agent-test-execution-protocol binding
  - Added BL-026 as Tier-0 constitutional requirement
  - Linked to governance/policy/AUTOMATED_DEPRECATION_DETECTION_GATE.md

- **governance/templates/PREHANDOVER_PROOF_TEMPLATE.md**
  - Added Section 3: Test Execution Evidence
  - Includes mandatory evidence for all test types
  - BL-026 deprecation detection evidence required
  - Test execution attestation checklist

- **All Builder Contracts** (5 contracts updated):
  - .github/agents/api-builder.md
  - .github/agents/ui-builder.md
  - .github/agents/qa-builder.md
  - .github/agents/schema-builder.md
  - .github/agents/integration-builder.md
  - Each now includes Test Execution Protocol section
  - References to both protocols in governance bindings

---

## Impact on FM and Builders

### Immediate Impact (Effective 2026-01-13)

**FM Responsibilities**:
- Schedule synchronous training session for all builders
- Conduct training covering both protocols
- Collect and track builder attestations
- Enforce PREHANDOVER_PROOF requirements in PR reviews
- Block task assignment for builders without attestation

**Builder Responsibilities**:
- Attend mandatory training session
- Sign attestation for both protocols
- Execute ALL tests locally before PR creation
- Include Section 3 (Test Execution Evidence) in all PREHANDOVER_PROOF documents
- Run `npm run lint:deprecation` before every commit
- Achieve 100% pass rate or document legitimate exceptions

### Process Changes

**Before PR Creation**:
1. Execute tests locally: `npm run test`, `npm run lint`, `npm run lint:deprecation`
2. Fix ALL failures immediately
3. Document results in PREHANDOVER_PROOF Section 3
4. Include attestation statement

**During PR Review**:
1. FM verifies PREHANDOVER_PROOF includes test execution evidence
2. FM verifies deprecation check passed
3. FM verifies attestation statement present
4. PR rejected if evidence incomplete

**Ongoing**:
- Builders blocked from task assignment without attestation
- Violations result in PR rejection and re-training
- Quarterly review of attestation compliance

---

## Grace Period

**Compliance Deadline**: 2026-01-27 (2 weeks from layer-down)

**Grace Period Activities**:
- Training session must be conducted before deadline
- All builders must attest before deadline
- First 5 PRs after training will receive extra review and feedback
- Learning log entries captured for any issues discovered

**After Deadline**:
- Full enforcement of both protocols
- No task assignments without attestation
- No PR approvals without proper evidence
- Violations escalated to Governance Liaison

---

## Enforcement Rules

### Test Execution Protocol

**MUST**:
- Execute all replicable tests locally
- Fix all failures before PR creation
- Document test results in PREHANDOVER_PROOF
- Include attestation statement

**MUST NOT**:
- Create PRs with known test failures
- Rely on CI for diagnostic feedback
- Skip test execution documentation
- Assume "it will pass in CI"

### BL-026 Deprecation Detection

**MUST**:
- Run `npm run lint:deprecation` locally before commit
- Achieve 0 deprecated APIs
- Request FM approval for any deprecation exceptions
- Include migration plan with any approval request

**MUST NOT**:
- Use deprecated APIs without FM approval
- Commit code with deprecation violations
- Disable or weaken deprecation checks
- Bypass pre-commit or CI gates

---

## Training Requirements

### Training Session Details

**When**: To be scheduled by FM (before 2026-01-27)  
**Duration**: 45-60 minutes  
**Format**: Synchronous session with all builders  
**Required Attendees**: All 5 builders (API, UI, QA, Schema, Integration)

**Agenda**:
1. Agent Test Execution Protocol overview (20 min)
   - Core principle: CI is confirmation only
   - Local execution requirements
   - Exception process
   - PREHANDOVER_PROOF evidence format

2. BL-026 Deprecation Detection overview (15 min)
   - Constitutional Tier-0 status
   - Why deprecations are blocked
   - How to check for deprecations
   - Exception request process

3. PREHANDOVER_PROOF walkthrough (10 min)
   - Section 3: Test Execution Evidence
   - How to document test results
   - Exception documentation format
   - Attestation requirements

4. Q&A and practical examples (10 min)
   - Real PR examples
   - Common scenarios
   - How to handle edge cases

5. Attestation signing (5 min)
   - Review attestation statements
   - Sign and witness attestations
   - Document attestation completion

### Post-Training

- Attestations filed in governance/evidence/attestations/
- Builders authorized for task assignment
- First 5 PRs reviewed with extra scrutiny
- Feedback captured for protocol improvements

---

## Validation and Evidence

### Pre-Implementation Validation

✅ Created AGENT_TEST_EXECUTION_PROTOCOL.md  
✅ Updated .agent file with protocol bindings  
✅ Updated PREHANDOVER_PROOF_TEMPLATE.md  
✅ Updated all 5 builder contracts  
✅ Created attestation tracking document  
✅ BL-026 already implemented (deprecation-detection.yml workflow exists)  
✅ Deprecation check script working (`npm run lint:deprecation`)

### Post-Implementation Validation (Required)

- [ ] Training session conducted
- [ ] All 5 builders attested
- [ ] First 5 PRs include proper test execution evidence
- [ ] CI gates continue to pass
- [ ] No deprecation violations detected
- [ ] Learning log entries captured
- [ ] Completion report created

---

## Related Documents

**New**:
- governance/runbooks/AGENT_TEST_EXECUTION_PROTOCOL.md
- governance/evidence/attestations/test-execution-protocol-attestations.md

**Updated**:
- .agent
- governance/templates/PREHANDOVER_PROOF_TEMPLATE.md
- .github/agents/api-builder.md
- .github/agents/ui-builder.md
- .github/agents/qa-builder.md
- .github/agents/schema-builder.md
- .github/agents/integration-builder.md

**Existing (Referenced)**:
- governance/policy/AUTOMATED_DEPRECATION_DETECTION_GATE.md (BL-026)
- governance/canon/EXECUTION_BOOTSTRAP_PROTOCOL.md
- .github/workflows/deprecation-detection.yml
- eslint.config.deprecation.mjs

---

## Success Metrics

### Layer-Down Complete When

- [x] Protocol documents created
- [x] .agent file updated with bindings
- [x] Templates updated with evidence requirements
- [x] All builder contracts updated
- [x] Attestation infrastructure created
- [ ] Training session conducted
- [ ] All builders attested
- [ ] First 5 PRs validated for compliance
- [ ] Zero violations in first 2 weeks
- [ ] Completion report published

### Long-Term Success Indicators

- 100% of PRs include test execution evidence
- 0% CI failures on "locally validated" PRs
- 0% deprecation violations detected
- Builder satisfaction with protocol clarity
- Reduced PR review time (fewer back-and-forth cycles)

---

## Escalation Path

**For Questions**: FM → Governance Liaison  
**For Violations**: Builder → FM → Governance Liaison  
**For Exceptions**: Builder → FM (for approval)  
**For Constitutional Issues**: Anyone → Johan Ras

---

## Notes

This is a **high-urgency** layer-down mandated by canonical governance.

**Key Points**:
- Both protocols are MANDATORY and constitutional
- Training is REQUIRED for all builders
- Attestation is BLOCKING for task assignment
- Violations have immediate consequences
- No exceptions without FM approval

**FM Action Required**:
- Schedule training session ASAP
- Conduct training before 2026-01-27
- Collect and file attestations
- Enforce PREHANDOVER_PROOF requirements
- Monitor compliance in first 5 PRs

---

**Event Status**: ✅ Layer-Down Complete, ⚠️ Training Pending  
**Next Milestone**: Training session and attestations  
**Compliance Deadline**: 2026-01-27  
**Owner**: Governance Liaison  
**FM Approval Required**: For training schedule

---

**END OF GOVERNANCE EVENT**
