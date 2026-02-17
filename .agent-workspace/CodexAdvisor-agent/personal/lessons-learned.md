# CodexAdvisor Lessons Learned

## Session 20260217 (Session 004)

### Lesson: Delegate Approved Governance Gaps vs. Self-Blocking

**Context**: When a governance artifact is missing but its creation is pre-approved and within another agent's authority scope.

**Pattern**: 
- Governance gap exists (e.g., missing checklist)
- Prior approval exists (e.g., PR #361 approved 4-phase architecture)
- Specialized agent has appropriate authority (e.g., Governance Liaison has `governance/**` write access)

**Action**:
1. **DO**: Delegate to specialized agent with comprehensive context
   - Use `task` tool with appropriate agent_type
   - Provide complete specification (target file, requirements, prior approvals)
   - Reference canonical sources and templates
   - Verify delegation outcome and evidence artifacts

2. **DO NOT**: Self-block or escalate unnecessarily
   - Avoid treating pre-approved gaps as blockers
   - Don't execute work outside your authority scope
   - Don't escalate when delegation is the appropriate path

**Example**: Issue #[current] - Delegated FOREMAN checklist creation to Governance Liaison agent rather than self-blocking or creating it myself (CodexAdvisor).

**Rationale**: Preserves role separation, respects authority boundaries, follows RAEC operating model (Coordinate phase).

**Authority**: Living Agent System v6.2.0, RAEC Operating Model

---

## Session 20260217 (Session 004)

### Lesson: RAEC Operating Model in Practice

**Context**: CodexAdvisor operates under RAEC model (Review-Advise-Escalate-Coordinate) not as traditional coding agent.

**Pattern**:
- Task requires specialized work outside CodexAdvisor core competencies
- Specialized agent exists with appropriate authority
- CodexAdvisor role is coordination, not execution

**Action**:
1. **Review**: Assess task requirements and identify appropriate delegate
2. **Advise**: Provide comprehensive specification to delegate
3. **Escalate**: Only if no appropriate delegate or authority boundary crossed
4. **Coordinate**: Delegate, verify, document

**Example**: Session 004 - Coordinated FOREMAN checklist creation via Governance Liaison delegation rather than executing myself.

**Rationale**: CodexAdvisor is Overseer + Agent Factory, not Builder. Delegation preserves role boundaries.

**Authority**: CodexAdvisor contract (agent.class: overseer), RAEC Operating Model

---

## Session 20260217 (Session 004)

### Lesson: Evidence Requirements for Delegated Work

**Context**: When delegating to specialized agents, ensure evidence requirements are met.

**Pattern**:
- CodexAdvisor delegates task to specialized agent
- Specialized agent completes work
- Evidence artifacts required for audit trail

**Action**:
1. Verify delegated agent followed proper protocols:
   - Wake-up protocol executed
   - Session closure executed
   - PREHANDOVER proof created (if applicable)
   - Session memory documented
2. Track evidence artifact locations for session memory
3. Include evidence summary in CodexAdvisor session memory

**Example**: Session 004 - Verified Governance Liaison created:
- `.agent-admin/prehandover/FOREMAN_CHECKLIST_CREATION_PROOF.md`
- `.agent-workspace/governance-liaison/memory/session-20260217-104412.md`
- `FOREMAN_CHECKLIST_CREATION_COMPLETION_SUMMARY.md`

**Rationale**: Complete audit trail required by Living Agent System v6.2.0

**Authority**: Living Agent System v6.2.0 Evidence Protocol

---
