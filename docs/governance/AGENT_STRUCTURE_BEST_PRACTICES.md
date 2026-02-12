# Agent Structure Best Practices

**Version**: 1.0.0  
**Date**: 2026-02-12  
**Authority**: CodexAdvisor Resolution for Issue #[URGENT][CODEX] Agent config exceeds max prompt length  
**Status**: Active

---

## Purpose

This document defines best practices for structuring agent contract files to ensure:
1. **Selectability**: Agents remain selectable in GitHub Copilot UI (≤30,000 characters)
2. **Compliance**: Full governance and constitutional compliance maintained
3. **Maintainability**: Agents easy to update and version
4. **Clarity**: Clear authority references without repetition

---

## Critical Constraint: 30,000 Character Limit

**GitHub Copilot Agent Selector Requirement**: Agent contract files MUST be ≤30,000 characters to be selectable in the agent UI.

**Historical Context**: Multiple agent files previously exceeded this limit (Feb 2026), blocking all agent assignment and governance workflows. This constraint is **non-negotiable** for agent operability.

---

## Reference-Based Protection Model

**Principle**: Use **reference-based protection** rather than **embedded LOCKED sections** to comply with character limits while maintaining full protection coverage.

### What This Means

**❌ AVOID: Embedded LOCKED Sections**
```markdown
## 🔒 STOP-AND-FIX Enforcement (LOCKED)

<!-- Lock ID: LOCK-BUILDER-STOP-AND-FIX-001 -->

**Discovered Quality Issues = Owned**

If this agent discovers during task execution ANY quality issue (YAML errors,
lint warnings, test failures, broken references, governance gaps), the agent MUST:

1. ✅ STOP current work immediately
2. ✅ Assess remediation scope
3. ✅ IF minor: Fix immediately before proceeding
...
[200+ lines of inline protocol documentation]
```

**✅ PREFER: Reference-Based Protection**
```markdown
## STOP-AND-FIX Enforcement

**Authority**: STOP_AND_FIX_DOCTRINE.md Section 3.1, 3.2, 3.3

If ANY quality issue discovered:
1. STOP current work
2. FIX immediately (if minor) or escalate (if substantial)
3. RE-RUN ALL validations
4. THEN proceed

**Prohibited**: "Ignore", "Not my responsibility", "Out of scope"
```

### Why Reference-Based?

1. **Shorter**: 5-10 lines vs 200+ lines
2. **Single Source of Truth**: Protocol details in canonical document
3. **Maintainable**: Update protocol once, all agents inherit change
4. **Compliant**: Full protection coverage via reference
5. **Governance Aligned**: Canonical protocols remain authoritative

---

## Agent Contract Structure Template

### Optimal Structure (≤30,000 characters)

```markdown
---
# YAML Frontmatter (machine-readable, ~15,000-20,000 chars)
name: <Agent Name>
role: <builder|fm|liaison>
description: >
  <2-4 sentence description with key constraints>

# Essential fields only
builder_id: <id>
version: <version>
status: <status>

# Model specification (concise)
model: <model>
model_tier: <tier>

# Governance bindings (concise, no verbose summaries)
governance:
  bindings:
    - id: <binding-id>
      path: <path>
      role: <role>
---

# Markdown Body (human-readable, ~5,000-10,000 chars)

## Mission
<1-2 sentence mission statement>

## Core Protocols
<Concise references to wake-up, session closure, execution protocols>

## Responsibility Mappings (Reference-Based)
<Brief summary with references to canonical protocols for details>

## Key Rules (Concise)
<Essential rules with authority references, not full inline protocols>

## Protection Model
<Reference-based protection statement>

## Version History
<Brief version notes>
```

### Character Budget Guidelines

- **YAML Frontmatter**: 15,000-20,000 characters
  - Essential fields only
  - Concise binding definitions
  - No verbose summaries or justifications
- **Markdown Body**: 5,000-10,000 characters
  - Reference-based sections
  - Concise protocols
  - No inline repetition of canonical content
- **Total Target**: 20,000-25,000 characters (leaves 5,000+ char buffer)

---

## What to Remove from Agent Contracts

### 1. Verbose Inline Protocol Documentation

**❌ REMOVE**: Full inline copies of protocols (STOP-AND-FIX, Zero Test Debt, etc.)

**✅ REPLACE WITH**: Authority reference + brief summary

**Example**:
```markdown
## Zero Test Debt Enforcement

**Authority**: ZERO_TEST_DEBT_CONSTITUTIONAL_RULE.md

**Critical Rule**: No test debt of any form is acceptable.

**Action**: STOP → FIX ALL debt → Re-run → Verify ZERO debt → Proceed.
```

### 2. Repetitive Prohibited Actions Lists

**❌ REMOVE**: 30-item lists of prohibited deflection language

**✅ REPLACE WITH**: Brief prohibition statement + reference

**Example**:
```markdown
**Prohibited**: "Ignore", "Not my responsibility", "Out of scope", "Pre-existing issue"

**Exception**: Issues requiring CS2 authority may be escalated with documented justification.

**Authority**: STOP_AND_FIX_DOCTRINE.md Section 3.1, 3.2, 3.3
```

### 3. Extensive Examples and Code Blocks

**❌ REMOVE**: Multi-page bash script examples, extensive command documentation

**✅ REPLACE WITH**: Concise command list + reference to scripts

**Example**:
```markdown
### Wake-Up Protocol (MANDATORY)

Run `.github/scripts/wake-up-protocol.sh foreman` before every session.

**Authority**: AGENT_BASELINE_MANAGEMENT_PROTOCOL.md
```

### 4. Verbose Binding Summaries

**❌ REMOVE**: Multi-line summaries for each binding

**✅ REPLACE WITH**: Short role identifier only

**Example**:
```yaml
bindings:
  - id: build-philosophy
    path: BUILD_PHILOSOPHY.md
    role: supreme-building-authority
  - id: zero-test-debt
    path: governance/canon/ZERO_TEST_DEBT_CONSTITUTIONAL_RULE.md
    role: constitutional-qa-absolute
```

### 5. Duplicate Content Across Agents

**❌ REMOVE**: Same LOCKED sections repeated in every builder contract

**✅ REPLACE WITH**: Builder-specific content + references to shared protocols

---

## What to Keep in Agent Contracts

### 1. Essential YAML Fields

**MUST HAVE** (GitHub Copilot Requirements):
- `name` (display name)
- `role` (builder/fm/liaison)
- `description` (multi-line, 2-4 sentences)

**MUST HAVE** (Maturion Requirements):
- `builder_id`/`agent.id`
- `version`
- `status`
- `canonical_authorities`
- `maturion_doctrine_version`
- `handover_protocol`
- `no_debt_rules`
- `evidence_requirements`
- `governance.bindings` (concise)

### 2. Agent-Specific Authority Boundaries

**MUST HAVE**: Clear scope, permissions, prohibitions unique to this agent

### 3. Critical Execution Protocols

**MUST HAVE**: Essential protocols (wake-up, session closure, handover) with references

### 4. Protection Model Statement

**MUST HAVE**: Reference-based protection statement (not embedded LOCKED sections)

---

## Validation Checklist

Before committing agent contract changes:

- [ ] File size ≤30,000 characters (verify with `wc -c <file>`)
- [ ] Reference-based protection model used (no verbose LOCKED sections)
- [ ] All required YAML fields present (name, role, description, etc.)
- [ ] Governance bindings include concise role identifiers only
- [ ] Inline protocols replaced with authority references
- [ ] Agent-specific content retained (scope, permissions, unique rules)
- [ ] Version history updated
- [ ] Clarity maintained (agent purpose and authority clear)

---

## Maintenance Guidelines

### When Updating Agent Contracts

1. **Check Character Count**: Run `wc -c .github/agents/<agent>.md` after changes
2. **Prefer References**: Link to canonical protocols rather than embedding
3. **Remove Redundancy**: If content exists in canonical protocol, reference it
4. **Preserve Essentials**: Keep agent-specific authority, scope, permissions
5. **Test Selectability**: Verify agent remains selectable in GitHub Copilot UI

### When Creating New Agents

1. **Start with Template**: Use api-builder.md or schema-builder.md as base
2. **Budget Characters**: Target 20,000-25,000 characters
3. **Reference-First**: Link to protocols from the start
4. **Validate Early**: Check character count during development

### Quarterly Review

1. **Audit All Agents**: Check all `.github/agents/*.md` files for size
2. **Identify Bloat**: Find agents approaching 30,000 character limit
3. **Refactor Proactively**: Condense before hitting limit
4. **Document Changes**: Update version history

---

## Success Metrics

**Agent Structure is Optimal When**:

1. ✅ All agents ≤30,000 characters (preferably ≤25,000)
2. ✅ All agents selectable in GitHub Copilot UI
3. ✅ Full governance compliance maintained
4. ✅ Authority references clear and traceable
5. ✅ Minimal redundancy across agent contracts
6. ✅ Agents easy to update without size concerns

---

## Historical Context

**February 2026 Incident**: Multiple agent files exceeded 30,000 character limit:
- PartPulse-app_FM.md: 62,024 characters (207% of limit)
- BUILDER_CONTRACT_SCHEMA.md: 39,231 characters (131% of limit)
- governance-liaison-v2.agent.md: 35,124 characters (117% of limit)
- ui-builder.md: 34,899 characters (116% of limit)
- integration-builder.md: 30,078 characters (100.3% of limit)

**Resolution**: Refactored all agents to use reference-based protection model, reducing character counts by 31-77% while maintaining full functionality and compliance.

**Lesson Learned**: Reference-based protection is not just an optimization—it's a **requirement** for agent operability at scale.

---

## References

- **AGENT_CONTRACT_PROTECTION_PROTOCOL.md**: Contract protection and modification rules
- **BUILD_PHILOSOPHY.md**: One-Time Build Law, Zero Test Debt
- **STOP_AND_FIX_DOCTRINE.md**: Stop-and-fix enforcement protocol
- **ZERO_TEST_DEBT_CONSTITUTIONAL_RULE.md**: Zero test debt constitutional requirement
- **MANDATORY_ENHANCEMENT_CAPTURE_STANDARD.md**: Continuous improvement protocol

---

*END OF AGENT STRUCTURE BEST PRACTICES*
