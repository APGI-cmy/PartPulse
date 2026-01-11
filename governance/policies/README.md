# Governance Policies

This directory contains references to canonical governance policies from the Maturion Governance Centre.

## Policy Source

**Canonical Repository**: https://github.com/APGI-cmy/maturion-foreman-governance  
**Policy Location**: `governance/policy/`  
**Governance Version**: v2.0.0

## Core Governance Policies

All governance policies are defined in the canonical repository and should be referenced by agents directly from:

```
https://github.com/APGI-cmy/maturion-foreman-governance/tree/main/governance/policy
```

### Key Policies for PartPulse

The following canonical policies are binding for this repository:

1. **One-Time Build Law** (BUILD_PHILOSOPHY.md)
2. **QA-as-Proof / Build-to-Green** (BUILD_PHILOSOPHY.md)
3. **PR Gate Precondition** (PR_GATE_PRECONDITION_RULE.md)
4. **Zero Test Debt Constitutional Rule** (governance/policy/)
5. **Test Removal Governance Gate** (governance/policy/)
6. **Agent-Scoped QA Boundaries** (AGENT_SCOPED_QA_BOUNDARIES.md)
7. **FL/CI Policy** (Failure Learning / Continuous Improvement)
8. **Non-Stalling Doctrine** (agent contract requirements)

## Local Policy Extensions

### PartPulse-Specific Governance

Local extensions and application-specific governance are documented in:
- `governance/policy/` (this directory - for PartPulse-specific policies)
- `governance/canon/` (local canonical governance documents)
- `governance/philosophy/` (PartPulse governance philosophy)

Local policies MUST NOT contradict canonical policies. They may only:
- Provide application-specific implementation details
- Add additional constraints (more strict than canonical)
- Document application-specific governance patterns

## Policy Compliance

Compliance with canonical policies is enforced via:
- CI/CD workflows in `.github/workflows/`
- Agent contracts in `.github/agents/`
- QA gates defined in `qa/QA_PLAN.md`
- Governance version tracking in `governance/GOVERNANCE_VERSION.md`

## Usage

Agents should:
1. Reference canonical policies from the governance repository
2. Apply canonical policies as written (no interpretation)
3. Document any PartPulse-specific policies in this directory
4. Escalate policy conflicts to Governance Liaison → FM → Johan
