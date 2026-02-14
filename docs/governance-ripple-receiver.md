# Governance Ripple Receiver and Alignment Infrastructure

## Overview

This document describes the automated governance ripple receiver and alignment infrastructure for PartPulse consumer repository. The infrastructure ensures continuous alignment with canonical governance from `APGI-cmy/maturion-foreman-governance`.

**Authority**: 
- CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md v1.0.0
- GOVERNANCE_RIPPLE_DETECTION_PROTOCOL.md v1.0.0
- GOVERNANCE_LIAISON_ROLE_SURVEY.md

**Version**: 1.0.0  
**Created**: 2026-02-14

---

## Architecture

### Components

1. **Push Ripple Receiver** (`.github/workflows/governance-ripple-sync.yml`)
   - Listens for `repository_dispatch` events with type `governance_ripple`
   - Receives payload from canonical governance repo
   - Triggers immediate alignment check
   - Creates PR on drift detection

2. **Scheduled Fallback** (`.github/workflows/governance-alignment-schedule.yml`)
   - Runs hourly as mandated fallback mechanism
   - Ensures eventual consistency
   - Recovers from missed dispatch events

3. **Alignment Script** (`.github/scripts/align-governance.sh`)
   - Core alignment logic
   - Fetches canonical governance
   - Detects drift
   - Creates alignment PRs with bot token
   - Maintains evidence artifacts

4. **Evidence Directory** (`.agent-admin/governance/`)
   - `ripple-log.json` - Tracks all ripple events
   - `sync_state.json` - Current alignment status
   - `drift/` - Drift detection logs

---

## Transport Modes

### Mode 1: Push Ripple (Primary)

**Trigger**: `repository_dispatch` event from canonical governance repo

**Payload Format**:
```json
{
  "event_type": "governance_ripple",
  "canonical_commit": "<sha>",
  "inventory_version": "<version>",
  "changed_paths": ["..."],
  "sender": "APGI-cmy/maturion-foreman-governance",
  "dispatch_id": "<uuid>",
  "timestamp": "<iso-8601>"
}
```

**Flow**:
1. Canonical governance repo triggers dispatch on merge to main
2. This repo receives event via `repository_dispatch` trigger
3. Workflow logs event to `.agent-admin/governance/ripple-log.json`
4. Workflow calls `align-governance.sh` with canonical commit and version
5. Script detects drift by comparing commits and versions
6. On drift: creates PR with MATURION_BOT_TOKEN
7. On alignment: updates sync state

**SLA**: Alignment PR created within 30 minutes of drift detection

### Mode 2: Scheduled Fallback

**Trigger**: Hourly cron schedule (`0 * * * *`)

**Flow**:
1. Workflow triggers on schedule
2. Workflow calls `align-governance.sh` without arguments
3. Script fetches latest canonical governance from GitHub
4. Script compares with current sync state
5. On drift: creates PR with MATURION_BOT_TOKEN
6. On alignment: updates sync state

**SLA**: Hourly checks ensure eventual consistency

**Purpose**: Recover from missed dispatch events, network failures, or GitHub downtime

---

## Alignment Protocol

### Drift Detection

The alignment script detects drift when:
- Canonical commit differs from sync state
- Inventory version differs from sync state
- New governance changes merged to canonical repo

### Drift Response

On drift detection:
1. Log drift to `.agent-admin/governance/drift/drift-<timestamp>.json`
2. Update sync state with `drift_detected: true`
3. Create git branch `governance/auto-align-<timestamp>`
4. Commit drift evidence
5. Push branch
6. Create PR with:
   - Title: "governance: automatic alignment required"
   - Body: Drift details and remediation steps
   - Labels: `governance-ripple-required`, `governance-only`

### Alignment PR Review

When alignment PR is created:
1. **Governance-liaison** reviews drift log
2. Execute 7-step layer-down protocol:
   - Read ripple manifest (from drift log)
   - Identify affected artifacts
   - Assess local impact
   - **Verify SHA256 hashes** (REQ-CM-001 - MANDATORY)
   - Apply layer-down updates
   - Validate integrity
   - Document evidence
3. Update local governance artifacts
4. Update sync state on completion
5. Merge PR

---

## Evidence Artifacts

### Ripple Log (`.agent-admin/governance/ripple-log.json`)

Tracks all ripple events received:

```json
{
  "ripple_events": [
    {
      "event_type": "governance_ripple",
      "canonical_commit": "abc123...",
      "inventory_version": "1.2.3",
      "dispatch_id": "uuid-...",
      "timestamp": "2026-02-14T12:00:00Z",
      "sender": "APGI-cmy/maturion-foreman-governance",
      "received_at": "2026-02-14T12:00:01Z",
      "status": "completed"
    }
  ],
  "last_updated": "2026-02-14T12:00:01Z",
  "schema_version": "1.0.0"
}
```

### Sync State (`.agent-admin/governance/sync_state.json`)

Current alignment status:

```json
{
  "last_sync": "2026-02-14T12:00:00Z",
  "canonical_commit": "abc123...",
  "inventory_version": "1.2.3",
  "alignment_status": "aligned",
  "drift_detected": false,
  "last_check": "2026-02-14T12:00:01Z",
  "schema_version": "1.0.0"
}
```

### Drift Logs (`.agent-admin/governance/drift/`)

Per-drift evidence:

```json
{
  "timestamp": "2026-02-14T12:00:00Z",
  "current_commit": "abc123...",
  "target_commit": "def456...",
  "current_version": "1.2.2",
  "target_version": "1.2.3",
  "reasons": [
    "Canonical commit behind: abc123 -> def456",
    "Inventory version mismatch: 1.2.2 -> 1.2.3"
  ]
}
```

---

## Permissions and Secrets

### Required Secret: MATURION_BOT_TOKEN

**Purpose**: Create PRs and issues automatically

**Permissions Required**:
- `contents: write` - Push branches
- `pull-requests: write` - Create PRs
- `issues: write` - Create tracking issues

**Configuration**: Must be set in repository secrets as `MATURION_BOT_TOKEN`

---

## Merge Gate Integration

### Existing Gates (Already Configured)

The following gates from `.github/workflows/merge-gate-interface.yml` support governance alignment:

1. **`merge-gate/verdict`** - Validates evidence artifacts
2. **`governance/alignment`** - Validates canon integrity and sync
3. **`stop-and-fix/enforcement`** - Validates RCA on failures

These gates check for:
- Canon hash integrity (no placeholders per REQ-CM-001)
- Governance sync state
- Protected file changes

**No changes needed** - gates already configured.

---

## Testing and Validation

### Manual Test: Scheduled Alignment

```bash
# Trigger scheduled workflow manually
gh workflow run governance-alignment-schedule.yml
```

### Manual Test: Alignment Script

```bash
# Test alignment check locally
.github/scripts/align-governance.sh
```

### Workflow Syntax Validation

```bash
# Validate workflow YAML
yamllint .github/workflows/governance-ripple-sync.yml
yamllint .github/workflows/governance-alignment-schedule.yml
```

---

## Troubleshooting

### Issue: Alignment PR not created on drift

**Possible Causes**:
- MATURION_BOT_TOKEN not set or invalid
- Not running in CI environment
- GitHub CLI (`gh`) not available

**Solution**:
1. Verify secret exists: Repository Settings → Secrets → MATURION_BOT_TOKEN
2. Check workflow logs for authentication errors
3. Verify bot token has required permissions

### Issue: Drift detected but no drift log created

**Possible Causes**:
- `.agent-admin/governance/drift/` directory missing
- Permission issues

**Solution**:
```bash
mkdir -p .agent-admin/governance/drift
chmod 755 .agent-admin/governance/drift
```

### Issue: Scheduled workflow not running

**Possible Causes**:
- Repository inactive (GitHub pauses scheduled workflows)
- Workflow disabled

**Solution**:
1. Verify workflow enabled: Actions tab → Governance Alignment Schedule
2. Trigger manually to test: `gh workflow run governance-alignment-schedule.yml`

---

## Maintenance

### Quarterly Review (Minimum)

Per CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md, verify:
- [ ] Ripple events logged correctly
- [ ] Sync state reflects canonical source
- [ ] Scheduled workflow executing hourly
- [ ] PR creation working with bot token
- [ ] Drift logs archived (>90 days)

### Evidence Retention

- Keep ripple logs indefinitely (audit trail)
- Archive drift logs older than 90 days
- Maintain sync state current

---

## Authority and Compliance

This infrastructure implements requirements from:
- **CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md** (Mandatory transport modes)
- **GOVERNANCE_RIPPLE_DETECTION_PROTOCOL.md** (Detection and signaling)
- **REQ-CM-001** (SHA256 hash verification - MANDATORY)
- **REQ-RA-*** (Ripple and alignment requirements)
- **Living Agent System v6.2.0** (Agent authority model)

**CS2 Escalation Required**:
- Placeholder/truncated canon hashes (degraded mode)
- Registry conflicts
- Version misalignment beyond authority
- Failed ripple after circuit breaker

---

## Version History

**v1.0.0** (2026-02-14): Initial governance ripple receiver infrastructure

---

*END OF GOVERNANCE RIPPLE RECEIVER DOCUMENTATION*
