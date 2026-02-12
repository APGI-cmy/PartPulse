# Foreman Agent - Patterns

This file captures recurring patterns observed across sessions. It is never rotated - only appended to.

---

## Pattern: Incomplete Gold Standard Verification

- **Observed**: 2026-02-12 (Session 001)
- **Context**: When working toward canonical gold standard compliance without systematic verification
- **Symptoms**:
  - Work declared "complete" but missing required sections
  - Manual review fails to catch gaps
  - Multiple attempts needed to achieve compliance
- **Root Cause**: Relying on human memory/visual scan instead of systematic tool-based comparison
- **Response**:
  - Download canonical reference locally
  - Use `diff` or `grep` to compare programmatically
  - Create verification checklist from canonical sections
  - Verify EVERY requirement before claiming completion

## Pattern: Binary Compliance Misunderstood as Progressive

- **Observed**: 2026-02-12 (Session 001)
- **Context**: Declaring "Phase 1 complete" or "Phase 2 complete" for gold standard alignment
- **Symptoms**:
  - Work submitted as "Phase N complete" but overall goal not met
  - False sense of progress toward incomplete goal
  - Partial compliance treated as acceptable milestone
- **Root Cause**: Misunderstanding that gold standard compliance is binary (100% or 0%), not progressive
- **Response**:
  - Use only binary status: COMPLIANT or NON-COMPLIANT
  - Never declare partial compliance as "complete"
  - Verify ALL requirements atomically before submission
  - No "phases" for what should be atomic compliance

## Pattern: Manual Evidence Creation is Error-Prone

- **Observed**: 2026-02-12 (Session 001)
- **Context**: Creating evidence artifacts manually for each PR
- **Symptoms**:
  - Inconsistent directory structures
  - Missing required subdirectories
  - Template files not created
  - Time-consuming manual setup
- **Root Cause**: Lack of automation for standard, repeatable processes
- **Response**:
  - Create bash automation scripts for evidence bundle creation
  - Maintain standard templates in version control
  - Run automation script before PR submission
  - Integrate automation into CI/CD pipelines

## Pattern: Session Memory Gap Causes Repeat Failures

- **Observed**: 2026-02-12 (Session 001)
- **Context**: Starting work without infrastructure to remember previous session learnings
- **Symptoms**:
  - Same mistakes repeated across sessions
  - No learning curve observed
  - Failures don't trigger process improvements
  - Each session starts from zero knowledge
- **Root Cause**: No session-to-session memory infrastructure in place
- **Response**:
  - Create .agent-workspace/foreman/memory/ structure
  - Document EVERY session with memory file
  - Review previous session before starting new work
  - Rotate memory files when > 5 sessions exist

## Pattern: Checklists Used as Documentation, Not Gates

- **Observed**: 2026-02-12 (Session 001)
- **Context**: Acceptance criteria listed but not enforced before claiming completion
- **Symptoms**:
  - Checklist items marked complete without verification
  - Work submitted missing checklist requirements
  - Checklist becomes retrospective documentation, not preventive gate
- **Root Cause**: Treating checklists as progress tracking instead of quality gates
- **Response**:
  - Don't proceed to next step until current step VERIFIED
  - Use tools to verify checklist items programmatically
  - Block completion until ALL checklist items pass
  - Checklists must ENFORCE compliance, not just document it

---

**Last Updated**: 2026-02-12 (Session 001)  
**Authority**: LIVING_AGENT_SYSTEM.md v6.2.0  
**Maintenance**: Append after each pattern observation; never rotate
