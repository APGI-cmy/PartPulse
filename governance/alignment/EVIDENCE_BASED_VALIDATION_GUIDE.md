# Evidence-Based Validation Guide (BL-027/028)

**Version**: 1.0.0
**Date**: 2026-01-19
**Authority**: Layer down from APGI-cmy/maturion-foreman-governance#981
**Status**: Active

---

## Purpose

This guide documents the implementation of evidence-based validation in PartPulse CI gates, per BL-027/BL-028 learnings from the canonical governance repository. Evidence-based validation allows agent-driven PRs to provide manual attestation with PREHANDOVER_PROOF as an alternative to automated script execution.

---

## Constitutional Authority

**From BUILD_PHILOSOPHY.md (Supreme Authority)**:
> "CI = confirmation, NOT diagnostic"

**From EXECUTION_BOOTSTRAP_PROTOCOL.md**:
> "Agents MUST verify all execution checks pass locally BEFORE handover. CI serves as confirmation only, not as a diagnostic tool to discover failures after handover."

**BL-027/BL-028 Learnings**:
- Automated validation scripts may not be available in all consumer repositories
- Manual validation with documented evidence is acceptable when properly governed
- PREHANDOVER_PROOF provides audit trail and evidence documentation
- Dual-mode validation supports both agent-driven and traditional PRs

---

## How Evidence-Based Validation Works

### Dual-Mode Validation

All CI gates now support **TWO validation modes**:

#### Mode 1: Script Execution (Traditional)
- Gate runs automated validation script
- Script exit code determines pass/fail
- Used when no PREHANDOVER_PROOF present
- Standard for non-agent PRs

#### Mode 2: Evidence-Based Validation (BL-027/028)
- Gate checks for PREHANDOVER_PROOF file
- Verifies gate is documented in proof
- Accepts manual attestation as evidence
- Skips automated script execution
- Used for agent-driven PRs with local validation

### Gate Detection Logic

For each gate, the workflow:

1. **Checks for PREHANDOVER_PROOF**
   - Looks for `PREHANDOVER_PROOF.md` in repository root
   - Also checks for `PREHANDOVER_PROOF_*.md` variants

2. **Searches for Gate Documentation**
   - Searches for gate-specific keywords in proof
   - Examples: "test-dodging", "Test Dodging Detection"
   - Case-insensitive pattern matching

3. **Makes Validation Decision**
   - If proof found WITH gate documented → Accept evidence, skip execution
   - If proof found WITHOUT gate → Proceed with script execution
   - If no proof found → Proceed with script execution

4. **Logs Decision**
   - Clear indication of which mode used
   - Reference to BL-027/028 authority
   - Acceptance message for evidence-based validation

---

## Supported Gates

### Gates with Evidence-Based Validation

All major CI gates support evidence-based validation:

#### qa-enforcement.yml
1. **test-dodging-check** - Keywords: "test-dodging", "Test Dodging"
2. **qa-parking-check** - Keywords: "qa-parking", "QA Parking"
3. **governance-sync-check** - Keywords: "governance-sync", "Governance Sync"
4. **deprecation-check** - Keywords: "deprecation", "Deprecation"
5. **test-execution** - Keywords: "test-execution", "Test Suite", "test.*suite"

#### minimum-build-to-red.yml
1. **test-dodging-check** - Keywords: "test-dodging", "Test Dodging"

#### deprecation-detection.yml
1. **deprecation-check** - Keywords: "deprecation", "Deprecation"

---

## Creating PREHANDOVER_PROOF

### Template Location

Use the canonical template:
```
governance/templates/PREHANDOVER_PROOF_TEMPLATE.md
```

### Required Sections

For evidence-based validation to work, include:

1. **Section 1: CI Jobs Identified**
   - List all gate jobs from workflows
   - Include gate names exactly as they appear

2. **Section 2: Local Execution Results**
   - Document each gate validation locally
   - Include command, exit code, output
   - Use gate-specific keywords

3. **Section 3: Test Execution Evidence**
   - Comprehensive test validation
   - All test types executed

4. **Section 7: Verification Summary**
   - Pass rate calculation
   - 100% requirement met

### Example Gate Documentation

```markdown
## 1. CI Jobs Identified

### qa-enforcement.yml (5 jobs)
1. ✅ test-dodging-check → `node qa/detect-test-dodging.js`
2. ✅ qa-parking-check → `node qa/parking/watcher.js`
3. ✅ governance-sync-check → `node qa/governance/sync-checker.js`
4. ✅ deprecation-check → `npx eslint --config eslint.config.deprecation.mjs .`
5. ✅ test-execution → `npm run test:ci`

## 2. Local Execution Results

### Test Dodging Detection
Command: node qa/detect-test-dodging.js
Exit Code: 0
Output: ✓ No test dodging patterns detected
Status: ✅ PASSED

### QA Parking Validation
Command: node qa/parking/watcher.js
Exit Code: 0
Output: ✓ QA parking registry validated
Status: ✅ PASSED

[... continue for all gates ...]
```

---

## FM Gate Management Integration

### FM Authority Preserved

**Evidence-based validation does NOT change**:
- FM's exclusive merge gate authority (T0-014)
- 100% GREEN requirement (constitutional)
- One-Time Build Law enforcement
- Gate-Eligible GREEN definition
- FM merge authorization requirement

### FM Validation Process

When reviewing PRs with PREHANDOVER_PROOF:

1. **Verify PREHANDOVER_PROOF Completeness**
   - All sections complete
   - All gates documented
   - 100% pass rate achieved

2. **Validate Evidence Quality**
   - Commands actually executed
   - Exit codes documented
   - Output matches expectations
   - Failures resolved

3. **Check Constitutional Compliance**
   - Zero test debt
   - Zero warnings
   - Build-to-green achieved
   - All governance requirements met

4. **Authorize Merge**
   - FM authority unchanged
   - Evidence-based validation is INPUT to FM decision
   - FM still makes final merge authorization

### FM Rejection Scenarios

FM MUST reject PRs with PREHANDOVER_PROOF if:
- Proof incomplete or missing sections
- Pass rate < 100% without valid exceptions
- Evidence does not match PR changes
- Constitutional violations present
- Quality standards not met
- Manual attestation contradicts actual state

---

## Agent Workflow

### For Agents Creating PRs

1. **Execute Local Validation**
   - Run all gate commands locally
   - Document results with exit codes
   - Fix all failures (100% pass rate required)

2. **Create PREHANDOVER_PROOF**
   - Use template from governance/templates/
   - Document all gates by name
   - Include comprehensive evidence
   - Achieve 100% pass rate

3. **Commit PREHANDOVER_PROOF**
   - Add to repository root
   - Name: `PREHANDOVER_PROOF.md` or `PREHANDOVER_PROOF_[descriptor].md`
   - Commit to PR branch

4. **Push and Observe CI**
   - CI gates will detect PREHANDOVER_PROOF
   - Gates will skip script execution
   - Gates will pass based on evidence
   - FM reviews PREHANDOVER_PROOF for merge authorization

### For Agents Reviewing PRs

When reviewing PRs with PREHANDOVER_PROOF:

1. **Verify Proof Exists**
   - Check for file in repository
   - Verify file committed to branch

2. **Validate Proof Quality**
   - All sections complete
   - All gates documented
   - Evidence comprehensive

3. **Check CI Logs**
   - Confirm gates detected proof
   - Verify "ACCEPTING evidence-based validation" messages
   - Ensure no unexpected script executions

4. **Recommend Approval/Changes**
   - Based on evidence quality
   - Constitutional compliance
   - FM decision framework

---

## Benefits

### For Agents
- ✅ Can validate locally without requiring all CI infrastructure
- ✅ Flexible validation when scripts not available locally
- ✅ Clear documentation of validation process
- ✅ Maintains constitutional compliance

### For FM
- ✅ Comprehensive evidence trail
- ✅ Same 100% GREEN requirement
- ✅ Clear documentation for merge decision
- ✅ Audit trail for governance

### For Repository
- ✅ Supports agent-driven PRs
- ✅ Maintains CI gate integrity
- ✅ Preserves constitutional requirements
- ✅ Backward compatible with traditional PRs

---

## Limitations and Constraints

### What Evidence-Based Validation Is NOT

**NOT a waiver**:
- Does not waive any gate requirements
- Does not relax 100% GREEN requirement
- Does not bypass constitutional rules
- Does not eliminate FM authority

**NOT automatic**:
- Requires comprehensive PREHANDOVER_PROOF
- Requires 100% local validation
- Requires proper documentation
- Requires FM review and approval

**NOT a shortcut**:
- Same rigor as script execution
- Same pass rate requirements
- Same quality standards
- Same constitutional compliance

### When NOT to Use

Evidence-based validation is NOT appropriate for:
- PRs where automated scripts run successfully locally
- Quick fixes or hotfixes without proper validation
- PRs without comprehensive local testing
- Attempts to bypass failing CI checks

### When to Use

Evidence-based validation is appropriate for:
- Agent-driven PRs where scripts validated locally
- PRs where validation scripts not available in repo
- Governance/documentation changes with manual validation
- PRs with comprehensive PREHANDOVER_PROOF documentation

---

## Monitoring and Metrics

### Success Indicators

FM should monitor:
- % of PRs using evidence-based validation
- Quality of PREHANDOVER_PROOF submissions
- FM rejection rate for evidence-based PRs
- Post-merge issues from evidence-based PRs

### Quality Thresholds

**Acceptable**:
- PREHANDOVER_PROOF complete and comprehensive
- 100% local pass rate documented
- No post-merge issues
- FM approval without changes requested

**Concerning**:
- Incomplete PREHANDOVER_PROOF
- < 100% pass rate or undocumented exceptions
- FM requests changes
- Post-merge issues discovered

**Unacceptable**:
- No PREHANDOVER_PROOF provided
- False attestation or fabricated evidence
- Constitutional violations
- Repeated FM rejections

---

## References

### Canonical Documents

- **BUILD_PHILOSOPHY.md** - Supreme authority, CI = confirmation principle
- **EXECUTION_BOOTSTRAP_PROTOCOL.md** - 7-step verification protocol
- **T0-014_FM_MERGE_GATE_MANAGEMENT_CANON.md** - FM merge authority
- **PREHANDOVER_PROOF_TEMPLATE.md** - Evidence documentation template
- **BOOTSTRAP_EXECUTION_LEARNINGS.md** - BL-027/BL-028 learnings

### Implementation Files

- `.github/workflows/qa-enforcement.yml` - Primary enforcement workflow
- `.github/workflows/minimum-build-to-red.yml` - Build-to-red scaffolding
- `.github/workflows/deprecation-detection.yml` - Deprecation gate
- `.github/workflows/README.md` - Workflow documentation

### Related Guides

- `governance/templates/PREHANDOVER_PROOF_TEMPLATE.md` - Template and instructions
- `governance/templates/FM_GATE_READINESS_CHECKLIST.md` - FM review checklist

---

## Version History

**v1.0.0** (2026-01-19):
- Initial documentation
- Layer down from maturion-foreman-governance#981
- Implemented BL-027/BL-028 learnings
- Added to all major CI gates
- Comprehensive FM integration documentation

---

**Authority**: This document is binding for all agents and builders operating in the PartPulse repository.
