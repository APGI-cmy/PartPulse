# Governance Artifact Inventory

**Repository**: APGI-cmy/PartPulse  
**Type**: Consumer Repository (Layered-Down Governance)  
**Canonical Source**: APGI-cmy/maturion-foreman-governance  
**Last Updated**: 2026-01-23T12:02:11Z  
**Updated By**: governance-liaison  

---

## Purpose

This inventory tracks all governance artifacts layered down from the canonical governance repository to this consumer repository. It ensures local governance alignment with canonical governance and provides traceability for governance ripple operations.

---

## Layered-Down Governance Canon Files

### Tier-0 Constitutional Canon

| File | Path | Last Layered-Down | Source PR | Status |
|------|------|-------------------|-----------|--------|
| STOP_AND_FIX_DOCTRINE.md | governance/canon/STOP_AND_FIX_DOCTRINE.md | 2026-01-23T12:02:11Z | #1005 | ✅ CURRENT |

### Philosophy Files

| File | Path | Last Layered-Down | Source PR | Status |
|------|------|-------------------|-----------|--------|
| BYG_DOCTRINE.md | governance/philosophy/BYG_DOCTRINE.md | 2026-01-23T12:02:11Z | #1007 | ✅ CURRENT |
| GOVERNANCE_INCIDENT_RESPONSE_DOCTRINE.md | governance/philosophy/GOVERNANCE_INCIDENT_RESPONSE_DOCTRINE.md | (existing) | - | ✅ CURRENT |

### Runbooks

| File | Path | Last Layered-Down | Source PR | Status |
|------|------|-------------------|-----------|--------|
| AGENT_TEST_EXECUTION_PROTOCOL.md | governance/runbooks/AGENT_TEST_EXECUTION_PROTOCOL.md | (existing) | - | ✅ CURRENT |
| AGENT_FILE_VALIDATION.md | governance/runbooks/AGENT_FILE_VALIDATION.md | (existing) | - | ✅ CURRENT |
| FOREMAN_GOVERNANCE_RUNBOOK.md | governance/runbooks/FOREMAN_GOVERNANCE_RUNBOOK.md | (existing) | - | ✅ CURRENT |
| AGENT_FILE_MAINTENANCE.md | governance/runbooks/AGENT_FILE_MAINTENANCE.md | (existing) | - | ✅ CURRENT |

---

## Layer-Down History

### 2026-01-23 - Governance Ripple: Stop-and-Fix Doctrine

**Ripple Type**: Tier-0 Canon + Philosophy Update  
**Source PRs**: #1005 (STOP_AND_FIX_DOCTRINE.md), #1007 (BYG_DOCTRINE.md)  
**Executed By**: governance-liaison  
**Timestamp**: 2026-01-23T12:02:11Z  

**Files Layered Down**:
1. ✅ governance/canon/STOP_AND_FIX_DOCTRINE.md (NEW - 22643 bytes)
2. ✅ governance/philosophy/BYG_DOCTRINE.md (UPDATED - 3416 bytes)

**Validation**:
- [COMPLETE] Governance alignment check - PASS ✅
- [COMPLETE] Pre-handover validation gates - PASS ✅
- [COMPLETE] JSON validation - PASS ✅
- [COMPLETE] Git diff check - PASS ✅

**Notes**:
- STOP_AND_FIX_DOCTRINE.md is new Tier-0 constitutional canon
- BYG_DOCTRINE.md updated with latest philosophy changes
- **ESCALATION RESOLVED**: Agent binding mismatch detected and escalated to CS2. CS2 fixed governance-liaison.md line 36 binding from `STOP_AND_FIX_PROTOCOL.md` to `STOP_AND_FIX_DOCTRINE.md`. Validation complete.

---

## Escalations

### Binding Mismatch - stop-and-fix [RESOLVED]

**Issue**: Agent contract binding references wrong filename  
**File**: .github/agents/governance-liaison.md (line 36)  
**Previous Binding**: `path: governance/canon/STOP_AND_FIX_PROTOCOL.md`  
**Corrected Binding**: `path: governance/canon/STOP_AND_FIX_DOCTRINE.md`  
**Actual File**: `governance/canon/STOP_AND_FIX_DOCTRINE.md`  
**Action Taken**: CS2 updated agent contract binding to reference correct filename  
**Authority**: CS2 (agent contract modifications)  
**Status**: **RESOLVED** ✅  
**Detected**: 2026-01-23T12:02:11Z  
**Resolved**: 2026-01-23T12:56:00Z  
**Resolved By**: CS2 (@APGI-cmy)  

---

## Governance Alignment Status

**Last Checked**: 2026-01-23T12:56:00Z  
**Status**: **FULLY ALIGNED** ✅  
**Canonical Source**: APGI-cmy/maturion-foreman-governance@main  
**Local Governance Version**: Synchronized as of 2026-01-23T12:56:00Z  
**Agent Contract Binding**: Corrected and validated ✅  

---

## Notes

- This inventory is maintained by governance-liaison agent
- All layered-down files MUST match canonical source
- Any drift detected triggers automatic self-alignment per Issue #999
- Agent contract modifications require CS2 approval per AGENT_CONTRACT_PROTECTION_PROTOCOL.md

