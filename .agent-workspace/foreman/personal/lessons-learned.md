# Foreman Agent - Lessons Learned

This file captures cumulative learnings across all Foreman sessions. It is never rotated - only appended to.

---

## Session 20260212 (Session 001)

### Lesson: Gold Standard Compliance is Binary, Not Progressive

- **Context**: When working toward canonical gold standard compliance
- **Pattern**: Declaring work "Phase 1 complete" or "Phase 2 complete" for what should be atomic compliance
- **Problem**: Gold standard has no phases - it's either 100% compliant or non-compliant
- **Action**: 
  - Never declare partial compliance as "complete"
  - Verify ALL requirements before claiming completion
  - Use binary status: COMPLIANT or NON-COMPLIANT (no middle ground)

### Lesson: Manual Review Fails as Quality Gate

- **Context**: Submitting work for review without systematic verification
- **Pattern**: Relying on human memory to check all requirements; using checklists as documentation rather than enforcement
- **Problem**: Human review missed 4 major sections across 2 attempts (repeat failure)
- **Action**:
  - Download canonical gold standard locally for comparison
  - Use `diff` or structured tools to compare programmatically
  - Check EVERY section/requirement with tools, not just visual scan
  - Treat checklists as gates that must PASS, not just documentation

### Lesson: Session Memory Prevents Repeat Failures

- **Context**: Working on multi-session tasks or repeat attempts
- **Pattern**: Starting work without reviewing what previous sessions learned
- **Problem**: Without session-to-session memory, agents repeat the same mistakes
- **Action**:
  - Document EVERY session in .agent-workspace/foreman/memory/
  - Review previous session memory before starting new work
  - Capture root causes, not just fixes
  - Update lessons-learned.md (this file) after each learning event

### Lesson: Evidence Automation > Manual Evidence Creation

- **Context**: Creating evidence artifacts for PR submissions
- **Pattern**: Manually creating evidence files/directories each time
- **Problem**: Manual creation is error-prone, inconsistent, and time-consuming
- **Action**:
  - Create automation scripts for standard evidence patterns
  - Use templates for consistency
  - Run automation script before PR submission
  - Maintain scripts in .github/scripts/ for CI/CD integration

### Lesson: Repeat Failures Require Root Cause Analysis

- **Context**: Failing the same task multiple times
- **Pattern**: Fixing symptoms without understanding why the failure occurred
- **Problem**: Without RCA, failures repeat because root cause persists
- **Action**:
  - First failure = fix it
  - Second failure = fix it + document RCA + prevention actions
  - Third failure = escalate (process is broken, not just execution)
  - Document RCA in session memory file
  - Update lessons-learned.md with prevention protocol

---

## Verification Protocols

### Pre-Work Verification Protocol

**When**: Before starting any gold standard alignment work

**Steps**:
1. Download canonical gold standard reference locally
   ```bash
   curl -sL https://raw.githubusercontent.com/APGI-cmy/maturion-foreman-governance/main/.github/agents/foreman-v2.agent.md > /tmp/canonical-foreman.md
   ```

2. Create section-by-section checklist from canonical
   ```bash
   grep "^## " /tmp/canonical-foreman.md > /tmp/canonical-sections.txt
   ```

3. Compare current file against canonical sections
   ```bash
   grep "^## " .github/agents/PartPulse-app_FM.md > /tmp/current-sections.txt
   diff /tmp/canonical-sections.txt /tmp/current-sections.txt
   ```

4. Identify gaps before starting work (don't discover gaps during review)

### Completion Gate Protocol

**When**: Before declaring work complete or submitting PR

**Steps**:
1. Verify EVERY acceptance criterion
   - Use `grep` to check for required sections
   - Use `diff` to compare against canonical
   - Don't rely on memory - use tools

2. Check for required infrastructure
   ```bash
   # Verify evidence infrastructure exists
   test -d .agent-admin/prehandover || echo "MISSING: prehandover/"
   test -d .agent-admin/gates || echo "MISSING: gates/"
   test -d .agent-admin/rca || echo "MISSING: rca/"
   test -d .agent-admin/improvements || echo "MISSING: improvements/"
   test -d .agent-admin/governance || echo "MISSING: governance/"
   
   # Verify Foreman workspace exists
   test -d .agent-workspace/foreman/memory || echo "MISSING: memory/"
   test -d .agent-workspace/foreman/personal || echo "MISSING: personal/"
   test -d .agent-workspace/foreman/escalation-inbox || echo "MISSING: escalation-inbox/"
   ```

3. Verify required sections exist in contract
   ```bash
   # Check for gold standard sections
   grep -q "## Versioning Notes" .github/agents/PartPulse-app_FM.md || echo "MISSING: Versioning Notes"
   grep -q "## Responsibility & Requirement Mappings" .github/agents/PartPulse-app_FM.md || echo "MISSING: 10-Category Mapping"
   grep -q "## Canonical Governance References" .github/agents/PartPulse-app_FM.md || echo "MISSING: Canonical References"
   grep -q "## Evidence Artifact Bundle Automation" .github/agents/PartPulse-app_FM.md || echo "MISSING: Evidence Bundle"
   ```

4. Only declare COMPLETE when ALL checks pass

### Session Closure Protocol

**When**: At the end of every work session

**Steps**:
1. Create session memory file in .agent-workspace/foreman/memory/
2. Document what was done, decisions made, challenges faced
3. Perform root cause analysis if work failed or was reworked
4. Update lessons-learned.md with new learnings
5. Create patterns.md entries for recurring issues
6. Rotate memory if > 5 sessions exist

---

## Prevention Actions

### For Gold Standard Compliance Work

**DO**:
- ✅ Download canonical reference first
- ✅ Create verification checklist from canonical
- ✅ Use tools (diff, grep) for systematic comparison
- ✅ Verify EVERY section before claiming complete
- ✅ Document learnings in session memory

**DON'T**:
- ❌ Rely on memory or visual scan alone
- ❌ Declare partial completion as "complete"
- ❌ Skip systematic verification due to time pressure
- ❌ Submit PR without diff check against canonical
- ❌ Assume "close enough" is acceptable

### For Repeat Failure Prevention

**DO**:
- ✅ Review previous session memory before starting
- ✅ Document root cause analysis for failures
- ✅ Create prevention actions, not just fixes
- ✅ Update lessons-learned.md after learning events
- ✅ Escalate if same failure occurs 3+ times

**DON'T**:
- ❌ Start work without reviewing past sessions
- ❌ Fix symptoms without understanding root cause
- ❌ Repeat failed approaches without modification
- ❌ Ignore patterns of repeated mistakes
- ❌ Continue same process after multiple failures

---

**Last Updated**: 2026-02-12 (Session 001)  
**Authority**: LIVING_AGENT_SYSTEM.md v6.2.0  
**Maintenance**: Append after each learning event; never rotate
