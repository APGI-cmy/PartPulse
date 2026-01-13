# Governance Scan - Example Template

**Date**: 2026-01-13  
**PR**: #XXX  
**Agent**: [agent-name]  
**Purpose**: Example governance scan artifact for PREHANDOVER_PROOF template

---

## Scope

**PR Number**: #XXX  
**Branch**: feature/example-branch  
**Agent**: [agent-name]  
**Change Type**: [governance/code/infrastructure/documentation]

**Brief Description**: 
[1-2 sentence summary of what this PR changes]

---

## Governance Touchpoints Identified

### Touchpoint 1: [Document/Protocol Name]
- **Path**: `governance/canon/DOCUMENT_NAME.md`
- **Change Type**: [add/modify/remove/reference]
- **Section Affected**: [section number/name]
- **Authority**: [governance reference that authorizes this change]
- **Impact**: [brief description of impact]

### Touchpoint 2: [Document/Protocol Name]
- **Path**: `governance/canon/DOCUMENT_NAME.md`
- **Change Type**: [add/modify/remove/reference]
- **Section Affected**: [section number/name]
- **Authority**: [governance reference that authorizes this change]
- **Impact**: [brief description of impact]

[... Continue for all governance touchpoints ...]

### Summary
**Total Touchpoints**: [N]  
**High Impact**: [N]  
**Medium Impact**: [N]  
**Low Impact**: [N]

---

## Agent Contracts Affected

### Contract 1: [agent-name].md
- **Path**: `.github/agents/[agent-name].md`
- **Change Type**: [structural/content/binding]
- **Impact**: [description of how contract is affected]
- **Authority**: [AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md or other]
- **Ripple Required**: [yes/no]

### Contract 2: [agent-name].md
- **Path**: `.github/agents/[agent-name].md`
- **Change Type**: [structural/content/binding]
- **Impact**: [description of how contract is affected]
- **Authority**: [AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md or other]
- **Ripple Required**: [yes/no]

**OR**

- [ ] No agent contracts affected by this PR

---

## Ripple Impact Analysis

### Files Requiring Updates

1. **File**: `.agent` (repository contract)
   - **Reason**: [why this file needs updating]
   - **Change Type**: [add binding/update reference/etc.]
   - **Priority**: [high/medium/low]

2. **File**: `governance/alignment/GOVERNANCE_ALIGNMENT.md`
   - **Reason**: [why this file needs updating]
   - **Change Type**: [update alignment status/add reference]
   - **Priority**: [high/medium/low]

3. **File**: `.github/agents/[agent-name].md`
   - **Reason**: [why this file needs updating]
   - **Change Type**: [add binding/update section]
   - **Priority**: [high/medium/low]

[... Continue for all ripple files ...]

### Ripple Execution Plan
- [ ] Ripple 1: [file] - [change description]
- [ ] Ripple 2: [file] - [change description]
- [ ] Ripple 3: [file] - [change description]

**OR**

- [ ] No ripples required for this PR

---

## Workflows Affected

### Workflow 1: [workflow-name].yml
- **Path**: `.github/workflows/[workflow-name].yml`
- **Change Type**: [add job/modify job/remove job/change trigger]
- **Impact**: [description of workflow impact]
- **Testing Required**: [yes/no and what type]

**OR**

- [ ] No workflows affected by this PR

---

## Gates Affected

### Gate 1: [gate-name]
- **Type**: [PR gate/merge gate/quality gate]
- **Change**: [description of gate change]
- **Impact**: [HIGH/MEDIUM/LOW]
- **Validation Required**: [what validation is needed]

**OR**

- [ ] No gates affected by this PR

---

## Compliance Requirements

### Requirement 1: [Compliance Name]
- **Authority**: [governance document reference]
- **Requirement**: [what must be done]
- **Status**: [met/pending/blocked]
- **Evidence**: [where evidence is provided]

### Requirement 2: [Compliance Name]
- **Authority**: [governance document reference]
- **Requirement**: [what must be done]
- **Status**: [met/pending/blocked]
- **Evidence**: [where evidence is provided]

**OR**

- [ ] No additional compliance requirements for this PR

---

## Cross-Repository Impact

**Does this change affect other repositories?**
- [ ] Yes - affects [repo-name] (document impact below)
- [ ] No - change is local to this repository only

### If Yes - Other Repositories Affected

**Repository**: [org]/[repo-name]
- **Impact Type**: [governance layerdown/shared library/API contract]
- **Action Required**: [what needs to be done in other repo]
- **Coordination**: [who needs to be notified]
- **Timeline**: [when coordination is needed]

---

## Scan Completeness Verification

- [ ] All governance documents reviewed for touchpoints
- [ ] All agent contracts reviewed for impact
- [ ] All ripple files identified
- [ ] All workflows reviewed for changes
- [ ] All gates reviewed for impact
- [ ] All compliance requirements identified
- [ ] Cross-repository impact assessed
- [ ] Scan is complete and accurate

---

## Scan Sign-Off

**Scanned by**: [agent-name]  
**Role**: [agent role/contract]  
**Date**: [YYYY-MM-DD]  
**Authority**: AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md (Tier-0, Constitutional)

**I certify that this governance scan is complete and accurate to the best of my knowledge.**

---

## Notes

[Any additional context, special considerations, or clarifications about the governance scan]

---

**Scan Version**: 1.0.0 (based on PREHANDOVER_PROOF Template v2.0.0)
