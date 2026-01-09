# GitHub Labels Configuration for Defect Resolution

## Purpose
This document defines the GitHub labels required for defect resolution and maintenance in accordance with the Defect Resolution and Maintenance Canon.

**Canonical Reference**: `maturion-foreman-governance/governance/canon/DEFECT_RESOLUTION_MAINTENANCE_CANON.md`  
**Effective Date**: 2026-01-09

---

## Required Labels

### Classification Labels

Labels to classify the type of defect:

| Label | Color | Description |
|-------|-------|-------------|
| `defect-bug` | `#d73a4a` (red) | Functional defect - behavior does not match specification |
| `defect-feature` | `#0075ca` (blue) | Missing capability - required functionality not implemented |
| `defect-tech-debt` | `#fbca04` (yellow) | Quality/architectural issue - creates maintenance burden |

### Severity Labels

Labels to indicate defect severity:

| Label | Color | Description |
|-------|-------|-------------|
| `severity-critical` | `#b60205` (dark red) | Production down, data loss, security breach, blocking users |
| `severity-high` | `#d93f0b` (orange-red) | Major functionality broken, significant user impact |
| `severity-medium` | `#fbca04` (yellow) | Functionality degraded, moderate user impact, workaround available |
| `severity-low` | `#0e8a16` (green) | Minor issue, cosmetic, limited impact |

### Status Labels

Labels to track fix progress:

| Label | Color | Description |
|-------|-------|-------------|
| `fix-in-progress` | `#1d76db` (blue) | Fix work underway |
| `fix-deployed` | `#0e8a16` (green) | Fix deployed to production |
| `fix-verified` | `#006b75` (teal) | Defect confirmed resolved in production |

### Special Labels

Additional labels for governance:

| Label | Color | Description |
|-------|-------|-------------|
| `governance` | `#5319e7` (purple) | Governance-related issue |
| `enhancement` | `#a2eeef` (light blue) | New feature request (not a defect) |
| `ripple` | `#e99695` (pink) | Requires cross-repo awareness |

---

## Label Creation Instructions

### Via GitHub Web Interface

1. Navigate to repository Settings
2. Go to Labels section
3. Click "New label" for each required label
4. Enter name, description, and color code
5. Click "Create label"

### Via GitHub CLI

```bash
# Classification Labels
gh label create "defect-bug" --color d73a4a --description "Functional defect - behavior does not match specification"
gh label create "defect-feature" --color 0075ca --description "Missing capability - required functionality not implemented"
gh label create "defect-tech-debt" --color fbca04 --description "Quality/architectural issue - creates maintenance burden"

# Severity Labels
gh label create "severity-critical" --color b60205 --description "Production down, data loss, security breach, blocking users"
gh label create "severity-high" --color d93f0b --description "Major functionality broken, significant user impact"
gh label create "severity-medium" --color fbca04 --description "Functionality degraded, moderate user impact, workaround available"
gh label create "severity-low" --color 0e8a16 --description "Minor issue, cosmetic, limited impact"

# Status Labels
gh label create "fix-in-progress" --color 1d76db --description "Fix work underway"
gh label create "fix-deployed" --color 0e8a16 --description "Fix deployed to production"
gh label create "fix-verified" --color 006b75 --description "Defect confirmed resolved in production"

# Special Labels
gh label create "ripple" --color e99695 --description "Requires cross-repo awareness"
```

---

## Label Usage Guidelines

### Defect Classification (Required)

**Every defect MUST have exactly ONE classification label:**
- `defect-bug` - For functional defects
- `defect-feature` - For missing functionality
- `defect-tech-debt` - For quality/architectural issues

Applied: During defect triage

### Severity Assessment (Required)

**Every defect MUST have exactly ONE severity label:**
- `severity-critical` - Immediate response required
- `severity-high` - Response within 24 hours
- `severity-medium` - Next sprint planning
- `severity-low` - Backlog prioritization

Applied: During defect triage

### Status Tracking (Optional but Recommended)

**Track fix progress with status labels:**
- `fix-in-progress` - Applied when builder appointed
- `fix-deployed` - Applied when fix deployed to production
- `fix-verified` - Applied when defect verified resolved

Applied: Throughout fix lifecycle

### Special Labels (As Needed)

**Apply when relevant:**
- `governance` - Already exists, use for governance-related items
- `enhancement` - Already exists, use for new features (not defects)
- `ripple` - Use when defect pattern may exist in other repos

---

## Label Validation

### Issue Template Integration

Defect issue templates automatically apply:
- Classification label (`defect-bug`, `defect-feature`, `defect-tech-debt`)
- User selects severity during issue creation

### Manual Verification

Governance Liaison should periodically verify:
- All defect issues have classification label
- All defect issues have severity label
- Status labels updated as fix progresses

### Automation (Future)

Consider GitHub Actions workflow to:
- Validate defect issues have required labels
- Alert if labels missing
- Auto-update status labels based on PR events

---

## Label Migration

### Existing Issues

For issues created before this canon:
1. Review open issues without classification labels
2. Apply appropriate `defect-*` label if issue is a defect
3. Apply appropriate `severity-*` label
4. Document in issue comment why labels applied

### Bulk Label Application

Use GitHub CLI for bulk updates:
```bash
# Example: Label all issues with "bug" label as "defect-bug"
gh issue list --label bug --json number --jq '.[].number' | \
  xargs -I {} gh issue edit {} --add-label defect-bug

# Example: Add severity-high to all critical bugs
gh issue list --label defect-bug --json number --jq '.[].number' | \
  xargs -I {} gh issue edit {} --add-label severity-high
```

---

## Label Maintenance

### Regular Review

Governance Liaison reviews labels:
- Quarterly: Verify labels still align with canonical requirements
- After canon updates: Add/update labels as needed
- As needed: Add labels for new governance categories

### Label Changes

If canonical requirements change:
1. Update this document
2. Create/update labels in GitHub
3. Update issue templates
4. Communicate changes to team
5. Create visibility event (if significant)

---

## References

- **Canonical Source**: `maturion-foreman-governance/governance/canon/DEFECT_RESOLUTION_MAINTENANCE_CANON.md`
- **Process Documentation**: `/docs/defect-resolution-process.md`
- **Issue Templates**: `.github/ISSUE_TEMPLATE/defect-*.yml`

---

**Version**: 1.0.0  
**Last Updated**: 2026-01-09  
**Next Review**: 2026-04-09

---

**END OF LABELS CONFIGURATION**
