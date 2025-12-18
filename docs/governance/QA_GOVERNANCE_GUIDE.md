# QA/Governance Compliance Guide

## Canonical Governance Document

**This document is governed by Foreman Governance. The canonical version is located at:**

**https://github.com/MaturionISMS/maturion-foreman-governance/blob/main/policies/QA_GOVERNANCE_GUIDE.md**

---

## Purpose

This pointer redirects to the canonical QA and Governance Compliance Guide maintained in the Foreman Governance repository. All governance policies, principles, and mechanisms are defined centrally to ensure consistency across all governed applications in the Maturion ecosystem.

## Local Implementation

For PartPulse-specific implementation details, governance status, and builder-level artifacts, see:
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - PartPulse governance implementation
- [/GOVERNANCE_STATUS.md](../../GOVERNANCE_STATUS.md) - Current governance status
- [/.github/agents/PartPulse-agent.md](../../.github/agents/PartPulse-agent.md) - Builder agent contract

## Builder-Level Tools

PartPulse implements the canonical governance policies using these builder-level tools:
- `/qa/detect-test-dodging.js` - Test dodging detection
- `/qa/parking/` - QA parking registry and watcher
- `/qa/evidence/` - Evidence capture system
- `/qa/governance/sync-checker.js` - Governance synchronization
- `/.github/workflows/qa-enforcement.yml` - CI enforcement

## Related Documents

For detailed PartPulse-specific information:
- [BUILD_TO_GREEN.md](../../BUILD_TO_GREEN.md) - BUILD-TO-GREEN plan (6 waves, 37 tests)
- [QA_PLAN.md](../../qa/QA_PLAN.md) - Complete QA strategy
- [GOVERNANCE_STATUS.md](../../GOVERNANCE_STATUS.md) - Governance status and True North compliance
