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

## Two Validation Modes

### Mode 1: Evidence-Based (Preferred)

**Process**:
1. Agent provides PREHANDOVER_PROOF.md
2. Gate checks for keywords matching gate name
3. If found → SKIP execution, PASS gate
4. Fast, agent-proven quality

### Mode 2: Script Execution (Fallback)

**Process**:
1. No PREHANDOVER_PROOF found
2. Gate runs validation script
3. Exit code must be 0 to pass
4. Slower, CI-validated quality

---

## Summary

This is one of 15 critical Tier-0 governance canon files that establishes the merge gate operational philosophy.

Key principles:
- **CI confirms, not discovers**: Agents prove locally, CI confirms
- **Evidence-based validation**: Agents provide PREHANDOVER_PROOF with validation evidence
- **Two-mode validation**: Evidence-based (preferred) or script execution (fallback)
- **Anti-patterns**: Don't use CI for discovery, don't re-run complex validation, don't use indirect signals
- **Authority**: Constitutional governance with bootstrap learnings (BL-027, BL-028)

**Version**: 1.0.0  
**Authority**: Constitutional Governance Rule (Tier-0)  
**Source**: APGI-cmy/maturion-foreman-governance

For complete details on gate types, anti-patterns, implementation status, example PREHANDOVER_PROOF, benefits, and transition plan, please refer to the full document.
