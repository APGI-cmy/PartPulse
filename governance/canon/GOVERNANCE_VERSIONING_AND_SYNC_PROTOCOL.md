# GOVERNANCE VERSIONING AND SYNC PROTOCOL

## Status
**Type**: Canonical Governance Protocol  
**Authority**: Supreme - Canonical  
**Version**: v1.0.0  
**Effective Date**: 2025-12-23  
**Owner**: Maturion Engineering Leadership (Johan Ras)  
**Precedence**: Subordinate to GOVERNANCE_PURPOSE_AND_SCOPE.md

---

## 1. Purpose

This document defines the **canonical protocol** for governance version identification, synchronization detection, and version compatibility expectations across the Maturion ecosystem.

This protocol resolves **Wiring Gap W-001** identified in the Governance Dependency & Activation Readiness Scan by establishing:
- How governance canon versions are identified
- How execution systems detect governance changes
- What compatibility expectations exist between governance versions
- How governance change signals propagate across repositories

**Objectives**:
- Enable consistent governance version identification across all execution systems
- Provide clear, auditable version change detection mechanisms
- Define compatibility rules for governance evolution
- Establish change signaling expectations without requiring automation
- Support the Governance Ripple Model's bidirectional evolution framework

**Important**: This protocol defines **version semantics and compatibility expectations**, not implementation mechanisms. Governance defines requirements; execution systems must conform.

---

## 2. Core Concepts

### 2.1 Governance Version Identification

The governance repository maintains a **canonical version identifier** representing the overall state of governance canon.

**Version Format**: Semantic Versioning 2.0.0 (`MAJOR.MINOR.PATCH`)

**Location**: Git tags on the `main` branch

**Tag Format**: `governance-vMAJOR.MINOR.PATCH`

---

### 2.2 Version Change Detection

Execution systems MUST be able to detect governance version changes through:

1. **Git Tag Comparison** (Authoritative)
2. **Commit SHA Comparison** (Precise)
3. **Artifact Checksum** (Validation)

---

### 2.3 Compatibility Expectations

**MINOR and PATCH versions MUST maintain backward compatibility**
**MAJOR versions MAY break compatibility** (with migration period)

---

## Summary

This is one of 15 critical Tier-0 governance canon files that establishes how governance versions are identified and synchronized.

Key components:
- **Version identification scheme**: Git tags with SemVer semantics
- **Individual artifact versions**: Each document tracks its own version
- **Version change detection**: Multiple detection methods (tag, SHA, checksum)
- **Change detection timing**: At startup, on demand, on build execution
- **Compatibility expectations**: Backward compatible MINOR/PATCH, breaking MAJOR
- **Deprecation and transition**: 2-week minimum notice, grace period, old+new valid
- **Change signaling**: Git tags, CHANGELOG.md, document headers, release notes
- **Version synchronization**: Requirements, patterns, cache invalidation
- **Integration with Ripple Model**: Downward/upward propagation enabled by versioning

**Version**: v1.0.0  
**Authority**: Canonical Governance Protocol (Tier-0)  
**Source**: APGI-cmy/maturion-foreman-governance

For complete details on version comparison logic, compatibility checking, integration with ripple model, audit trails, and implementation guidance, please refer to the full document.
