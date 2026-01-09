# Label Creation Verification Checklist

**Issue**: [GOVERNANCE] Create Required Labels for Defect Resolution Process  
**Date**: 2026-01-09  
**Status**: Pending Manual Execution  

## Purpose

This document provides a verification checklist for creating the 11 required GitHub labels for the Defect Resolution Process (implemented in PR #136).

## Why Manual Creation Required

GitHub labels **cannot be created via Git commits**. They require:
- GitHub API access via `gh` CLI with authentication, OR
- Manual creation in GitHub Web UI

This is a GitHub platform limitation, not a repository configuration.

## Quick Start Options

### Option 1: Automated Script (Recommended - 2 minutes)

**Prerequisites**:
- GitHub CLI (`gh`) installed
- Authenticated with repository access

**Steps**:
```bash
# 1. Ensure you're in repository root
cd /home/runner/work/PartPulse/PartPulse

# 2. Make script executable
chmod +x scripts/create-defect-labels.sh

# 3. Run script
bash scripts/create-defect-labels.sh
```

**Expected Output**:
- 11 labels created or already exists warnings
- Success confirmation message
- Verification links

### Option 2: Manual GitHub CLI (2 minutes)

Copy and paste these commands into your terminal (requires `gh` CLI authentication):

```bash
# Classification Labels
gh label create "defect-bug" --color d73a4a --description "Functional defect - behavior does not match specification" --force
gh label create "defect-feature" --color 0075ca --description "Missing capability - required functionality not implemented" --force
gh label create "defect-tech-debt" --color fbca04 --description "Quality/architectural issue - creates maintenance burden" --force

# Severity Labels
gh label create "severity-critical" --color b60205 --description "Production down, data loss, security breach, blocking users" --force
gh label create "severity-high" --color d93f0b --description "Major functionality broken, significant user impact" --force
gh label create "severity-medium" --color fbca04 --description "Functionality degraded, moderate user impact, workaround available" --force
gh label create "severity-low" --color 0e8a16 --description "Minor issue, cosmetic, limited impact" --force

# Status Labels
gh label create "fix-in-progress" --color 1d76db --description "Fix work underway" --force
gh label create "fix-deployed" --color 0e8a16 --description "Fix deployed to production" --force
gh label create "fix-verified" --color 006b75 --description "Defect confirmed resolved in production" --force

# Special Label
gh label create "ripple" --color e99695 --description "Requires cross-repo awareness" --force
```

### Option 3: GitHub Web UI (10 minutes)

**Steps**:
1. Navigate to: https://github.com/APGI-cmy/PartPulse/labels
2. Click "New label" button
3. For each label below, enter name, color, and description
4. Click "Create label"

## Required Labels Table

| # | Label Name | Color | Description |
|---|------------|-------|-------------|
| 1 | `defect-bug` | `#d73a4a` | Functional defect - behavior does not match specification |
| 2 | `defect-feature` | `#0075ca` | Missing capability - required functionality not implemented |
| 3 | `defect-tech-debt` | `#fbca04` | Quality/architectural issue - creates maintenance burden |
| 4 | `severity-critical` | `#b60205` | Production down, data loss, security breach, blocking users |
| 5 | `severity-high` | `#d93f0b` | Major functionality broken, significant user impact |
| 6 | `severity-medium` | `#fbca04` | Functionality degraded, moderate user impact, workaround available |
| 7 | `severity-low` | `#0e8a16` | Minor issue, cosmetic, limited impact |
| 8 | `fix-in-progress` | `#1d76db` | Fix work underway |
| 9 | `fix-deployed` | `#0e8a16` | Fix deployed to production |
| 10 | `fix-verified` | `#006b75` | Defect confirmed resolved in production |
| 11 | `ripple` | `#e99695` | Requires cross-repo awareness |

## Verification Checklist

After label creation, verify completion:

### Step 1: Visual Verification
- [ ] Navigate to: https://github.com/APGI-cmy/PartPulse/labels
- [ ] Confirm all 11 labels visible in labels list
- [ ] Verify colors match expected values (see table above)
- [ ] Verify descriptions are complete

### Step 2: Functional Verification
- [ ] Go to: https://github.com/APGI-cmy/PartPulse/issues/new/choose
- [ ] Open one defect template (e.g., "Defect Report - Bug")
- [ ] Verify `defect-bug` label is auto-applied (check labels section)
- [ ] Verify severity labels appear in label picker dropdown

### Step 3: CLI Verification (Optional)
If you have `gh` CLI access:
```bash
gh label list | grep -E "defect-|severity-|fix-|ripple"
```

Expected output: 11 labels listed

### Step 4: Documentation Verification
- [ ] Open `/docs/github-labels-configuration.md`
- [ ] Confirm documentation matches created labels
- [ ] No discrepancies in names, colors, or descriptions

## Troubleshooting

### Error: "gh: command not found"
**Solution**: Install GitHub CLI
- macOS: `brew install gh`
- Ubuntu: `sudo apt install gh`
- Windows: Download from https://cli.github.com/

### Error: "To use GitHub CLI in a GitHub Actions workflow, set the GH_TOKEN environment variable"
**Solution**: Authenticate gh CLI
```bash
gh auth login
```
Follow prompts to authenticate with your GitHub account.

### Error: "Label already exists"
**Solution**: This is expected if label was manually created. Verify the label matches requirements:
```bash
gh label list | grep "LABEL_NAME"
```

### Labels created but not visible in issue templates
**Solution**: 
1. Check label name spelling matches exactly (case-sensitive)
2. Verify label exists: https://github.com/APGI-cmy/PartPulse/labels
3. Try creating a test issue to confirm auto-application

## Completion Evidence

After successful creation, provide evidence:

1. **Screenshot**: Capture labels list from GitHub UI showing all 11 labels
2. **CLI Output**: Run `gh label list` and save output
3. **Test Issue**: Create a test defect issue showing auto-applied labels

**Post evidence to**: Original issue requesting label creation

## References

- **Issue**: [Link to issue requesting label creation]
- **PR #136**: Defect Resolution Canon Implementation
- **Documentation**: `/docs/github-labels-configuration.md`
- **Process**: `/docs/defect-resolution-process.md`
- **Canonical Source**: `maturion-foreman-governance/governance/canon/DEFECT_RESOLUTION_MAINTENANCE_CANON.md`

---

**Version**: 1.0.0  
**Created**: 2026-01-09  
**Author**: Governance Liaison Agent  
**Status**: Ready for Manual Execution
