---
id: BUILDER_CONTRACT_SCHEMA
description: >-
  Machine-readable builder agent contract specification.
  Defines required structure and format for all builder agent contracts.
schema:
  version: "2.0"
  status: canonical
  authority: BUILD_PHILOSOPHY.md
---

# Builder Contract Schema v2.0

**Status**: CANONICAL SCHEMA (MATURION DOCTRINE ENFORCED)
**Authority**: BUILD_PHILOSOPHY.md, BL-016 Constitutional Alignment
**Location**: `.github/agents/BUILDER_CONTRACT_SCHEMA.md`

---

## Purpose

Defines the required structure and format for all builder agent contracts in the Maturion ISMS ecosystem. Builder contracts MUST conform to this schema to enable automated builder recruitment, selection, and task assignment.

---

## STOP-AND-FIX Enforcement

**Authority**: STOP_AND_FIX_DOCTRINE.md Section 3.1, 3.2, 3.3

If this agent discovers ANY quality issue (YAML errors, lint warnings, test failures, broken references, governance gaps):
1. STOP current work immediately
2. Assess remediation scope
3. IF minor: Fix immediately before proceeding
4. IF substantial: Escalate as blocking issue
5. Document remediation in PREHANDOVER_PROOF
6. THEN proceed with original task

**Prohibited**: "Ignore", "Not my responsibility", "Out of scope", "Pre-existing issue"

---

## File Location & Format

**Location**: `.github/agents/<builder-id>.md`

**Format**: YAML frontmatter + Markdown body

```markdown
---
name: <Display Name>
role: builder
description: >
  <Multi-line description>
builder_id: <builder-id>
...
---

# Markdown body
## Section 1
...
```

---

## Required YAML Frontmatter Fields

### GitHub Copilot Agent Fields (REQUIRED FOR SELECTABILITY)

Must be at the top of YAML frontmatter. **Missing these = agent not selectable.**

1. **name** (string, REQUIRED): Display name in agent selector
   - Example: `name: API Builder`
   - Must be human-readable, title case recommended

2. **role** (string, REQUIRED): Agent role designation
   - Value: `builder` (for all Maturion builders)
   - Critical for GitHub Copilot platform integration

3. **description** (string, REQUIRED): Multi-line description using `>` syntax
   - Must describe builder purpose, constraints, Maturion Build Philosophy
   - 2-4 sentences recommended
   - Example:
     ```yaml
     description: >
       API Builder for Maturion ISMS modules. Implements backend API endpoints
       according to frozen architecture. Operates under Maturion Build Philosophy:
       Architecture → QA-to-Red → Build-to-Green → Validation. MUST NOT modify UI or schema.
     ```

### Maturion Builder Identity Fields (REQUIRED)

4. **builder_id** (string, REQUIRED): Unique builder identifier
   - Format: kebab-case (e.g., `api-builder`, `ui-builder`)
   - Must match filename

5. **builder_type** (string, REQUIRED): Builder classification
   - Values: `specialized`, `generalist`
   - Specialized: Domain-specific (UI, API, schema, integration, QA)
   - Generalist: Cross-domain capabilities

6. **version** (string, REQUIRED): Contract version (semantic versioning)
   - Format: `major.minor.patch`
   - Example: `version: 3.3.0`

7. **status** (string, REQUIRED): Builder recruitment status
   - Values: `recruited`, `active`, `retired`

8. **capabilities** (array, REQUIRED): List of builder capabilities
   - Example: `["api", "backend", "business-logic", "data-processing"]`

9. **responsibilities** (array, REQUIRED): List of builder responsibilities
   - Example: `["API routes", "Business logic", "Data validation"]`

10. **forbidden** (array, REQUIRED): List of prohibited activities
    - Example: `["Frontend UI logic", "Cross-module logic", "Database schema changes"]`

11. **permissions** (object, REQUIRED): File access permissions
    - Structure:
      ```yaml
      permissions:
        read:
          - "foreman/**"
          - "architecture/**"
          - "governance/**"
        write:
          - "apps/*/api/**"
      ```

12. **recruitment_date** (string, REQUIRED): Date builder was recruited (ISO 8601)
    - Example: `recruitment_date: 2025-12-30`

### Maturion Doctrine Fields (REQUIRED)

13. **canonical_authorities** (array, REQUIRED): Canonical governance sources
    - MUST include:
      - `BUILD_PHILOSOPHY.md`
      - `governance/ROLE_APPOINTMENT_PROTOCOL.md`
      - `foreman/builder/<builder-spec>.md`
    - Example:
      ```yaml
      canonical_authorities:
        - BUILD_PHILOSOPHY.md
        - governance/ROLE_APPOINTMENT_PROTOCOL.md
        - foreman/builder/api-builder-spec.md
      ```

14. **maturion_doctrine_version** (string, REQUIRED): Maturion Build Philosophy version
    - Current: `"1.0.0"`

15. **handover_protocol** (string, REQUIRED): Handover semantics
    - Value: `"gate-first-deterministic"`
    - Meaning: Work complete ONLY when gates satisfied, evidence linkable

16. **no_debt_rules** (string, REQUIRED): Test debt policy
    - Value: `"zero-test-debt-mandatory"`
    - Meaning: No .skip(), .todo(), commented tests, incomplete tests

17. **evidence_requirements** (string, REQUIRED): Evidence trail policy
    - Value: `"complete-audit-trail-mandatory"`
    - Meaning: All build/validation/iteration evidence required

18. **governance** (object, REQUIRED): Governance bindings
    - Structure:
      ```yaml
      governance:
        canon:
          repository: APGI-cmy/maturion-foreman-governance
          path: /governance/canon
          reference: main
        bindings:
          - id: governance-purpose-scope
            path: governance/canon/GOVERNANCE_PURPOSE_AND_SCOPE.md
            role: supreme-authority
          - id: build-philosophy
            path: BUILD_PHILOSOPHY.md
            role: supreme-building-authority
          # ... (10 universal bindings + 3 builder-specific)
      ```
    - **Universal Bindings** (ALL AGENTS): governance-purpose-scope, build-philosophy, zero-test-debt, bootstrap-learnings, constitutional-sandbox, pre-gate-merge-validation, opojd, mandatory-enhancement, agent-contract-protection, ci-confirmatory
    - **Builder-Specific Bindings**: builder-red-to-green, builder-execution-checklist, builder-enhancement-capture

19. **metadata** (object, REQUIRED): Contract metadata
    - Fields: version, repository, context, protection_model, references_locked_protocol
    - Example:
      ```yaml
      metadata:
        version: 3.3.0
        repository: APGI-cmy/PartPulse
        context: builder-contract
        protection_model: reference-based
        references_locked_protocol: true
      ```

20. **model** (string, REQUIRED): AI model designation
    - Example: `model: gpt-4-1`

21. **model_tier** (string, REQUIRED): Model tier classification
    - Values: `standard`, `premium`

22. **model_tier_level** (string, REQUIRED): Model tier level
    - Values: `L0`, `L1`, `L2`, `L3`
    - Builders typically use `L1`

23. **model_class** (string, REQUIRED): Model class
    - Values: `coding`, `reasoning`, `extended-reasoning`

24. **temperature** (number, REQUIRED): Model temperature setting
    - Range: 0.0 to 1.0
    - Builders typically use 0.3

---

## Required Markdown Sections

### Maturion Doctrine Sections (REQUIRED)

**1. Maturion Builder Mindset**

Must contain:
- Core mindset: NOT a generic developer
- Principle: Governance-first, not code-first
- Discipline: Architecture → QA-to-Red → Build-to-Green → Validation
- No deviation from this workflow

Example structure:
```markdown
## Maturion Builder Mindset

**Core Mindset**:
- ❌ NOT a generic developer who iterates to solutions
- ✅ A governed builder who implements frozen architecture to make RED tests GREEN

**Sacred Workflow**:
Architecture (frozen) → QA-to-Red (failing) → Build-to-Green (implement) → Validation (100%) → Merge
```

**2. One-Time Build Discipline**

Must contain:
- No trial-and-error implementation
- Architecture must be 100% complete before starting
- No "build first, fix later" approaches

**3. Zero Test Debt Constitutional Rule**

Must contain:
- All test debt types prohibited
- STOP-FIX-RERUN-VERIFY cycle
- 100% GREEN required

**4. STOP-AND-FIX Doctrine**

Must contain:
- Quality issue ownership
- Immediate remediation requirement
- Prohibited deflection language

**5. Mandatory Enhancement Capture**

Must contain:
- After EVERY task: Suggest improvements
- Capture in designated location
- Cannot skip even if "none found"

**6. Execution Checklist**

Must contain:
- Pre-work verification steps
- During-work checkpoints
- Post-work validation steps

**7. Protection Model**

Must contain:
- Reference to AGENT_CONTRACT_PROTECTION_PROTOCOL.md
- Protection coverage statement
- Reference-based (not embedded) protection approach

**8. Version History**

Must contain:
- Version number
- Date
- Change summary

---

## Validation Rules

1. **YAML Syntax**: Must be valid YAML
2. **Required Fields**: All 24 required fields must be present
3. **Field Types**: All fields must match specified types
4. **Allowed Values**: Enumerated fields must use specified values
5. **Required Sections**: All 8 markdown sections must be present
6. **File Location**: Must be in `.github/agents/` directory
7. **Filename**: Must match `<builder-id>.md`
8. **Character Limit**: Must be ≤30,000 characters for GitHub Copilot compatibility

---

## Enforcement

**Authority**: BUILD_PHILOSOPHY.md § V - Builder Authority and Constraints

- Builder contracts NOT conforming to this schema CANNOT validate
- Foreman MUST verify schema compliance before builder appointment
- Non-conforming contracts MUST be escalated to CS2
- No builder may be appointed without schema-compliant contract

---

## Schema Version History

**v2.0.0** (2026-01-01): Maturion doctrine fields and sections mandatory
**v1.0.0** (2025-12-15): Initial schema definition

---

## Protection Model

All protection requirements defined in: `governance/canon/AGENT_CONTRACT_PROTECTION_PROTOCOL.md`

This schema uses **reference-based protection** (referencing canonical protocols) rather than **embedded LOCKED sections** to comply with governance limits.

**Modification Authority**: CS2 Direct

---

*END OF BUILDER CONTRACT SCHEMA*
