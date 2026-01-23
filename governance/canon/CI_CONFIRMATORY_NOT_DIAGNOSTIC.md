# CI CONFIRMATORY NOT DIAGNOSTIC CANON

## Status
**Type**: Constitutional Governance Rule  
**Authority**: Supreme - Canonical  
**Version**: 1.0.0  
**Effective Date**: 2025-12-30  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Precedence**: Subordinate only to GOVERNANCE_PURPOSE_AND_SCOPE.md

---

## 1. Purpose

This canon establishes that **CI execution is confirmatory, not diagnostic** across all governed repositories.

This principle protects:
- One-Time Build Law enforcement
- CS2 human verification constraints
- Deterministic governance boundaries
- Clear responsibility boundaries
- Auditability and evidence-driven decision-making

CI must not be allowed to function as a diagnostic or discovery mechanism.

---

## 2. Constitutional Mandate

This canon derives authority from and operationalizes:
- **GOVERNANCE_PURPOSE_AND_SCOPE.md** - Governance as canonical memory
- **BUILD_PHILOSOPHY.md** - One-Time Build Law, 100% GREEN mandate
- **PR_GATE_PRECONDITION_RULE.md** - Gate precondition enforcement ("No green gate, no handover")
- **AGENT_ROLE_GATE_APPLICABILITY.md** - Agent-role-aware gate evaluation
- **PR_GATE_EVALUATION_AND_ROLE_PROTOCOL.md** - Gate evaluation semantics
- **BYG_DOCTRINE.md** - Agent roles and authorities

---

## 3. Core Principle

> **CI execution is confirmatory, not diagnostic.**

CI validates that governance obligations were satisfied **before** handover.  
CI does **not** discover, diagnose, or debug failures.

**CI Role**:
- ✅ Confirm that required artifacts exist
- ✅ Confirm that required gates passed
- ✅ Confirm that process was followed
- ✅ Confirm that evidence is complete
- ✅ Confirm that compliance was achieved

**NOT CI Role**:
- ❌ Discover defects
- ❌ Debug failures
- ❌ Provide diagnostic surface
- ❌ Interpret failure causes
- ❌ Guide corrective action

**Principle**: If CI fails, the agent violated upstream governance obligations. The failure was preventable and should have been detected during preflight evaluation.

---

## Summary

This is one of 15 critical Tier-0 governance canon files that establishes CI's role in the build pipeline.

Key requirements:
- **Mandatory Preflight Evaluation**: All PR gates must be evaluated by responsible agent before handover
- **Gate Script Alignment Verification**: Agent must verify local validation matches CI gate scripts
- **No CI Log Inspection Requirement**: CS2 must never need to read CI logs for decision-making
- **Two-Mode Validation**: Evidence-based (preferred) or script execution (fallback)

**Version**: 1.0.0  
**Authority**: Constitutional Governance Rule (Tier-0)  
**Source**: APGI-cmy/maturion-foreman-governance

For complete details on preflight evaluation obligations, gate classification, contract integration, and enforcement semantics, please refer to the full document.
