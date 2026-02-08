# Governance Ripple Proposal: Living Agent System v5.0.0 Layer-Down

**Proposal ID**: governance-ripple-v5.0.0-layerdown
**Date**: 2026-02-08T06:40:00Z
**Authority**: CodexAdvisor-agent v5.0.0
**Status**: AWAITING_CS2_APPROVAL

---

## Executive Summary

Layer down Living Agent System v5.0.0 agent contracts and infrastructure from PartPulse (canonical) to consumer repositories following successful merge of PR #225 (commit 1230f51).

**Source Repository**: APGI-cmy/PartPulse (canonical)
**Target Repositories**: 
1. APGI-cmy/maturion-foreman-office-app
2. APGI-cmy/R_Roster

---

## Scope Verification

### ✅ Verified Source Files in PartPulse

**Agent Contracts (v5.0.0)**:
1. `.github/agents/CodexAdvisor-agent.md` (v5.0.0, 257 lines)
2. `.github/agents/governance-liaison.md` (v5.0.0, 311 lines)

**Infrastructure**:
3. `.agent-admin/` directory structure:
   - `change-records/` (1 file)
   - `completion-reports/` (1 file)
   - `evidence/` (5 files)
   - `proposals/` (1 file)
   - `risk-assessments/` (4 files)
   - `scans/` (3 files)
   - `self-assessments/` (1 file)
   - Root templates (7 files)

4. `.agent` repository configuration file (351 lines)

### ❌ Missing File Investigation

**Issue**: Mission brief mentioned `.agent-workspace-template/`
**Finding**: This directory does NOT exist in PartPulse
**Assessment**: Documentation error in mission brief
**Resolution**: Proceed with 4 verified items only

---

## Proposed Actions

### Phase 1: Pre-Flight Checks (Read-Only)
**No approval required - informational only**

1. Clone target repositories
2. Verify current agent contract versions
3. Check for local modifications or drift
4. Identify conflicts or blockers

### Phase 2: Layer-Down Execution (REQUIRES APPROVAL)
**Approval Required: YES - ALL actions**

For each target repository:

#### Step 1: Create Feature Branch
- Branch name: `governance/living-agent-system-v5.0.0`
- Base: `main`

#### Step 2: Layer Down Files
**What will be done**:
- Copy `.github/agents/CodexAdvisor-agent.md` (v5.0.0)
  - Update metadata: `this_copy: layered-down`
  - Preserve canonical_home reference
  
- Copy `.github/agents/governance-liaison.md` (v5.0.0)
  - Update metadata: `this_copy: layered-down`
  - Update repository-specific scope
  
- Copy `.agent-admin/` directory structure (complete)
  - Preserve all subdirectories and templates
  - Clear session-specific content
  
- Update `.agent` configuration
  - Update agent versions to v5.0.0
  - Preserve repository-specific settings

**Why**: 
- T0-XXX: Living Agent System v5.0.0 governance ripple requirement
- Maintains governance alignment across ecosystem
- Ensures consistent agent behavior and protocols

**Rollback Plan**:
- Close PR without merge
- Delete feature branch
- Target repo remains at previous version

#### Step 3: Create Pull Request
**PR Content**:
- Title: "Governance Ripple: Living Agent System v5.0.0"
- Body: Reference PartPulse PR #225, commit 1230f51
- Labels: `governance`, `tier-0`, `layer-down`

#### Step 4: Validation
**Automated**:
- CI workflows run
- Gate validations execute
- No breaking changes detected

**Manual Review**:
- CS2 reviews PR
- Approves merge when ready

---

## Target Repository Details

### Target 1: maturion-foreman-office-app
**Role**: FM execution surface, governance consumer
**Current Status**: Unknown (requires pre-flight check)
**Expected Changes**:
- CodexAdvisor-agent: Unknown → v5.0.0
- governance-liaison: Unknown → v5.0.0
- .agent-admin/: May not exist → created
- .agent: Update agent versions

### Target 2: R_Roster
**Role**: Application repository, governance consumer
**Current Status**: Unknown (requires pre-flight check)
**Expected Changes**:
- CodexAdvisor-agent: Unknown → v5.0.0
- governance-liaison: Unknown → v5.0.0
- .agent-admin/: May not exist → created
- .agent: Update agent versions

---

## Blockers Assessment

### ⚠️ Critical Blocker: GitHub Access
**Status**: BLOCKED
**Issue**: Cannot access target repositories via gh CLI
**Error**: `GH_TOKEN environment variable not set`
**Impact**: Cannot execute layer-down until resolved

**Resolution Required**:
1. CS2 provides GitHub token with appropriate permissions
2. Or CS2 executes layer-down manually following this plan
3. Or CS2 grants CodexAdvisor GitHub Actions workflow permissions

### 🟡 Minor Issue: Documentation Error
**Status**: CLARIFIED
**Issue**: `.agent-workspace-template/` mentioned but doesn't exist
**Resolution**: Proceed without this item (documentation will be corrected)

---

## Approval Request

**CodexAdvisor requests CS2 approval for**:

### Option A: Grant GitHub Access
**What**: Provide GitHub token to CodexAdvisor
**Why**: Enable automated layer-down execution
**How**: Set GH_TOKEN environment variable with repo access
**Risk**: CodexAdvisor gains write access (mitigated by approval-gate protocol)

### Option B: Manual Execution by CS2
**What**: CS2 executes layer-down following this plan
**Why**: CS2 retains direct control
**How**: Follow Phase 2 steps manually for each target repo
**Risk**: Manual process, potential for errors

### Option C: Defer/Block
**What**: Do not proceed with layer-down
**Why**: Unresolved concerns or blockers
**How**: CodexAdvisor closes session
**Risk**: Governance drift continues

---

## Success Criteria

- [ ] Both target repositories updated to Living Agent System v5.0.0
- [ ] PRs merged to main branches
- [ ] CI workflows pass
- [ ] No governance drift detected
- [ ] Session documented in PREHANDOVER_PROOF

---

## CS2 Decision Required

**Please respond with ONE of the following**:

1. **APPROVE Option A** - Grant GitHub access (provide GH_TOKEN)
2. **APPROVE Option B** - CS2 will execute manually (CodexAdvisor provides detailed steps)
3. **APPROVE Option C** - Defer/block (provide reason)
4. **REQUEST CLARIFICATION** - (specify what needs clarification)

**Awaiting CS2 approval to proceed.**

---

**Proposal Authority**: CodexAdvisor-agent v5.0.0
**Governance**: LIVING_AGENT_SYSTEM | TIER_0_CANON_MANIFEST.json
**Session**: codex-20260208-064000
