# Manual Governance Ripple Test Procedure

## Overview
This document provides instructions for testing the governance ripple receiver end-to-end.

## Prerequisites
- GitHub Actions must be enabled on the repository
- MATURION_BOT_TOKEN secret must be configured
- User must have workflow dispatch permissions

## Test Method 1: Manual Workflow Dispatch (Local Test)

### Via GitHub UI:
1. Navigate to Actions tab in GitHub
2. Select "Governance Ripple Sync" workflow
3. Click "Run workflow" button
4. Fill in optional test parameters:
   - canonical_commit: (leave empty to fetch latest)
   - inventory_version: "1.0.0" (or leave empty)
   - dispatch_id: "test-manual-001" (or leave empty for auto-generation)
5. Click "Run workflow" to trigger

### Via GitHub CLI:
```bash
gh workflow run governance-ripple-sync.yml \
  --ref main \
  -f canonical_commit="" \
  -f inventory_version="1.0.0" \
  -f dispatch_id="test-manual-001"
```

### Expected Results:
- Workflow executes successfully
- Ripple event is logged to `.agent-admin/governance/ripple-log.json`
- Alignment check runs against canonical governance repo
- If drift detected, creates alignment PR
- If aligned, logs success

## Test Method 2: Repository Dispatch (Production Test)

### From Canonical Governance Repo:
The canonical governance repo (APGI-cmy/maturion-foreman-governance) should have a dispatch workflow that sends ripple events to consumer repos.

### Manual dispatch from governance repo:
```bash
gh api repos/APGI-cmy/PartPulse/dispatches \
  --method POST \
  --field event_type='governance_ripple' \
  --raw-field client_payload='{
    "canonical_commit": "abc123...",
    "inventory_version": "1.0.0",
    "dispatch_id": "ripple-001",
    "timestamp": "2026-02-14T14:00:00Z",
    "sender": "maturion-foreman-governance"
  }'
```

### Expected Results:
- Repository dispatch event triggers governance-ripple-sync.yml
- Same validation flow as manual test
- Event logged with repository_dispatch metadata

## Verification Steps

After triggering either test method:

1. **Check Workflow Run**:
   ```bash
   gh run list --workflow=governance-ripple-sync.yml --limit 1
   ```

2. **View Workflow Logs**:
   ```bash
   gh run view <run-id> --log
   ```

3. **Check Ripple Log**:
   ```bash
   cat .agent-admin/governance/ripple-log.json | jq .
   ```

4. **Check Sync State**:
   ```bash
   cat .agent-admin/governance/sync_state.json | jq .
   ```

5. **Check for Alignment PRs**:
   ```bash
   gh pr list --label "governance-ripple-required"
   ```

## Success Criteria

✅ Workflow completes without errors
✅ Ripple event logged to ripple-log.json
✅ Alignment check executes (fetches canonical governance)
✅ Sync state updated with latest canonical commit
✅ If drift detected, PR created with governance-ripple-required label
✅ If aligned, no PR created and logs show "ALIGNMENT VERIFIED"

## Troubleshooting

### Workflow doesn't trigger
- Check if workflow is enabled in repository settings
- Verify permissions are correct (contents:write, pull-requests:write)
- Check if MATURION_BOT_TOKEN has necessary scopes

### Alignment check fails
- Verify canonical repo URL is correct
- Check network connectivity to github.com
- Verify git clone succeeds in workflow logs

### PR creation fails
- Check MATURION_BOT_TOKEN is configured
- Verify token has pull_request write permissions
- Check rate limits haven't been exceeded

## Next Steps for Complete Testing

Since automated workflow dispatch is restricted in this environment, here's how to complete the end-to-end test:

### Option 1: Test via GitHub UI (Recommended)
1. Merge this PR to enable the workflow_dispatch trigger
2. Navigate to Actions → Governance Ripple Sync
3. Click "Run workflow" and execute with default parameters
4. Monitor the workflow run logs
5. Verify ripple-log.json is updated
6. Check if alignment PR is created (if drift detected)

### Option 2: Test via Repository Dispatch
1. From the canonical governance repo (APGI-cmy/maturion-foreman-governance)
2. Trigger the dispatch sender workflow targeting this repo
3. Verify event is received and processed
4. Check workflow runs and ripple logs

### Option 3: Wait for Scheduled Fallback
1. The hourly scheduled workflow (governance-alignment-schedule.yml) will run automatically
2. This provides equivalent functionality via polling
3. Monitor workflow runs in the Actions tab
4. Verify alignment checks are occurring on schedule
