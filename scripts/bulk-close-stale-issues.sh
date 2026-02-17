#!/bin/bash
# Bulk Close Stale Drift/Ripple Issues
# Authority: GOVERNANCE_LIAISON_ROLE_SURVEY.md
# Purpose: Clean up drift/ripple issues created before Feb 15, 2026

set -e

REPO="APGI-cmy/PartPulse"
CLOSURE_DATE="2026-02-17"

# Array of stale issue numbers (created before 2026-02-15)
STALE_ISSUES=(168 182 193 195 218 249 253 257 272 284)

# Resolution comment template
read -r -d '' RESOLUTION_COMMENT << 'EOF' || true
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
**Closure Date**: CLOSURE_DATE  
**Reference**: Issue #356 (Bulk Close Drift/Ripple Issues)
EOF

# Replace CLOSURE_DATE placeholder
RESOLUTION_COMMENT="${RESOLUTION_COMMENT//CLOSURE_DATE/$CLOSURE_DATE}"

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  BULK CLOSING STALE DRIFT/RIPPLE ISSUES"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "Repository: $REPO"
echo "Total Issues to Close: ${#STALE_ISSUES[@]}"
echo "Closure Date: $CLOSURE_DATE"
echo ""

# Check if gh CLI is available and authenticated
if ! command -v gh &> /dev/null; then
    echo "❌ Error: gh CLI not found"
    echo "ℹ️  Please install GitHub CLI: https://cli.github.com/"
    exit 1
fi

if ! gh auth status &> /dev/null; then
    echo "⚠️  Warning: gh CLI not authenticated"
    echo "ℹ️  Running in preview mode only"
    echo ""
    echo "Issues to be closed:"
    for ISSUE_NUM in "${STALE_ISSUES[@]}"; do
        echo "  - #$ISSUE_NUM"
    done
    echo ""
    echo "To close these issues, authenticate gh CLI first:"
    echo "  gh auth login"
    exit 0
fi

# Track results
SUCCESSFUL=0
FAILED=0

for ISSUE_NUM in "${STALE_ISSUES[@]}"; do
    echo "Processing Issue #$ISSUE_NUM..."
    
    # Add comment
    if gh issue comment "$ISSUE_NUM" --repo "$REPO" --body "$RESOLUTION_COMMENT" 2>&1; then
        echo "  ✅ Added closure comment"
    else
        echo "  ⚠️  Failed to add comment (may not exist or lack permissions)"
        ((FAILED++))
        echo ""
        continue
    fi
    
    # Close issue
    if gh issue close "$ISSUE_NUM" --repo "$REPO" --reason "not_planned" 2>&1; then
        echo "  ✅ Closed issue #$ISSUE_NUM"
        ((SUCCESSFUL++))
    else
        echo "  ❌ Failed to close #$ISSUE_NUM"
        ((FAILED++))
    fi
    
    echo ""
done

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  BULK CLOSURE COMPLETE"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "Summary:"
echo "  Total Issues: ${#STALE_ISSUES[@]}"
echo "  Successfully Closed: $SUCCESSFUL"
echo "  Failed: $FAILED"
echo ""

if [ $FAILED -gt 0 ]; then
    echo "⚠️  Some issues failed to close - review output above"
    exit 1
fi

echo "✅ All stale issues successfully closed"
