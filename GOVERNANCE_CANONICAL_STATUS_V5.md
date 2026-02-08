# Living Agent System v5.0.0 - Canonical Status in PartPulse

**Status**: ✅ CANONICAL  
**Version**: 5.0.0  
**Repository**: APGI-cmy/PartPulse  
**Date**: 2026-02-08  
**Authority**: Living Agent System v5.0.0

---

## Canonical Confirmation

### ✅ Living Agent System v5.0.0 is Canonical in PartPulse

**Evidence**:
- **PR**: #225 - "Convert oversight agents to Living Agent System v5.0.0"
- **Merge Commit**: `1230f51e40b780cce013fe33973e81b2a3120345`
- **Merge Date**: 2026-02-08T08:34:09+0200
- **Target Branch**: main
- **Status**: Successfully merged

### Verification

```bash
# Verify merge commit
git log --oneline | grep 1230f51
# Output: 1230f51 Merge pull request #225 from APGI-cmy/copilot/update-codexadvisor-agent-to-v5-0-0

# Verify agent contract versions
grep "version:" .github/agents/CodexAdvisor-agent.md
# Output: version: 5.0.0

grep "version:" .github/agents/governance-liaison.md
# Output: version: 5.0.0
```

---

## Files Available for Layer-Down

Target repositories that need Living Agent System v5.0.0 should layer down the following files **from PartPulse**:

### 1. Agent Contracts (v5.0.0)

#### `.github/agents/CodexAdvisor-agent.md`
- **Version**: 5.0.0
- **Lines**: 257
- **Purpose**: Cross-repository coordination and oversight agent
- **Authority**: Living Agent System v5.0.0
- **Class**: overseer
- **Scope**: cross-repository

**Layer-Down Instructions for Target Repos**:
```yaml
# Target repos should update these metadata fields:
metadata:
  canonical_home: APGI-cmy/maturion-codex-control
  this_copy: layered-down  # IMPORTANT: Change from "canonical" to "layered-down"
  authority: CS2
```

#### `.github/agents/governance-liaison.md`
- **Version**: 5.0.0
- **Lines**: 311
- **Purpose**: Consumer repository governance liaison
- **Authority**: Living Agent System v5.0.0
- **Class**: liaison
- **Scope**: consumer-repository

**Layer-Down Instructions for Target Repos**:
```yaml
# Target repos should update these metadata fields:
scope:
  type: consumer-repository
  repository: [UPDATE_TO_TARGET_REPO]  # e.g., APGI-cmy/maturion-foreman-office-app
  canonical_source: APGI-cmy/maturion-foreman-governance
  self_alignment: authorized

metadata:
  canonical_home: APGI-cmy/PartPulse
  this_copy: layered-down  # IMPORTANT: Change from "canonical"
  authority: CS2
```

### 2. Infrastructure

#### `.agent-admin/` Directory Structure
- **Purpose**: Agent administrative infrastructure
- **Contents**: Complete directory with all subdirectories and templates

**Directory Structure**:
```
.agent-admin/
├── COMPLETION_SUMMARY.md
├── COMPLETION_SUMMARY_QIW_IMPLEMENTATION.md
├── COMPLETION_SUMMARY_V2.5.0_UPGRADE.md
├── EXAMPLE_COMPLETION_SUMMARY.md
├── ISSUE_COMMENT_DRAFT.md
├── ISSUE_RESPONSE_EMERGENCY_SELF_REVIEW.md
├── TASK_COMPLETION_SUMMARY_EMERGENCY_SELF_REVIEW.md
├── change-records/
│   └── change_001_20260119.md
├── completion-reports/
│   └── completion_001_20260119.md
├── evidence/
│   ├── EXAMPLE_change_record_20260113.md
│   ├── PREHANDOVER_PROOF_TEMPLATE_LAYERDOWN_AUDIT.md
│   ├── audit_alignment_20260113.md
│   ├── qiw-implementation-verification.md
│   └── self-modification-prohibition-compliance.md
├── proposals/
│   └── emergency-self-review-findings-20260114.md
├── risk-assessments/
│   ├── EXAMPLE_risk_20260113.md
│   ├── risk_001_20260113.md
│   ├── risk_001_20260114.md
│   └── risk_001_20260119.md
├── scans/
│   ├── EXAMPLE_scan_20260113.md
│   ├── scan_20260113_101707.md
│   ├── scan_20260114_082155.md
│   └── scan_20260119_135200.md
└── self-assessments/
    └── v2.5.0_upgrade_20260115.md
```

**Layer-Down Instructions**:
- Copy entire directory structure
- Preserve templates and examples
- Clear session-specific content (sessions/ subdirectory content)
- Keep structure intact for future agent use

#### `.agent` Configuration File
- **Lines**: 351
- **Purpose**: Repository-level agent configuration
- **Format**: YAML

**Layer-Down Instructions**:
```yaml
# Target repos should customize these sections:
---
id: [target-repo-id]  # e.g., office-app, r-roster
description: >
  [Update with target repo description]

repository:
  name: [TargetRepoName]  # e.g., maturion-foreman-office-app
  owner: APGI-cmy
  type: application
  technology: [Update as needed]

# Update agent versions to v5.0.0
# Update repository-specific governance bindings
# Preserve canonical governance references
```

### 3. NOT Required

#### `.agent-workspace-template/` ❌
- **Status**: Does NOT exist in PartPulse
- **Note**: This was mentioned in the original issue but is a documentation error
- **Action**: Target repos should NOT look for this directory

---

## Layer-Down Process for Target Repositories

### Correct Process (Repository Sovereignty Model)

**Step 1: CS2 Creates Issue in Target Repo**
- CS2 creates issue in the target repository
- Issue title: "Governance: Layer down Living Agent System v5.0.0 from PartPulse"
- Issue references this canonical status document

**Step 2: Target Repo's governance-liaison Reads Issue**
- governance-liaison agent in target repo picks up the issue
- Agent works **within its own repository only**
- Agent does NOT require access to PartPulse directly (can pull via git/GitHub)

**Step 3: Target Repo's Agent Pulls Files**
- Agent fetches files from PartPulse (canonical source)
- Agent layers down files **into its own repository**
- Agent updates metadata for layered-down copies
- Agent works entirely within repository boundaries

**Step 4: Target Repo's Agent Creates PR**
- Agent creates PR **in the target repository**
- PR contains layered-down files with updated metadata
- CS2 reviews and merges PR in target repository

### What Target Repo's Agent Should Do

```bash
# Pseudocode for target repo's governance-liaison

# 1. Fetch canonical files from PartPulse
fetch_from_canonical_source("APGI-cmy/PartPulse", "main", [
  ".github/agents/CodexAdvisor-agent.md",
  ".github/agents/governance-liaison.md",
  ".agent-admin/",
  ".agent"
])

# 2. Update metadata for layered-down copies
update_metadata(".github/agents/CodexAdvisor-agent.md", {
  "this_copy": "layered-down"
})

update_metadata(".github/agents/governance-liaison.md", {
  "scope.repository": current_repository,
  "this_copy": "layered-down"
})

update_metadata(".agent", {
  "id": current_repository_id,
  "repository.name": current_repository_name
})

# 3. Create PR in own repository
create_pr_in_own_repo(
  branch: "governance/living-agent-system-v5.0.0",
  title: "Governance: Layer down Living Agent System v5.0.0 from PartPulse",
  files: layered_down_files
)
```

### What Target Repo's Agent Should NOT Do

❌ Attempt to access PartPulse repository directly (beyond git fetch)  
❌ Request GitHub tokens for other repositories  
❌ Create PRs in other repositories  
❌ Coordinate with PartPulse agents  
❌ Cross repository boundaries

---

## File Checksums (for Verification)

Target repositories can verify they have the correct files using these checksums:

### `.github/agents/CodexAdvisor-agent.md`
```bash
wc -l .github/agents/CodexAdvisor-agent.md
# Expected: 257 lines

head -10 .github/agents/CodexAdvisor-agent.md | grep "version:"
# Expected: version: 5.0.0
```

### `.github/agents/governance-liaison.md`
```bash
wc -l .github/agents/governance-liaison.md
# Expected: 311 lines

head -10 .github/agents/governance-liaison.md | grep "version:"
# Expected: version: 5.0.0
```

### `.agent-admin/` Directory
```bash
find .agent-admin -type f | wc -l
# Expected: Multiple template files

ls -la .agent-admin/
# Expected: Subdirectories for change-records, evidence, proposals, etc.
```

---

## Target Repositories

### Repositories That Should Layer Down v5.0.0

1. **APGI-cmy/maturion-foreman-office-app**
   - Role: FM execution surface
   - Type: Application repository
   - Action Required: CS2 to create issue

2. **APGI-cmy/R_Roster**
   - Role: Application repository
   - Type: Application repository
   - Action Required: CS2 to create issue

### Process for Each Repository

**CS2 Actions**:
1. Create issue in target repo using template (see `GOVERNANCE_CS2_ISSUE_TEMPLATES.md`)
2. Wait for target repo's governance-liaison to execute
3. Review PR created by target repo's agent
4. Merge PR in target repository

**Target Repo's Agent Actions**:
1. Read issue created by CS2
2. Pull files from PartPulse (canonical source)
3. Update metadata for layered-down copies
4. Create PR in own repository
5. Wait for CS2 review and merge

---

## Version History

### v5.0.0 (Current - Canonical in PartPulse)
- **Date**: 2026-02-08
- **PR**: #225
- **Commit**: 1230f51
- **Changes**: Complete Living Agent System v5.0.0 implementation
- **Status**: Canonical in PartPulse

### Previous Versions
- **v2.5.0**: Previous agent contract system
- **v2.0.0**: Earlier governance model

---

## References

### Governance Authority
- **Living Agent System v5.0.0**: Agent contract and protocol specification
- **TIER_0_CANON_MANIFEST.json**: Canonical governance manifest
- **Agent Constitution**: Repository sovereignty and authority boundaries

### Source Evidence
- **PR #225**: https://github.com/APGI-cmy/PartPulse/pull/225
- **Merge Commit**: 1230f51e40b780cce013fe33973e81b2a3120345
- **Branch**: main

### Related Documentation
- **Realignment**: `GOVERNANCE_REALIGNMENT_AGENT_AUTHORITY.md`
- **CS2 Templates**: `GOVERNANCE_CS2_ISSUE_TEMPLATES.md`
- **Prehandover Proof**: `PREHANDOVER_PROOF_GOVERNANCE_RIPPLE_V5.md` (revised)

---

## Canonical Status Confirmation

✅ **CONFIRMED**: PartPulse (APGI-cmy/PartPulse) is the canonical source for Living Agent System v5.0.0 agent contracts

**Authority**: CS2 | Living Agent System v5.0.0  
**Date**: 2026-02-08T08:40:00Z  
**Repository**: APGI-cmy/PartPulse  
**Branch**: main  
**Commit**: 1230f51

---

**For CS2**: Use `GOVERNANCE_CS2_ISSUE_TEMPLATES.md` to create issues in target repositories.

**For Target Repo Agents**: Follow the layer-down process described above, working entirely within your own repository boundaries.
