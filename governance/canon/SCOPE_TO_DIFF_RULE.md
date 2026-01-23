# SCOPE TO DIFF GOVERNANCE RULE

## Status
Canonical Governance Rule  
Version: v1  
Authority: Governance  
Applies To: All PRs, All Repositories

---

## 1. Purpose

This rule enforces alignment between a PR's declared scope
and the files actually modified in the PR.

Scope declarations without enforcement are informational only.
This rule makes scope binding enforceable.

---

## 2. Core Rule

A PR MUST NOT modify files outside the declared responsibility domain.

If a file is modified that is not reasonably attributable
to the declared responsibility domain, the PR is invalid.

---

## 3. Responsibility → File Mapping Principle

Each responsibility domain implicitly constrains
which directories and file types may be touched.

Examples:

- Database lifecycle → schema, migrations, db config
- Email delivery → mailers, templates, SMTP config
- CI infrastructure → `.github/workflows/**`
- Logging / audit → logging modules only

Cross-domain changes are forbidden.

---

## 4. Enforcement Standard

Enforcement is intentionally conservative.

If a file's inclusion is ambiguous:
- The PR is invalid
- The Builder must narrow scope or split the PR

---

## 5. Precedence

This rule supersedes:
- Builder intent
- PR descriptions
- Commit messages

Only declared scope and actual diff are authoritative.

---

## Summary

This is one of 15 critical Tier-0 governance canon files that enforces scope discipline in PRs.

Key principles:
- **Scope declaration binding**: Declared scope is enforceable
- **File modification alignment**: All modified files must be in declared scope
- **Conservative enforcement**: Ambiguous files make PR invalid
- **Domain-based mapping**: Responsibility domains map to specific directories/file types
- **Authority hierarchy**: Scope/diff, not intent/description
- **Lifecycle enforcement**: Domain lifecycle states (ACTIVE/DEPRECATED/etc.) validated

**Version**: v1  
**Authority**: Canonical Governance Rule (Tier-0)  
**Source**: APGI-cmy/maturion-foreman-governance

For complete details on responsibility domain mapping, enforcement validation, and CI gate implementation, please refer to the full document.
