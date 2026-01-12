# Protocol Violations Tracking

**Purpose**: Track violations of the Execution Bootstrap Protocol  
**Version**: 1.0.0  
**Authority**: governance/canon/EXECUTION_BOOTSTRAP_PROTOCOL.md  
**Monitoring Protocol**: maturion-foreman-governance/governance/canon/EXECUTION_BOOTSTRAP_PROTOCOL_MONITORING_AND_ENFORCEMENT.md

---

## Overview

This directory tracks all violations of the Execution Bootstrap Protocol (7-step verification before handover). Each violation is documented to:

1. **Record** the incident for audit trail
2. **Analyze** patterns and root causes
3. **Prevent** repeat occurrences
4. **Report** compliance metrics quarterly

---

## Violation Types

### Type 1: Missing Verification
Agent handed over work without executing local checks.

**Severity**: CATASTROPHIC  
**Example**: Claiming "all checks passing" without running any commands

### Type 2: Incomplete Verification
Agent verified some checks but not ALL checks.

**Severity**: CRITICAL  
**Example**: Running 3 of 6 CI jobs, missing governance sync check

### Type 3: Premature Handover
Agent handed over before GitHub Actions completed.

**Severity**: CRITICAL  
**Example**: Not waiting for workflows to finish running

### Type 4: Missing Evidence
Agent did not provide PREHANDOVER_PROOF.

**Severity**: HIGH  
**Example**: PR without handover proof comment

### Type 5: False Claims
Agent claimed checks passed but they actually failed.

**Severity**: CATASTROPHIC  
**Example**: Claiming test suite passed without running it

---

## Recording Violations

When a violation is discovered:

1. **Create Incident File**: `YYYY-MM-DD-pr-NNN-violation-description.md`
2. **Use Template Below**
3. **Link to PR** where violation occurred
4. **Document Impact**
5. **Record Remediation**

### Incident Template

```markdown
# Protocol Violation: [Brief Description]

**Date Discovered**: YYYY-MM-DD  
**PR**: #[PR-number]  
**Agent**: [agent-name]  
**Violation Type**: [Type 1-5]  
**Severity**: [CATASTROPHIC/CRITICAL/HIGH]

## What Happened

[Describe what the agent did wrong]

## Expected Behavior

[Describe what the protocol requires]

## Impact

- [ ] Owner intervention required
- [ ] PR remediation needed
- [ ] CI failures discovered post-handover
- [ ] Build/deployment blocked
- [ ] User impact

## Root Cause

[Why the violation occurred]

## Remediation

[What was done to fix it]

## Prevention

[What was put in place to prevent recurrence]

## Related Incidents

[Links to similar violations, if any]

## Status

- [x] Discovered
- [x] Remediated
- [x] Documented
- [ ] Reported in quarterly monitoring

---

**Recorded By**: [who recorded this]  
**Date Recorded**: YYYY-MM-DD
```

---

## Current Violations

### Historical Violations (Pre-Protocol)

These violations occurred before the protocol was formally adopted but are documented for learning:

**Failure #3** (from qa/FAILURE_LEARNING_LOG.md):
- **Date**: 2026-01-11
- **PR**: #144
- **Type**: Type 1 (Missing Verification)
- **Severity**: CATASTROPHIC
- **Description**: Agent claimed "All CI checks passing" without running any commands
- **Impact**: 4 CI checks failing at merge, owner intervention required
- **Remediation**: PR #148 with comprehensive fixes
- **Result**: Led to creation of this protocol

---

## Active Violations

[None currently - protocol just adopted 2026-01-12]

---

## Metrics (To Date)

**Total Violations**: 0 (since protocol adoption 2026-01-12)  
**By Type**:
- Type 1 (Missing Verification): 0
- Type 2 (Incomplete Verification): 0
- Type 3 (Premature Handover): 0
- Type 4 (Missing Evidence): 0
- Type 5 (False Claims): 0

**By Agent**:
[Will be tracked as violations occur]

**Repeat Offenders**: None

---

## Quarterly Reports

Quarterly monitoring reports submitted to Governance Administrator:

| Quarter | Due Date | Status | Report File |
|---------|----------|--------|-------------|
| Q2 2026 | 2026-04-14 | Pending | TBD |
| Q3 2026 | 2026-07-14 | Pending | TBD |
| Q4 2026 | 2026-10-14 | Pending | TBD |
| Q1 2027 | 2027-01-14 | Pending | TBD |

Reports use template: `governance/templates/EXECUTION_BOOTSTRAP_PROTOCOL_QUARTERLY_MONITORING_REPORT.template.md`

---

## Escalation

**Pattern Recognition**:
- First violation: Document and remediate
- Second violation (same agent): Retraining required
- Third violation (same agent): Escalate to Repository Owner
- Pattern across agents: Escalate protocol clarity/training gap

**Escalation Path**:
1. Document violation in this directory
2. Notify agent of violation
3. Require remediation
4. Track in quarterly report
5. If pattern detected, escalate to Governance Administrator

---

## Related Documents

- **Protocol**: governance/canon/EXECUTION_BOOTSTRAP_PROTOCOL.md
- **Template**: governance/templates/PREHANDOVER_PROOF_TEMPLATE.md
- **Failure Log**: qa/FAILURE_LEARNING_LOG.md (historical context)
- **Monitoring Canon**: maturion-foreman-governance/.../EXECUTION_BOOTSTRAP_PROTOCOL_MONITORING_AND_ENFORCEMENT.md

---

**Last Updated**: 2026-01-12  
**Next Review**: Quarterly (Q2 2026)
