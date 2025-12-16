# Governance Policy Version

**Repository**: PartPulse  
**Policy Version**: 1.1.0  
**Last Updated**: 2025-12-16  
**Policy Authority**: ForemanApp Agent Contract

---

## Policy Declaration

This repository is governed by the ForemanApp Agent Contract as defined in `.github/agents/PartPulse-agent.md`.

## Core Governance Invariants

### 1. RED Ownership Invariant
- Any RED state at PR merge gate, governance gate, or Build-to-Green validation is owned until resolved
- Resolution limited to: Fix-to-GREEN or Approved governed exception

### 2. Zero Test Dodging Rule
- No skipped tests, focused tests, suppressed failures, or conditional bypasses
- Intentional RED only through governed mechanisms (QA Parking or DP-RED)
- QA Parking for implementation-phase RED states
- DP-RED for design-phase RED states

### 3. One-Time Failure Doctrine
- Failures may occur once
- Must implement permanent prevention
- Strengthen QA to detect forever
- Propagate lessons across repos

### 4. Merge Gate Supremacy
- RED merge gate is hard stop
- Never rationalize, defer, or proceed with RED
- Fix system or escalate for governed exception

### 5. Legacy Debt Handling
- Legacy debt still blocks merge
- Requires remediation or governed exception
- Must result in permanent prevention

### 6. Failure Completion Criteria
- Complete only when GREEN or governed exception approved
- Partial fixes do not constitute completion

### 7. Evidence & Audit Discipline
- Produce traceable decisions and immutable evidence
- Mandatory for ISO alignment and forensic traceability

### 8. Self-Evolution Requirement
- Update contract when new failure modes discovered
- Propagate lessons to all repositories

---

## Compliance Mechanisms

| Mechanism | Status | Location |
|-----------|--------|----------|
| Test Dodging Detection | ✅ Active | `qa/detect-test-dodging.js` |
| QA Parking Station | ✅ Active | `qa/parking/` |
| DP-RED Support | ✅ Active | `qa/parking/` |
| Parking Watcher | ✅ Active | `qa/parking/watcher.js` |
| Catastrophic Failure Tracking | ✅ Active | `qa/evidence/` |
| Evidence Capture | ✅ Active | `qa/evidence/capture.js` |
| CI Enforcement | ✅ Active | `.github/workflows/` |

---

## Policy Sync Status

- **Last Sync**: 2025-12-16
- **Sync Status**: ✅ Current
- **Next Review**: As needed per Self-Evolution Requirement

---

## Version History

### 1.1.0 (2025-12-16)
- Added Design-Phase RED (DP-RED) support (APPQA-1)
- Extended parking registry schema with category field
- Created DP-RED issue template
- Updated QA Governance Guide with DP-RED documentation
- Enhanced parking watcher to distinguish DP-RED from QA Parking

### 1.0.0 (2025-12-16)
- Initial policy version
- Implemented QA/Governance compliance bootstrap (PPQA-0)
- Established core governance mechanisms
- Set up CI enforcement

---

## Contact

For policy questions or governance exceptions:
- Create a QA Parking Request issue (for implementation-phase RED)
- Create a DP-RED Request issue (for design-phase RED)
- Reference ForemanApp Agent Contract
- Await owner approval
