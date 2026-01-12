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
| 2026-01-12 | v1.1.0 | .agent File Governance - 4 canonical documents layered down, .agent file schema compliance achieved | Governance Liaison Agent |
| 2026-01-12 | 2.0.0 | Execution Bootstrap Protocol layer-down - 7-step verification, PREHANDOVER_PROOF, monitoring infrastructure | Governance Liaison Agent |
| 2026-01-11 | 7dc8110ce | FPC layer-down process applied - directory structure completed, alignment tracking established | Governance Liaison Agent |
| 2026-01-09 | 2.0.0 | Initial governance framework with learning integration | ForemanApp Agent |
| 2025-12-16 | 1.0.0 | Governance framework established | ForemanApp Agent |

## Drift Detection

**Last Check**: 2026-01-11  
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
2. Governance Liaison Agent (v2.0.0) - Governance enforcement
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

**Governance Liaison Agent**: governance-liaison.md (v2.0.0)
