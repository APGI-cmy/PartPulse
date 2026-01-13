# Risk Assessment - Example Template

**Date**: 2026-01-13  
**Assessment ID**: risk_EXAMPLE_20260113  
**Agent**: [agent-name]  
**Purpose**: Example risk assessment artifact for PREHANDOVER_PROOF template

---

## PR Summary

**PR Number**: #XXX  
**Branch**: feature/example-branch  
**Agent**: [agent-name]  
**Change Type**: [governance/code/infrastructure/documentation]

**Brief Description**:
[2-3 sentence summary of what this PR changes and why]

---

## Risk Categories

### Technical Risks

**Overall Technical Risk Level**: [LOW/MEDIUM/HIGH/CRITICAL]

#### Risk 1: [Risk Name]
- **Description**: [Detailed description of the technical risk]
- **Probability**: [LOW/MEDIUM/HIGH] (10-30% / 30-70% / >70%)
- **Impact**: [LOW/MEDIUM/HIGH] (minimal / significant / severe)
- **Combined Risk**: [LOW/MEDIUM/HIGH/CRITICAL]
- **Mitigation Strategy**: [How this risk will be mitigated]
- **Mitigation Status**: [planned/in-progress/complete]
- **Residual Risk**: [LOW/MEDIUM/HIGH after mitigation]
- **Status**: [mitigated/accepted/monitoring/escalated]

#### Risk 2: [Risk Name]
- **Description**: [Detailed description of the technical risk]
- **Probability**: [LOW/MEDIUM/HIGH]
- **Impact**: [LOW/MEDIUM/HIGH]
- **Combined Risk**: [LOW/MEDIUM/HIGH/CRITICAL]
- **Mitigation Strategy**: [How this risk will be mitigated]
- **Mitigation Status**: [planned/in-progress/complete]
- **Residual Risk**: [LOW/MEDIUM/HIGH after mitigation]
- **Status**: [mitigated/accepted/monitoring/escalated]

[... Continue for all technical risks ...]

**OR**

- [ ] No technical risks identified

---

### Governance Risks

**Overall Governance Risk Level**: [LOW/MEDIUM/HIGH/CRITICAL]

#### Risk 1: [Risk Name]
- **Description**: [Detailed description of the governance risk]
- **Probability**: [LOW/MEDIUM/HIGH]
- **Impact**: [LOW/MEDIUM/HIGH]
- **Combined Risk**: [LOW/MEDIUM/HIGH/CRITICAL]
- **Constitutional Impact**: [yes/no - affects Tier-0 documents]
- **Mitigation Strategy**: [How this risk will be mitigated]
- **Mitigation Status**: [planned/in-progress/complete]
- **Residual Risk**: [LOW/MEDIUM/HIGH after mitigation]
- **Status**: [mitigated/accepted/monitoring/escalated]

#### Risk 2: [Risk Name]
- **Description**: [Detailed description of the governance risk]
- **Probability**: [LOW/MEDIUM/HIGH]
- **Impact**: [LOW/MEDIUM/HIGH]
- **Combined Risk**: [LOW/MEDIUM/HIGH/CRITICAL]
- **Constitutional Impact**: [yes/no - affects Tier-0 documents]
- **Mitigation Strategy**: [How this risk will be mitigated]
- **Mitigation Status**: [planned/in-progress/complete]
- **Residual Risk**: [LOW/MEDIUM/HIGH after mitigation]
- **Status**: [mitigated/accepted/monitoring/escalated]

[... Continue for all governance risks ...]

**OR**

- [ ] No governance risks identified

---

### Process Risks

**Overall Process Risk Level**: [LOW/MEDIUM/HIGH/CRITICAL]

#### Risk 1: [Risk Name]
- **Description**: [Detailed description of the process risk]
- **Probability**: [LOW/MEDIUM/HIGH]
- **Impact**: [LOW/MEDIUM/HIGH]
- **Combined Risk**: [LOW/MEDIUM/HIGH/CRITICAL]
- **Affected Processes**: [list process names]
- **Mitigation Strategy**: [How this risk will be mitigated]
- **Mitigation Status**: [planned/in-progress/complete]
- **Residual Risk**: [LOW/MEDIUM/HIGH after mitigation]
- **Status**: [mitigated/accepted/monitoring/escalated]

#### Risk 2: [Risk Name]
- **Description**: [Detailed description of the process risk]
- **Probability**: [LOW/MEDIUM/HIGH]
- **Impact**: [LOW/MEDIUM/HIGH]
- **Combined Risk**: [LOW/MEDIUM/HIGH/CRITICAL]
- **Affected Processes**: [list process names]
- **Mitigation Strategy**: [How this risk will be mitigated]
- **Mitigation Status**: [planned/in-progress/complete]
- **Residual Risk**: [LOW/MEDIUM/HIGH after mitigation]
- **Status**: [mitigated/accepted/monitoring/escalated]

[... Continue for all process risks ...]

**OR**

- [ ] No process risks identified

---

### Integration Risks

**Overall Integration Risk Level**: [LOW/MEDIUM/HIGH/CRITICAL]

#### Risk 1: [Risk Name]
- **Description**: [Detailed description of the integration risk]
- **Probability**: [LOW/MEDIUM/HIGH]
- **Impact**: [LOW/MEDIUM/HIGH]
- **Combined Risk**: [LOW/MEDIUM/HIGH/CRITICAL]
- **Components Affected**: [list components/systems]
- **Mitigation Strategy**: [How this risk will be mitigated]
- **Mitigation Status**: [planned/in-progress/complete]
- **Residual Risk**: [LOW/MEDIUM/HIGH after mitigation]
- **Status**: [mitigated/accepted/monitoring/escalated]

**OR**

- [ ] No integration risks identified

---

### Security Risks

**Overall Security Risk Level**: [LOW/MEDIUM/HIGH/CRITICAL]

#### Risk 1: [Risk Name]
- **Description**: [Detailed description of the security risk]
- **Probability**: [LOW/MEDIUM/HIGH]
- **Impact**: [LOW/MEDIUM/HIGH]
- **Combined Risk**: [LOW/MEDIUM/HIGH/CRITICAL]
- **Security Domain**: [authentication/authorization/data protection/etc.]
- **Mitigation Strategy**: [How this risk will be mitigated]
- **Mitigation Status**: [planned/in-progress/complete]
- **Residual Risk**: [LOW/MEDIUM/HIGH after mitigation]
- **Status**: [mitigated/accepted/monitoring/escalated]

**OR**

- [ ] No security risks identified

---

## Overall Risk Assessment

### Risk Summary Table

| Risk Category | Risk Level | Mitigated | Accepted | Escalated |
|--------------|-----------|----------|----------|-----------|
| Technical    | [L/M/H/C] | [N]      | [N]      | [N]       |
| Governance   | [L/M/H/C] | [N]      | [N]      | [N]       |
| Process      | [L/M/H/C] | [N]      | [N]      | [N]       |
| Integration  | [L/M/H/C] | [N]      | [N]      | [N]       |
| Security     | [L/M/H/C] | [N]      | [N]      | [N]       |

### Combined Risk Level

**Overall PR Risk Level**: [LOW/MEDIUM/HIGH/CRITICAL]

**Calculation Method**: Highest individual risk level determines overall risk

**Risk Posture Summary**:
[2-3 sentence summary of the overall risk posture for this PR, including key risks and mitigation status]

---

## Risk Acceptance

### Accepted Risks

**Risk 1**: [risk name]
- **Reason for Acceptance**: [why this risk is accepted rather than mitigated]
- **Authority for Acceptance**: [who authorized acceptance]
- **Monitoring Plan**: [how this risk will be monitored]

**OR**

- [ ] No risks accepted without mitigation

---

## Escalation Required

**Is escalation required for any risks?**
- [ ] YES - escalation required (document below)
- [ ] NO - all risks within agent authority

### If YES - Escalation Details

**Risk Requiring Escalation**: [risk name]
- **Risk Level**: [HIGH/CRITICAL]
- **Escalate To**: [FM/Johan]
- **Reason for Escalation**: [why escalation is needed]
- **Decision Required**: [what decision needs to be made]
- **Timeline**: [when decision is needed]
- **Blocking**: [yes/no - does this block PR merge]

---

## Risk Monitoring Plan

### Risks Requiring Ongoing Monitoring

**Risk 1**: [risk name]
- **Monitoring Frequency**: [daily/weekly/per-release]
- **Monitoring Method**: [how risk will be monitored]
- **Trigger for Re-assessment**: [conditions that trigger re-assessment]
- **Owner**: [who is responsible for monitoring]

**OR**

- [ ] No ongoing monitoring required (all risks fully mitigated or accepted)

---

## Dependencies and Assumptions

### Key Dependencies

1. **Dependency**: [description]
   - **Type**: [technical/organizational/external]
   - **Risk if Unavailable**: [what happens if dependency fails]
   - **Mitigation**: [backup plan]

[... Continue for all dependencies ...]

### Key Assumptions

1. **Assumption**: [description]
   - **Validity**: [HIGH/MEDIUM/LOW confidence in assumption]
   - **Risk if Invalid**: [what happens if assumption is wrong]
   - **Validation Method**: [how assumption will be validated]

[... Continue for all assumptions ...]

---

## Risk Assessment Sign-Off

### Assessment Completeness

- [ ] All risk categories reviewed
- [ ] All identified risks documented
- [ ] All mitigation strategies defined
- [ ] All escalations documented (if applicable)
- [ ] All accepted risks justified
- [ ] Monitoring plan established (if needed)
- [ ] Overall risk level determined

### Sign-Off

**Assessed by**: [agent-name]  
**Role**: [agent role/contract]  
**Date**: [YYYY-MM-DD]  
**Authority**: AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md (Tier-0, Constitutional)

**I certify that this risk assessment is complete and accurate to the best of my knowledge.**

---

## Approval

**For LOW/MEDIUM risk PRs**: Self-approved by agent
**For HIGH risk PRs**: Requires FM approval
**For CRITICAL risk PRs**: Requires Johan approval

**Approval Status**: 
- [ ] Self-approved (LOW/MEDIUM risk)
- [ ] Pending FM approval (HIGH risk)
- [ ] Pending Johan approval (CRITICAL risk)
- [ ] Approved by: [name] on [date]

---

## Notes

[Any additional context, special considerations, or clarifications about the risk assessment]

---

**Risk Assessment Version**: 1.0.0 (based on PREHANDOVER_PROOF Template v2.0.0)
