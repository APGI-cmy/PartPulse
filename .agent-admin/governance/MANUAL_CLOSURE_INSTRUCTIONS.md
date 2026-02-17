# Manual Bulk Closure Instructions

## Overview
This document provides step-by-step instructions for manually closing the 10 stale drift/ripple issues if the automated workflow fails or cannot be executed.

## Automated Closure (Recommended)

### Option 1: GitHub Actions Workflow

A workflow has been created at `.github/workflows/bulk-close-stale-issues.yml` for automated closure.

**To execute:**
1. Navigate to: https://github.com/APGI-cmy/PartPulse/actions/workflows/bulk-close-stale-issues.yml
2. Click "Run workflow"
3. Type "CONFIRM" in the confirmation field
4. Click "Run workflow" button
5. Monitor the workflow run for completion

**Requirements:**
- Requires `issues: write` permission
- Must be executed by repository administrator
- Confirmation input required to prevent accidental execution

### Option 2: Bash Script

A bash script is provided at `scripts/bulk-close-stale-issues.sh`.

**To execute:**
```bash
cd /home/runner/work/PartPulse/PartPulse
bash scripts/bulk-close-stale-issues.sh
```

**Requirements:**
- GitHub CLI (`gh`) must be installed
- Must be authenticated: `gh auth login`
- Requires `issues: write` permission

---

## Manual Closure (Fallback)

If automated methods fail, follow these steps for each issue:

### Issues to Close

| Issue # | Title |
|---------|-------|
| #168 | Governance: Update FRS Template to Mandate Wiring Specifications |
| #182 | Upgrade All Agent Contracts to Canonical v2.5.0 |
| #193 | Governance Ripple: Layer down STOP_AND_FIX_DOCTRINE.md |
| #195 | Governance Ripple: Layer down STOP_AND_FIX_DOCTRINE.md (duplicate) |
| #218 | [GOVERNANCE VIOLATION] Remediate YAML Errors |
| #249 | [Layerdown] Canon inventory, .gitattributes, and QA_POLICY_MASTER.md |
| #253 | [Foreman Agent] Phase 2: Complete gold-standard structure alignment |
| #257 | Bootstrap automated ripple listener & cross-repo alignment PR workflow |
| #272 | Scheduled Governance Alignment: Drift Detected |
| #284 | Scheduled Governance Alignment: Drift Detected |

### Closure Steps (Per Issue)

1. **Navigate to issue**: https://github.com/APGI-cmy/PartPulse/issues/[ISSUE_NUMBER]

2. **Post closure comment**: Copy the text below and post as a comment

```markdown
## Bulk Closure: Stale Drift/Ripple Issue

This issue is being closed as part of a bulk cleanup operation for stale governance drift/ripple issues.

### Resolution Context
This issue was created before **February 15, 2026** and is now obsolete due to recent fixes:

- **PR #305** - Fixed governance ripple receiver payload incompatibility
- **PR #316** - Fixed directory context bug in alignment PR creation  
- **PR #298** - Fixed duplicate PR pileup and auto-merge failure

### Current Status
The governance ripple system is now operational with:
- ✅ Correct payload field handling (commit_sha, source_repo, commit_message)
- ✅ Proper directory context for git operations
- ✅ Single stable branch name preventing duplicate PRs
- ✅ Auto-merge enabled on alignment PRs

### Evidence
- Audit Report: maturion-foreman-governance/pull/1141
- System Health: `.agent-admin/governance/SYSTEM_HEALTH_REPORT_2026-02-17.md`
- Bulk Closure Audit: `.agent-admin/governance/BULK_CLOSURE_AUDIT_2026-02-17.md`
- Recent successful alignment: PR #313+ (post-fix)

### Action Required
No action required. The governance alignment system will automatically handle future drift detection.

---

**Bulk Closure Authority**: Governance Liaison Agent  
**Closure Date**: 2026-02-17  
**Reference**: Issue #356 (Bulk Close Drift/Ripple Issues)
```

3. **Close the issue**:
   - Click "Close issue" button
   - Select reason: "Not planned"
   - Confirm closure

4. **Repeat** for all 10 issues listed above

---

## Verification

After closure (automated or manual), verify:

1. **All 10 issues closed**:
   ```bash
   gh issue list --repo APGI-cmy/PartPulse --state closed --search "168 OR 182 OR 193 OR 195 OR 218 OR 249 OR 253 OR 257 OR 272 OR 284"
   ```

2. **Closure comments present**:
   - Check each issue has the bulk closure comment
   - Verify "Bulk Closure Authority" appears in comment

3. **Remaining open issues are recent** (created after Feb 15, 2026):
   ```bash
   gh issue list --repo APGI-cmy/PartPulse --label governance-ripple-required --state open
   ```

---

## Troubleshooting

### "Permission denied" errors

**Cause**: Insufficient permissions for issue operations

**Solution**: 
- Ensure you have `triage` or higher permissions on the repository
- Contact repository administrator for permission grant
- Use repository admin account to execute workflow

### "Issue not found" errors

**Cause**: Issue may have been already closed or deleted

**Solution**:
- Skip that issue number
- Continue with remaining issues
- Document which issues were not found in closure audit

### "Rate limit exceeded" errors

**Cause**: GitHub API rate limit reached (5000/hour for authenticated users)

**Solution**:
- Wait 1 hour and retry
- Close issues in smaller batches
- Use workflow_dispatch which has higher rate limits

---

## Success Criteria

✅ All 10 stale issues successfully closed  
✅ Closure comment posted on each issue  
✅ Issues marked as "Not planned"  
✅ No errors in execution logs  
✅ Audit trail documented in `.agent-admin/governance/`

---

## Post-Closure

After successful closure:

1. **Update audit log**: Document actual closure timestamp in `BULK_CLOSURE_AUDIT_2026-02-17.md`
2. **Monitor remaining issues**: Verify they auto-resolve via alignment PR auto-merge
3. **Report completion**: Update Issue #356 with completion status
4. **Session closure**: Execute `bash .github/scripts/session-closure.sh governance-liaison`

---

**Document Version**: 1.0.0  
**Created**: 2026-02-17  
**Authority**: GOVERNANCE_LIAISON_ROLE_SURVEY.md
