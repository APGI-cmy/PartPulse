# FM PR Checklist (Category 0-4)

**Purpose**: Mandatory checklist for Foreman (FM) PRs  
**Version**: 2.0.0  
**Authority**: Execution Bootstrap Protocol + FM Merge Gate Management Canon  
**Effective**: 2026-01-12

---

## Instructions

FM MUST complete this checklist before submitting any PR. Copy into PR description.

---

## Category 0: Execution Bootstrap Protocol (MANDATORY, v2.0.0+)

**Authority**: governance/canon/EXECUTION_BOOTSTRAP_PROTOCOL.md

- [ ] **Step 1**: Identified ALL CI jobs from workflow files
- [ ] **Step 2**: Executed EVERY command locally
- [ ] **Step 3**: Documented results for EACH command
- [ ] **Step 4**: Fixed ALL failures
- [ ] **Step 5**: Verified 100% pass rate (local or justified exceptions)
- [ ] **Step 6**: Waited for GitHub Actions completion
- [ ] **Step 7**: Created PREHANDOVER_PROOF (comment on this PR)

**PREHANDOVER_PROOF Provided**: [ ] Yes (see comment) / [ ] Not Required (reason: _____________)

**Hard Stop**: If Category 0 incomplete, PR is BLOCKED from merge.

---

## Category 1: Planning & Architecture

**Authority**: BUILD_PHILOSOPHY.md, governance/policies/design-freeze-rule.md

- [ ] Architecture frozen and validated before implementation
- [ ] No architectural changes without explicit approval
- [ ] Design Freeze respected (T0-004)
- [ ] Changes conform to frozen architecture specifications

---

## Category 2: QA & Testing

**Authority**: governance/policies/zero-test-debt-constitutional-rule.md, BUILD_PHILOSOPHY.md

- [ ] QA-to-Red foundation established (if applicable)
- [ ] All tests passing (100% = PASS)
- [ ] Zero test debt (no skips, todos, or stubs)
- [ ] No test dodging patterns (.skip, .only, xdescribe, etc.)
- [ ] Test removal authorized if applicable (FM approval documented)
- [ ] QA parking validated (no unauthorized parking entries)

---

## Category 3: Build Quality

**Authority**: governance/specs/build-to-green-enforcement-spec.md, governance/policies/ZERO_WARNING_TEST_DEBT_IMMEDIATE_REMEDY_DOCTRINE.md

- [ ] Build succeeds (npm run build passes)
- [ ] Linting passes (npm run lint - 0 errors, 0 warnings)
- [ ] Type checking passes (tsc --noEmit)
- [ ] Zero warnings (lint, build, TypeScript)
- [ ] Deprecation detection passes (if applicable)
- [ ] All prior debt discovered has been remediated

---

## Category 4: Builder Verification (FM-Specific)

**Authority**: governance/alignment/FM_MERGE_GATE_MANAGEMENT_CANON.md

When reviewing builder PRs, FM MUST verify:

- [ ] Builder provided PREHANDOVER_PROOF (if applicable)
- [ ] Builder proof is complete (all 7 steps)
- [ ] Builder proof includes CI run URLs
- [ ] Builder CI runs are verified green
- [ ] Builder contract alignment confirmed
- [ ] Builder governance compliance validated
- [ ] No merge gate failures introduced by builder

**Builder Handover Status**: [ ] Verified / [ ] Not Applicable (FM-only PR)

---

## Category 5: Governance Compliance

**Authority**: governance/alignment/GOVERNANCE_ALIGNMENT.md

- [ ] Governance version synchronized (if applicable)
- [ ] Agent contracts updated (if applicable)
- [ ] Ripple awareness obligations satisfied
- [ ] No protected paths violated (governance/**, .github/agents/**)
- [ ] Enhancement capture completed (if applicable)
- [ ] Visibility events created (if affecting FM Office)

---

## Category 6: CI & Workflows

**Authority**: .github/workflows/*, governance/canon/EXECUTION_BOOTSTRAP_PROTOCOL.md

- [ ] All CI workflows passing
- [ ] qa-enforcement.yml: All jobs green
- [ ] deprecation-detection.yml: All jobs green (if applicable)
- [ ] minimum-build-to-red.yml: All jobs green
- [ ] No workflow modifications without explicit justification
- [ ] CI run URLs documented in PREHANDOVER_PROOF

---

## Category 7: Documentation

- [ ] Documentation updated (if changes affect user/developer docs)
- [ ] Architecture docs updated (if arch changes)
- [ ] Governance docs updated (if governance changes)
- [ ] README updated (if deployment/setup changes)
- [ ] Changelog updated (if applicable)

---

## Evidence & Audit Trail

**Authority**: BUILD_PHILOSOPHY.md (One-Time Build Law)

- [ ] All changes justified and traceable
- [ ] Failure learning captured (if fixing defect)
- [ ] BL/FL/CI forward-scan completed (if applicable)
- [ ] Evidence linked in PR description
- [ ] Audit trail complete

---

## Final Verification

### Pre-Merge Confirmation

- [ ] All categories (0-7) completed
- [ ] PREHANDOVER_PROOF provided (Category 0)
- [ ] All CI checks green
- [ ] Zero test debt
- [ ] Zero warnings
- [ ] 100% pass rate

### Authorization

**FM Self-Authorization**:
- [ ] I confirm all checks completed
- [ ] I confirm 100% GREEN status
- [ ] I confirm merge gate readiness
- [ ] I authorize merge

**FM Signature**: _____________________  
**Date**: _____________________

---

## Escalation

If any category cannot be completed:
- Document blocker in PR comments
- Escalate to Governance Liaison (governance issues)
- Escalate to Repository Owner (constitutional conflicts)
- Do NOT merge until blocker resolved

---

## References

- **Protocol**: governance/canon/EXECUTION_BOOTSTRAP_PROTOCOL.md
- **Template**: governance/templates/PREHANDOVER_PROOF_TEMPLATE.md
- **FM Canon**: governance/alignment/FM_MERGE_GATE_MANAGEMENT_CANON.md
- **Build Philosophy**: BUILD_PHILOSOPHY.md
- **Agent Contract**: .github/agents/ForemanApp-agent.md

---

**Version**: 2.0.0  
**Effective**: 2026-01-12  
**Next Review**: After first use

---

**This checklist is MANDATORY for all FM PRs. Incomplete checklists block merge.**
