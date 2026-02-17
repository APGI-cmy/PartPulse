# CodexAdvisor Patterns

## Pattern: Delegation Over Self-Execution

**Observed**: 2026-02-17 (Session 004)

**Context**: When a task falls within a specialized agent's authority scope and CodexAdvisor's role is coordination rather than execution.

**Triggers**:
- Task requires specialized authority (e.g., governance alignment, builder work)
- Specialized agent exists with appropriate scope
- Task is pre-approved or within established governance
- CodexAdvisor role is oversight/coordination

**Response**:
1. Identify appropriate specialized agent
2. Verify agent authority matches task requirements
3. Delegate using `task` tool with comprehensive context
4. Verify completion and evidence artifacts
5. Document coordination in session memory

**Anti-Pattern**: CodexAdvisor executing specialized work directly (violates role boundaries)

**Example**: Delegated FOREMAN checklist creation to Governance Liaison (Session 004)

**Authority**: RAEC Operating Model, Living Agent System v6.2.0

---

## Pattern: Comprehensive Delegation Context

**Observed**: 2026-02-17 (Session 004)

**Context**: When delegating to specialized agents via `task` tool, provide complete specification to enable autonomous completion.

**Required Elements**:
1. **Task objective**: What needs to be created/modified
2. **Prior approvals**: Reference governance approvals or CS2 authorizations
3. **Target artifacts**: Specific file paths and locations
4. **Reference templates**: Similar artifacts to use as structural models
5. **Requirements specification**: Complete list of requirements to satisfy
6. **Role-specific context**: Any role-specific considerations (e.g., Foreman vs. Builder requirements)
7. **Delivery requirements**: Evidence artifacts, validation criteria

**Response**:
- Include all 7 elements in delegation prompt
- Reference canonical sources and protocols
- Specify validation criteria explicitly
- Enable one-pass completion without back-and-forth

**Anti-Pattern**: Vague delegation requiring multiple rounds of clarification

**Example**: Session 004 FOREMAN checklist delegation included all 7 elements, enabling Governance Liaison to complete on first attempt

**Authority**: Living Agent System v6.2.0 Coordination Protocols

---

## Pattern: Pre-Approved Governance Gap Resolution

**Observed**: 2026-02-17 (Session 004)

**Context**: When a governance artifact is missing but its creation is pre-approved by prior governance decisions.

**Indicators**:
- Architecture or framework approved (e.g., PR #361 approved 4-phase architecture)
- Missing artifact is implementation detail of approved architecture (e.g., FOREMAN checklist)
- No new governance interpretation required
- Clear authority path exists (e.g., Governance Liaison for checklists)

**Response**:
1. **DO NOT** treat as blocker requiring escalation
2. **DO NOT** self-block on missing artifact
3. **DO** delegate to appropriate specialized agent
4. **DO** reference prior approval in delegation context
5. **DO** document resolution path in session memory

**Anti-Pattern**: Escalating pre-approved implementation tasks as governance gaps

**Example**: PR #361 approved Foreman 4-phase architecture; missing FOREMAN checklist was implementation task, not governance decision

**Authority**: Living Agent System v6.2.0, Issue #[current] guidance

---

## Pattern: Role-Appropriate Task Assignment

**Observed**: 2026-02-17 (Session 004)

**Context**: Matching tasks to agents based on authority scope and role definition.

**Agent Role Mappings**:
- **CodexAdvisor** (Overseer): Agent contract creation/alignment, coordination, governance advisory
- **Governance Liaison** (Liaison): Governance alignment, layer-down, checklist creation, ripple management
- **Foreman** (Foreman): Builder recruitment, wave orchestration, merge gate management, architecture approval
- **Builders** (Builder): Production code implementation, tests, QA, schema, UI, API, integration

**Response**:
1. Identify task category (governance alignment, agent contract, production code, etc.)
2. Map to appropriate agent role
3. Verify agent has authority for specific task
4. Delegate to appropriate agent OR execute if within CodexAdvisor scope

**Anti-Pattern**: Any agent executing work outside their defined role

**Example**: Governance alignment task (FOREMAN checklist) → Governance Liaison (NOT CodexAdvisor, NOT Foreman)

**Authority**: Living Agent System v6.2.0 Role Definitions

---
