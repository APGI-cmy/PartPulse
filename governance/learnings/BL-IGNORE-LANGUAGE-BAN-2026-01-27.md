# Bootstrap Learning: "Ignore" Language is Forbidden

**BL-ID**: BL-IGNORE-BAN-001
**Date**: 2026-01-27
**Category**: STOP-AND-FIX Doctrine Enforcement
**Severity**: CRITICAL
**Reporter**: CS2 (Johan) via PR APGI-cmy/PartPulse#214 review
**Repository**: APGI-cmy/PartPulse

---

## Violation Context

PR APGI-cmy/PartPulse#214 (Batch 4: Builder Governance Canons) PREHANDOVER_PROOF contained:

> "Ignore unrelated bugs or broken tests; it is not your responsibility to fix them"

This language violates **STOP_AND_FIX_DOCTRINE.md Section 3.1** ("Encountered = Owned") and **Section 3.2** ("Universal Responsibility").

The agent also deferred YAML error remediation discovered during Batch 4 execution, using "not my responsibility" and "out of scope" justifications.

---

## Canonical Rule

**"Ignore" is BANNED from all agent operations.**

Agents must NEVER:
- ❌ Use the word "ignore" regarding quality issues
- ❌ Claim "not my responsibility" for encountered issues
- ❌ Defer remediation using "scope" as excuse
- ❌ Use "pre-existing issue" as deflection
- ❌ Promise "will fix in follow-up" instead of fixing immediately

Agents MUST:
- ✅ Take ownership of discovered issues immediately per "If You See It, You Own It" rule
- ✅ Apply "Encountered = Owned" principle universally (Section 3.1)
- ✅ STOP current work and assess remediation scope (Section 3.3)
- ✅ Fix immediately if minor, or escalate with justification if substantial
- ✅ Document all remediation in PREHANDOVER_PROOF

---

## Constitutional Authority

**STOP_AND_FIX_DOCTRINE.md Section 3.2 - Universal Responsibility**:

> **The "If You See It, You Own It" Rule**:
> - Discovering a test failure → YOU fix it (not "file a bug")
> - Discovering test debt → YOU resolve it (not "defer for later")
> - Discovering a warning → YOU eliminate it (not "ignore it")
> - Discovering a security issue → YOU remediate it (not "document and move on")
> - Discovering broken infrastructure → YOU repair it (not "work around it")

**Forbidden Responses**:
- ❌ "Not my job" (quality is everyone's job)
- ❌ "Not my code" (you work on the codebase, you own its quality)
- ❌ "Was already broken" (doesn't matter—fix it now)
- ❌ "Out of scope" (quality is never out of scope)
- ❌ "File a ticket" (fix it immediately, then document)
- ❌ "Will fix in next PR" (fix it in THIS PR)

---

## Specific Violations from PR #214

### 1. Forbidden Language in PREHANDOVER_PROOF_BATCH4.md

**Discovered**:
```markdown
**Scope Decision**: Per instructions: "Ignore unrelated bugs or broken tests;
it is not your responsibility to fix them."
```

**Governance Violation**:
- Direct use of "Ignore" (forbidden)
- "Not your responsibility" (forbidden deflection)
- Contradicts Section 3.2 Universal Responsibility

**Correct Response Should Have Been**:
```markdown
**Quality Issues Discovered**: During Batch 4 validation, discovered YAML errors
in agent contracts. Per STOP_AND_FIX Section 3.1 ("Encountered = Owned"), I own
remediation. Creating follow-up issue for comprehensive agent contract YAML audit
and immediate fix.
```

### 2. YAML Error Deferral

**Discovered**: During Batch 4 execution, agent ran `yamllint .github/agents/*.md`
and discovered 432 errors/warnings.

**Agent Response** (VIOLATION):
> "Pre-existing YAML errors - not my responsibility, out of scope"

**Required Response** (STOP-AND-FIX):
> "YAML errors discovered. Per STOP-AND-FIX Section 3.1, I own remediation.
> Assessing scope: 432 issues (92 errors, 340 warnings). This requires comprehensive
> remediation. Creating blocking issue for immediate fix before proceeding to Batch 5."

### 3. Alignment Plan Misunderstanding

**Context**: Agent flagged 65 canon files in directory as potential "quality debt"
without understanding the 10-batch alignment plan.

**Issue**: While not a use of forbidden language, demonstrates lack of contextual
awareness that led to "out of scope" deflections.

**Learning**: Understand the plan context. Do not flag planned future work as
"quality debt" or "out of scope."

---

## Remediation Completed

1. ✅ All agent contracts updated with **STOP-AND-FIX LOCKED section**
2. ✅ YAML errors remediated (all 9 agent contracts)
   - Fixed trailing spaces
   - Added proper YAML frontmatter to BUILDER_CONTRACT_SCHEMA.md
   - Fixed empty lines in frontmatter
   - Created official `.github/scripts/validate-agent-yaml.sh` validator
3. ✅ Bootstrap learning promoted to governance repo (this document)
4. ✅ Updated all 9 agent contracts with forbidden language prohibitions

---

## STOP-AND-FIX Section Template

All agent contracts now include:

```markdown
## 🔒 STOP-AND-FIX Enforcement (LOCKED)

**Discovered Quality Issues = Owned**

If this agent discovers during task execution ANY quality issue (YAML errors,
lint warnings, test failures, broken references, governance gaps), the agent MUST:

1. ✅ STOP current work immediately
2. ✅ Assess remediation scope
3. ✅ IF minor: Fix immediately before proceeding
4. ✅ IF substantial: Escalate as blocking issue with justification
5. ✅ Document remediation in PREHANDOVER_PROOF
6. ✅ THEN proceed with original task

**Prohibited Deflection Language**:
❌ "Ignore"
❌ "Not my responsibility"
❌ "Out of scope"
❌ "Pre-existing issue"
❌ "Will fix in follow-up"

**Exception** (Section 5.2):
Issues requiring CS2 authority or external infrastructure may be escalated
with documented justification. Quality issues within agent authority MUST be
fixed immediately.

**Authority**: STOP_AND_FIX_DOCTRINE.md Section 3.1, 3.2, 3.3
**Modification Authority**: CS2 Direct
```

---

## Promotion to Canonical Governance

**Action Required**: This bootstrap learning MUST be promoted to canonical
governance repository (APGI-cmy/maturion-foreman-governance) for ripple to
all consumer repositories.

**Promotion Path**:
1. Submit to canonical governance repo as
   `governance/learnings/BL-IGNORE-LANGUAGE-BAN-2026-01-27.md`
2. Request governance-repo-administrator to ripple to all consumer repos
3. Ensure all agent contracts in all repos receive STOP-AND-FIX LOCKED section

**Rationale**: This is a universal governance principle applicable to all agents
in all repositories, not specific to PartPulse.

---

## References

- **Authority**: STOP_AND_FIX_DOCTRINE.md Section 3.1, 3.2, 3.3
- **Source PR**: APGI-cmy/PartPulse#214 (Batch 4: Builder Governance Canons)
- **Remediation Issue**: [GOVERNANCE VIOLATION] Remediate YAML Errors & Ban "Ignore" Language (Post-PR #214)
- **Related**: Issue APGI-cmy/PartPulse#1022 (Ban Excuse-Based Test Dodging)
- **Merge Comment**: PR #214 merge comment documenting governance violations

---

## Learning Summary

**Core Principle**: Quality is everyone's responsibility. "If you see it, you own it."

**Key Takeaway**: When any agent discovers ANY quality issue during execution
(tests, lint, YAML, governance, security), the agent MUST immediately:
1. STOP current work
2. Assess and fix (if minor) or escalate (if substantial)
3. Document remediation
4. THEN proceed with original task

**Zero Tolerance**: NO deferral, NO deflection, NO "not my job" language permitted.

---

**Status**: REMEDIATION COMPLETE
**Date Resolved**: 2026-01-27
**Resolved By**: governance-liaison (APGI-cmy/PartPulse)
**Awaiting**: Promotion to canonical governance for ecosystem-wide ripple
