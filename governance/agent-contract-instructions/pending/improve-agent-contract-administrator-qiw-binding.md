# Improvement Instruction: Add QIW Binding to Agent Contract Administrator

**Created**: 2026-01-14  
**Priority**: MEDIUM  
**Type**: Governance Completeness  
**Target Contract**: `.github/agents/agent-contract-administrator.md`  
**Authority**: CS2 (Human Governance)

---

## Issue Identified

During execution of task to update all agent files with QIW canonical binding (Issue: Update All .agent Files to Implement Canonical QIW Watchdog Channel Enforcement), the Agent Contract Administrator successfully updated 8 of 9 agent contracts in the PartPulse repository.

However, due to the **Constitutional Self-Modification Prohibition** (AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md, Tier-0), this agent **CANNOT** modify its own contract file (`.github/agents/agent-contract-administrator.md`).

**Result**: Agent Contract Administrator's contract is now **incomplete** - it lacks the QIW binding that all other agents have.

---

## Root Cause

**Constitutional Prohibition**: AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md (Tier-0) explicitly prohibits agents from modifying their own contract files to prevent:
- Conflict of interest
- Unauthorized scope expansion
- Governance circumvention

**Scope Clarification from Contract**:
- ✅ **CAN modify**: `.agent` (repository agent roster file)
- ❌ **CANNOT modify**: `.github/agents/agent-contract-administrator.md` (own contract)

This prohibition is **CATASTROPHIC** severity - violation requires immediate HALT and escalation to Johan.

---

## Governance Gap

**Current State**: `.github/agents/agent-contract-administrator.md` is missing:
```yaml
- id: watchdog-quality-integrity-channel
  path: governance/canon/WATCHDOG_QUALITY_INTEGRITY_CHANNEL.md
  role: quality-integrity-enforcement
  tier: 0
  version: 1.0.0
  enforcement: mandatory
  summary: QIW observes 5 channels (build, lint, test, deployment, runtime); blocks QA on anomalies
```

**Impact**:
- Governance incompleteness in Agent Contract Administrator's bindings
- Agent Contract Administrator lacks awareness of QIW requirements
- Inconsistency across agent contracts (8 have QIW, 1 does not)

**Severity**: MEDIUM (does not block current operations, but creates governance debt)

---

## Recommended Fix

**Who**: CS2 (Human Governance) or authorized agent designated by CS2 (NOT agent-contract-administrator)

**What**: Add QIW binding to `.github/agents/agent-contract-administrator.md`

**Where**: Insert in `governance.bindings` section, after `zero-test-debt` binding and before `runbooks` section

**Exact Change**:

In file: `/home/runner/work/PartPulse/PartPulse/.github/agents/agent-contract-administrator.md`

Find the section around line 100 (approximate):
```yaml
    - id: zero-test-debt
      path: governance/canon/ZERO_TEST_DEBT_CONSTITUTIONAL_RULE.md
      role: test-debt-enforcement
      status: immutable
      summary: Zero test debt mandate
    
    - id: execution-bootstrap-protocol
```

Change to:
```yaml
    - id: zero-test-debt
      path: governance/canon/ZERO_TEST_DEBT_CONSTITUTIONAL_RULE.md
      role: test-debt-enforcement
      status: immutable
      summary: Zero test debt mandate
    
    - id: watchdog-quality-integrity-channel
      path: governance/canon/WATCHDOG_QUALITY_INTEGRITY_CHANNEL.md
      role: quality-integrity-enforcement
      tier: 0
      version: 1.0.0
      enforcement: mandatory
      summary: QIW observes 5 channels (build, lint, test, deployment, runtime); blocks QA on anomalies
    
    - id: execution-bootstrap-protocol
```

**Verification**:
- YAML syntax valid
- Binding positioned consistently with other agent contracts
- Summary matches canonical document purpose
- Version specified (v1.0.0)

---

## Justification

**Why This Is Important**:
1. **Governance Completeness**: All agents in repository should have consistent governance bindings
2. **Self-Awareness**: Agent Contract Administrator should be aware of QIW requirements when administering contracts
3. **Cross-Repo Layer-Down Compliance**: QIW is canonical governance (PR#948) and must be layered down to all agents
4. **Future Task Enablement**: If ACA is asked to verify QIW compliance, it needs the binding to reference

**Why This Cannot Be Self-Executed**:
- Constitutional prohibition against self-modification (CATASTROPHIC severity)
- Agents MUST NOT modify their own defining contracts
- Contract modification requires external oversight and human approval

**Why This Is Not Urgent**:
- Agent Contract Administrator's current work does not require QIW awareness
- QIW is primarily for builders, FM, and QA enforcement
- ACA role is contract administration, not build/test execution
- Gap does not block current repository operations

---

## Related Documents

- **Source Task**: Issue "Update All .agent Files to Implement Canonical QIW Watchdog Channel Enforcement"
- **Canonical Authority**: [WATCHDOG_QUALITY_INTEGRITY_CHANNEL.md](https://github.com/APGI-cmy/maturion-foreman-governance/blob/main/governance/canon/WATCHDOG_QUALITY_INTEGRITY_CHANNEL.md) (v1.0.0)
- **Source PR**: https://github.com/APGI-cmy/maturion-foreman-governance/pull/948
- **Constitutional Authority**: AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md (Tier-0)
- **Risk Assessment**: `.agent-admin/risk-assessments/risk_001_20260114.md`
- **Governance Scan**: `.agent-admin/scans/scan_20260114_082155.md`

---

## Escalation Path

**Primary**: CS2 (Johan Ras) - Human Governance  
**Alternate**: Authorized agent designated by CS2 (with explicit instruction)

**Urgency**: Non-blocking, can be addressed in next governance maintenance cycle

---

**Instruction Status**: PENDING  
**Created By**: agent-contract-administrator  
**Date**: 2026-01-14  
**Task**: QIW Implementation (PartPulse)
