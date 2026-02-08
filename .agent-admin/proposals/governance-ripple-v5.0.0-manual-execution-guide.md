# Manual Execution Guide: Living Agent System v5.0.0 Layer-Down

**Guide ID**: governance-ripple-v5.0.0-manual-execution
**For**: CS2 Manual Execution (Option B)
**Date**: 2026-02-08T06:45:00Z
**Authority**: CodexAdvisor-agent v5.0.0

---

## Overview

This guide provides step-by-step instructions for CS2 to manually execute the Living Agent System v5.0.0 layer-down to consumer repositories.

**Prerequisites**:
- CS2 has approved Option B (Manual Execution)
- CS2 has GitHub access to target repositories
- Source repository: APGI-cmy/PartPulse (commit 1230f51)

---

## Target Repository 1: maturion-foreman-office-app

### Step 1: Clone and Branch

```bash
# Clone target repository
git clone https://github.com/APGI-cmy/maturion-foreman-office-app.git
cd maturion-foreman-office-app

# Create feature branch
git checkout main
git pull origin main
git checkout -b governance/living-agent-system-v5.0.0
```

### Step 2: Layer Down Agent Contracts

```bash
# Copy CodexAdvisor-agent.md from PartPulse
# Source: PartPulse/.github/agents/CodexAdvisor-agent.md (commit 1230f51)
# Destination: maturion-foreman-office-app/.github/agents/CodexAdvisor-agent.md

# Create directory if needed
mkdir -p .github/agents

# Copy the file (CS2: Use your preferred method)
# Then modify metadata section:
```

**Edit `.github/agents/CodexAdvisor-agent.md`**:
```yaml
metadata:
  canonical_home: APGI-cmy/maturion-codex-control
  this_copy: layered-down  # ← Change this
  authority: CS2
```

```bash
# Copy governance-liaison.md
# Source: PartPulse/.github/agents/governance-liaison.md (commit 1230f51)
# Destination: maturion-foreman-office-app/.github/agents/governance-liaison.md
```

**Edit `.github/agents/governance-liaison.md`**:
```yaml
scope:
  type: consumer-repository
  repository: APGI-cmy/maturion-foreman-office-app  # ← Update repo name
  canonical_source: APGI-cmy/maturion-foreman-governance
  self_alignment: authorized

metadata:
  canonical_home: APGI-cmy/PartPulse
  this_copy: layered-down  # ← Change this
  authority: CS2
```

### Step 3: Layer Down .agent-admin Infrastructure

```bash
# Copy entire .agent-admin directory structure
# Source: PartPulse/.agent-admin/
# Destination: maturion-foreman-office-app/.agent-admin/

mkdir -p .agent-admin/{change-records,completion-reports,evidence,proposals,risk-assessments,scans,self-assessments,sessions/CodexAdvisor}

# Copy template files (examples and completion summaries)
# - COMPLETION_SUMMARY.md
# - EXAMPLE_COMPLETION_SUMMARY.md
# - COMPLETION_SUMMARY_QIW_IMPLEMENTATION.md
# - COMPLETION_SUMMARY_V2.5.0_UPGRADE.md
# - ISSUE_COMMENT_DRAFT.md
# - ISSUE_RESPONSE_EMERGENCY_SELF_REVIEW.md
# - TASK_COMPLETION_SUMMARY_EMERGENCY_SELF_REVIEW.md

# Copy subdirectory contents:
# - change-records/ (template files)
# - completion-reports/ (template files)
# - evidence/ (template files)
# - proposals/ (template files)
# - risk-assessments/ (template files)
# - scans/ (template files)
# - self-assessments/ (template files)

# Note: Clear any session-specific content, keep only templates
```

### Step 4: Update .agent Configuration

**If `.agent` file exists**, update it:

```yaml
agents:
  oversight:
    - id: codex-advisor
      path: .github/agents/CodexAdvisor-agent.md
      version: 5.0.0  # ← Update version
      role: cross-repository-coordination
  
  governance:
    - id: governance-liaison
      path: .github/agents/governance-liaison.md
      version: 5.0.0  # ← Update version
      role: governance-enforcement
```

**If `.agent` file doesn't exist**, check if governance structure exists in another location or create minimal .agent file referencing the new contracts.

### Step 5: Commit and Push

```bash
git add .github/agents/CodexAdvisor-agent.md
git add .github/agents/governance-liaison.md
git add .agent-admin/
git add .agent  # if modified

git commit -m "Governance Ripple: Living Agent System v5.0.0

Layer down from PartPulse PR #225 (commit 1230f51)

Changes:
- CodexAdvisor-agent v5.0.0
- governance-liaison v5.0.0
- .agent-admin infrastructure
- .agent configuration update

Source: APGI-cmy/PartPulse
Authority: CodexAdvisor-agent v5.0.0"

git push origin governance/living-agent-system-v5.0.0
```

### Step 6: Create Pull Request

```bash
gh pr create \
  --title "Governance Ripple: Living Agent System v5.0.0" \
  --body "## Governance Ripple

Layer down Living Agent System v5.0.0 from PartPulse.

**Source**: APGI-cmy/PartPulse PR #225 (commit 1230f51)
**Authority**: CodexAdvisor-agent v5.0.0

### Changes
- CodexAdvisor-agent: → v5.0.0
- governance-liaison: → v5.0.0
- .agent-admin/: Infrastructure added
- .agent: Configuration updated

### Governance Context
- TIER_0 Canon: v5.0.0
- Protocol: LIVING_AGENT_SYSTEM
- Approval: CS2

### Validation
- [ ] CI workflows pass
- [ ] No breaking changes
- [ ] Gate validations complete

**Ready for review and merge.**" \
  --label "governance,tier-0,layer-down" \
  --base main
```

### Step 7: Review and Merge

1. Wait for CI workflows to complete
2. Review automated checks
3. Merge when ready
4. Delete feature branch

---

## Target Repository 2: R_Roster

**Repeat Steps 1-7 above, but**:

- Use repository: `APGI-cmy/R_Roster`
- Update `.github/agents/governance-liaison.md` scope:
  ```yaml
  scope:
    repository: APGI-cmy/R_Roster  # ← Update repo name
  ```

---

## Verification Checklist

After completing both repositories:

### maturion-foreman-office-app
- [ ] PR created: `governance/living-agent-system-v5.0.0`
- [ ] CodexAdvisor-agent.md v5.0.0 with `this_copy: layered-down`
- [ ] governance-liaison.md v5.0.0 with correct repository scope
- [ ] .agent-admin/ infrastructure complete
- [ ] .agent configuration updated
- [ ] CI workflows passing
- [ ] PR merged to main
- [ ] Feature branch deleted

### R_Roster
- [ ] PR created: `governance/living-agent-system-v5.0.0`
- [ ] CodexAdvisor-agent.md v5.0.0 with `this_copy: layered-down`
- [ ] governance-liaison.md v5.0.0 with correct repository scope
- [ ] .agent-admin/ infrastructure complete
- [ ] .agent configuration updated
- [ ] CI workflows passing
- [ ] PR merged to main
- [ ] Feature branch deleted

---

## Rollback Procedure

If issues are discovered during execution:

```bash
# Close PR without merging
gh pr close <PR_NUMBER>

# Delete feature branch
git push origin --delete governance/living-agent-system-v5.0.0

# Local cleanup
git checkout main
git branch -D governance/living-agent-system-v5.0.0
```

Target repository remains unchanged.

---

## Success Criteria

✅ Both repositories updated to Living Agent System v5.0.0
✅ All PRs merged to main branches
✅ CI workflows passing
✅ No governance drift
✅ Session documented

---

## Post-Execution

After successful completion, notify CodexAdvisor with:

1. PR links for both repositories
2. Merge commit hashes
3. Any issues encountered
4. Confirmation of successful completion

CodexAdvisor will:
- Update session contract with outcome
- Document in PREHANDOVER_PROOF
- Close session

---

## Troubleshooting

### Issue: CI Workflows Fail
**Solution**: Review workflow logs, fix issues, push corrections

### Issue: Merge Conflicts
**Solution**: Manually resolve conflicts, ensuring v5.0.0 contracts are preserved

### Issue: Missing .agent File
**Solution**: Check for alternative governance structure or create minimal .agent file

### Issue: Repository Structure Different
**Solution**: Adapt paths as needed, maintain governance compliance

---

## Questions During Execution

If questions arise during manual execution:

1. **Structural Questions**: Refer to PartPulse as canonical example
2. **Governance Questions**: Escalate to CodexAdvisor
3. **Technical Issues**: Follow standard repository practices

---

**CS2: Execute steps above for both target repositories, then notify CodexAdvisor of completion.**

---

**Guide Authority**: CodexAdvisor-agent v5.0.0
**Governance**: LIVING_AGENT_SYSTEM | TIER_0_CANON_MANIFEST.json
**Session**: codex-20260208-064000
