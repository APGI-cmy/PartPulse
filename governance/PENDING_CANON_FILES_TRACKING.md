# Pending Canon Files - Layer-Down Tracking

**Last Updated**: 2026-02-08
**Maintained By**: governance-liaison
**Authority**: CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md

---

## Purpose

This document tracks canonical governance files that are referenced in existing governance protocols but not yet layered down to this consumer repository. This ensures we can monitor the canonical governance repository for when these files become available and execute timely layer-down operations.

---

## Tracked Canon Files

### 1. FM_ROLE_CANON.md

**Status**: 🔍 TRACKED - Not Yet Layered Down  
**Priority**: HIGH  
**Canonical Path**: `governance/canon/FM_ROLE_CANON.md` or `governance/maturion/FM_ROLE_CANON.md`

**Description**:
FM Role Canon defines the canonical role, responsibilities, and authority boundaries for Foreman (FM) agents. This is a foundational document for FM operations.

**Referenced In**:
- `governance/canon/AGENT_BASELINE_MANAGEMENT_PROTOCOL.md` (line 141, 169)
- `governance/canon/AGENT_RECRUITMENT_AND_CONTRACT_AUTHORITY_MODEL.md` (multiple)
- `governance/canon/AGENT_RIPPLE_AWARENESS_OBLIGATION.md`
- `governance/canon/BOOTSTRAP_EXECUTION_LEARNINGS.md` (multiple)
- `governance/canon/FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md` (§2, §6.1, §7.1)
- `governance/TIER_0_CANON_MANIFEST.json` (T0-011)

**Key Content Expected**:
- FM role definition and canonical responsibilities
- FM authority model and supervision boundaries
- Wave progress recording requirements (§6.1)
- Issue artifact generation protocols (§13)
- Builder appointment and supervision authority
- FM self-governance requirements

**Integration Impact**:
- High - Required for complete FM agent contract validation
- Affects FM wake-up protocol references
- Needed for wave planning methodology completeness
- Essential for FM memory protocol integration

**Action Required When Available**:
1. Monitor canonical governance repository for release
2. Execute immediate layer-down via governance-liaison
3. Update FM agent contract (ForemanApp-agent.md) with canonical references
4. Update TIER_0_CANON_MANIFEST.json with actual file metadata
5. Validate all cross-references
6. Update this tracking document

---

### 2. WAVE_MODEL.md

**Status**: 🔍 TRACKED - Not Yet Layered Down  
**Priority**: HIGH  
**Canonical Path**: `governance/canon/WAVE_MODEL.md`

**Description**:
Wave Model defines the canonical wave lifecycle, phase definitions, wave/subwave decomposition rules, and phase transition criteria. Essential for FM wave planning and execution.

**Referenced In**:
- `governance/canon/FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md` (§2, §3.1, §4.1, §6, §7.1)
- `governance/canon/AGENT_BASELINE_MANAGEMENT_PROTOCOL.md` (lines mentioning wave lifecycle)

**Key Content Expected**:
- Wave lifecycle definition (6 phases: Planning, Architecture, QA Creation, Build, Validation, Closure)
- Wave vs. subwave distinction and decomposition rules
- Phase transition criteria and gate requirements
- Wave completion certification requirements
- Wave progress tracking obligations
- Subwave boundary establishment rules

**Integration Impact**:
- High - Required for complete wave planning methodology
- Affects wave closure script validation logic
- Needed for FM wave decomposition strategy
- Essential for phase transition enforcement

**Action Required When Available**:
1. Monitor canonical governance repository for release
2. Execute immediate layer-down via governance-liaison
3. Update wave closure script with canonical phase definitions
4. Enhance wave_closure.sh validation with canonical criteria
5. Update FM agent contract with wave lifecycle references
6. Validate wave planning protocols against canonical model
7. Update this tracking document

---

### 3. LIVING_AGENT_SYSTEM.md

**Status**: 🔍 TRACKED - Not Yet Layered Down  
**Priority**: CRITICAL  
**Canonical Path**: `governance/canon/LIVING_AGENT_SYSTEM.md`

**Description**:
Living Agent System v5.0.0 comprehensive specification defining the complete agent lifecycle: wake-up, memory management, working contract generation, execution, and session closure. This is the supreme authority for agent operations.

**Referenced In**:
- `governance/canon/AGENT_BASELINE_MANAGEMENT_PROTOCOL.md` (§2, §3.2.3, multiple sections)
- `governance/TIER_0_CANON_MANIFEST.json` (metadata)
- Multiple wake-up protocol references across agent contracts

**Key Content Expected**:
- **§1**: Wake-up protocol specification (including baseline validation step)
- **§2-3**: Memory management architecture and lifecycle
- **§4**: Working contract generation from memory and baselines
- **§5**: Session closure and handover obligations
- Agent lifecycle phases and transitions
- Integration points with governance protocols
- Mandatory pre-work governance self-test
- Post-work memory capture requirements

**Integration Impact**:
- CRITICAL - Supreme authority for all agent operations
- Affects all agent wake-up protocols
- Required for complete baseline validation integration
- Essential for FM memory protocol implementation
- Needed for working contract generation
- Affects session closure protocols across all agents

**Action Required When Available**:
1. **IMMEDIATE** layer-down upon release (CRITICAL priority)
2. Update all agent contracts with canonical wake-up protocol
3. Update validate_baseline.sh to reference canonical sections
4. Integrate wake-up protocol with baseline validation
5. Update FM agent contract with complete lifecycle references
6. Update all builder agent contracts with lifecycle integration
7. Validate all session closure protocols against canonical
8. Update TIER_0_CANON_MANIFEST.json with authoritative metadata
9. Execute comprehensive validation across all agent contracts
10. Update this tracking document

---

## Layer-Down Workflow

When any of these files become available in the canonical governance repository:

### Detection
1. Monitor canonical repository releases/PRs
2. Check governance ripple notifications
3. Review TIER_0_CANON_MANIFEST updates from canonical

### Execution
1. **governance-liaison** receives governance ripple notification
2. Execute CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md
3. Copy file from canonical to `governance/canon/<filename>`
4. Update `GOVERNANCE_ARTIFACT_INVENTORY.md` with new file entry
5. Update `TIER_0_CANON_MANIFEST.json` with actual metadata
6. Validate file integrity and cross-references
7. Update this tracking document to reflect layer-down completion

### Integration
1. Identify all agent contracts referencing the new file
2. Update agent contracts with accurate section references
3. Update related scripts (validate_baseline.sh, wave_closure.sh)
4. Run governance alignment validation
5. Test impacted functionality
6. Document integration in layer-down completion summary

### Validation
1. Run validate_baseline.sh on all agent contracts
2. Check for broken cross-references
3. Validate against TIER_0_CANON_MANIFEST.json
4. Confirm zero governance drift
5. Update session memory with layer-down outcome

---

## Monitoring Strategy

**Frequency**: Weekly review of canonical governance repository  
**Trigger**: Governance ripple notification from governance-repo-administrator  
**Responsibility**: governance-liaison agent  
**Escalation**: If files remain unavailable >90 days, escalate to CS2 for timeline

---

## Notes

- These files are referenced extensively in already-layered governance protocols
- Their absence does not block current operations but limits governance completeness
- FM_ROLE_CANON.md and LIVING_AGENT_SYSTEM.md are marked in TIER_0_CANON_MANIFEST.json
- When available, these will likely trigger a HIGH-priority governance ripple
- All three files are considered foundational for Living Agent System v5.0.0 completeness

---

**Authority**: CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md, GOVERNANCE_RIPPLE_MODEL.md  
**Version**: 1.0.0  
**Living Agent System**: v5.0.0
