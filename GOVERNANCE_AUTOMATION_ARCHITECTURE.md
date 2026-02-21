# Governance Layer-Down Automation Architecture

**Repository**: APGI-cmy/PartPulse  
**Agent**: governance-liaison  
**Date**: 2026-02-21  
**Authority**: CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md v1.0.0

---

## Architecture Overview

This document visualizes the complete governance layer-down automation architecture for PartPulse consumer repository.

---

## Current State (Before Issue #323)

```
┌─────────────────────────────────────────────────────────────────┐
│  APGI-cmy/maturion-foreman-governance (Canonical Governance)    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  main branch merge                                        │   │
│  │  ├─ governance/canon/*.md                                 │   │
│  │  ├─ governance/CANON_INVENTORY.json                       │   │
│  │  └─ governance/executable/*                               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Dispatch Workflow (maturion-foreman-governance)          │   │
│  │  repository_dispatch: governance_ripple                   │   │
│  │  Payload: {canonical_commit, inventory_version, ...}      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  APGI-cmy/PartPulse (Consumer Repository)                       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  .github/workflows/governance-ripple-sync.yml             │   │
│  │  Trigger: repository_dispatch (governance_ripple)         │   │
│  │  ├─ Log event to .agent-admin/governance/ripple-log.json  │   │
│  │  ├─ Call align-governance.sh                              │   │
│  │  ├─ Create issue (governance-ripple-required)             │   │
│  │  └─ Update ripple status                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  .github/scripts/align-governance.sh                      │   │
│  │  ├─ Fetch canonical governance                            │   │
│  │  ├─ Compare commits/versions                              │   │
│  │  ├─ Detect drift                                          │   │
│  │  ├─ Create PR (governance-alignment-auto)                 │   │
│  │  └─ Enable auto-merge                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Pull Request: "governance: automatic alignment required" │   │
│  │  ├─ Label: governance-ripple-required                     │   │
│  │  ├─ Auto-merge: enabled                                   │   │
│  │  └─ ⚠️  MANUAL REVIEW REQUIRED (no auto-merge logic)      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  .github/workflows/governance-alignment-schedule.yml      │   │
│  │  Trigger: cron (hourly)                                   │   │
│  │  ├─ Call align-governance.sh                              │   │
│  │  └─ Fallback for missed dispatches                        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**Current Limitations**:
- ❌ No actual layer-down (file synchronization)
- ❌ No auto-merge decision logic
- ❌ No escalation for agent file changes
- ❌ No SHA256 verification
- ❌ No ripple inbox management
- ❌ PR requires manual governance-liaison intervention

---

## Target State (After Issue #323 Implementation)

```
┌─────────────────────────────────────────────────────────────────┐
│  APGI-cmy/maturion-foreman-governance (Canonical Governance)    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  main branch merge                                        │   │
│  │  ├─ governance/canon/*.md                                 │   │
│  │  ├─ governance/CANON_INVENTORY.json                       │   │
│  │  ├─ .github/agents/*.md (agent contracts)                 │   │
│  │  └─ governance/executable/*                               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Dispatch Workflow (enhanced)                             │   │
│  │  repository_dispatch: governance_ripple                   │   │
│  │  Payload: {                                               │   │
│  │    canonical_commit, inventory_version,                   │   │
│  │    changed_paths: [...], dispatch_id, timestamp           │   │
│  │  }                                                         │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS (repository_dispatch)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  APGI-cmy/PartPulse (Consumer Repository)                       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  📥 .github/workflows/ripple-integration.yml (ENHANCED)   │   │
│  │  Trigger: repository_dispatch (governance_ripple)         │   │
│  │  ├─ Step 1: Log dispatch                                  │   │
│  │  │   └─ Write to .agent-admin/ripple/dispatch-{id}.json   │   │
│  │  ├─ Step 2: Create ripple entry                           │   │
│  │  │   └─ Move to ripple-inbox/pending/{id}.json            │   │
│  │  ├─ Step 3: Execute alignment check                       │   │
│  │  │   └─ Call align-governance.sh (enhanced)               │   │
│  │  ├─ Step 4: Detect changed files                          │   │
│  │  │   └─ Call detect-agent-changes.sh                      │   │
│  │  ├─ Step 5: Create layer-down issue                       │   │
│  │  │   └─ Label: governance-layer-down-required             │   │
│  │  └─ Step 6: Update ripple status                          │   │
│  │      └─ Move to ripple-inbox/in-progress/{id}.json        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  🔧 .github/scripts/align-governance.sh (ENHANCED)        │   │
│  │  ├─ Step 1: Fetch canonical governance                    │   │
│  │  ├─ Step 2: Compare commits/versions (drift detection)    │   │
│  │  ├─ Step 3: Verify SHA256 hashes (REQ-CM-001)             │   │
│  │  ├─ Step 4: Execute layer-down (file sync)                │   │
│  │  │   ├─ Copy governance/canon/*.md                        │   │
│  │  │   ├─ Copy governance/CANON_INVENTORY.json              │   │
│  │  │   └─ Copy .github/agents/*.md (if changed)             │   │
│  │  ├─ Step 5: Create evidence bundle                        │   │
│  │  │   └─ .agent-admin/governance/layer-down/{ripple-id}/   │   │
│  │  ├─ Step 6: Create alignment PR                           │   │
│  │  │   └─ Branch: governance-alignment-auto                 │   │
│  │  └─ Step 7: Output changed files list                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  🔍 .github/scripts/detect-agent-changes.sh (NEW)         │   │
│  │  ├─ Check if .github/agents/*.md changed                  │   │
│  │  ├─ Output: AGENT_FILES_CHANGED=true/false                │   │
│  │  └─ Exit: 0 (governance-only), 1 (agent files changed)    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  📋 GitHub Issue Created                                  │   │
│  │  Title: "Governance Layer-Down Required: {dispatch-id}"   │   │
│  │  Labels: governance-layer-down-required                   │   │
│  │  Triggers ▼ ripple-listener workflow                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  🤖 .github/workflows/ripple-listener.yml (NEW)           │   │
│  │  Trigger: issues (labeled governance-layer-down-required) │   │
│  │  ├─ Step 1: Read ripple metadata from issue               │   │
│  │  ├─ Step 2: Check for alignment PR                        │   │
│  │  ├─ Step 3: Detect agent file changes                     │   │
│  │  │   └─ Call detect-agent-changes.sh                      │   │
│  │  ├─ Step 4: Decision Logic                                │   │
│  │  │   ├─ If governance-only → AUTO-MERGE                   │   │
│  │  │   └─ If agent files changed → ESCALATE                 │   │
│  │  ├─ Step 5a: Auto-Merge Path                              │   │
│  │  │   ├─ Verify all checks passing                         │   │
│  │  │   ├─ Enable auto-merge on PR                           │   │
│  │  │   ├─ Move ripple to completed                          │   │
│  │  │   ├─ Close issue (automated layer-down complete)       │   │
│  │  │   └─ Comment: "✅ Auto-merged (governance-only)"       │   │
│  │  └─ Step 5b: Escalation Path                              │   │
│  │      ├─ Create escalation in escalation-inbox/            │   │
│  │      ├─ Move ripple to failed                             │   │
│  │      ├─ Assign issue to governance-liaison                │   │
│  │      └─ Comment: "⚠️ Manual review required (agent files)" │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                 ┌─────────┴─────────┐                            │
│                 ▼                   ▼                            │
│  ┌──────────────────────┐  ┌──────────────────────────────┐    │
│  │  ✅ AUTO-MERGE       │  │  ⚠️  ESCALATION              │    │
│  │  ├─ PR merges auto   │  │  ├─ Issue assigned to agent  │    │
│  │  ├─ Issue closed     │  │  ├─ Escalation in inbox      │    │
│  │  └─ Ripple completed │  │  └─ Manual intervention      │    │
│  └──────────────────────┘  └──────────────────────────────┘    │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ⏰ .github/workflows/governance-alignment-schedule.yml   │   │
│  │  Trigger: cron (hourly) - UNCHANGED                       │   │
│  │  ├─ Call align-governance.sh (enhanced version)           │   │
│  │  └─ Fallback for missed dispatches                        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**New Capabilities**:
- ✅ Full layer-down execution (file synchronization)
- ✅ Auto-merge for governance-only changes
- ✅ Escalation for agent file changes
- ✅ SHA256 verification (REQ-CM-001)
- ✅ Ripple inbox state management
- ✅ Evidence bundle creation
- ✅ Automated layer-down with human oversight gate

---

## Directory Structure Flow

```
Repository Ripple Flow
======================

1. Dispatch Received
   └─> .agent-admin/ripple/
       └─> dispatch-{id}.json                    (dispatch payload logged)

2. Ripple Entry Created
   └─> .agent-workspace/governance-liaison/ripple-inbox/
       └─> pending/
           └─> {id}.json                         (awaiting processing)

3. Alignment Check Started
   └─> .agent-workspace/governance-liaison/ripple-inbox/
       └─> in-progress/
           └─> {id}.json                         (processing ripple)

4a. Layer-Down Executed (governance-only)
   └─> .agent-admin/governance/layer-down/
       └─> {ripple-id}/
           ├─> manifest.json                     (ripple manifest)
           ├─> sha256-verification.md            (hash verification)
           ├─> layer-down-log.md                 (execution log)
           ├─> impact-assessment.md              (impact analysis)
           └─> completion-proof.md               (completion evidence)

4b. Escalation Required (agent files changed)
   └─> .agent-workspace/governance-liaison/escalation-inbox/
       └─> {id}.json                             (escalation entry)

5a. Auto-Merge Success
   └─> .agent-workspace/governance-liaison/ripple-inbox/
       └─> completed/
           └─> {id}.json                         (success, archived)

5b. Manual Intervention Required
   └─> .agent-workspace/governance-liaison/ripple-inbox/
       └─> failed/
           └─> {id}.json                         (requires liaison action)
```

---

## Decision Logic Flowchart

```
                    ┌─────────────────────────┐
                    │  Ripple Event Received  │
                    └───────────┬─────────────┘
                                │
                                ▼
                    ┌─────────────────────────┐
                    │  Execute Layer-Down     │
                    │  (align-governance.sh)  │
                    └───────────┬─────────────┘
                                │
                                ▼
                    ┌─────────────────────────┐
                    │  Drift Detected?        │
                    └───────────┬─────────────┘
                                │
                      ┌─────────┴─────────┐
                      │                   │
                   NO │                   │ YES
                      ▼                   ▼
          ┌───────────────────┐  ┌────────────────────┐
          │  No Action Needed │  │  Create PR         │
          │  Update Sync State│  │  governance-...    │
          │  Close Ripple     │  └────────┬───────────┘
          └───────────────────┘           │
                                          ▼
                              ┌────────────────────────┐
                              │  Detect Changed Files  │
                              │  (detect-agent-...)    │
                              └────────┬───────────────┘
                                       │
                         ┌─────────────┴─────────────┐
                         │                           │
           .github/agents/*.md changed?              │
                         │                           │
                    NO   │                      YES  │
                         ▼                           ▼
          ┌──────────────────────────┐  ┌─────────────────────────┐
          │  GOVERNANCE-ONLY CHANGE  │  │  AGENT FILES CHANGED    │
          └──────────┬───────────────┘  └────────┬────────────────┘
                     │                           │
                     ▼                           ▼
          ┌──────────────────────────┐  ┌─────────────────────────┐
          │  AUTO-MERGE PATH         │  │  ESCALATION PATH        │
          │  ├─ Verify checks pass   │  │  ├─ Create escalation   │
          │  ├─ Enable auto-merge    │  │  ├─ Assign to liaison   │
          │  ├─ Move to completed    │  │  ├─ Move to failed      │
          │  └─ Close issue          │  │  └─ Require human review│
          └──────────┬───────────────┘  └────────┬────────────────┘
                     │                           │
                     ▼                           ▼
          ┌──────────────────────────┐  ┌─────────────────────────┐
          │  ✅ AUTOMATED COMPLETE   │  │  ⚠️  MANUAL REQUIRED    │
          │  Ripple: completed/      │  │  Ripple: failed/        │
          │  PR: merged              │  │  PR: awaiting review    │
          │  Issue: closed           │  │  Issue: assigned        │
          └──────────────────────────┘  └─────────────────────────┘
```

---

## File Change Detection Logic

```bash
# detect-agent-changes.sh (pseudocode)

# Step 1: Get list of changed files from PR
CHANGED_FILES=$(gh pr view <pr-number> --json files -q '.files[].path')

# Step 2: Check for agent file changes
AGENT_FILES_CHANGED=false
for file in $CHANGED_FILES; do
  if [[ "$file" =~ ^\.github/agents/.+\.md$ ]]; then
    AGENT_FILES_CHANGED=true
    echo "⚠️  Agent file changed: $file"
  fi
done

# Step 3: Exit with status
if [ "$AGENT_FILES_CHANGED" = true ]; then
  echo "RESULT=escalate" >> $GITHUB_OUTPUT
  exit 1  # Escalation required
else
  echo "RESULT=auto-merge" >> $GITHUB_OUTPUT
  exit 0  # Auto-merge allowed
fi
```

**Decision Rules**:
1. **Auto-Merge**: Only governance/canon/*.md and governance/*.json changes
2. **Escalate**: Any .github/agents/*.md changes
3. **Escalate**: Any unknown/unexpected file changes
4. **Escalate**: SHA256 verification failures
5. **Escalate**: Evidence bundle creation failures

---

## Evidence Requirements

### Per-Ripple Evidence Bundle

Location: `.agent-admin/governance/layer-down/{ripple-id}/`

Required files:
```
{ripple-id}/
├─ manifest.json                # Ripple manifest from canonical source
│                               # Contains: dispatch_id, canonical_commit,
│                               # inventory_version, changed_paths, timestamp
│
├─ sha256-verification.md       # SHA256 hash verification results
│                               # Format: For each changed file:
│                               # - Expected hash (from canonical)
│                               # - Actual hash (computed locally)
│                               # - Verification status (PASS/FAIL)
│
├─ layer-down-log.md            # Step-by-step execution log
│                               # Documents 7-step layer-down protocol:
│                               # 1. Ripple manifest read
│                               # 2. Artifact identification
│                               # 3. Local impact assessment
│                               # 4. SHA256 verification
│                               # 5. Layer-down application
│                               # 6. Integrity validation
│                               # 7. Evidence documentation
│
├─ impact-assessment.md         # Local impact analysis
│                               # - Files affected
│                               # - Breaking changes (if any)
│                               # - Compatibility issues
│                               # - Downstream impacts
│
└─ completion-proof.md          # Layer-down completion evidence
                                # - Completion timestamp
                                # - Verification results
                                # - PR reference
                                # - Auto-merge/escalation decision
```

### Ripple State Tracking

Location: `.agent-workspace/governance-liaison/ripple-inbox/{state}/{id}.json`

State transitions:
```
pending/ → in-progress/ → completed/  (success path)
                       → failed/       (escalation path)
```

Schema:
```json
{
  "dispatch_id": "uuid",
  "canonical_commit": "sha",
  "inventory_version": "1.0.0",
  "received_at": "2026-02-21T12:00:00Z",
  "state": "in-progress",
  "changed_files": [...],
  "agent_files_changed": false,
  "auto_merge_decision": "approved",
  "pr_number": 123,
  "issue_number": 456,
  "completion_status": "pending"
}
```

---

## Security Model

### Least-Privilege Tokens

**MATURION_BOT_TOKEN** permissions:
- `contents: write` (for PR creation, branch management)
- `pull-requests: write` (for PR operations, auto-merge)
- `issues: write` (for issue creation, labeling, assignment)

### PR-Only Writes

**Mandatory**: All governance changes MUST go through PR workflow
- No direct pushes to main
- All merges require CI checks
- Auto-merge only for governance-only changes
- Human approval required for agent file changes

### SHA256 Verification (REQ-CM-001)

**Mandatory**: All canonical artifacts MUST have SHA256 verification
- Hash mismatch → FAIL alignment gate
- Placeholder hashes → FAIL alignment gate
- Truncated hashes → FAIL alignment gate
- No hash available → FAIL alignment gate

**Failure handling**: Escalate to CS2 with evidence

---

## SLA Requirements

From CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md § 8:

1. **Push ripple dispatch**: Within 10 minutes of canonical merge
2. **Scheduled fallback**: Every 60 minutes
3. **Alignment PR creation**: Within 30 minutes of drift detection
4. **Auto-merge decision**: Within 5 minutes of PR creation (new)
5. **Evidence bundle creation**: Synchronous with layer-down execution (new)

---

## Monitoring and Observability

### Metrics to Track

1. **Ripple Event Volume**
   - Total ripple events received
   - Auto-merge vs escalation ratio
   - Average processing time

2. **Drift Frequency**
   - Drift detections per week
   - False positive rate
   - Time to resolution

3. **Failure Modes**
   - SHA256 verification failures
   - Agent file change escalations
   - Evidence bundle creation failures
   - Auto-merge failures

### Audit Trail

All ripple events MUST maintain complete audit trail:
- Dispatch log: `.agent-admin/ripple/dispatch-{id}.json`
- Ripple state: `.agent-workspace/governance-liaison/ripple-inbox/{state}/{id}.json`
- Evidence bundle: `.agent-admin/governance/layer-down/{ripple-id}/`
- GitHub issue: Permanent record with full context
- GitHub PR: Permanent record with file changes

---

## Rollback and Recovery

### Rollback Scenarios

1. **Bad governance change merged**
   - Use git revert on main branch
   - Triggers new ripple event
   - Auto-merge rolls back to previous state

2. **Auto-merge logic malfunction**
   - Disable ripple-listener workflow
   - Revert to manual governance-liaison intervention
   - Fix auto-merge logic
   - Re-enable workflow

3. **Evidence corruption**
   - Evidence bundles are immutable
   - Re-execute layer-down with same ripple-id
   - Evidence bundle versioning (v2, v3, etc.)

### Recovery Procedures

1. **Missed ripple event**
   - Scheduled fallback recovers within 1 hour
   - Manual trigger available: `workflow_dispatch`

2. **Failed auto-merge**
   - Falls back to escalation path
   - Governance-liaison manual intervention
   - Evidence preserved for analysis

3. **GitHub outage**
   - Ripple events queue in canonical repo
   - Scheduled fallback provides eventual consistency
   - No data loss due to immutable evidence bundles

---

## Implementation Phases

### Phase 1: Foundation (Directories)
- Create `.agent-admin/ripple/`
- Create ripple-inbox structure
- Update documentation

### Phase 2: Detection (Scripts)
- Create `detect-agent-changes.sh`
- Enhance `align-governance.sh` with SHA256 verification
- Test detection logic

### Phase 3: Automation (Workflows)
- Enhance `ripple-integration.yml` (formerly governance-ripple-sync.yml)
- Create `ripple-listener.yml`
- Test auto-merge logic

### Phase 4: Evidence (Compliance)
- Implement evidence bundle creation
- Implement ripple state tracking
- Test full layer-down protocol

### Phase 5: Validation (E2E Testing)
- Test with canonical governance repo
- Verify auto-merge path
- Verify escalation path
- Stress test with concurrent ripples

---

**End of Architecture Document**

**Generated**: 2026-02-21  
**Authority**: Living Agent System v6.2.0, CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md v1.0.0  
**Status**: Planning Document for Issue #323 Implementation
