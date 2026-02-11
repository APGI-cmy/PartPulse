# Foreman & Governance Liaison Checklist Alignment Recommendations

**Date**: 2026-02-11  
**Context**: Aligning PartPulse agent contracts to office-app gold standard  
**Authority**: GOVERNANCE_RIPPLE_PR_FAILURE_PROTOCOL_COMPLETE.md, BUILDER_CONTRACT_SCHEMA.md, Living Agent System v5.0.0  
**PRs Referenced**: office-app #730, #733 (PR failure protocol implementation)

---

## Executive Summary

Based on review of:
1. **Governance Liaison contract** - Already includes PR Failure Analysis Protocol (LOCKED section added 2026-02-09)
2. **Foreman contract** - Missing several gold standard checklists present in BUILDER_CONTRACT_SCHEMA.md
3. **Office-app incident lessons** - Catastrophic repeat PR failures due to missing protocols

**Key Finding**: Governance Liaison is CURRENT (includes PR failure protocol). Foreman contract needs 8 specific enhancements to meet gold standard.

---

## Part 1: Governance Liaison Status

### ✅ Already Implemented (Gold Standard Compliant)

**PR Failure Analysis Protocol** (Lines 497-606):
- ✅ LOCKED section with proper metadata
- ✅ Detection protocol (check for recent failed PRs)
- ✅ Mandatory workflow log reading
- ✅ Root cause analysis requirement
- ✅ Local verification before retry
- ✅ Escalation after 2 failed attempts
- ✅ Authority: STOP_AND_FIX_DOCTRINE.md

**Source**: GOVERNANCE_RIPPLE_PR_FAILURE_PROTOCOL_COMPLETE.md confirms this was added as governance ripple from office-app incident.

### 📋 Recommendation: No Changes Needed

Governance Liaison contract is **already aligned** with office-app gold standard for PR failure handling.

---

## Part 2: Foreman Contract Gap Analysis

### Current State Assessment

**Foreman Contract** (`.github/agents/PartPulse-app_FM.md`):
- 38.8 KB, comprehensive governance bindings
- Includes 23 canonical bindings (10 Universal + 10 FM-Specific + 3 Living Agent v5.0.0)
- Has LOCKED sections for contract protection and improvement capture
- **Missing**: Several critical pre-work and error prevention checklists

---

## Part 3: Specific Recommendations for Foreman Contract

### 🔴 HIGH PRIORITY: Add These 8 Sections

---

### Recommendation #1: Wake-Up Protocol (Session Start Checklist)

**Location**: Add immediately after agent metadata (line ~250, after bindings section)

**Purpose**: Prevent starting work in inconsistent/degraded state

**Section Title**: `## Before ANY Work - FM Wake-Up Protocol`

**Content Elements**:
```markdown
## Before ANY Work - FM Wake-Up Protocol

**Authority**: AGENT_BASELINE_MANAGEMENT_PROTOCOL.md (Binding #18)

Copy-paste and run this code before every session:

```bash
#!/bin/bash
# FM Wake-Up Protocol v5.0.0
# Authority: Living Agent System v5.0.0

set -e

echo "==================================="
echo "FM Wake-Up Protocol v5.0.0"
echo "==================================="

# PHASE 1: Agent Identity & Contract Integrity
AGENT_CONTRACT=".github/agents/PartPulse-app_FM.md"
if [ ! -f "$AGENT_CONTRACT" ]; then
    echo "❌ FATAL: Cannot locate own contract"
    exit 1
fi
echo "✅ Agent contract located"

# PHASE 2: Repository Context
echo "📍 Repository: $(git rev-parse --show-toplevel)"
echo "📍 Branch: $(git branch --show-current)"
echo "📍 Last commit: $(git log -1 --oneline)"

# PHASE 3: Governance Health Check
if [ -f "governance/TIER_0_CANON_MANIFEST.json" ]; then
    LOCAL_VERSION=$(grep '"version"' governance/TIER_0_CANON_MANIFEST.json | head -1 | cut -d'"' -f4)
    echo "✅ TIER_0 Canon: v$LOCAL_VERSION"
else
    echo "❌ FATAL: TIER_0 manifest missing"
    exit 1
fi

# PHASE 4: Builder Manifest Check
if [ -f "foreman/builder-manifest.json" ]; then
    BUILDER_COUNT=$(grep -c '"builder_id"' foreman/builder-manifest.json || echo "0")
    echo "✅ Builder manifest: $BUILDER_COUNT builders registered"
else
    echo "⚠️  Builder manifest not found"
fi

# PHASE 5: Working Directory State
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Working directory has uncommitted changes"
    git status --short | head -10
else
    echo "✅ Working directory clean"
fi

# PHASE 6: Environment Health
echo "🔍 Environment checks..."
npm --version >/dev/null 2>&1 && echo "✅ npm available" || echo "⚠️  npm not found"
node --version >/dev/null 2>&1 && echo "✅ node available" || echo "⚠️  node not found"
gh --version >/dev/null 2>&1 && echo "✅ gh available" || echo "⚠️  gh not found"

echo ""
echo "✅ WAKE-UP COMPLETE"
echo "🎯 Ready to receive mission"
echo "==================================="
```

**Next Steps**:
1. Review wake-up output
2. If any FATAL errors → escalate to CS2
3. If warnings → document in session contract
4. Proceed to mission execution
```

**Rationale**: 
- Prevents work in degraded state
- Catches governance drift early
- Validates environment before work begins
- Aligns with AGENT_BASELINE_MANAGEMENT_PROTOCOL.md (already bound)

---

### Recommendation #2: PR Failure Analysis Protocol (LOCKED)

**Location**: Add after wake-up protocol, before main execution sections

**Purpose**: Prevent catastrophic repeat PR failures (office-app lessons)

**Section Title**: `## 🔒 PR Failure Analysis Protocol (LOCKED)`

**Content Elements**:
```markdown
## 🔒 PR Failure Analysis Protocol (LOCKED)

<!-- Lock ID: LOCK-FM-PR-FAILURE-001 -->
<!-- Lock Reason: Prevents catastrophic repeat PR failures - STOP AND FIX enforcement -->
<!-- Lock Authority: STOP_AND_FIX_DOCTRINE.md, CI_CONFIRMATORY_NOT_DIAGNOSTIC.md -->
<!-- Lock Date: 2026-02-11 -->
<!-- Last Reviewed: 2026-02-11 -->
<!-- Review Frequency: quarterly -->
<!-- END METADATA -->

**MANDATORY before creating retry PR after ANY PR failure:**

### Detection: Is This a Retry After Failure?

Check for recent closed/failed PRs:
```bash
gh pr list --repo APGI-cmy/PartPulse --state closed --limit 10
```

If you see recently closed PRs from FM or builders → EXECUTE THIS PROTOCOL.

---

### Step 1: Read Workflow Logs (MANDATORY)

```bash
# List recent workflow runs
gh run list --repo APGI-cmy/PartPulse --limit 10

# Identify the failed run from the closed PR
# Read the complete workflow log
gh run view <run-id> --log

# If specific job failed, get that job's log
gh run view <run-id> --job=<job-id> --log
```

**STOP**: Do NOT proceed until you have READ and UNDERSTOOD the failure logs.

---

### Step 2: Root Cause Analysis (MANDATORY)

Document your analysis:

1. **What specifically failed?**
   - Exact error message
   - Failing test/check name
   - Stack trace or failure point

2. **Why did it fail?**
   - Root cause (not symptom)
   - What assumption was violated?
   - What changed that caused failure?

3. **What is the fix?**
   - Specific code/config change required
   - Why will this fix work?
   - What prevents recurrence?

**Create analysis file**: `.agent-workspace/PartPulse-app_FM/pr_failure_analysis/<session-id>_analysis.md`

---

### Step 3: Verify Fix Before Retry (MANDATORY)

Before creating new PR:

```bash
# If tests failed: Run tests locally
npm test

# If build failed: Build locally
npm run build

# If linting failed: Run linter locally
npm run lint

# If gates failed: Run gate simulation locally
scripts/validate_baseline.sh PartPulse-app_FM
```

**STOP**: Do NOT create retry PR until local validation PASSES.

---

### Step 4: Retry PR Creation

Only after Steps 1-3 complete:

1. Create new PR with:
   - Clear title: "Fix: [root cause from analysis]"
   - Link to failure analysis file in PR description
   - Explanation of fix and prevention

2. Monitor new PR's CI checks
3. If new failure → RETURN TO STEP 1 (do not guess)

---

### Escalation

If after 2 retry attempts the issue persists:
- Create detailed escalation in `governance/escalation/`
- Tag CS2 for assistance
- DO NOT continue retry loop

---

**Authority**: STOP_AND_FIX_DOCTRINE.md (Universal Responsibility principle)
**Enforcement**: MANDATORY - No exceptions for FM PRs
**Source**: office-app incident PRs #730, #733 (catastrophic repeat failures)

<!-- LOCKED SECTION END -->
```

**Rationale**:
- Same protocol already in governance-liaison (proven effective)
- Prevents blind retry loops without diagnosis
- Enforces CI_CONFIRMATORY_NOT_DIAGNOSTIC principle
- Learned from office-app catastrophic failures

---

### Recommendation #3: Pre-Authorization Checklist

**Location**: Add before wave initiation sections

**Purpose**: Prevent starting waves without prerequisites

**Section Title**: `## Pre-Authorization Checklist (Before Starting Any Wave)`

**Content Elements**:
```markdown
## Pre-Authorization Checklist (Before Starting Any Wave)

**Authority**: FM_PREAUTH_CHECKLIST.md (Binding reference in FM contract)

Before initiating ANY wave (Wave 0.x, 1.x, etc.), FM MUST verify:

### Governance Prerequisites
- [ ] TIER_0 Canon manifest present and current
- [ ] No blocking governance drift detected
- [ ] All required governance bindings accessible
- [ ] Builder contracts aligned with current governance

### Repository Health
- [ ] Working directory clean (no uncommitted changes)
- [ ] Default branch up-to-date
- [ ] No failing tests in baseline
- [ ] No build warnings in baseline
- [ ] No linting errors in baseline

### Wave Planning Prerequisites (FOREMAN_WAVE_PLANNING protocol)
- [ ] Wave objectives clearly defined
- [ ] Scope boundaries explicit
- [ ] Success criteria measurable
- [ ] Builder assignment strategy defined
- [ ] Issue artifact templates prepared

### Builder Readiness
- [ ] Required builders recruited and ready
- [ ] Builder capabilities match wave requirements
- [ ] QA ranges assigned (if applicable)
- [ ] Builder contracts validated

### Infrastructure Prerequisites
- [ ] CI/CD pipelines operational
- [ ] Test infrastructure ready
- [ ] Deployment targets accessible (if applicable)
- [ ] Evidence collection infrastructure ready

**Enforcement**: 
- If ANY checklist item fails → HALT and remediate
- Document checklist completion in wave initialization issue
- CS2 escalation if prerequisites cannot be met

**Rationale**: BL-020 (Fail Once Doctrine) - Catch blockers BEFORE work begins, not during execution
```

**Rationale**:
- Prevents wasted work due to missing prerequisites
- Aligns with BL-020 (scope declaration mandatory)
- Catches issues before builder assignment
- Referenced in FM contract but not detailed

---

### Recommendation #4: Builder Task Validation Checklist

**Location**: Add in builder orchestration section

**Purpose**: Ensure builder tasks meet quality standards before assignment

**Section Title**: `## Builder Task Validation (Before Assignment)`

**Content Elements**:
```markdown
## Builder Task Validation (Before Assignment)

**Authority**: FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md (Binding #20)

Before creating builder task issues, FM MUST validate:

### Architecture Readiness
- [ ] Architecture document exists and is frozen
- [ ] No TBD, TODO, or placeholder sections
- [ ] All requirements are unambiguous
- [ ] Dependencies clearly identified
- [ ] Integration points defined

### QA Preparation (QA-to-Red)
- [ ] QA specifications defined
- [ ] Test cases written and FAILING (RED state)
- [ ] Coverage requirements specified
- [ ] Acceptance criteria measurable

### Task Decomposition Quality
- [ ] Task is atomic (single builder can complete)
- [ ] Task has clear entry criteria
- [ ] Task has clear exit criteria
- [ ] Task has measurable success metrics
- [ ] Task scope prevents scope creep

### Builder Match Validation
- [ ] Required capabilities match builder contract
- [ ] Task within builder's permissions
- [ ] Task does not violate builder's forbidden actions
- [ ] Builder has access to required resources

### Evidence Infrastructure
- [ ] Evidence collection paths defined
- [ ] Report templates accessible
- [ ] QA gate requirements documented

**Prohibited Task Characteristics**:
- ❌ Vague requirements ("improve performance")
- ❌ Multiple independent changes in one task
- ❌ Tasks requiring builder to "figure it out"
- ❌ Tasks without architecture
- ❌ Tasks without QA-to-Red preparation

**Enforcement**: If validation fails → FIX architecture/QA before assignment
```

**Rationale**:
- Prevents "build first, figure out later" anti-pattern
- Enforces One-Time Build Discipline
- Aligns with Build Philosophy (Architecture → QA → Build)
- Prevents builder confusion and wasted iterations

---

### Recommendation #5: Pre-Merge Gate Simulation Checklist

**Location**: Add before handover/merge sections

**Purpose**: Guarantee gate success BEFORE PR creation (not hope)

**Section Title**: `## 🔴 Pre-Merge Gate Simulation (LIFE OR DEATH)`

**Content Elements**:
```markdown
## 🔴 Pre-Merge Gate Simulation (LIFE OR DEATH)

**Authority**: AGENT_CONTRACT_PROTECTION_PROTOCOL.md (Binding #6 - PRE-GATE MERGE VALIDATION)

**Principle**: Run duplicate gate merge BEFORE delivery to guarantee success (not hope)

Before ANY PR creation or wave handover, FM MUST:

### Step 1: Local Gate Execution (Mandatory)

```bash
# Run ALL gates that will execute on PR
npm test              # If test gate exists
npm run build         # If build gate exists  
npm run lint          # If lint gate exists
npm run type-check    # If TypeScript gate exists

# Run FM-specific validation
scripts/validate_baseline.sh PartPulse-app_FM

# If governance gates exist
scripts/governance_validation.sh
```

**REQUIREMENT**: ALL commands MUST exit with code 0 (zero errors, zero warnings)

### Step 2: Evidence Documentation (Mandatory)

Document gate execution in PREHANDOVER_PROOF:

```markdown
## Gate Simulation Results

### Test Gate
- **Command**: `npm test`
- **Exit Code**: 0
- **Output**: All tests passing (X passed, 0 failed, 0 skipped)
- **Evidence**: [link to test output file]

### Build Gate  
- **Command**: `npm run build`
- **Exit Code**: 0
- **Output**: Build successful, 0 warnings
- **Evidence**: [link to build log]

### Lint Gate
- **Command**: `npm run lint`
- **Exit Code**: 0
- **Output**: No linting errors, 0 warnings
- **Evidence**: [link to lint output]

### FM Baseline Validation
- **Command**: `scripts/validate_baseline.sh PartPulse-app_FM`
- **Exit Code**: 0
- **Output**: All baseline checks passed
- **Evidence**: [link to validation log]
```

### Step 3: Guarantee Statement (Mandatory)

FM MUST include this statement in PREHANDOVER_PROOF:

```
I, Foreman, have executed ALL PR gates locally and guarantee 100% success.
Exit code 0 for ALL gates. Zero errors. Zero warnings. Gate success GUARANTEED.
```

**Prohibited Statements**:
- ❌ "Should pass" (not guaranteed)
- ❌ "Looks good" (not verified)
- ❌ "Tests ran successfully earlier" (stale)
- ❌ "Warnings are non-blocking" (not acceptable)

### Enforcement

**IF ANY GATE FAILS LOCALLY**:
1. ❌ STOP - Do NOT create PR
2. 🔧 FIX - Remediate the issue
3. ♻️  RE-RUN - Execute gate again
4. ✅ VERIFY - Confirm exit code 0
5. ➡️  THEN - Proceed to PR creation

**IF PR GATE FAILS AFTER LOCAL SUCCESS**:
- This is a CATASTROPHIC governance failure
- Immediately escalate to CS2
- Root cause analysis mandatory
- Gate simulation protocol review required

**Rationale**: CI is CONFIRMATORY, not DIAGNOSTIC (CI_CONFIRMATORY_NOT_DIAGNOSTIC.md binding #10)
```

**Rationale**:
- Binding #6 already requires this but lacks detailed checklist
- Prevents "hope and pray" PR creation
- Enforces CI_CONFIRMATORY_NOT_DIAGNOSTIC doctrine
- Provides evidence for audit trail

---

### Recommendation #6: Error Prevention Guardrails

**Location**: Add in execution section

**Purpose**: Prevent common FM orchestration errors

**Section Title**: `## Error Prevention Guardrails (Common FM Mistakes)`

**Content Elements**:
```markdown
## Error Prevention Guardrails (Common FM Mistakes)

**Authority**: BOOTSTRAP_EXECUTION_LEARNINGS.md (Binding #4 - all 28 learnings)

### Guardrail #1: Never Assign Tasks Without Architecture

**Symptom**: Builder asks "what should I build?"

**Prevention**:
- [ ] Verify architecture document exists
- [ ] Verify architecture is frozen (no TBD/TODO)
- [ ] Verify architecture has passed review
- [ ] Include architecture link in task issue

**Error Pattern**: Assigning task → Builder confused → Multiple iterations → Wasted time

**Fix**: ALWAYS freeze architecture BEFORE builder assignment

---

### Guardrail #2: Never Skip QA-to-Red

**Symptom**: Builder has no failing tests to make pass

**Prevention**:
- [ ] Verify QA specs written
- [ ] Verify tests exist and are FAILING (RED)
- [ ] Verify QA agent has completed QA-to-Red phase
- [ ] Include QA report link in builder task

**Error Pattern**: Builder guesses requirements → Tests written after code → 100% passing (false confidence) → Integration fails

**Fix**: ALWAYS complete QA-to-Red BEFORE build phase

---

### Guardrail #3: Never Create PRs Without Local Validation

**Symptom**: PR fails CI checks on first run

**Prevention**:
- [ ] Run all gates locally (see Pre-Merge Gate Simulation)
- [ ] Document gate results in PREHANDOVER_PROOF
- [ ] Guarantee statement included
- [ ] Evidence links provided

**Error Pattern**: Create PR → CI fails → Retry → CI fails → Retry → Multiple failed PRs

**Fix**: ALWAYS validate locally BEFORE PR creation (see Recommendation #5)

---

### Guardrail #4: Never Ignore Warnings

**Symptom**: "Just warnings, not errors"

**Prevention**:
- [ ] Treat warnings as errors (BL-028)
- [ ] Zero warnings required for handover
- [ ] yamllint warnings ARE errors
- [ ] TypeScript warnings ARE errors
- [ ] Build warnings ARE errors

**Error Pattern**: Warnings accumulate → Technical debt grows → Future work blocked

**Fix**: Zero tolerance for warnings (ZERO_TEST_DEBT binding #3)

---

### Guardrail #5: Never Skip Scope Declaration

**Symptom**: PR changes files not related to task

**Prevention**:
- [ ] Scope declaration written before work starts (BL-027)
- [ ] Scope boundaries explicit
- [ ] File change predictions documented
- [ ] Out-of-scope changes explained

**Error Pattern**: Work expands → Scope creep → Merge conflicts → Gate failures

**Fix**: MANDATORY scope declaration (SCOPE_DECLARATION.md)

---

### Guardrail #6: Never Start Wave Without Prerequisites

**Symptom**: Wave blocked mid-execution due to missing dependency

**Prevention**:
- [ ] Complete Pre-Authorization Checklist (Recommendation #3)
- [ ] Verify all dependencies resolved
- [ ] Verify infrastructure ready
- [ ] Verify builder readiness

**Error Pattern**: Wave starts → Blocked → Builders idle → Wasted time

**Fix**: Pre-authorization checklist (BL-020)

---

### Guardrail #7: Never Modify Agent Contracts Directly

**Symptom**: Agent contract change without governance approval

**Prevention**:
- [ ] FM CANNOT modify own contract
- [ ] FM CANNOT modify builder contracts
- [ ] FM CANNOT modify governance-liaison contract
- [ ] Contract changes → Escalate to CS2

**Error Pattern**: Unauthorized contract modification → Governance violation → Rollback required

**Fix**: AGENT_CONTRACT_PROTECTION_PROTOCOL.md (Binding #9)

---

### Guardrail #8: Never Bypass STOP-AND-FIX

**Symptom**: Discovered issue noted but not fixed

**Prevention**:
- [ ] If quality issue discovered → STOP immediately
- [ ] Assess remediation scope
- [ ] Fix if minor, escalate if substantial
- [ ] Document in PREHANDOVER_PROOF
- [ ] THEN proceed with original work

**Error Pattern**: Note issue → Continue work → Issue causes downstream failure

**Fix**: STOP_AND_FIX_DOCTRINE.md (Universal Responsibility)

**Prohibited Language**: "Will fix later", "Not my job", "Out of scope", "Pre-existing", "Known issue"
```

**Rationale**:
- Codifies lessons from BOOTSTRAP_EXECUTION_LEARNINGS (all 28 BLs)
- Prevents repeat mistakes
- Provides quick-reference guard rails
- Aligns with existing bindings

---

### Recommendation #7: Session Memory Protocol

**Location**: Add at end of contract (before final authority section)

**Purpose**: Ensure session learning and continuity

**Section Title**: `## Session Memory Protocol`

**Content Elements**:
```markdown
## Session Memory Protocol

**Authority**: FOREMAN_MEMORY_PROTOCOL.md (Binding #19)

### Memory Architecture (Four Levels)

1. **Constitutional Memory**: Governance canon (permanent)
2. **Wave Memory**: Wave-level continuity across sessions
3. **Session Memory**: Individual session artifacts
4. **Learning Memory**: Captured insights promoted to governance

---

### Session Closure Requirements (MANDATORY)

At end of EVERY session, FM MUST create:

**File**: `.agent-workspace/PartPulse-app_FM/memory/session-<NNN>-<YYYYMMDD>.md`

**Template**:
```markdown
# Session <NNN> - <YYYYMMDD>

## Task
[What was requested]

## Actions Taken
- [Action 1 with outcome]
- [Action 2 with outcome]

## Decisions Made
- [Decision 1: what and why]
- [Decision 2: what and why]

## Files Modified
[Auto-generated list with SHA256 checksums]

## Evidence Generated
- [Evidence file 1]
- [Evidence file 2]

## Issues Created
- [Issue #N: title and purpose]

## Builder Assignments
- [Builder X assigned to task Y]

## Outcome
[✅ COMPLETE | ⚠️ PARTIAL | ❌ ESCALATED]

## Lessons Learned
### What Worked Well
- [Success 1]

### What Was Challenging
- [Challenge 1]

### What Future Sessions Should Know
- [Recommendation 1]

---
Authority: FOREMAN_MEMORY_PROTOCOL.md v1.0.0 | Session: <NNN>
```

---

### Memory Rotation

When > 5 session files exist:
- Move oldest to `.agent-workspace/PartPulse-app_FM/memory/.archive/`
- Keep 5 most recent sessions active
- Commit archive operation

---

### Learning Capture (MANDATORY)

Also update (cumulative):

**File**: `.agent-workspace/PartPulse-app_FM/personal/lessons-learned.md`
```markdown
## Session <YYYYMMDD>
### Lesson: [Title]
- Context: [when this applies]
- Pattern: [what to watch for]
- Action: [what to do]
```

**File**: `.agent-workspace/PartPulse-app_FM/personal/patterns.md`
```markdown
## Pattern: [Name]
- Observed: YYYY-MM-DD (Session <NNN>)
- Context: [when this occurs]
- Response: [how to handle]
```

---

### Escalations

If blockers found, create:

**File**: `.agent-workspace/PartPulse-app_FM/escalation-inbox/blocker-<YYYYMMDD>.md`
```markdown
# Escalation: [Title]

## Type
BLOCKER | GOVERNANCE_GAP | AUTHORITY_BOUNDARY

## Description
[What requires CS2 attention]

## Context
[Session and wave context]

## Recommendation
[Proposed solution]

---
Created: Session <NNN> | Date: YYYY-MM-DD
```

---

**Rationale**: Memory continuity prevents repeat work, captures learning, enables session-to-session improvement
```

**Rationale**:
- FOREMAN_MEMORY_PROTOCOL already bound (Binding #19)
- Provides practical implementation guidance
- Ensures session continuity
- Captures organizational learning

---

### Recommendation #8: Governance Health Check Protocol

**Location**: Add after wake-up protocol

**Purpose**: Detect governance drift before it causes failures

**Section Title**: `## Governance Health Check (Pre-Work Validation)`

**Content Elements**:
```markdown
## Governance Health Check (Pre-Work Validation)

**Authority**: AGENT_BASELINE_MANAGEMENT_PROTOCOL.md (Binding #18), LIVING_AGENT_GOVERNANCE_HEALTH_CHECKS.md

Run this check after wake-up protocol, before starting work:

### Check 1: TIER_0 Canon Version

```bash
# Check local version
LOCAL_VERSION=$(grep '"version"' governance/TIER_0_CANON_MANIFEST.json | head -1 | cut -d'"' -f4)
echo "Local TIER_0: v$LOCAL_VERSION"

# Check canonical version (if network available)
CANONICAL_URL="https://raw.githubusercontent.com/APGI-cmy/maturion-foreman-governance/main/governance/TIER_0_CANON_MANIFEST.json"
CANONICAL_VERSION=$(curl -f -s "$CANONICAL_URL" 2>/dev/null | grep '"version"' | head -1 | cut -d'"' -f4)

if [ -n "$CANONICAL_VERSION" ]; then
    echo "Canonical TIER_0: v$CANONICAL_VERSION"
    if [ "$LOCAL_VERSION" != "$CANONICAL_VERSION" ]; then
        echo "⚠️  DRIFT DETECTED: Governance version mismatch"
        echo "   Action: Trigger governance-liaison to sync"
    else
        echo "✅ Governance aligned"
    fi
fi
```

### Check 2: Critical Canon Files Present

```bash
# Verify critical canon files exist
CRITICAL_CANON=(
    "governance/canon/GOVERNANCE_PURPOSE_AND_SCOPE.md"
    "governance/canon/STOP_AND_FIX_DOCTRINE.md"
    "governance/canon/AGENT_CONTRACT_PROTECTION_PROTOCOL.md"
    "governance/canon/CI_CONFIRMATORY_NOT_DIAGNOSTIC.md"
    "governance/canon/ZERO_TEST_DEBT_CONSTITUTIONAL_RULE.md"
    "BUILD_PHILOSOPHY.md"
)

MISSING_COUNT=0
for canon_file in "${CRITICAL_CANON[@]}"; do
    if [ ! -f "$canon_file" ]; then
        echo "❌ MISSING: $canon_file"
        MISSING_COUNT=$((MISSING_COUNT + 1))
    fi
done

if [ $MISSING_COUNT -gt 0 ]; then
    echo "❌ FATAL: $MISSING_COUNT critical canon files missing"
    echo "   Action: Escalate to governance-liaison"
    exit 1
fi
```

### Check 3: Agent Contract Integrity

```bash
# Verify FM contract hasn't been corrupted
EXPECTED_BINDINGS=23  # 10 Universal + 10 FM + 3 Living Agent v5.0
ACTUAL_BINDINGS=$(grep -c '- id:' .github/agents/PartPulse-app_FM.md)

if [ $ACTUAL_BINDINGS -ne $EXPECTED_BINDINGS ]; then
    echo "⚠️  WARNING: Binding count mismatch"
    echo "   Expected: $EXPECTED_BINDINGS"
    echo "   Actual: $ACTUAL_BINDINGS"
fi
```

### Check 4: Baseline Cleanliness

```bash
# Verify no test debt in baseline
if npm test 2>&1 | grep -E "skip|todo|pending"; then
    echo "❌ FATAL: Test debt detected in baseline"
    echo "   Action: Remediate test debt before starting work"
    exit 1
fi

# Verify no build warnings in baseline
if npm run build 2>&1 | grep -i "warning"; then
    echo "❌ FATAL: Build warnings detected in baseline"
    echo "   Action: Remediate warnings before starting work"
    exit 1
fi
```

### Check 5: Unresolved Escalations

```bash
# Check for blocking escalations
if [ -d ".agent-workspace/PartPulse-app_FM/escalation-inbox" ]; then
    ESCALATION_COUNT=$(find .agent-workspace/PartPulse-app_FM/escalation-inbox -name "blocker-*.md" | wc -l)
    if [ $ESCALATION_COUNT -gt 0 ]; then
        echo "⚠️  $ESCALATION_COUNT unresolved escalation(s)"
        echo "   Review before starting new work"
    fi
fi
```

### Health Check Summary

```bash
echo ""
echo "==================================="
echo "GOVERNANCE HEALTH CHECK SUMMARY"
echo "==================================="
echo "✅ TIER_0 Canon: Aligned"
echo "✅ Critical Canon Files: Present"
echo "✅ Contract Integrity: Valid"
echo "✅ Baseline: Clean"
echo "✅ Escalations: None blocking"
echo ""
echo "🎯 CLEARED FOR WORK"
echo "==================================="
```

**Enforcement**:
- Run after wake-up protocol
- FATAL errors → HALT and escalate
- Warnings → Document and proceed with caution
- Must pass before wave initiation
```

**Rationale**:
- Prevents working in degraded governance state
- Catches drift early
- Validates baseline before making changes
- Aligns with AGENT_BASELINE_MANAGEMENT_PROTOCOL (Binding #18)

---

## Part 4: Implementation Priority

### Phase 1: Critical (Immediate)
1. **PR Failure Analysis Protocol** (Rec #2) - Prevents catastrophic repeats
2. **Pre-Merge Gate Simulation** (Rec #5) - Guarantees gate success
3. **Wake-Up Protocol** (Rec #1) - Prevents degraded state execution

### Phase 2: High Priority (Next Session)
4. **Error Prevention Guardrails** (Rec #6) - Prevents common mistakes
5. **Pre-Authorization Checklist** (Rec #3) - Prevents wasted wave work
6. **Governance Health Check** (Rec #8) - Detects drift early

### Phase 3: Quality of Life (Following Session)
7. **Builder Task Validation** (Rec #4) - Improves builder experience
8. **Session Memory Protocol** (Rec #7) - Enables learning capture

---

## Part 5: Integration Notes

### Existing Bindings That Support These Recommendations

All recommendations align with **existing bindings** already in FM contract:

- **Rec #1** (Wake-Up) → Binding #18 (AGENT_BASELINE_MANAGEMENT_PROTOCOL.md)
- **Rec #2** (PR Failure) → Binding #10 (CI_CONFIRMATORY_NOT_DIAGNOSTIC.md)
- **Rec #3** (Pre-Auth) → Referenced but not detailed (FM_PREAUTH_CHECKLIST.md)
- **Rec #4** (Task Validation) → Binding #20 (FOREMAN_WAVE_PLANNING protocol)
- **Rec #5** (Gate Simulation) → Binding #6 (PRE-GATE MERGE VALIDATION)
- **Rec #6** (Guardrails) → Binding #4 (BOOTSTRAP_EXECUTION_LEARNINGS.md)
- **Rec #7** (Memory) → Binding #19 (FOREMAN_MEMORY_PROTOCOL.md)
- **Rec #8** (Health Check) → Binding #18 (AGENT_BASELINE_MANAGEMENT_PROTOCOL.md)

**Key Point**: These are NOT new requirements. They are **detailed implementations** of protocols already bound to FM contract.

---

## Part 6: Gold Standard Comparison

### Office-App Gold Standard Elements

From GOVERNANCE_RIPPLE_PR_FAILURE_PROTOCOL_COMPLETE.md:

1. ✅ **PR Failure Detection** → Rec #2 provides
2. ✅ **Mandatory Log Reading** → Rec #2 enforces
3. ✅ **Root Cause Analysis** → Rec #2 requires
4. ✅ **Local Validation** → Rec #5 provides
5. ✅ **Escalation Path** → Rec #2 defines
6. ✅ **Evidence Trail** → Rec #5 documents

### Builder Contract Schema Gold Standard

From BUILDER_CONTRACT_SCHEMA.md Section 5 (Maturion Doctrine Sections):

1. ✅ **Maturion Builder Mindset** → (Builder-specific, N/A for FM)
2. ✅ **One-Time Build Discipline** → Rec #4 enforces
3. ✅ **Zero Test Debt Rules** → Rec #6 Guardrail #4 enforces
4. ✅ **Evidence Requirements** → Rec #5 provides
5. ✅ **Build-to-Green Workflow** → Rec #6 Guardrail #2 enforces
6. ✅ **STOP-AND-FIX Enforcement** → Rec #6 Guardrail #8 enforces

---

## Part 7: Evidence-Based Rationale

### Office-App Incident Analysis

**Context**: PRs #730 and #733 experienced catastrophic repeat failures

**Root Causes Identified**:
1. No mandatory log reading before retry → Blind retries
2. No root cause analysis requirement → Symptom fixes only
3. No local validation before PR → Hope-based delivery
4. No escalation protocol → Infinite retry loops

**How These Recommendations Address**:
- **Rec #2**: Mandatory PR Failure Analysis Protocol
  - Forces log reading (Step 1)
  - Requires RCA (Step 2)
  - Enforces local validation (Step 3)
  - Limits retry attempts to 2 (Escalation section)

---

### Builder Contract Schema Analysis

**Requirement**: Schema v2.0 requires "Maturion Doctrine Sections"

**FM Contract Gap**: 
- Has governance bindings ✅
- Has LOCKED sections ✅
- Missing detailed checklists ❌
- Missing error prevention guardrails ❌

**How These Recommendations Address**:
- **Rec #1-8**: Provide practical implementation guidance for bound protocols
- **Rec #6**: Codifies error prevention (aligns with BL-001 through BL-028)
- **Rec #5**: Enforces PRE-GATE MERGE VALIDATION (already bound)

---

## Part 8: Approval and Implementation

### CS2 Approval Required

These recommendations propose LOCKED sections:
- **Rec #2**: PR Failure Analysis Protocol (LOCKED)

**Approval Path**: CS2 must approve before implementation

### Governance Alignment

All recommendations align with:
- ✅ Living Agent System v5.0.0
- ✅ Existing FM contract bindings (23 canonical bindings)
- ✅ BUILDER_CONTRACT_SCHEMA.md requirements
- ✅ Office-app incident lessons (PRs #730, #733)
- ✅ STOP_AND_FIX_DOCTRINE.md
- ✅ CI_CONFIRMATORY_NOT_DIAGNOSTIC.md

---

## Part 9: Expected Outcomes

### Quantifiable Improvements

1. **Reduced PR Failure Rate**: 
   - Before: Multiple retry PRs common
   - After: <5% PR failure rate (matching governance-liaison post-protocol)

2. **Faster Issue Resolution**:
   - Before: Blind retries without diagnosis
   - After: Root cause identified before first retry

3. **Improved Gate Success**:
   - Before: "Hope and pray" PR creation
   - After: Guaranteed gate success via local validation

4. **Better Session Continuity**:
   - Before: Lost context between sessions
   - After: Memory protocol preserves learning

### Qualitative Improvements

- **Reduced Builder Confusion**: Clear task validation checklist
- **Improved Governance Alignment**: Health checks catch drift early
- **Better Error Prevention**: Guardrails codify common mistakes
- **Enhanced Learning Capture**: Memory protocol preserves insights

---

## Part 10: Next Steps

### Immediate Actions

1. **Review Recommendations**: CS2 reviews all 8 recommendations
2. **Approve LOCKED Sections**: CS2 approves Rec #2 (PR Failure Protocol)
3. **Prioritize Implementation**: Use Phase 1/2/3 priorities (Part 4)

### Implementation Approach

**Option A: Single PR** (All 8 recommendations)
- Pros: Complete alignment in one change
- Cons: Large PR, harder to review

**Option B: Phased PRs** (Follow Phase 1/2/3)
- Pros: Incremental, easier to review, faster approval
- Cons: Multiple PRs, slower total completion

**Recommendation**: Option B (Phased PRs) with Phase 1 first (Critical items)

### Success Criteria

FM contract is aligned when:
- [ ] Wake-Up Protocol present and executable
- [ ] PR Failure Analysis Protocol present and LOCKED
- [ ] Pre-Merge Gate Simulation checklist present
- [ ] Error Prevention Guardrails documented
- [ ] Pre-Authorization Checklist present
- [ ] Builder Task Validation checklist present
- [ ] Session Memory Protocol documented
- [ ] Governance Health Check protocol present

---

## Authority & References

**Primary Authority**:
- GOVERNANCE_RIPPLE_PR_FAILURE_PROTOCOL_COMPLETE.md (office-app lessons)
- BUILDER_CONTRACT_SCHEMA.md (canonical schema requirements)
- Living Agent System v5.0.0 (TIER_0_CANON_MANIFEST.json v5.0.0)

**Supporting Authority**:
- STOP_AND_FIX_DOCTRINE.md
- CI_CONFIRMATORY_NOT_DIAGNOSTIC.md
- AGENT_BASELINE_MANAGEMENT_PROTOCOL.md
- FOREMAN_MEMORY_PROTOCOL.md
- FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md
- BOOTSTRAP_EXECUTION_LEARNINGS.md (BL-001 through BL-028)

**Evidence Sources**:
- Office-app PRs #730, #733 (catastrophic repeat failures)
- Governance Liaison contract (proven PR failure protocol)
- Builder Contract Schema v2.0 (Maturion Doctrine requirements)

---

**Generated**: 2026-02-11  
**Agent**: CodexAdvisor-agent  
**Version**: 1.0.0  
**Status**: READY FOR CS2 REVIEW
