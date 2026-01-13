# Agent Contract Modification Request

**Template Version**: 1.0.0  
**Authority**: AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md  
**Purpose**: Request modification to agent contract file via instruction system

---

## Request Metadata

**Agent ID**: [e.g., "governance-liaison", "ui-builder", "api-builder"]  
**Contract File**: [e.g., ".github/agents/governance-liaison.md"]  
**Request Date**: [YYYY-MM-DD]  
**Requested By**: [Agent ID or Human Name]  
**Request Type**: [Scope Expansion | Capability Addition | Binding Update | Constraint Modification | Authority Clarification | Bug Fix | Other]

---

## Modification Need

### Description
[Clear description of why contract modification is needed. Include context about what triggered this request.]

### Problem Statement
[What specific problem or gap does this modification address?]

### Impact if Not Addressed
[What happens if this modification is not made? What is blocked or broken?]

---

## Current Contract State

### Current Language
[Quote or reference the exact current contract language that needs modification]

```markdown
[Paste relevant section from current contract]
```

### Location
[Section number and/or line numbers in contract file]

---

## Proposed Modification

### Proposed Language
[Provide the exact proposed changes, preferably in diff format]

```diff
- [Old text to be removed]
+ [New text to be added]
```

### Alternative Formulations (Optional)
[If there are alternative ways to address the need, list them here]

---

## Justification

### Governance Basis
[Which governance document(s) support or require this modification?]

### Precedent
[Are there similar modifications in other agent contracts? Reference them.]

### Alignment with Canonical Governance
[How does this modification align with canonical governance principles?]

---

## Ripple Impact Analysis

**Mandatory Section** (per AGENT_RIPPLE_AWARENESS_OBLIGATION.md)

### Affected Agents
[List other agents whose contracts or behavior will be affected by this modification]
- Agent: [Agent ID]
  - Impact: [Description of impact]
  - Action Required: [What needs to happen to this agent]

### Affected Workflows
[List workflows that validate against or depend on this contract]
- Workflow: [Workflow file path]
  - Impact: [Description of impact]
  - Action Required: [Any workflow updates needed]

### Affected Governance
[List governance documents that reference this contract]
- Document: [Document path]
  - Impact: [Description of impact]
  - Action Required: [Any documentation updates needed]

### Affected Files (Other)
[List any other files that will be affected by this modification]
- File: [File path]
  - Impact: [Description of impact]
  - Action Required: [What needs to happen to this file]

### Breaking vs Non-Breaking
[Classification: Breaking | Non-Breaking | Potentially Breaking]

**Explanation**: [Why this classification applies]

### Remediation Plan
[If breaking or high-impact, describe how ripples will be addressed]

---

## Authority Request

### Requested Approval Authority
[Who should approve this modification?]
- [ ] Human Governance (Johan Ras) — **Required for constitutional changes**
- [ ] Foreman (FM) — **For builder contract changes (if delegated)**
- [ ] Governance Liaison — **For governance-driven updates (if delegated)**
- [ ] Other: [Specify]

### Authority Basis
[Why is this the appropriate approval authority for this modification?]

### Escalation Path
[If primary authority rejects or cannot decide, who is the escalation path?]

---

## Implementation Plan

### Execution Approach
[How will this modification be implemented if approved?]
- [ ] Authority executes modification directly
- [ ] Authority delegates to authorized agent: [Agent ID]
- [ ] Requires coordination with multiple parties: [List]

### Timeline
[When does this modification need to be completed?]
- **Urgency**: [Critical | High | Medium | Low]
- **Target Date**: [YYYY-MM-DD or "As soon as approved"]

### Dependencies
[Are there any dependencies that must be completed before or after this modification?]

---

## Review Checklist (For Approving Authority)

**Authority must verify**:
- [ ] Modification need is clearly justified
- [ ] Current contract state is accurately represented
- [ ] Proposed modification is specific and actionable
- [ ] Ripple impact analysis is complete and accurate
- [ ] Remediation plan addresses all identified ripples
- [ ] Modification aligns with canonical governance
- [ ] Modification does not violate constitutional prohibitions
- [ ] Modification does not weaken governance enforcement
- [ ] Appropriate authority is requested
- [ ] Implementation plan is feasible

---

## Approval Decision

**To be completed by approving authority**

### Decision
- [ ] **APPROVED** — Proceed with modification as proposed
- [ ] **APPROVED WITH CHANGES** — Proceed with modifications (see below)
- [ ] **REJECTED** — Do not proceed (see rationale below)
- [ ] **ESCALATED** — Escalate to higher authority (see escalation below)

### Approval Date
[YYYY-MM-DD]

### Approved By
[Name and Role]

### Modifications to Proposal (if approved with changes)
[Describe any changes to the proposed modification]

### Rejection Rationale (if rejected)
[Explain why this modification is being rejected]

### Escalation Target (if escalated)
[Who is this being escalated to and why?]

### Special Conditions or Notes
[Any additional conditions, timelines, or requirements]

---

## Execution Documentation

**To be completed after modification is executed**

### Execution Date
[YYYY-MM-DD]

### Executed By
[Name and Role]

### Commit Reference
[Git commit SHA or PR number]

### Ripple Remediation Status
[Status of addressing ripple effects identified above]
- [ ] All ripple effects addressed
- [ ] Partial — remaining work tracked in: [Issue/PR reference]
- [ ] Deferred — justification: [Explain]

### Governance Event Created
[If high-impact, reference governance event document]
- [ ] Yes — Path: [governance/events/YYYY-MM-DD-description.md]
- [ ] No — Justification: [Low impact, no event required]

---

## Related References

### Related Issues/PRs
[List any related GitHub issues or pull requests]

### Related Contract Modification Requests
[List any related or dependent contract modification requests]

### Governance Documents Referenced
[List all governance documents referenced in this request]

---

## Notes and Context

[Any additional context, background, or notes that don't fit in other sections]

---

**Template Version**: 1.0.0  
**Template Authority**: governance/canon/AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md  
**Template Path**: governance/templates/AGENT_CONTRACT_MODIFICATION_REQUEST.template.md  
**Last Updated**: 2026-01-13
