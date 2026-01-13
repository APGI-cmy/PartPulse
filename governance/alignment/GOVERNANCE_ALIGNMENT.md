# Governance Alignment

## Current Governance Version

**Governance Repository Version**: 7dc8110ce2477e1eb441eb905c56951090df36ed  
**Layer-Down Date**: 2026-01-11  
**Layer-Down Authority**: Governance Liaison Agent (FPC Layer-Down)  
**Status**: Aligned

## Canonical Source

**Repository**: `maturion-foreman-governance`  
**Branch**: `main`  
**Location**: `https://github.com/APGI-cmy/maturion-foreman-governance`

## Layer-Down History

| Date | Governance Version | Changes Applied | Authority |
|------|-------------------|-----------------|-----------|
| 2026-01-13 | v2.2.0 | Agent Contract Management Protocol (Tier-0) layer-down - Constitutional self-modification prohibition, instruction system, contract modification template | Governance Liaison Agent |
| 2026-01-13 | v2.1.0 | Agent Test Execution Protocol & BL-026 (T0-015) layer-down - CI-confirmatory-not-diagnostic principle, local test execution required, builder attestations | Governance Liaison Agent |
| 2026-01-12 | v1.1.0 | .agent File Governance - 4 canonical documents layered down, .agent file schema compliance achieved | Governance Liaison Agent |
| 2026-01-12 | 2.0.0 | Execution Bootstrap Protocol layer-down - 7-step verification, PREHANDOVER_PROOF, monitoring infrastructure | Governance Liaison Agent |
| 2026-01-11 | 7dc8110ce | FPC layer-down process applied - directory structure completed, alignment tracking established | Governance Liaison Agent |
| 2026-01-09 | 2.0.0 | Initial governance framework with learning integration | ForemanApp Agent |
| 2025-12-16 | 1.0.0 | Governance framework established | ForemanApp Agent |

## Drift Detection

**Last Check**: 2026-01-13  
**Status**: No drift detected  
**Next Scheduled Check**: 2026-02-11 (monthly review)

## FPC Layer-Down Compliance

This repository has completed the **First Point of Contact (FPC) Repository Layer-Down** process as defined in `governance/canon/FPC_REPOSITORY_LAYERDOWN_GUIDE.md` v1.0.0.

**FPC Compliance Status**: ✅ COMPLETE

**Key FPC Phases Completed**:
- Phase 1: Directory structure setup ✅
- Phase 2: Core governance files ✅
- Phase 3: PR gate workflows ✅ (pre-existing)
- Phase 4: Agent contracts ✅ (pre-existing, 9 agents)
- Phase 5: Governance policies & schemas ✅
- Phase 6: Latest learnings integration ✅
- Phase 7: Repository-specific mapping ✅
- Phase 8: Branch protection & activation ✅ (pre-existing)

## Repository Classification

**Repository Type**: Application (Next.js Full-Stack)  
**Primary Domain**: Parts Management / Inventory Control  
**Governance Scope**: Full (FM + Builders + QA + Governance Liaison)

**Agent Roster**:
1. ForemanApp Agent (v4.0.0) - Orchestration authority
2. Governance Liaison Agent (v2.2.0) - Governance enforcement
3. API Builder - Backend development
4. UI Builder - Frontend development
5. QA Builder - Quality assurance
6. Schema Builder - Database schema management
7. Integration Builder - Integration development
8. CodexAdvisor Agent - Advisory services

---

## Execution Bootstrap Protocol (v2.0.0)

**Effective Date**: 2026-01-12  
**Compliance Deadline**: 2026-02-11  
**Status**: Active and Mandatory

### Protocol Overview

The Execution Bootstrap Protocol mandates a **7-step verification process** before agent handover:

1. Identify ALL CI jobs from workflow files
2. Execute EVERY command locally
3. Document results for EACH command
4. Fix ALL failures
5. Verify 100% pass rate
6. Wait for GitHub Actions completion
7. Create PREHANDOVER_PROOF

### Implementation Status

- [x] Protocol document created (`governance/canon/EXECUTION_BOOTSTRAP_PROTOCOL.md`)
- [x] PREHANDOVER_PROOF template created (`governance/templates/PREHANDOVER_PROOF_TEMPLATE.md`)
- [x] Monitoring infrastructure created (`governance/incidents/protocol-violations/`)
- [x] Quarterly report template created
- [x] All agent contracts updated (FM + 5 builders + governance liaison)
- [x] Onboarding materials updated
- [x] Governance alignment documented
- [ ] First quarterly report (due 2026-04-14)

### Agent Obligations

**All agents** creating/modifying workflows, gates, or execution artifacts MUST:
- Execute complete 7-step verification
- Provide PREHANDOVER_PROOF as PR comment
- Wait for CI completion before claiming green
- Document any limitations with justification

**Foreman Agent** MUST:
- Verify builder provided PREHANDOVER_PROOF (Category 4 checklist)
- Validate proof completeness
- Block merge if proof incomplete or invalid

### Monitoring

**Metrics Tracked**:
- PREHANDOVER_PROOF completion rate
- Protocol violations by type
- Agent compliance rate
- False positive rate (proof claims green but CI fails)

**Reporting**: Quarterly reports submitted to Governance Administrator
- Q2 2026: Due 2026-04-14
- Q3 2026: Due 2026-07-14
- Q4 2026: Due 2026-10-14

### Violations

All violations tracked in `governance/incidents/protocol-violations/` with:
- Incident date and PR number
- Agent and violation type
- Impact and remediation
- Prevention measures

**Escalation**: Pattern violations escalate to Repository Owner

---

## .agent File Governance (v1.1.0)

**Effective Date**: 2026-01-12  
**Layer-Down Date**: 2026-01-12  
**Status**: COMPLETE

### Documents Layered Down

1. **AGENT_FILE_SCHEMA.md** → `governance/schemas/AGENT_FILE_SCHEMA.md`
   - Version: 1.0.0
   - Purpose: Comprehensive specification for repository `.agent` files
   - Authority: Supreme - Canonical

2. **AGENT_FILE_BINDING_REQUIREMENTS.md** → `governance/canon/AGENT_FILE_BINDING_REQUIREMENTS.md`
   - Version: 1.0.0
   - Purpose: Define mandatory and optional bindings for `.agent` files
   - Authority: Supreme - Canonical

3. **AGENT_FILE_VALIDATION.md** → `governance/runbooks/AGENT_FILE_VALIDATION.md`
   - Version: 1.0.0
   - Purpose: 4-level validation process for `.agent` files
   - Authority: Canonical

4. **AGENT_FILE_MAINTENANCE.md** → `governance/runbooks/AGENT_FILE_MAINTENANCE.md`
   - Version: 1.0.0
   - Purpose: Maintenance protocol for `.agent` files
   - Authority: Canonical

### Validation Status

Complete 4-level validation executed per AGENT_FILE_VALIDATION.md:

- ✅ **Level 1 (Syntax)**: PASS - File exists, YAML parseable, no syntax errors
- ✅ **Level 2 (Schema)**: PASS - All required fields and sections present, constraint values correct
- ✅ **Level 3 (Semantic)**: PASS - Canonical references valid, all bindings verified, agent contracts exist
- ✅ **Level 4 (Alignment)**: PASS - No duplication, bindings relevant, consistent with contracts

**Validation Evidence**: `governance/evidence/initialization/AGENT_FILE_VALIDATION_RESULTS.md`

### .agent File Updates Applied

**Required Sections Added**:
- `capabilities` section (6 fields)
- `constraints` section (6 mandatory constraints)
- `enforcement` section (3 enforcement rules)

**Bindings Added**:
- `execution-bootstrap-protocol` (governance/canon/EXECUTION_BOOTSTRAP_PROTOCOL.md)
- `fm-merge-gate-management` (governance/canon/T0-014_FM_MERGE_GATE_MANAGEMENT_CANON.md)

**Workflow Gates Fixed**:
- Removed: `qa-enforcement-v2` (workflow file deleted in PR #148)
- Added: `deprecation-detection` (governance/canon/AUTOMATED_DEPRECATION_DETECTION_GATE.md)
- Updated branch protection required_checks accordingly

**Total Bindings**: 24 (up from 22)

### Schema Compliance

✅ **Repository `.agent` file is now fully compliant** with:
- AGENT_FILE_SCHEMA.md v1.0.0
- AGENT_FILE_BINDING_REQUIREMENTS.md v1.0.0

**Repository Type**: Application (Next.js Full-Stack) with FM + Builders  
**Mandatory Bindings Met**: All application-type mandatory bindings present

### Outstanding Items

**Future Layer-Down Needed**:
- Some Tier-0 canonical documents not yet present in local governance/canon (governance-purpose-scope, governance-ripple-model)
- Will be addressed in future canonical governance synchronization

**Next Review**: 2026-04-12 (quarterly validation per AGENT_FILE_MAINTENANCE.md)

---

## Agent Test Execution Protocol & BL-026 (v2.1.0)

**Effective Date**: 2026-01-13  
**Layer-Down Date**: 2026-01-13  
**Compliance Deadline**: 2026-01-27  
**Status**: ACTIVE - Training Pending

### Protocol Overview

Two critical protocols layered down simultaneously:

1. **Agent Test Execution Protocol** (governance/runbooks/AGENT_TEST_EXECUTION_PROTOCOL.md)
   - Core Principle: CI is confirmation, NOT diagnostic
   - Requires local test execution before PR creation
   - Mandates PREHANDOVER_PROOF Section 3 evidence
   - 100% pass rate or documented legitimate exceptions

2. **BL-026 (T0-015): Automated Deprecation Detection** (governance/policy/AUTOMATED_DEPRECATION_DETECTION_GATE.md)
   - Constitutional Tier-0 requirement
   - Zero deprecated APIs without FM approval
   - Pre-commit and CI gate enforcement
   - Learning ID: BL-026

### Implementation Status

- [x] Protocol document created (`governance/runbooks/AGENT_TEST_EXECUTION_PROTOCOL.md`)
- [x] .agent file updated with `runbooks` section and BL-026 Tier-0 binding
- [x] PREHANDOVER_PROOF template updated with Section 3 (Test Execution Evidence)
- [x] All 5 builder contracts updated (API, UI, QA, Schema, Integration)
- [x] Attestation tracking document created (`governance/evidence/attestations/test-execution-protocol-attestations.md`)
- [x] Governance event created (`governance/events/2026-01-13-agent-test-execution-bl026-layerdown.md`)
- [x] Governance alignment updated
- [x] Deprecation check validated locally (exit code 0)
- [ ] Training session scheduled by FM
- [ ] All builder attestations collected
- [ ] First 5 PRs validated for compliance

### Builder Requirements

**BEFORE creating ANY PR**, builders MUST:
1. Execute ALL tests locally: `npm run test`, `npm run lint`, `npm run lint:deprecation`
2. Fix ALL failures immediately (no "will fix in CI")
3. Document results in PREHANDOVER_PROOF Section 3
4. Achieve 100% pass rate or document legitimate exceptions
5. Include test execution attestation

**Non-Replicable Tests**: Document what cannot run locally, why, what was attempted, alternative validation

**Deprecation (BL-026)**: MUST run `npm run lint:deprecation` and achieve 0 deprecated APIs. No exceptions without FM approval.

### Attestation Status

**Total Builders**: 5 (API, UI, QA, Schema, Integration)  
**Attestations Complete**: 0  
**Attestations Pending**: 5  
**Training Scheduled**: To be scheduled by FM (before 2026-01-27)  
**Task Assignment**: BLOCKED for all builders until attestation complete

**Attestation Requirements**:
- Attend mandatory training session
- Sign attestation for both protocols
- Attestations tracked in `governance/evidence/attestations/test-execution-protocol-attestations.md`

### FM Responsibilities

- Schedule synchronous training session for all builders
- Conduct 45-60 minute training covering both protocols
- Collect and file builder attestations
- Enforce PREHANDOVER_PROOF Section 3 requirements in all PR reviews
- Block task assignment for builders without attestation
- Review first 5 PRs with extra scrutiny
- Escalate violations to Governance Liaison

### Enforcement Rules

**Test Execution Protocol**:
- PR rejected if PREHANDOVER_PROOF Section 3 missing
- PR rejected if test execution evidence incomplete
- Builder re-training required after violations
- Task assignment blocked until re-training complete

**BL-026 Deprecation**:
- Pre-commit hook blocks commits with deprecated APIs
- CI gate blocks PRs with deprecation violations
- No exceptions without FM written approval
- Violations = catastrophic (constitutional Tier-0)

### Validation Evidence

**Local Validation**:
- Deprecation check executed: `npm run lint:deprecation` → Exit code 0 ✅
- Zero deprecated APIs detected
- Pre-commit hooks operational
- CI workflow confirmed operational

**CI Validation**:
- `.github/workflows/deprecation-detection.yml` active
- Gate included in branch protection
- BL-026 policy document present

### Next Milestones

1. FM schedules training (target: week of 2026-01-20)
2. Training conducted, attestations collected
3. First 5 PRs post-training validated
4. Quarterly compliance review (2026-04-13)

---

## Agent Contract Management Protocol (v2.2.0)

**Effective Date**: 2026-01-13  
**Layer-Down Date**: 2026-01-13  
**Status**: ACTIVE - Constitutional (Tier-0)

### Protocol Overview

The **Agent Contract Management Protocol** establishes constitutional rules for agent contract modification, explicitly prohibiting agents from writing to their own contract files.

**Key Documents Layered Down**:

1. **AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md** → `governance/canon/AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md`
   - Version: 1.0.0
   - Tier: 0 (Constitutional)
   - Purpose: Define self-modification prohibition and instruction system
   - Authority: Supreme - Canonical

2. **AGENT_CONTRACT_MODIFICATION_REQUEST.template.md** → `governance/templates/AGENT_CONTRACT_MODIFICATION_REQUEST.template.md`
   - Version: 1.0.0
   - Purpose: Template for contract modification requests via instruction system
   - Authority: Canonical

### Core Principle

**ABSOLUTE PROHIBITION**: Agents MUST NOT modify their own contract files under ANY circumstances.

> "I enforce governance. I do NOT define my own authority."

### Implementation Status

- [x] Protocol document created (`governance/canon/AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md`)
- [x] Modification request template created (`governance/templates/AGENT_CONTRACT_MODIFICATION_REQUEST.template.md`)
- [x] Governance-liaison contract updated with explicit prohibition (v2.2.0)
- [x] .agent file updated with protocol binding
- [x] Governance visibility event created (`governance/events/2026-01-13-agent-contract-management-protocol-layerdown.md`)
- [x] Governance alignment updated
- [ ] All agents acknowledge prohibition
- [ ] First contract modification request processed via instruction system

### Governance Liaison Specific Prohibition

**EXPLICITLY PROHIBITED from**:
- ❌ Writing to `.github/agents/governance-liaison.md`
- ❌ Modifying own contract in any form (direct edits, templates, mechanical fixes, ripple updates)
- ❌ Applying automated updates to own contract file
- ❌ Bypassing prohibition for any reason

**ALLOWED Actions**:
- ✅ Read and reference own contract for self-awareness
- ✅ Identify contract gaps and submit modification requests
- ✅ Modify OTHER agents' contracts (when authorized)
- ✅ Escalate contract conflicts or ambiguities

### Instruction System

**Process for Contract Modifications**:
1. Agent identifies contract modification need
2. Agent creates modification request using template
3. Agent submits via GitHub issue with label `contract-modification`
4. Authority reviews and approves/rejects
5. Authority executes modification OR delegates to authorized agent
6. Modification is documented and tracked

**Authority Hierarchy**:
- **Human Governance (Johan Ras)**: Ultimate authority for ALL contract modifications
- **Foreman (FM)**: Delegated authority for builder contracts ONLY
- **Governance Liaison**: Delegated authority for governance-driven updates (CANNOT modify own contract)

### Enforcement

**Validation**:
- All PRs modifying agent contracts MUST be reviewed by authority
- Reviewers MUST verify agent is not modifying its own contract
- Modification request reference required

**Consequences of Violation**:
- Self-modification attempt = CATASTROPHIC governance violation
- PR rejected immediately
- Escalate to Human Governance
- Root cause analysis required
- Agent retraining or contract revision

### Ripple Awareness

All contract modification requests MUST include ripple impact analysis per AGENT_RIPPLE_AWARENESS_OBLIGATION.md:
- Affected agents
- Affected workflows
- Affected governance documents
- Breaking vs non-breaking classification
- Remediation plan

### Next Steps

1. **All Agents**: Review AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md
2. **Governance Liaison**: Acknowledge self-modification prohibition
3. **FM**: Understand contract modification approval authority
4. **Human Governance**: Monitor for compliance

---

**Governance Liaison Agent**: governance-liaison.md (v2.2.0)
