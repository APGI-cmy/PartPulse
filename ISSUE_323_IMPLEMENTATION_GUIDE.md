# Issue #323 Implementation Quick Reference

**Issue**: Governance Layer-Down Automation  
**Repository**: APGI-cmy/PartPulse  
**Agent**: governance-liaison  
**Date**: 2026-02-21  

---

## TL;DR - What Needs to Be Built

Issue #323 requires implementing **automated governance layer-down** with auto-merge for governance-only changes and escalation for agent file changes.

**Current State**: Manual governance-liaison intervention required for all ripple events  
**Target State**: Automated layer-down with human oversight only for agent contract changes

---

## Files to Create (5 files)

### 1. Directories

```bash
# Ripple dispatch logs
mkdir -p .agent-admin/ripple

# Ripple inbox state management
mkdir -p .agent-workspace/governance-liaison/ripple-inbox/{pending,in-progress,completed,failed}
```

### 2. Workflows

**File**: `.github/workflows/ripple-listener.yml` (NEW)
- **Trigger**: Issues labeled `governance-layer-down-required`
- **Purpose**: Auto-merge or escalate based on changed files
- **Key Logic**: Detect agent file changes → auto-merge if governance-only, escalate otherwise

### 3. Scripts

**File**: `.github/scripts/detect-agent-changes.sh` (NEW)
- **Purpose**: Detect if `.github/agents/*.md` changed in PR
- **Output**: `RESULT=auto-merge` or `RESULT=escalate`
- **Exit Code**: 0 (auto-merge), 1 (escalate)

### 4. Documentation

**File**: `LAYERING_AND_RIPPLING_AUTOMATION_STRATEGY.md` (NEW)
- **Purpose**: Document complete automation architecture
- **Content**: Architecture, decision logic, evidence requirements, SLAs

---

## Files to Modify (3 files)

### 1. `.github/workflows/governance-ripple-sync.yml` (ENHANCE)

**Current**: Creates PR, creates issue, no auto-merge logic  
**Enhancement Needed**:
- Write dispatch to `.agent-admin/ripple/dispatch-{id}.json`
- Create ripple entry in `ripple-inbox/pending/`
- Include changed files in issue metadata
- Move ripple to `in-progress/` when alignment starts

### 2. `.github/scripts/align-governance.sh` (ENHANCE)

**Current**: Detects drift, creates PR, no file sync  
**Enhancement Needed**:
- Add SHA256 verification (REQ-CM-001)
- Add actual layer-down (file synchronization from canonical)
- Create evidence bundle (`.agent-admin/governance/layer-down/{ripple-id}/`)
- Output changed files list for detection script

### 3. `docs/governance-ripple-receiver.md` (UPDATE)

**Current**: Documents push ripple + scheduled fallback  
**Update Needed**:
- Document new ripple-listener workflow
- Document auto-merge vs escalation logic
- Document ripple inbox workflow
- Document evidence requirements

---

## Implementation Checklist

### Phase 1: Foundation ✅ (Low Risk)

- [ ] Create `.agent-admin/ripple/` directory
- [ ] Create ripple-inbox structure:
  - [ ] `.agent-workspace/governance-liaison/ripple-inbox/pending/`
  - [ ] `.agent-workspace/governance-liaison/ripple-inbox/in-progress/`
  - [ ] `.agent-workspace/governance-liaison/ripple-inbox/completed/`
  - [ ] `.agent-workspace/governance-liaison/ripple-inbox/failed/`
- [ ] Create `.gitkeep` files in empty directories
- [ ] Test: Verify directory structure exists

### Phase 2: Detection Script ⚠️ (Medium Risk)

- [ ] Create `.github/scripts/detect-agent-changes.sh`
- [ ] Implement agent file detection logic
- [ ] Test with sample PRs (governance-only)
- [ ] Test with sample PRs (agent files changed)
- [ ] Test with sample PRs (mixed changes)
- [ ] Add error handling for edge cases

### Phase 3: Workflow - Listener 🔴 (High Risk)

- [ ] Create `.github/workflows/ripple-listener.yml`
- [ ] Implement issue trigger (`governance-layer-down-required`)
- [ ] Implement agent file detection step
- [ ] Implement auto-merge logic (governance-only path)
- [ ] Implement escalation logic (agent files changed path)
- [ ] Implement ripple state updates (completed/failed)
- [ ] Test in isolation (workflow_dispatch)
- [ ] Test with real issue creation

### Phase 4: Workflow - Integration 🔴 (High Risk)

- [ ] Enhance `.github/workflows/governance-ripple-sync.yml`
- [ ] Add dispatch logging to `.agent-admin/ripple/`
- [ ] Add ripple inbox entry creation
- [ ] Add changed files detection
- [ ] Update issue creation (include metadata)
- [ ] Test backward compatibility (scheduled fallback)
- [ ] Test with canonical governance dispatch

### Phase 5: Script - Alignment ⚠️ (Medium Risk)

- [ ] Enhance `.github/scripts/align-governance.sh`
- [ ] Add SHA256 verification logic
- [ ] Add layer-down file synchronization
- [ ] Add evidence bundle creation
- [ ] Add changed files output
- [ ] Test with canonical governance repo
- [ ] Test SHA256 verification failures
- [ ] Test drift detection edge cases

### Phase 6: Documentation ✅ (Low Risk)

- [ ] Create `LAYERING_AND_RIPPLING_AUTOMATION_STRATEGY.md`
- [ ] Update `docs/governance-ripple-receiver.md`
- [ ] Document architecture diagrams
- [ ] Document decision logic
- [ ] Document evidence requirements
- [ ] Document rollback procedures
- [ ] Update README if needed

### Phase 7: Integration Testing 🔴 (High Risk)

- [ ] Test full flow: dispatch → auto-merge (governance-only)
- [ ] Test full flow: dispatch → escalation (agent files)
- [ ] Test scheduled fallback still works
- [ ] Test concurrent ripple events
- [ ] Test SHA256 verification failures
- [ ] Test evidence bundle completeness
- [ ] Test ripple inbox state transitions

### Phase 8: Validation ✅ (Low Risk)

- [ ] Run code review
- [ ] Run CodeQL security scan
- [ ] Verify all governance canon requirements met
- [ ] Verify evidence artifacts complete
- [ ] Session closure protocol
- [ ] Create pre-handover proof

---

## Critical Implementation Details

### Auto-Merge Decision Logic

```yaml
# In ripple-listener.yml

- name: Detect Agent Changes
  id: detect
  run: .github/scripts/detect-agent-changes.sh ${{ env.PR_NUMBER }}

- name: Auto-Merge or Escalate
  if: steps.detect.outputs.RESULT == 'auto-merge'
  run: |
    # Auto-merge path
    gh pr merge $PR_NUMBER --auto --squash
    # Move ripple to completed
    # Close issue

- name: Escalate
  if: steps.detect.outputs.RESULT == 'escalate'
  run: |
    # Create escalation in escalation-inbox
    # Move ripple to failed
    # Assign issue to governance-liaison
    # Comment with escalation reason
```

### SHA256 Verification

```bash
# In align-governance.sh enhancement

# For each changed file from canonical
EXPECTED_HASH=$(jq -r ".files[\"$FILE\"].sha256" manifest.json)
ACTUAL_HASH=$(sha256sum "$FILE" | cut -d' ' -f1)

if [ "$EXPECTED_HASH" != "$ACTUAL_HASH" ]; then
  echo "❌ SHA256 mismatch: $FILE"
  echo "Expected: $EXPECTED_HASH"
  echo "Actual: $ACTUAL_HASH"
  VERIFICATION_FAILED=true
fi

# If any verification failed → escalate to CS2
if [ "$VERIFICATION_FAILED" = true ]; then
  create_escalation "SHA256 verification failed"
  exit 1
fi
```

### Evidence Bundle Structure

```
.agent-admin/governance/layer-down/{ripple-id}/
├── manifest.json              # From canonical dispatch payload
├── sha256-verification.md     # Hash verification results
├── layer-down-log.md          # 7-step execution log
├── impact-assessment.md       # Local impact analysis
└── completion-proof.md        # Completion evidence
```

### Ripple State Schema

```json
{
  "dispatch_id": "uuid-from-canonical",
  "canonical_commit": "sha256-hash",
  "inventory_version": "1.0.0",
  "received_at": "2026-02-21T12:00:00Z",
  "state": "in-progress",
  "changed_files": ["governance/canon/FILE.md"],
  "agent_files_changed": false,
  "auto_merge_decision": "approved",
  "pr_number": 123,
  "issue_number": 456,
  "completion_status": "pending"
}
```

---

## Testing Strategy

### Unit Tests (Per Component)

1. **detect-agent-changes.sh**
   - Test: governance/canon/*.md only → auto-merge
   - Test: .github/agents/*.md changed → escalate
   - Test: mixed changes → escalate
   - Test: no changes → auto-merge

2. **align-governance.sh (enhanced)**
   - Test: SHA256 verification pass
   - Test: SHA256 verification fail
   - Test: layer-down file sync
   - Test: evidence bundle creation
   - Test: changed files output

3. **ripple-listener.yml**
   - Test: auto-merge logic
   - Test: escalation logic
   - Test: ripple state updates
   - Test: issue closing

### Integration Tests (End-to-End)

1. **Scenario 1: Governance-Only Change**
   - Canonical repo: Merge governance canon change
   - Dispatch: Send repository_dispatch
   - Consumer repo: Receive, layer-down, auto-merge
   - Verify: PR merged, issue closed, ripple completed

2. **Scenario 2: Agent File Change**
   - Canonical repo: Merge agent contract change
   - Dispatch: Send repository_dispatch
   - Consumer repo: Receive, layer-down, escalate
   - Verify: PR awaiting review, issue assigned, ripple failed

3. **Scenario 3: SHA256 Failure**
   - Canonical repo: Merge with corrupted file
   - Dispatch: Send repository_dispatch
   - Consumer repo: Receive, verify, escalate
   - Verify: Escalation created, CS2 notified

4. **Scenario 4: Concurrent Ripples**
   - Canonical repo: Merge multiple changes rapidly
   - Dispatch: Send multiple repository_dispatch
   - Consumer repo: Handle all without conflicts
   - Verify: All ripples processed, no duplicates

### Regression Tests

1. **Scheduled Fallback Still Works**
   - Disable repository_dispatch
   - Wait for hourly cron
   - Verify: Alignment check runs, drift detected

2. **Manual Workflow Dispatch**
   - Trigger governance-ripple-sync manually
   - Verify: Same behavior as repository_dispatch

---

## Risk Mitigation

### High-Risk Areas

1. **Auto-Merge Logic** → Could merge incorrect changes
   - Mitigation: Conservative detection logic (err on side of escalation)
   - Mitigation: Comprehensive testing before production
   - Mitigation: Manual approval gate for first implementations

2. **Agent File Detection** → False positives could block merges
   - Mitigation: Clear detection rules (exact path matching)
   - Mitigation: Test with edge cases
   - Mitigation: Escalation path preserves manual override

3. **SHA256 Verification** → Could fail on legitimate changes
   - Mitigation: Clear error messages
   - Mitigation: Escalation to CS2 with evidence
   - Mitigation: No placeholder/truncated hashes allowed

### Rollback Plan

If automation causes issues:
1. Disable `ripple-listener.yml` workflow
2. Revert to manual governance-liaison intervention
3. Fix automation logic
4. Re-enable with testing

**Fallback**: Existing governance-ripple-sync.yml continues to work without listener

---

## Success Criteria

### Functional Requirements

- ✅ Receives repository_dispatch from canonical governance
- ✅ Logs dispatch to `.agent-admin/ripple/`
- ✅ Creates ripple inbox entry
- ✅ Executes layer-down with SHA256 verification
- ✅ Creates evidence bundle
- ✅ Detects agent file changes
- ✅ Auto-merges governance-only changes
- ✅ Escalates agent file changes
- ✅ Updates ripple state (completed/failed)
- ✅ Closes issues on success
- ✅ Assigns issues on escalation

### Non-Functional Requirements

- ✅ SLA: Alignment PR within 30 minutes
- ✅ SLA: Auto-merge decision within 5 minutes
- ✅ Evidence: Complete audit trail
- ✅ Security: PR-only writes
- ✅ Security: SHA256 verification mandatory
- ✅ Reliability: Scheduled fallback still works
- ✅ Observability: All states logged

### Governance Requirements

- ✅ REQ-CM-001: SHA256 verification
- ✅ REQ-ER-*: Evidence artifacts complete
- ✅ REQ-RA-*: Ripple received and processed
- ✅ REQ-GC-*: Gate compliance (auto-merge/escalate)
- ✅ REQ-AS-*: Self-alignment within scope
- ✅ REQ-SS-*: PR-only writes, least-privilege

---

## Key Files Reference

```
.github/
├── workflows/
│   ├── governance-ripple-sync.yml        (MODIFY - add dispatch logging)
│   ├── ripple-listener.yml               (CREATE - auto-merge/escalate)
│   └── governance-alignment-schedule.yml (PRESERVE - no changes)
├── scripts/
│   ├── align-governance.sh               (MODIFY - SHA256, layer-down)
│   └── detect-agent-changes.sh           (CREATE - agent file detection)
└── agents/
    └── governance-liaison.md             (PRESERVE - no changes)

.agent-admin/
├── ripple/                               (CREATE - dispatch logs)
└── governance/
    ├── layer-down/                       (ENHANCE - evidence bundles)
    ├── ripple-log.json                   (PRESERVE - existing)
    └── sync_state.json                   (PRESERVE - existing)

.agent-workspace/governance-liaison/
├── ripple-inbox/                         (CREATE - state management)
│   ├── pending/
│   ├── in-progress/
│   ├── completed/
│   └── failed/
├── escalation-inbox/                     (PRESERVE - existing)
└── memory/                               (PRESERVE - existing)

docs/
└── governance-ripple-receiver.md         (MODIFY - update docs)

LAYERING_AND_RIPPLING_AUTOMATION_STRATEGY.md (CREATE - architecture docs)
```

---

## Commands Reference

### Testing Commands

```bash
# Test agent file detection
.github/scripts/detect-agent-changes.sh <PR_NUMBER>

# Test alignment script (manual)
.github/scripts/align-governance.sh <CANONICAL_COMMIT> <INVENTORY_VERSION>

# Trigger ripple sync manually
gh workflow run governance-ripple-sync.yml

# Trigger ripple listener manually (after issue creation)
gh workflow run ripple-listener.yml -f issue_number=<ISSUE_NUMBER>

# Check ripple state
ls -la .agent-workspace/governance-liaison/ripple-inbox/*/

# Check evidence bundles
ls -la .agent-admin/governance/layer-down/
```

### Debugging Commands

```bash
# Check recent ripple events
cat .agent-admin/governance/ripple-log.json | jq .

# Check sync state
cat .agent-admin/governance/sync_state.json | jq .

# Check dispatch logs
ls -la .agent-admin/ripple/

# Check workflow runs
gh run list --workflow=governance-ripple-sync.yml --limit 5
gh run list --workflow=ripple-listener.yml --limit 5

# View workflow logs
gh run view <RUN_ID> --log
```

---

**End of Quick Reference**

**Generated**: 2026-02-21  
**Agent**: governance-liaison  
**Purpose**: Implementation guide for Issue #323  
**Status**: Planning Complete - Ready for Implementation
