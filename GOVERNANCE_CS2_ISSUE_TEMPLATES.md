# CS2 Issue Templates for Governance Ripple

**Purpose**: Issue templates for CS2 to create in target repositories  
**Context**: Living Agent System v5.0.0 layer-down from PartPulse  
**Target Repositories**: maturion-foreman-office-app, R_Roster  
**Date**: 2026-02-08

---

## How to Use These Templates

**CS2 Actions**:
1. Copy the appropriate template below
2. Create a new issue in the target repository
3. Paste the template as the issue description
4. Assign to the repository's governance-liaison agent (if assignable)
5. Add label: `governance`, `layer-down`, `agent-task`
6. Create the issue
7. Monitor for PR created by target repo's governance-liaison

**What Happens Next**:
- Target repo's governance-liaison picks up the issue
- Agent pulls files from PartPulse (canonical source)
- Agent creates PR in target repository
- CS2 reviews and merges the PR

---

## Template 1: maturion-foreman-office-app

```markdown
# Governance: Layer Down Living Agent System v5.0.0 from PartPulse

**Type**: Governance Layer-Down  
**Priority**: Medium  
**Source**: APGI-cmy/PartPulse (Canonical)  
**Target**: APGI-cmy/maturion-foreman-office-app (This Repository)  
**Authority**: CS2 (Johan)

---

## Mission

Layer down **Living Agent System v5.0.0** agent contracts and infrastructure from PartPulse (canonical source) to this repository.

---

## Context

**Canonical Source**: APGI-cmy/PartPulse has Living Agent System v5.0.0 as canonical
- **PR**: #225 - "Convert oversight agents to Living Agent System v5.0.0"
- **Merge Commit**: `1230f51e40b780cce013fe33973e81b2a3120345`
- **Merge Date**: 2026-02-08
- **Documentation**: See `GOVERNANCE_CANONICAL_STATUS_V5.md` in PartPulse

**This Repository**: maturion-foreman-office-app needs to layer down v5.0.0
- **Current Status**: [Unknown - governance-liaison should verify]
- **Target Status**: Living Agent System v5.0.0
- **Action Required**: governance-liaison to pull from PartPulse and create PR

---

## Files to Layer Down

Pull the following files **from PartPulse (APGI-cmy/PartPulse, main branch)**:

### 1. Agent Contracts (v5.0.0)

#### `.github/agents/CodexAdvisor-agent.md`
- Source: `APGI-cmy/PartPulse/.github/agents/CodexAdvisor-agent.md`
- Version: 5.0.0
- Lines: 257
- **Action**: Update metadata `this_copy: layered-down`

#### `.github/agents/governance-liaison.md`
- Source: `APGI-cmy/PartPulse/.github/agents/governance-liaison.md`
- Version: 5.0.0
- Lines: 311
- **Action**: Update metadata:
  - `scope.repository: APGI-cmy/maturion-foreman-office-app`
  - `this_copy: layered-down`

### 2. Infrastructure

#### `.agent-admin/` Directory
- Source: `APGI-cmy/PartPulse/.agent-admin/`
- **Action**: Copy complete directory structure
- **Note**: Clear session-specific content, keep templates

#### `.agent` Configuration File
- Source: `APGI-cmy/PartPulse/.agent`
- **Action**: Customize for maturion-foreman-office-app:
  - Update `id: office-app` (or appropriate)
  - Update `repository.name: maturion-foreman-office-app`
  - Update agent versions to v5.0.0
  - Preserve governance references

### 3. NOT Required

- `.agent-workspace-template/` - Does NOT exist (documentation error)

---

## Instructions for governance-liaison

**This is a task for THIS repository's governance-liaison agent.**

### Step 1: Fetch Files from Canonical Source

```bash
# Pull from PartPulse (canonical source)
# Use git or GitHub API to fetch files from:
# Repository: APGI-cmy/PartPulse
# Branch: main
# Commit: 1230f51 (or later)

# Files to fetch:
# - .github/agents/CodexAdvisor-agent.md
# - .github/agents/governance-liaison.md
# - .agent-admin/ (complete directory)
# - .agent (configuration file)
```

### Step 2: Update Metadata for Layered-Down Copies

**For `.github/agents/CodexAdvisor-agent.md`**:
```yaml
metadata:
  canonical_home: APGI-cmy/maturion-codex-control
  this_copy: layered-down  # CHANGE from "canonical"
  authority: CS2
```

**For `.github/agents/governance-liaison.md`**:
```yaml
scope:
  type: consumer-repository
  repository: APGI-cmy/maturion-foreman-office-app  # UPDATE
  canonical_source: APGI-cmy/maturion-foreman-governance
  self_alignment: authorized

metadata:
  canonical_home: APGI-cmy/PartPulse
  this_copy: layered-down  # CHANGE from "canonical"
  authority: CS2
```

**For `.agent`**:
```yaml
id: office-app  # UPDATE (or appropriate ID)
repository:
  name: maturion-foreman-office-app  # UPDATE
  owner: APGI-cmy
```

### Step 3: Create PR in THIS Repository

**Branch**: `governance/living-agent-system-v5.0.0`  
**Title**: "Governance: Layer down Living Agent System v5.0.0 from PartPulse"  
**Description**: Include:
- Reference to PartPulse PR #225 and commit 1230f51
- List of files layered down
- Metadata updates made
- Link to `GOVERNANCE_CANONICAL_STATUS_V5.md` in PartPulse

### Step 4: Wait for CS2 Review

- CS2 will review the PR
- CS2 will merge if approved
- No further action required from agent after PR creation

---

## Constraints

**Repository Boundaries**:
- ❌ DO NOT attempt to access other repositories beyond git fetch
- ❌ DO NOT create PRs in other repositories
- ❌ DO NOT request GitHub tokens for other repositories
- ✅ Work entirely within THIS repository (maturion-foreman-office-app)
- ✅ Create PR in THIS repository only
- ✅ Pull from canonical source (PartPulse) via git/GitHub

**Authority Boundaries**:
- governance-liaison operates ONLY within this repository
- Cross-repository coordination is CS2's role
- Follow the PULL model (pull from canonical, don't push to others)

---

## Validation

After layer-down, verify:

```bash
# Check CodexAdvisor version
grep "version:" .github/agents/CodexAdvisor-agent.md
# Expected: version: 5.0.0

# Check governance-liaison version
grep "version:" .github/agents/governance-liaison.md
# Expected: version: 5.0.0

# Verify metadata updates
grep "this_copy:" .github/agents/CodexAdvisor-agent.md
# Expected: this_copy: layered-down

grep "repository:" .github/agents/governance-liaison.md
# Expected: repository: APGI-cmy/maturion-foreman-office-app
```

---

## References

- **Canonical Source**: APGI-cmy/PartPulse (main branch, commit 1230f51)
- **Canonical Status Doc**: `GOVERNANCE_CANONICAL_STATUS_V5.md` in PartPulse
- **Source PR**: https://github.com/APGI-cmy/PartPulse/pull/225
- **Authority**: Living Agent System v5.0.0 | CS2

---

## Expected Outcome

**Success Criteria**:
- [x] governance-liaison reads this issue
- [ ] governance-liaison pulls files from PartPulse
- [ ] governance-liaison updates metadata appropriately
- [ ] governance-liaison creates PR in THIS repository
- [ ] CS2 reviews PR
- [ ] CS2 merges PR
- [ ] maturion-foreman-office-app has Living Agent System v5.0.0

**Timeline**: ~1-2 hours after issue creation

---

**Created by**: CS2 (Johan)  
**Date**: [Fill in when creating issue]  
**Authority**: Living Agent System v5.0.0
```

---

## Template 2: R_Roster

```markdown
# Governance: Layer Down Living Agent System v5.0.0 from PartPulse

**Type**: Governance Layer-Down  
**Priority**: Medium  
**Source**: APGI-cmy/PartPulse (Canonical)  
**Target**: APGI-cmy/R_Roster (This Repository)  
**Authority**: CS2 (Johan)

---

## Mission

Layer down **Living Agent System v5.0.0** agent contracts and infrastructure from PartPulse (canonical source) to this repository.

---

## Context

**Canonical Source**: APGI-cmy/PartPulse has Living Agent System v5.0.0 as canonical
- **PR**: #225 - "Convert oversight agents to Living Agent System v5.0.0"
- **Merge Commit**: `1230f51e40b780cce013fe33973e81b2a3120345`
- **Merge Date**: 2026-02-08
- **Documentation**: See `GOVERNANCE_CANONICAL_STATUS_V5.md` in PartPulse

**This Repository**: R_Roster needs to layer down v5.0.0
- **Current Status**: [Unknown - governance-liaison should verify]
- **Target Status**: Living Agent System v5.0.0
- **Action Required**: governance-liaison to pull from PartPulse and create PR

---

## Files to Layer Down

Pull the following files **from PartPulse (APGI-cmy/PartPulse, main branch)**:

### 1. Agent Contracts (v5.0.0)

#### `.github/agents/CodexAdvisor-agent.md`
- Source: `APGI-cmy/PartPulse/.github/agents/CodexAdvisor-agent.md`
- Version: 5.0.0
- Lines: 257
- **Action**: Update metadata `this_copy: layered-down`

#### `.github/agents/governance-liaison.md`
- Source: `APGI-cmy/PartPulse/.github/agents/governance-liaison.md`
- Version: 5.0.0
- Lines: 311
- **Action**: Update metadata:
  - `scope.repository: APGI-cmy/R_Roster`
  - `this_copy: layered-down`

### 2. Infrastructure

#### `.agent-admin/` Directory
- Source: `APGI-cmy/PartPulse/.agent-admin/`
- **Action**: Copy complete directory structure
- **Note**: Clear session-specific content, keep templates

#### `.agent` Configuration File
- Source: `APGI-cmy/PartPulse/.agent`
- **Action**: Customize for R_Roster:
  - Update `id: r-roster` (or appropriate)
  - Update `repository.name: R_Roster`
  - Update agent versions to v5.0.0
  - Preserve governance references

### 3. NOT Required

- `.agent-workspace-template/` - Does NOT exist (documentation error)

---

## Instructions for governance-liaison

**This is a task for THIS repository's governance-liaison agent.**

### Step 1: Fetch Files from Canonical Source

```bash
# Pull from PartPulse (canonical source)
# Use git or GitHub API to fetch files from:
# Repository: APGI-cmy/PartPulse
# Branch: main
# Commit: 1230f51 (or later)

# Files to fetch:
# - .github/agents/CodexAdvisor-agent.md
# - .github/agents/governance-liaison.md
# - .agent-admin/ (complete directory)
# - .agent (configuration file)
```

### Step 2: Update Metadata for Layered-Down Copies

**For `.github/agents/CodexAdvisor-agent.md`**:
```yaml
metadata:
  canonical_home: APGI-cmy/maturion-codex-control
  this_copy: layered-down  # CHANGE from "canonical"
  authority: CS2
```

**For `.github/agents/governance-liaison.md`**:
```yaml
scope:
  type: consumer-repository
  repository: APGI-cmy/R_Roster  # UPDATE
  canonical_source: APGI-cmy/maturion-foreman-governance
  self_alignment: authorized

metadata:
  canonical_home: APGI-cmy/PartPulse
  this_copy: layered-down  # CHANGE from "canonical"
  authority: CS2
```

**For `.agent`**:
```yaml
id: r-roster  # UPDATE (or appropriate ID)
repository:
  name: R_Roster  # UPDATE
  owner: APGI-cmy
```

### Step 3: Create PR in THIS Repository

**Branch**: `governance/living-agent-system-v5.0.0`  
**Title**: "Governance: Layer down Living Agent System v5.0.0 from PartPulse"  
**Description**: Include:
- Reference to PartPulse PR #225 and commit 1230f51
- List of files layered down
- Metadata updates made
- Link to `GOVERNANCE_CANONICAL_STATUS_V5.md` in PartPulse

### Step 4: Wait for CS2 Review

- CS2 will review the PR
- CS2 will merge if approved
- No further action required from agent after PR creation

---

## Constraints

**Repository Boundaries**:
- ❌ DO NOT attempt to access other repositories beyond git fetch
- ❌ DO NOT create PRs in other repositories
- ❌ DO NOT request GitHub tokens for other repositories
- ✅ Work entirely within THIS repository (R_Roster)
- ✅ Create PR in THIS repository only
- ✅ Pull from canonical source (PartPulse) via git/GitHub

**Authority Boundaries**:
- governance-liaison operates ONLY within this repository
- Cross-repository coordination is CS2's role
- Follow the PULL model (pull from canonical, don't push to others)

---

## Validation

After layer-down, verify:

```bash
# Check CodexAdvisor version
grep "version:" .github/agents/CodexAdvisor-agent.md
# Expected: version: 5.0.0

# Check governance-liaison version
grep "version:" .github/agents/governance-liaison.md
# Expected: version: 5.0.0

# Verify metadata updates
grep "this_copy:" .github/agents/CodexAdvisor-agent.md
# Expected: this_copy: layered-down

grep "repository:" .github/agents/governance-liaison.md
# Expected: repository: APGI-cmy/R_Roster
```

---

## References

- **Canonical Source**: APGI-cmy/PartPulse (main branch, commit 1230f51)
- **Canonical Status Doc**: `GOVERNANCE_CANONICAL_STATUS_V5.md` in PartPulse
- **Source PR**: https://github.com/APGI-cmy/PartPulse/pull/225
- **Authority**: Living Agent System v5.0.0 | CS2

---

## Expected Outcome

**Success Criteria**:
- [x] governance-liaison reads this issue
- [ ] governance-liaison pulls files from PartPulse
- [ ] governance-liaison updates metadata appropriately
- [ ] governance-liaison creates PR in THIS repository
- [ ] CS2 reviews PR
- [ ] CS2 merges PR
- [ ] R_Roster has Living Agent System v5.0.0

**Timeline**: ~1-2 hours after issue creation

---

**Created by**: CS2 (Johan)  
**Date**: [Fill in when creating issue]  
**Authority**: Living Agent System v5.0.0
```

---

## CS2 Workflow Summary

### Step-by-Step Process

1. **Create Issue in maturion-foreman-office-app**
   - Go to: https://github.com/APGI-cmy/maturion-foreman-office-app/issues/new
   - Copy Template 1 above
   - Fill in `[Fill in when creating issue]` fields
   - Create issue
   - Add labels: `governance`, `layer-down`, `agent-task`

2. **Create Issue in R_Roster**
   - Go to: https://github.com/APGI-cmy/R_Roster/issues/new
   - Copy Template 2 above
   - Fill in `[Fill in when creating issue]` fields
   - Create issue
   - Add labels: `governance`, `layer-down`, `agent-task`

3. **Monitor Each Repository**
   - Wait for governance-liaison in each repo to create PR
   - Review PR in that repository
   - Merge if approved
   - Verify v5.0.0 is properly layered down

4. **Validate Governance Ripple Complete**
   - All repos have Living Agent System v5.0.0
   - All agent contracts updated
   - All metadata correctly set
   - Governance alignment achieved

---

## Timeline Expectations

**maturion-foreman-office-app**:
- Issue creation: [CS2 action]
- governance-liaison response: ~30 minutes
- PR creation: ~1 hour
- CS2 review: ~30 minutes
- Merge: [CS2 action]
- **Total**: ~2 hours

**R_Roster**:
- Issue creation: [CS2 action]
- governance-liaison response: ~30 minutes
- PR creation: ~1 hour
- CS2 review: ~30 minutes
- Merge: [CS2 action]
- **Total**: ~2 hours

**Overall Governance Ripple**: ~2-4 hours (can run in parallel)

---

## Troubleshooting

### If Target Repo's Agent Doesn't Respond
- Check if agent contract exists in target repo
- Verify governance-liaison is at a version that can process issues
- Manual fallback: CS2 can execute the layer-down manually

### If PR Creation Fails
- Check agent logs in target repo
- Verify PartPulse is accessible (public or agent has access)
- Verify files exist in PartPulse at specified commit

### If Metadata Updates Are Incorrect
- Target repo's agent should update:
  - `this_copy: layered-down`
  - Repository-specific identifiers
- CS2 can request corrections in PR review

---

**Authority**: CS2 (Johan) | Living Agent System v5.0.0  
**Date**: 2026-02-08T08:45:00Z  
**Purpose**: Enable governance ripple via repository sovereignty model
