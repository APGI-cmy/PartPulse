# MERGE GATE PHILOSOPHY

**Version**: 1.0.0  
**Date**: 2026-01-20  
**Status**: Active  
**Type**: Constitutional Governance Rule  
**Authority**: Supreme - Canonical  
**Owner**: CS2 (Johan Ras in bootstrap mode, Maturion in production)

---

## Core Principle

**CI is confirmatory, NOT diagnostic.**

Agents validate locally BEFORE creating PRs. Merge gates confirm what the agent already proved.

---

## Agent Responsibilities (BEFORE PR)

**Agent MUST validate locally**:

### 1. Code Quality
- **100% builds**: No compilation errors
- **Zero warnings**: All warnings treated as errors
- **Zero deprecations**: BL-026 compliance (no deprecated API usage)
- **All tests passing**: 100% green, no skips, no suppressions

### 2. Governance Compliance
- **SCOPE_DECLARATION.md created and validated**: Matches git diff exactly
- **YAML syntax validated**: `yamllint` exit code 0 (BL-028)
- **All applicable gates run locally**: Exit code 0 for ALL gates
- **No manual verification shortcuts**: Execute actual scripts, not mental validation

### 3. Evidence Documentation
- **PREHANDOVER_PROOF.md created**: Mandatory handover evidence
- **Contains actual commands executed**: Exact commands, not paraphrases
- **Contains exit codes**: All must be 0 (PASS)
- **Contains timestamps**: When validation occurred

**Agent runs merge gate checks IN THEIR ENVIRONMENT** (not in CI)

---

## Merge Gate Responsibilities

**Merge gates check**:

### 1. Evidence Exists
**Primary Mode**: PREHANDOVER_PROOF.md with gate-specific keywords
- Gate looks for evidence file
- Gate searches for keywords matching gate name
- If found → SKIP execution, PASS gate immediately
- Fast, agent-proven quality

### 2. Governance Compliance
**Simple Checks**: File exists, format valid
- Not complex re-validation
- Not diagnostic testing
- Simple structure and presence checks

### 3. No Fancy Validation
**Gates do NOT**:
- Re-run complex validation that agent should have run
- Perform diagnostic analysis
- Discover failures (agent already caught them)
- Act as primary quality enforcement

---

## Two Validation Modes

### Mode 1: Evidence-Based (Preferred)

**Process**:
1. Agent provides PREHANDOVER_PROOF.md
2. Gate checks for keywords matching gate name
3. If found → SKIP execution, PASS gate
4. Fast, agent-proven quality

**Benefits**:
- ✅ Fast CI execution (skips re-validation)
- ✅ Trusts agent evidence (agent already validated)
- ✅ Reduces CI resource usage
- ✅ Encourages proper pre-gate validation

**Keywords per Gate**:
- Scope-to-Diff: `"Scope Declaration"|"scope-to-diff"`
- YAML Validation: `"yamllint"|"YAML"`
- Governance Compliance: `"Governance Compliance"`
- Agent Governance: `"Agent.*Governance"|"Agent.*Contract"`
- FM Effectiveness: `"FM.*Effectiveness"|"Effectiveness"`
- FM Failure Enforcement: `"Failure.*Enforcement"|"FM.*Failure"`
- FM Failure Promotion: `"Failure.*Promotion"`
- FM Learning Promotion: `"Learning.*Promotion"`

### Mode 2: Script Execution (Fallback)

**Process**:
1. No PREHANDOVER_PROOF found
2. Gate runs validation script
3. Exit code must be 0 to pass
4. Slower, CI-validated quality

**When Used**:
- Agent didn't provide PREHANDOVER_PROOF
- Agent forgot to document gate validation
- Legacy PRs before evidence-based model
- Non-agent PR contributors

---

## Evidence-Based Validation Pattern

**Standard Pattern for ALL Gates**:

```yaml
- name: Check for Evidence-Based Validation (BL-027/028)
  id: evidence_check
  run: |
    echo "=== Evidence-Based Validation Check (BL-027/028) ==="
    echo "Gate: [GATE NAME]"
    echo ""
    
    # Look for PREHANDOVER_PROOF with this gate documented
    if [ -f "PREHANDOVER_PROOF.md" ] && grep -qi "[gate-keyword]" PREHANDOVER_PROOF.md; then
      echo "✅ Found PREHANDOVER_PROOF.md with [Gate] validation"
      echo "✅ ACCEPTING evidence-based validation per BL-027/028"
      echo "skip_execution=true" >> $GITHUB_OUTPUT
    elif ls PREHANDOVER_PROOF_*.md 1> /dev/null 2>&1 && grep -qi "[gate-keyword]" PREHANDOVER_PROOF_*.md 2>/dev/null; then
      echo "✅ Found PREHANDOVER_PROOF with [Gate] validation"
      echo "✅ ACCEPTING evidence-based validation per BL-027/028"
      echo "skip_execution=true" >> $GITHUB_OUTPUT
    else
      echo "ℹ️  No evidence-based validation found - proceeding with script execution"
      echo "skip_execution=false" >> $GITHUB_OUTPUT
    fi

- name: [Original Gate Validation]
  if: steps.evidence_check.outputs.skip_execution != 'true'
  run: [original validation command]
```

**Key Elements**:
1. **Evidence check step**: Runs first, looks for PREHANDOVER_PROOF
2. **Keyword search**: Looks for gate-specific keywords
3. **Output variable**: Sets `skip_execution` based on evidence
4. **Conditional validation**: Original validation only runs if no evidence

---

## Gate Types

### 1. Governance Compliance Gates

**Purpose**: Ensure governance artifacts present and valid

**Examples**:
- Scope-to-Diff validation (BL-027)
- YAML syntax validation (BL-028)
- Governance binding validation

**Validation**: Simple file checks, format validation

**Evidence-Based**: ✅ Supported (PREHANDOVER_PROOF contains validation evidence)

---

### 2. Quality Gates

**Purpose**: Ensure code quality standards met

**Examples**:
- No warnings
- No deprecations (BL-026)
- 100% test passage

**Validation**: Evidence-based preferred (agent already ran checks)

**Evidence-Based**: ✅ Supported (PREHANDOVER_PROOF contains build/test evidence)

---

### 3. Evidence Gates

**Purpose**: Ensure handover evidence complete

**Examples**:
- PREHANDOVER_PROOF exists
- Required sections present
- Evidence complete

**Validation**: Document structure checks

**Evidence-Based**: ⚠️ Partial (checks existence, but validates structure in CI)

---

## Anti-Patterns (DO NOT)

### ❌ DO NOT

1. **Use CI to discover failures** (diagnostic)
   - Agent should catch failures locally first
   - CI confirms what agent already validated

2. **Run complex validation in CI that agent should have run**
   - Agent runs builds, tests, linters locally
   - CI confirms agent's work, doesn't redo it

3. **Infer state from PR comments or labels**
   - Use PREHANDOVER_PROOF file, not indirect signals
   - Explicit evidence, not implied state

4. **Make CI the source of truth**
   - Agent's pre-gate validation is source of truth
   - CI confirms, doesn't establish truth

5. **Skip evidence-based validation opportunities**
   - If agent provided evidence, use it
   - Don't waste CI resources re-running validation

---

### ✅ DO

1. **Trust agent evidence**
   - If PREHANDOVER_PROOF documents validation, accept it
   - Agent's local validation is authoritative

2. **Confirm what agent already proved**
   - Evidence-based validation confirms agent's work
   - Lightweight confirmation, not re-validation

3. **Keep gates simple**
   - Gates check presence and format
   - Complex validation belongs in agent's environment

4. **Use evidence-based validation**
   - Faster CI, trusts agent discipline
   - Encourages proper pre-gate validation

5. **Provide clear feedback when evidence missing**
   - Tell agent what evidence was expected
   - Guide agent to provide evidence next time

---

## Authority

### Constitutional
- **BUILD_PHILOSOPHY.md**: Zero-debt philosophy, governance-first principles
- **CONSTITUTION.md**: Maturion constitutional framework

### Canonical Governance
- **BL-027**: Scope Declaration Mandatory (BOOTSTRAP_EXECUTION_LEARNINGS.md)
- **BL-028**: Yamllint Warnings ARE Errors (BOOTSTRAP_EXECUTION_LEARNINGS.md)
- **EXECUTION_BOOTSTRAP_PROTOCOL.md**: Pre-gate validation requirements

### Operational Protocols
- **CI_CONFIRMATORY_NOT_DIAGNOSTIC.md**: CI philosophy (if exists)
- **AGENT_CONTRACT_PROTECTION_PROTOCOL.md**: Section 4.2 (pre-gate release validation)

---

## Implementation Status

### ✅ Implemented

- **governance-scope-to-diff-gate.yml**: Reference implementation (complete)

### ⏳ In Progress

- **governance-gate.yml**: Evidence-based pattern needed
- **agent-governance-check.yml**: Evidence-based pattern needed
- **fm-effectiveness-validation-gate.yml**: Evidence-based pattern needed
- **fm-failure-enforcement-gate.yml**: Evidence-based pattern needed
- **fm-failure-promotion-gate.yml**: Evidence-based pattern needed
- **fm-learning-promotion-gate.yml**: Evidence-based pattern needed

---

## Example: PREHANDOVER_PROOF with Gate Evidence

```markdown
# PREHANDOVER_PROOF

**Agent**: governance-repo-administrator  
**Task**: Remove agent-contract-administrator & align merge gates  
**Date**: 2026-01-20

---

## Pre-Gate Validation Evidence

### Gate 1: Scope-to-Diff Validation (BL-027)

**Status**: PASS

**Command Executed**:
```bash
.github/scripts/validate-scope-to-diff.sh
```

**Exit Code**: 0

**Output**:
```
✓ All files in SCOPE_DECLARATION match git diff
✓ All git diff files in SCOPE_DECLARATION
✓ Scope declaration VALID
```

**Timestamp**: 2026-01-20 14:31:15 UTC

---

### Gate 2: YAML Syntax Validation (BL-028)

**Status**: PASS

**Command Executed**:
```bash
yamllint .github/agents/*.md
```

**Exit Code**: 0

**Output**:
```
✓ governance-repo-administrator.agent.md - no warnings
✓ CodexAdvisor-agent.md - no warnings
All files valid, zero warnings
```

**Timestamp**: 2026-01-20 14:32:00 UTC

---

[Additional gates...]
```

**Gate Behavior**:
1. Gate reads PREHANDOVER_PROOF.md
2. Gate finds keywords: "Scope-to-Diff", "YAML", etc.
3. Gate accepts evidence-based validation
4. Gate PASSES without re-running validation
5. Fast CI, agent-proven quality

---

## Benefits

### For Agents
- ✅ Clear expectations: validate locally first
- ✅ Fast feedback: CI confirms quickly
- ✅ Discipline reinforcement: must provide evidence
- ✅ Pre-gate validation becomes routine

### For CI/CD
- ✅ Reduced resource usage: skips re-validation
- ✅ Faster execution: evidence-based gates pass immediately
- ✅ Clearer purpose: confirmation, not diagnostics
- ✅ Better signal-to-noise: failures indicate real issues

### For Governance
- ✅ Enforces pre-gate validation (BL-027, BL-028)
- ✅ Creates audit trail (PREHANDOVER_PROOF)
- ✅ Aligns CI with philosophy (confirmatory not diagnostic)
- ✅ Reduces governance violations (agents validate first)

---

## Governance Compliance Checklist for Merge Gates

This checklist provides **exhaustive governance compliance checks** that gates MUST satisfy. FM uses this checklist when implementing or fixing gates.

### Gate Implementation Compliance

**All gates MUST**:

- [ ] **Role Awareness**: Detect agent role using authoritative methods (AGENT_ROLE_GATE_APPLICABILITY.md)
- [ ] **Applicability Logic**: Only execute for applicable agent roles (MERGE_GATE_APPLICABILITY_MATRIX.md)
- [ ] **Evidence-Based Validation**: Check PREHANDOVER_PROOF before script execution
- [ ] **Conditional Execution**: Run validation only if evidence not found
- [ ] **Clear Failure Messages**: Include agent role, requirement, canonical reference, remediation guidance
- [ ] **Canonical Alignment**: Logic matches governance canon requirements
- [ ] **No Prohibited Inference**: Do not use file paths, PR metadata, or heuristics as sole role indicators
- [ ] **Documentation**: Include canonical references in gate documentation
- [ ] **Testing**: Validated against all agent roles (applicable and non-applicable)
- [ ] **No Weakening**: Does not reduce enforcement below canonical requirements

### Evidence-Based Validation Compliance

**Gates implementing evidence pattern MUST**:

- [ ] **Evidence Check Step**: First step checks for PREHANDOVER_PROOF.md
- [ ] **Keyword Search**: Searches for gate-specific keywords
- [ ] **Output Variable**: Sets `skip_execution` based on evidence presence
- [ ] **Conditional Validation**: Original validation only runs if `skip_execution != 'true'`
- [ ] **Fast Path**: Evidence-based validation passes immediately without re-execution
- [ ] **Fallback Path**: Script execution when evidence not found
- [ ] **Clear Logging**: Logs whether evidence-based or script-based validation used

### Role Detection Compliance

**Gates detecting agent role MUST**:

- [ ] **Primary Method**: Check explicit PR body declaration (`AGENT_ROLE: builder`)
- [ ] **Secondary Method**: Check agent contract reference (`.agent` file)
- [ ] **Tertiary Method**: Repository context (governance repo only, governance-only changes)
- [ ] **No File Path Inference**: Do not infer role solely from changed files
- [ ] **No Heuristic Defaults**: Do not default to builder without verification
- [ ] **Unknown Handling**: Fail gracefully if role cannot be determined
- [ ] **Output**: Set role as output variable for conditional gate execution

### Failure Message Compliance

**Gate failure messages MUST include**:

- [ ] **Gate Name**: Clear identification of which gate failed
- [ ] **Detected Role**: Agent role that was detected
- [ ] **Applicable Roles**: Which roles this gate applies to
- [ ] **Failed Requirement**: Specific requirement that was not satisfied
- [ ] **Canonical Reference**: Governance document defining requirement
- [ ] **Remediation Guidance**: How to fix the failure
- [ ] **Failure Category**: Classification per PR_GATE_FAILURE_HANDLING_PROTOCOL.md

### FM Gate Management Compliance

**Gates modified by FM MUST**:

- [ ] **Misalignment Classification**: Fix addresses specific misalignment category (FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md Section 4.1)
- [ ] **Authority Verification**: Fix within FM autonomous authority
- [ ] **Matrix Alignment**: Fix aligns gate with MERGE_GATE_APPLICABILITY_MATRIX.md
- [ ] **Canonical Basis**: Fix references canonical source justifying change
- [ ] **Testing Evidence**: Fix tested against all agent roles
- [ ] **Documentation**: Fix documented with rationale and canonical references
- [ ] **No Bypass**: Fix corrects gate, does not bypass enforcement
- [ ] **Validation**: Post-fix validation confirms issue resolved

### Escalation Compliance

**Gates requiring CS2 escalation MUST**:

- [ ] **Escalation Trigger**: Identified trigger per FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md Section 9.1
- [ ] **Escalation Document**: Complete escalation report prepared
- [ ] **Canonical Analysis**: All relevant canonical sources referenced
- [ ] **Impact Documentation**: Work blocked and urgency documented
- [ ] **Recommendation**: FM recommendation with options provided
- [ ] **CS2 Tag**: CS2 (Johan Ras) tagged for review
- [ ] **Pause Work**: FM paused gate fix until CS2 decision
- [ ] **Decision Implementation**: CS2 guidance followed precisely

---

## Transition Plan

### Phase 1: Pattern Definition (COMPLETE)
- [x] Document merge gate philosophy
- [x] Define evidence-based validation pattern
- [x] Identify keyword mappings per gate
- [x] Create FM Merge Gate Management Protocol
- [x] Create Merge Gate Applicability Matrix
- [x] Add governance compliance checklist

### Phase 2: Gate Updates (IN PROGRESS)
- [ ] Apply pattern to all remaining gates
- [ ] Test pattern with sample PRs
- [ ] Validate keyword detection works
- [ ] Implement role-aware gate execution
- [ ] Add clear failure messages to all gates

### Phase 3: Documentation (IN PROGRESS)
- [ ] Create sample PREHANDOVER_PROOF
- [ ] Update agent contracts with gate requirements
- [ ] Add to AGENT_ONBOARDING_QUICKSTART.md
- [ ] Layer-down to consumer repositories

### Phase 4: Enforcement (FUTURE)
- [ ] Make PREHANDOVER_PROOF mandatory for all PRs
- [ ] Add CI check for PREHANDOVER_PROOF presence
- [ ] Fail PRs without evidence (after transition period)

---

## References

### Governance Canon
- **BOOTSTRAP_EXECUTION_LEARNINGS.md**: BL-027 (Scope Declaration), BL-028 (YAML Warnings)
- **AGENT_CONTRACT_PROTECTION_PROTOCOL.md**: Section 4.2 (Pre-Gate Release Validation)
- **EXECUTION_BOOTSTRAP_PROTOCOL.md**: Pre-gate validation requirements
- **FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md**: FM authority for gate management
- **MERGE_GATE_APPLICABILITY_MATRIX.md**: Gate-to-role mapping
- **AGENT_ROLE_GATE_APPLICABILITY.md**: Role-based gate applicability principles
- **AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md**: Agent-class gate requirements
- **PR_GATE_EVALUATION_AND_ROLE_PROTOCOL.md**: Gate evaluation semantics
- **PR_GATE_FAILURE_HANDLING_PROTOCOL.md**: Gate failure classification

### Implementation
- **.github/workflows/governance-scope-to-diff-gate.yml**: Reference implementation
- **governance/examples/PREHANDOVER_PROOF_SAMPLE.md**: Example evidence file (to be created)

---

## Version History

**Version 1.1.0** (2026-02-09)  
- Added comprehensive governance compliance checklist for merge gates
- Integrated with FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md
- Integrated with MERGE_GATE_APPLICABILITY_MATRIX.md
- Enhanced transition plan with role-aware gate execution
- Added references to new canonical documents
- Authority: CS2 approval (Johan Ras) 2026-02-09

**Version 1.0.0** (2026-01-20)  
- Initial version documenting merge gate philosophy
- Defines evidence-based validation pattern
- Establishes two-mode validation (evidence vs. script execution)
- Authority: CS2 strategic decision 2026-01-20, BL-027/028 compliance

---

**End of Merge Gate Philosophy**
