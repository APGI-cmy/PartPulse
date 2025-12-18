# CI Lifecycle Gates

## Canonical Governance Document

**This document is governed by Foreman Governance. The canonical version is located at:**

**https://github.com/MaturionISMS/maturion-foreman-governance/blob/main/policies/CI_LIFECYCLE_GATES.md**

---

## Purpose

This pointer redirects to the canonical CI Lifecycle Gates policy maintained in the Foreman Governance repository. The canonical policy defines how CI gates behave across the Build-to-Green lifecycle for all governed applications.

## PartPulse Implementation

**Lifecycle Marker**: `.governance/BUILD_TO_GREEN_COMPLETE`  
**Current State**: Post-BUILD-TO-GREEN (Production Phase)  
**Status**: ✅ Active

### CI Workflows

PartPulse implements the canonical CI lifecycle policy through:

1. **Minimum Build-to-Red Gate** (`.github/workflows/minimum-build-to-red.yml`)
   - Pre-BUILD-TO-GREEN: Enforces hygiene checks
   - Post-BUILD-TO-GREEN: Advisory mode (automatically passes)
   - Lifecycle-aware based on `.governance/BUILD_TO_GREEN_COMPLETE` marker

2. **QA Enforcement Gate** (`.github/workflows/qa-enforcement.yml`)
   - Always enforced (lifecycle-independent)
   - Full test suite execution
   - Test dodging detection
   - QA parking validation
   - Governance sync checking

### Related Documents

For PartPulse-specific implementation:
- [GOVERNANCE_STATUS.md](../../GOVERNANCE_STATUS.md) - Current lifecycle state
- [BUILD_TO_GREEN.md](../../BUILD_TO_GREEN.md) - Build-to-Green plan
- [minimum-build-to-red.yml](../../.github/workflows/minimum-build-to-red.yml) - Lifecycle-aware workflow
- [qa-enforcement.yml](../../.github/workflows/qa-enforcement.yml) - Permanent enforcement workflow
