# Foreman Execution Quick Reference

**Version**: 1.0.0  
**Last Updated**: 2025-12-15

---

## Purpose

This document provides a quick reference to the **Foreman Execution Readiness** documentation suite, helping you navigate the operational guides quickly.

---

## Core Documents

### 1. **Foreman Execution Playbook** ⭐ PRIMARY GUIDE
**Location**: `foreman/FOREMAN_EXECUTION_PLAYBOOK.md`

**Purpose**: The single authoritative operational guide for Maturion Foreman execution.

**Use When**: 
- Starting a new task or program
- Need to understand Foreman's workflow end-to-end
- Unclear about when to escalate or wait
- Setting up a new Foreman instance

**Key Sections**:
- Task classification (Program/Wave/Task)
- When to design architecture
- When to design QA
- When to issue Build-to-Green
- How to supervise builders
- How to evaluate evidence
- Completion vs escalation decisions
- When to STOP, escalate, or wait

**Quick Links**:
- Section III: Task Acceptance and Classification
- Section V: When to Design Architecture
- Section VI: When to Design QA
- Section VII: When to Issue Build-to-Green
- Section VIII: How to Supervise Builders
- Section X: Completion vs Escalation Decision
- Section XV: Execution State Tracking

---

### 2. **Architecture Design Checklist**
**Location**: `foreman/constitution/architecture-design-checklist.md`

**Purpose**: Mandatory 11-section checklist for validating architecture completeness before any build.

**Use When**:
- Designing new architecture
- Validating existing architecture before build
- Unsure if architecture is complete

**11 Mandatory Sections**:
1. True North (module vision)
2. Architecture Specification
3. Integration Specification
4. Data Specification
5. Frontend Specification
6. Backend Specification
7. QA Specification
8. Implementation Guide
9. Sprint Plan / Build Sequencing
10. Compliance and Security
11. Change Management and Versioning

**Critical Rule**: ALL sections must be 100% complete before issuing Build-to-Green.

---

### 3. **Design Freeze Rule**
**Location**: `foreman/governance/design-freeze-rule.md`

**Purpose**: Constitutional rule defining when and how architecture and QA are frozen during builds.

**Use When**:
- About to issue Build-to-Green
- During active build execution
- Considering modifying architecture mid-build
- Investigating freeze violations

**Key Rules**:
- **Freeze Trigger**: Activates when "Build to Green" is issued
- **Freeze Scope**: Architecture and QA documents
- **Freeze Duration**: Until build completes or is aborted
- **Who is Bound**: Foreman, Builders, Human Operators
- **Violations**: Architecture/QA modifications during build
- **Exception**: Owner (Johan) override only

**Critical Principle**: No moving targets during implementation.

---

### 4. **Build to Green Rule**
**Location**: `foreman/builder-specs/build-to-green-rule.md`

**Purpose**: Defines the ONLY instruction format builders accept and the workflow they follow.

**Use When**:
- Creating instructions for builders
- Builder rejects instruction (understand why)
- Validating builder workflow

**Key Rules**:
- ONLY instruction format: "Build to Green"
- Architecture must be complete and frozen
- QA must be RED (failing tests)
- 100% pass required before completion
- Pre-build validation mandatory
- Final validation mandatory

---

### 5. **Foreman Execution State Model**
**Location**: `foreman/governance/foreman-execution-state-model.md`

**Purpose**: Defines minimal execution states for tracking Foreman operations and enabling recovery.

**Use When**:
- Recording state transitions
- Resuming after interruption
- Understanding where Foreman is in a workflow
- Debugging stuck or lost context

**8 Execution States**:
1. **IDLE** - Awaiting work
2. **PLANNING** - Designing architecture and QA
3. **DESIGN_COMPLETE** - Ready to issue Build-to-Green
4. **BUILDING** - Builder executing, Design Freeze active
5. **BLOCKED** - Cannot proceed, waiting for resolution
6. **WAITING_FOR_DECISION** - Escalated, awaiting approval
7. **COMPLETE** - Build successful, ready for merge
8. **ABORTED** - Build stopped, needs revision

**Temporary Status**: Until PIT (Platform Intelligence Tracker) is implemented.

---

## Workflow Quick Reference

### Starting a New Task

```
1. Read Task → IDLE to PLANNING
2. Classify Task (Program/Wave/Task) → See Playbook Section III
3. Determine Scope → See Playbook Section IV
4. Design Architecture → See Playbook Section V
5. Validate Architecture → Use Architecture Design Checklist
6. Design QA (RED) → See Playbook Section VI
7. Validate QA → See Playbook Section VI
8. Ready to Build → PLANNING to DESIGN_COMPLETE
```

### Issuing Build-to-Green

```
1. Verify Preconditions → See Playbook Section VII
2. Activate Design Freeze → See Design Freeze Rule Section IV
3. Create Build-to-Green Instruction → See Build to Green Rule Section II
4. Assign to Builder → See Playbook Section VII
5. Issue Instruction → DESIGN_COMPLETE to BUILDING
```

### During Build Execution

```
1. Monitor Builder Progress → See Playbook Section VIII
2. Respond to Escalations → See Playbook Section VIII
3. Enforce Design Freeze → See Design Freeze Rule Section V
4. Track State → Use Execution State Model
5. Record Heartbeats → See State Model Section V
```

### Completing a Build

```
1. Review Evidence → See Playbook Section IX
2. Validate Completion Criteria → See Playbook Section X
3. Release Design Freeze → See Design Freeze Rule Section VII
4. Update Memory → See Playbook Section XVIII
5. Approve for Merge → See Playbook Section XI
6. Transition to COMPLETE → BUILDING to COMPLETE
```

### Handling Issues

```
1. Classify Issue → See Playbook Section VIII (Escalation Types)
2. Determine Response:
   - Architecture-QA Mismatch → ABORT
   - Impossible Requirements → ABORT
   - Protected Path Needed → ESCALATE
   - Repeated Failures → ESCALATE
   - Unclear Scope → BLOCKED
3. Create Escalation Report → See Playbook Section XIII
4. Update State → See State Model Section III
5. WAIT for Resolution → See Playbook Section XIV
```

---

## Decision Trees

### "Should I Issue Build-to-Green?"

```
Is architecture 100% complete? (Architecture Design Checklist)
  NO → Continue designing architecture
  YES ↓
  
Is architecture frozen?
  NO → Freeze architecture
  YES ↓
  
Is QA 100% complete? (QA-of-QA validation)
  NO → Continue designing QA
  YES ↓
  
Is QA status RED? (tests failing)
  NO → Something wrong, investigate
  YES ↓
  
Is there zero test debt?
  NO → Fix test debt
  YES ↓
  
Is builder identified and ready?
  NO → Identify and prepare builder
  YES ↓
  
✅ ISSUE BUILD-TO-GREEN
```

### "Should I Escalate to Johan?"

```
Can I resolve this within my authority?
  YES → Resolve and continue
  NO ↓
  
Is this one of these types?
  - Architectural Decision (business logic)
  - Breaking Change (CS2 required)
  - Protected Path Modification
  - Resource Constraint
  - Compliance Issue
  - Security Decision
  - Repeated Failures Pattern
  
  YES ↓
  
✅ ESCALATE TO JOHAN
  - See Playbook Section XIII for format
  - Transition to WAITING_FOR_DECISION
```

### "Should I STOP?"

```
Is one of these true?
  - Constitutional Violation Detected
  - Critical Security Issue
  - Fundamental Architecture Flaw
  - Memory Integrity Loss
  - Scope Boundary Violation
  - Test Debt Introduction
  - Partial QA Pass Attempt
  
  YES ↓
  
✅ STOP IMMEDIATELY
  - See Playbook Section XII
  - Transition to BLOCKED or ABORTED
  - Do NOT proceed
```

---

## Common Scenarios

### Scenario 1: Builder Escalates "Architecture Unclear"

**Response**:
1. Review architecture section in question
2. Determine if truly unclear OR builder misunderstood
3. **If truly unclear**:
   - ABORT build
   - Release Design Freeze
   - Clarify architecture
   - Re-validate architecture
   - Re-issue Build-to-Green
4. **If builder misunderstood**:
   - Provide clarification (without modifying docs)
   - Builder continues

**Reference**: Playbook Section VIII

### Scenario 2: Tests at 99% Passing

**Response**:
1. **REJECT** - 99% = TOTAL FAILURE
2. Do NOT accept partial pass
3. Builder must continue until 100%
4. Enforce Governance Supremacy Rule

**Reference**: Playbook Section X, Build Philosophy Section IV

### Scenario 3: Mid-Build Architecture Gap Discovered

**Response**:
1. Assess severity
2. **If minor clarification** (no spec change):
   - Document clarification
   - Continue build
3. **If specification missing** (gap in architecture):
   - ABORT build
   - Release Design Freeze
   - Complete missing architecture sections
   - Re-validate architecture
   - Re-issue Build-to-Green

**Reference**: Design Freeze Rule Section VIII

### Scenario 4: Context Lost After Chat Reset

**Response**:
1. Load latest state from memory
   - Query: `execution-state-*` (most recent)
2. Load task context from memory
3. Load evidence trail
4. Validate state integrity
5. **If state recent (<24h)**:
   - Resume from recorded state
6. **If state old (>24h)**:
   - Review for relevance
   - Escalate if unclear
7. Document gap and resumption

**Reference**: State Model Section VI

---

## Memory Integration

### What to Load Before Actions

**Before Classifying Task**:
```typescript
queryMemory({
  scope: 'foreman',
  tags: ['task', 'classification', '<module-name>'],
  limit: 10
})
```

**Before Designing Architecture**:
```typescript
queryMemory({
  scope: 'foreman',
  tags: ['architecture', '<module-name>'],
  limit: 20
})
```

**Before Issuing Build-to-Green**:
```typescript
queryMemory({
  scope: 'foreman',
  tags: ['build', '<module-name>', 'lessons'],
  limit: 10
})
```

### What to Write After Actions

**After Task Classification**:
```json
{
  "scope": "foreman",
  "key": "task-classification-<id>",
  "classification": "<PROGRAM|WAVE|TASK>",
  "affected_modules": ["list"],
  "timestamp": "ISO 8601"
}
```

**After State Transition**:
```json
{
  "scope": "foreman",
  "key": "execution-state-<task-id>-<timestamp>",
  "state": "<STATE>",
  "previous_state": "<PREVIOUS_STATE>",
  "reason": "why",
  "timestamp": "ISO 8601"
}
```

**After Build Completion**:
```json
{
  "scope": "foreman",
  "key": "build-completion-<id>",
  "status": "complete",
  "lessons_learned": ["list"],
  "timestamp": "ISO 8601"
}
```

**Reference**: Playbook Section XVIII

---

## Constitutional Authority Hierarchy

```
1. Johan (Owner)
   - Ultimate authority
   - Can override any rule temporarily
   ↓
2. BUILD_PHILOSOPHY.md
   - Supreme constitutional authority
   - All other docs derive from this
   ↓
3. Foreman Agent Contract (.github/foreman/agent-contract.md)
   - Foreman's constitutional contract
   ↓
4. Constitutional Documents (foreman/constitution/)
   - Architecture Design Checklist
   ↓
5. Governance Rules (foreman/governance/)
   - Governance Supremacy Rule
   - Zero Test Debt Constitutional Rule
   - Design Freeze Rule
   - Foreman Execution State Model
   ↓
6. Builder Specifications (foreman/builder-specs/)
   - Build to Green Rule
   ↓
7. Operational Guides
   - Foreman Execution Playbook
```

**Reference**: Build Philosophy Section I, Foreman Agent Definition

---

## Protected Paths (Never Modify Without CS2 Approval)

```
.github/workflows/
.github/foreman/agent-contract.md
.github/agents/foreman.agent.md
BUILD_PHILOSOPHY.md
foreman/constitution/
foreman/governance/
foreman/builder-specs/build-to-green-rule.md
foreman/FOREMAN_EXECUTION_PLAYBOOK.md
docs/governance/
```

**If modification needed**: STOP → Escalate to Johan → Require CS2 approval

**Reference**: Build Philosophy Section VIII

---

## Key Principles (Always Remember)

1. **One-Time Build Correctness**
   - Complete architecture before building
   - No trial-and-error implementation
   - First build is correct

2. **Zero Regression**
   - No breaking changes without approval
   - All existing tests must continue to pass
   - Working code stays working

3. **Full Architectural Alignment**
   - Architecture is law
   - No deviation
   - No interpretation

4. **Zero Loss of Context**
   - Memory is mandatory
   - All decisions preserved
   - Context survives resets

5. **Zero Ambiguity**
   - All requirements testable
   - All acceptance criteria measurable
   - No subjective standards

6. **Governance Supremacy**
   - 100% QA passing is ABSOLUTE
   - Zero test debt is MANDATORY
   - Architecture conformance is REQUIRED
   - Constitutional files are PROTECTED

**Reference**: Build Philosophy Section II

---

## Getting Help

### If You're Unsure...

**About task classification**: See Playbook Section III  
**About architecture completeness**: Use Architecture Design Checklist  
**About when to build**: See Playbook Section VII (Preconditions)  
**About handling escalations**: See Playbook Section VIII  
**About when to STOP**: See Playbook Section XII  
**About when to escalate**: See Playbook Section XIII  
**About state tracking**: See State Model Section II  
**About Design Freeze**: See Design Freeze Rule

### Still Unsure?

**ESCALATE TO JOHAN** - It's better to escalate than proceed incorrectly.

---

## Version and Maintenance

**Version**: 1.0.0  
**Last Updated**: 2025-12-15  
**Maintained By**: Maturion Foreman  
**Owner**: Johan (MaturionISMS)

**Update This Document When**:
- Core documents are updated
- New workflows are added
- Common scenarios change
- Feedback identifies gaps

---

## Summary

This quick reference connects you to the right document for any Foreman execution scenario.

**Primary Guide**: Start with **Foreman Execution Playbook**  
**Architecture Validation**: Use **Architecture Design Checklist**  
**Build Process**: Follow **Build to Green Rule**  
**Mid-Build Changes**: Prohibited by **Design Freeze Rule**  
**State Tracking**: Use **Execution State Model**

**When in doubt → Escalate. Quality is non-negotiable.**

---

*END OF FOREMAN EXECUTION QUICK REFERENCE*
