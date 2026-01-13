# AGENT CONTRACT MANAGEMENT PROTOCOL

## Status
**Type**: Constitutional Governance Protocol  
**Authority**: Supreme - Canonical  
**Version**: 1.0.0  
**Effective Date**: 2026-01-13  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Tier**: 0 (Constitutional)  
**Part of**: Agent Contract Governance Framework

---

## 1. Purpose

This protocol establishes **constitutional rules for agent contract modification**, explicitly prohibiting agents from writing to their own contract files and establishing the instruction system for contract changes.

**Core Principle**: **Agents MUST NOT modify their own contracts.** Contracts are authority-defining documents that require external oversight and human approval.

**Key Concepts**:
- **Agent Contract** = The `.md` file in `.github/agents/` that defines an agent's authority, scope, and obligations
- **Self-Modification Prohibition** = Agents cannot write to their own contract files
- **Instruction System** = The process by which agents request contract modifications
- **Contract Authority** = Human governance (Johan Ras) has final authority over contract changes

**Related Documents**:
- **AGENT_CONSTITUTION.md** - Agent obligations and boundaries
- **AGENT_RECRUITMENT.md** - Agent legitimacy and authority
- **AGENT_FILE_BINDING_REQUIREMENTS.md** - Repository `.agent` file binding rules
- **AGENT_RIPPLE_AWARENESS_OBLIGATION.md** - Ripple awareness requirements

---

## 2. Constitutional Authority

This protocol derives authority from:
- **BUILD_PHILOSOPHY.md** — Supreme constitutional authority
- **AGENT_CONSTITUTION.md** — Agent obligations, boundaries, and authority
- **AGENT_RECRUITMENT.md** — Agent legitimacy and appointment
- **governance-supremacy-rule.md** — Governance as absolute authority

**Precedence**: This protocol is **Tier-0 Constitutional** and takes precedence over all agent contracts.

---

## 3. Scope

### 3.1 In Scope
- Prohibition on agent self-modification of contracts
- Instruction system for contract modification requests
- Authority model for contract changes
- Contract modification workflow
- Ripple awareness for contract changes

### 3.2 Out of Scope
- Repository `.agent` file modifications (covered by AGENT_FILE_BINDING_REQUIREMENTS.md)
- Agent profile modifications (covered by separate protocol)
- Workflow and CI/CD modifications (covered by execution protocols)
- Code and feature modifications (covered by builder protocols)

---

## 4. Core Prohibition: No Self-Modification

### 4.1 The Self-Modification Problem

**Problem Statement**: Agents modifying their own contracts creates a conflict of interest and governance risk:
- Agents could expand their own scope without oversight
- Agents could remove constraints or prohibitions
- Agents could weaken enforcement mechanisms
- Agents could bypass governance boundaries

**Principle**: **An agent MUST NOT modify the contract file that defines its own authority.**

### 4.2 Absolute Prohibition

**Rule**: Agents are **PROHIBITED** from writing to their own contract files under all circumstances.

**Applies To**:
- **Governance Liaison**: Cannot modify `.github/agents/governance-liaison.md`
- **Foreman (FM)**: Cannot modify `.github/agents/ForemanApp-agent.md`
- **Builders**: Cannot modify their respective builder contract files
- **Domain Agents**: Cannot modify their respective domain contract files
- **Advisors**: Cannot modify their respective advisor contract files

**NO EXCEPTIONS**: This prohibition has no exceptions and cannot be waived.

### 4.3 What "Writing" Means

**Prohibited Actions**:
- ✗ Direct edits to own contract file
- ✗ Automated updates to own contract file
- ✗ Mechanical fixes (formatting, typos) to own contract file
- ✗ Template application to own contract file
- ✗ Ripple-driven updates to own contract file
- ✗ "Read-only verification" that includes writes

**Allowed Actions**:
- ✓ Reading own contract file (for self-awareness)
- ✓ Proposing changes via instruction system (see Section 5)
- ✓ Documenting contract gaps or inconsistencies
- ✓ Escalating contract conflicts or ambiguities
- ✓ Modifying OTHER agents' contracts (if authorized by role)

### 4.4 Multi-Agent Contract Modifications

**Cross-Agent Modifications**: An agent MAY modify another agent's contract IF:
- The modifying agent has explicit authority (e.g., Governance Liaison)
- The modification is part of a governance ripple or layerdown
- The modification is approved via the instruction system
- The modification is documented with ripple awareness

**Example**: Governance Liaison MAY modify builder contracts as part of a governance layerdown, but Governance Liaison MUST NOT modify `.github/agents/governance-liaison.md`.

---

## 5. Contract Modification Instruction System

### 5.1 Purpose of Instruction System

When an agent identifies a need to modify its own contract, it must use the **instruction system** to request the change through external oversight.

**Instruction System Flow**:
1. Agent identifies contract modification need
2. Agent documents modification request
3. Agent submits request to appropriate authority
4. Authority reviews and approves/rejects
5. Authority executes modification OR delegates to authorized agent
6. Modification is documented and tracked

### 5.2 When to Use Instruction System

Agents **MUST** use the instruction system when:
- Contract scope needs expansion or clarification
- Contract bindings need updating
- Contract capabilities need adjustment
- Contract constraints need modification
- Contract authority boundaries need clarification
- Contract conflicts with canonical governance emerge

### 5.3 Instruction System Structure

#### 5.3.1 Modification Request Format

```markdown
## Agent Contract Modification Request

**Agent**: [Agent ID, e.g., "governance-liaison"]  
**Contract File**: [Path, e.g., ".github/agents/governance-liaison.md"]  
**Request Date**: [YYYY-MM-DD]  
**Requested By**: [Agent or Human]

### Modification Need
[Clear description of why contract modification is needed]

### Current Contract State
[Quote or reference current contract language that needs modification]

### Proposed Modification
[Specific changes proposed, preferably in diff format]

### Justification
[Why this modification is necessary, what governance gap it addresses]

### Ripple Impact Analysis
[What other files, agents, or processes will be affected by this change]

### Authority Request
[What authority is needed to approve this modification]
```

#### 5.3.2 Submission Channels

**Option 1: GitHub Issue**
- Create issue in repository with label `contract-modification`
- Use template above
- Assign to appropriate authority (FM or human governance)

**Option 2: Pull Request Comment**
- Add comment to PR where contract conflict was discovered
- Use template above
- Tag appropriate authority

**Option 3: Escalation Document**
- Create markdown file in `governance/requests/` or `governance/escalations/`
- Use template above
- Reference in PR or commit message

### 5.4 Authority for Contract Modifications

**Authority Hierarchy**:

1. **Human Governance (Johan Ras)**: Ultimate authority for ALL contract modifications
   - Constitutional contract changes (scope, authority, prohibitions)
   - Cross-repository contract changes
   - Breaking contract changes
   - Conflict resolution

2. **Foreman (FM)**: Delegated authority for builder contracts ONLY
   - Builder scope adjustments within established boundaries
   - Builder capability enablement (when pre-authorized)
   - Builder contract updates from governance ripples
   - MUST NOT modify FM's own contract

3. **Governance Liaison**: Delegated authority for governance-driven updates
   - Contract updates from canonical governance layerdowns
   - Contract binding additions from governance ripple
   - Template application to OTHER agents' contracts
   - MUST NOT modify Governance Liaison's own contract

**Default**: If authority is unclear, escalate to Human Governance.

### 5.5 Approval Process

**Step 1: Request Submission**
- Agent submits modification request via instruction system
- Request includes all required sections (see 5.3.1)
- Request is assigned to appropriate authority

**Step 2: Authority Review**
- Authority reviews modification need and justification
- Authority validates ripple impact analysis
- Authority checks for governance conflicts
- Authority determines if modification is within delegated scope

**Step 3: Approval Decision**
- **APPROVED**: Authority authorizes modification
- **APPROVED WITH CHANGES**: Authority modifies request and approves
- **REJECTED**: Authority rejects with rationale
- **ESCALATED**: Authority escalates to higher authority

**Step 4: Execution**
- If approved, authority executes modification OR delegates to authorized agent
- Modification is committed with reference to approval
- Ripple effects are addressed

**Step 5: Documentation**
- Modification request and approval are documented
- PR includes reference to instruction system request
- Governance events created if high-impact

---

## 6. Standing Contract Modification Prohibition

### 6.1 Governance Liaison Specific Prohibition

**Governance Liaison agents are EXPLICITLY PROHIBITED from**:
- Writing to `.github/agents/governance-liaison.md`
- Modifying their own contract in any form
- Applying templates or mechanical fixes to their own contract
- Updating their own contract as part of governance ripple

**Mindset Requirement**: Governance Liaison must internalize:
> "I enforce governance. I do NOT define my own authority."

**What Governance Liaison CAN Do**:
- Read and reference own contract for self-awareness
- Identify contract gaps and submit modification requests
- Modify OTHER agents' contracts (when part of governance layerdown)
- Escalate contract conflicts or ambiguities

### 6.2 Enforcement

**Validation**:
- PRs modifying governance-liaison.md MUST NOT be authored by governance-liaison
- Git history checks for contract modifications
- Code review catches self-modification attempts

**Consequences of Violation**:
- PR is rejected with CATASTROPHIC violation flag
- Incident is escalated to Human Governance
- Root cause analysis required
- Agent retraining or contract revision may be required

---

## 7. Contract Modification Workflow Examples

### 7.1 Example: Governance Liaison Requests Scope Expansion

**Scenario**: Governance Liaison discovers that its contract prohibits modifying workflow files, but a governance layerdown requires workflow updates.

**Workflow**:
1. **Identification**: Governance Liaison identifies scope gap
2. **Documentation**: GL creates modification request:
   ```markdown
   ## Agent Contract Modification Request
   
   **Agent**: governance-liaison  
   **Contract File**: .github/agents/governance-liaison.md  
   **Request Date**: 2026-01-15
   
   ### Modification Need
   Governance layerdown protocol requires updating deprecation-detection workflow,
   but current contract prohibits workflow modifications.
   
   ### Proposed Modification
   Add to `scope.allowed_paths`:
   - ".github/workflows/deprecation-detection.yml" # Governance-driven only
   
   ### Justification
   AUTOMATED_DEPRECATION_DETECTION_GATE.md (BL-026) requires workflow updates
   as part of governance ripple. Current scope prohibits this.
   
   ### Ripple Impact Analysis
   - No ripple to other agents
   - Workflow modification is limited to governance-driven changes
   - Does not expand general workflow modification authority
   
   ### Authority Request
   Human governance approval required (constitutional scope change)
   ```
3. **Submission**: GL creates GitHub issue with `contract-modification` label
4. **Review**: Johan reviews and approves (or requests FM review)
5. **Execution**: Johan modifies governance-liaison.md OR delegates to FM
6. **Documentation**: Approval documented in issue, PR references issue

### 7.2 Example: Builder Requests Capability Addition

**Scenario**: UI Builder discovers it cannot modify test configuration files, which blocks QA work.

**Workflow**:
1. **Identification**: UI Builder identifies capability gap
2. **Documentation**: Builder creates modification request (escalated to FM)
3. **Submission**: Builder adds request to PR comment, tags FM
4. **Review**: FM reviews and determines if within delegated authority
5. **Approval**: FM approves (if within scope) or escalates to Johan
6. **Execution**: FM modifies ui-builder.md contract
7. **Documentation**: FM documents approval in PR, updates builder contract

### 7.3 Example: Governance Ripple Requires Contract Updates

**Scenario**: Canonical governance adds new mandatory binding to AGENT_FILE_BINDING_REQUIREMENTS.md.

**Workflow**:
1. **Governance Ripple**: New binding requirement propagates to execution repo
2. **Governance Liaison**: GL identifies need to update ALL agent contracts
3. **Authority Check**: GL confirms authority to modify OTHER agents' contracts
4. **Execution**: GL updates builder, domain, and advisor contracts
5. **Self-Modification Check**: GL STOPS before modifying governance-liaison.md
6. **Instruction System**: GL creates modification request for own contract
7. **Review**: Johan reviews and approves
8. **Execution**: Johan modifies governance-liaison.md
9. **Documentation**: Governance event documents ripple completion

---

## 8. Ripple Awareness for Contract Modifications

### 8.1 Contract Changes Are Non-Local

**Principle**: Agent contract modifications have ripple effects:
- Changes affect agent behavior
- Changes may affect dependent agents
- Changes may affect enforcement workflows
- Changes may affect governance alignment

**Ripple Awareness Required**:
- Identify which agents depend on modified contract
- Identify which workflows validate against modified contract
- Identify which governance documents reference modified contract
- Surface ripple effects explicitly in modification request

### 8.2 Mandatory Ripple Analysis

All contract modification requests **MUST** include ripple impact analysis:

**Template**:
```markdown
### Ripple Impact Analysis

**Affected Agents**: [List of agents impacted by this modification]  
**Affected Workflows**: [List of workflows that validate or depend on this contract]  
**Affected Governance**: [List of governance documents that reference this contract]  
**Breaking vs Non-Breaking**: [Classification]  
**Remediation Plan**: [How ripples will be addressed]
```

### 8.3 High-Impact Contract Changes

**High-Impact Triggers**:
- Scope expansion affecting multiple agents
- Authority boundary changes
- Prohibition removals or weakenings
- Capability additions that affect enforcement

**Required Actions**:
- Escalate to Human Governance (Johan)
- Coordinate with FM and affected agents
- Create governance visibility event
- Document migration path

---

## 9. Related Systems

### 9.1 Repository `.agent` File

**Distinction**: 
- `.agent` file = Repository-level contract (defines repo identity and all agents)
- `.github/agents/*.md` = Agent-level contracts (defines individual agent authority)

**Self-Modification**:
- Agents are also RESTRICTED from modifying `.agent` file (per .agent `restricted_paths`)
- `.agent` modifications require escalation per repository contract

**Authority**: AGENT_FILE_BINDING_REQUIREMENTS.md governs `.agent` file structure and bindings.

### 9.2 Agent Profiles

**Agent Profiles** (e.g., `governance/profiles/builder.v1.md`) define **class-level** constraints.

**Modification Authority**:
- Profiles are canonical governance documents
- Profile modifications are governance ripples
- Agents do NOT modify profiles directly
- Profile changes propagate to agent contracts via governance liaison

### 9.3 Governance Canon

**Canonical governance** (e.g., `governance/canon/*.md`) defines supreme authority.

**Modification Authority**:
- Canon modifications are governance ripples from maturion-foreman-governance
- Governance Liaison layers down canon changes
- Canon changes may trigger contract modification needs
- Agents do NOT modify canon directly

---

## 10. Contract Validation and Enforcement

### 10.1 Pre-Commit Validation

**Recommended Validation** (future enhancement):
- Git pre-commit hook checks if modified file is agent's own contract
- If self-modification detected, abort commit with error message
- Direct agent to instruction system

**Current State**: Manual validation via code review.

### 10.2 Code Review Requirements

**All PRs modifying agent contracts MUST**:
- Be reviewed by authority with modification approval power
- Include modification request reference (issue, comment, or escalation doc)
- Include ripple impact analysis
- Document approval in PR description

**Reviewers MUST verify**:
- Agent is not modifying its own contract
- Modification is authorized
- Ripple awareness is complete
- Approval is documented

### 10.3 Post-Merge Validation

**After contract modification**:
- Validate contract against schema (if schema exists)
- Validate contract bindings reference valid canonical documents
- Validate contract scope does not conflict with repository `.agent` file
- Document modification in governance events (if high-impact)

---

## 11. Failure Modes and Responses

### 11.1 Self-Modification Attempt

**Failure Mode**: Agent attempts to modify its own contract file.

**Detection**:
- Code review catches self-modification
- Git history shows agent as author of own contract modification
- Validation script detects self-modification (future)

**Response**:
- REJECT PR immediately
- Flag as CATASTROPHIC governance violation
- Escalate to Human Governance
- Root cause analysis: Why did agent attempt self-modification?
- Agent retraining or contract revision

### 11.2 Unauthorized Cross-Agent Modification

**Failure Mode**: Agent modifies another agent's contract without authority.

**Detection**:
- Code review verifies modifying agent has authority
- Modification request is missing or unauthorized

**Response**:
- REJECT PR
- Request modification request via instruction system
- Escalate if agent repeatedly bypasses instruction system

### 11.3 Missing Ripple Awareness

**Failure Mode**: Contract modification proceeds without ripple impact analysis.

**Detection**:
- Code review identifies missing ripple analysis
- High-impact change lacks governance event or coordination

**Response**:
- BLOCK PR until ripple analysis completed
- Request ripple impact analysis from author
- Escalate if ripples are high-impact

---

## 12. Version History

### v1.0.0 (2026-01-13)
- Initial canonical protocol definition
- Establishes self-modification prohibition
- Defines instruction system for contract modifications
- Specifies authority model and approval workflow
- Integrates ripple awareness requirements

---

## 13. Authority Statement

**This protocol is constitutional and binding.**

All agents MUST:
- NOT modify their own contract files under any circumstances
- Use instruction system for contract modification requests
- Include ripple impact analysis in modification requests
- Obtain appropriate authority approval before contract modifications
- Document and track all contract modifications

**Governance Liaison agents are EXPLICITLY PROHIBITED from writing to `.github/agents/governance-liaison.md`.**

**Violations constitute CATASTROPHIC governance failures and must be escalated to Human Governance immediately.**

---

**Status**: Active and Enforced  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Approval Authority**: Johan Ras  
**Last Updated**: 2026-01-13

---

*End of AGENT CONTRACT MANAGEMENT PROTOCOL v1.0.0*
