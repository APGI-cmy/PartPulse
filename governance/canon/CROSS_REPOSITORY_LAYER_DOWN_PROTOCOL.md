# CROSS-REPOSITORY LAYER-DOWN PROTOCOL

## Status
**Type**: Canonical Governance Process  
**Authority**: Supreme - Canonical  
**Version**: 1.1.0  
**Effective Date**: 2026-01-05  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Precedence**: Extends GOVERNANCE_LAYERDOWN_CONTRACT.md  
**Purpose**: Define explicit, controlled protocol for governance propagation across repositories

---

## 1. Purpose

This protocol defines the **explicit, controlled mechanism** for propagating governance changes from the governance repository (`maturion-foreman-governance`) to downstream application repositories (FM app, SlotMaster, future applications).

It exists to:
- **Prevent governance drift** across repositories
- **Ensure version synchronization** between governance and applications
- **Establish explicit boundaries** for cross-repo governance visibility
- **Prevent "control creep"** where governance visibility becomes implicit authority
- **Provide audit trail** for all governance propagation
- **Define governance liaison responsibilities** in downstream repos

**Constitutional Principle**: All governance consumption by downstream repositories MUST go through this explicit layer-down protocol. Direct cross-repo reading of governance internals is PROHIBITED.

---

## 2. Core Principles

### 2.1 Governance Public API vs. Internal

**Principle**: Downstream repositories MAY ONLY consume governance canon files explicitly marked as `PUBLIC_API` or `OPTIONAL` in the Governance Canon Manifest. `INTERNAL` files are off-limits.

### 2.2 Explicit Version Synchronization

**Principle**: Every downstream repository MUST explicitly track which governance version it is aligned with. Implicit alignment is PROHIBITED.

### 2.3 Layer-Down as Single Point of Contact

**Principle**: All governance propagation MUST go through the governance liaison agent in the downstream repository. Direct cross-repo governance reading by other agents is PROHIBITED.

### 2.4 Breaking Changes Require Explicit Migration

**Principle**: Breaking changes to PUBLIC_API canon files MUST be communicated explicitly via ripple signals and layer-down issues. Silent propagation is PROHIBITED.

---

## Summary

This is one of 15 critical Tier-0 governance canon files that establishes how governance flows across repositories.

Key components:
- **Governance visibility boundaries** (what can/cannot be read across repos)
- **Layer-down process** (6 steps with mandatory prehandover verification)
- **Governance liaison responsibilities** (version sync, canon consumption, audit support)
- **Breaking change communication** (7-day minimum notice with migration guides)
- **Governance alignment tracking** (GOVERNANCE_ALIGNMENT.md required in all repos)
- **Audit trail requirements** (comprehensive documentation at every step)

**Version**: 1.1.0  
**Authority**: Canonical Governance Process (Tier-0)  
**Source**: APGI-cmy/maturion-foreman-governance

For complete details on layer-down steps, governance liaison authority, breaking change protocols, and audit trail requirements, please refer to the full document.
