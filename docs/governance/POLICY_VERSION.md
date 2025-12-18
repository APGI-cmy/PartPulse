# Governance Policy Version

## Canonical Governance Document

**This document is governed by Foreman Governance. The canonical version is located at:**

**https://github.com/MaturionISMS/maturion-foreman-governance/blob/main/policies/POLICY_VERSION.md**

---

## Purpose

This pointer redirects to the canonical Governance Policy Version document maintained in the Foreman Governance repository. The canonical policy defines all governance invariants, compliance mechanisms, and version history centrally.

## PartPulse Implementation

**Current Policy Version**: 1.1.0  
**Last Sync**: 2025-12-16  
**Repository**: MaturionISMS/PartPulse

For PartPulse-specific governance status and implementation:
- [GOVERNANCE_STATUS.md](../../GOVERNANCE_STATUS.md) - Current governance status and compliance
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Implementation details
- [/.github/agents/PartPulse-agent.md](../../.github/agents/PartPulse-agent.md) - Builder agent contract

## Compliance Status

PartPulse implements canonical governance policy v1.1.0 with the following builder-level mechanisms:

| Mechanism | Status | Location |
|-----------|--------|----------|
| Test Dodging Detection | ✅ Active | `qa/detect-test-dodging.js` |
| QA Parking Station | ✅ Active | `qa/parking/` |
| DP-RED Support | ✅ Active | `qa/parking/` |
| Parking Watcher | ✅ Active | `qa/parking/watcher.js` |
| Catastrophic Failure Tracking | ✅ Active | `qa/evidence/` |
| Evidence Capture | ✅ Active | `qa/evidence/capture.js` |
| CI Enforcement | ✅ Active | `.github/workflows/` |
