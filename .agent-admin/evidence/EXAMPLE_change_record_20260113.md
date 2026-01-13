# Change Record - Example Template

**Date**: 2026-01-13  
**Record ID**: change_record_EXAMPLE_20260113  
**Agent**: [agent-name]  
**Purpose**: Example change record artifact for PREHANDOVER_PROOF template

---

## PR Information

**PR Number**: #XXX  
**Branch**: feature/example-branch  
**Base Branch**: main  
**Agent**: [agent-name]  
**Agent Contract**: `.github/agents/[agent-name].md`

**PR Title**: [title from issue]  
**PR Description**: [brief description from issue]

---

## Changes Made

### Files Added

#### File 1: [path/to/new/file.ext]
- **Purpose**: [why this file was added]
- **Authority**: [governance reference authorizing this addition]
- **Content Type**: [code/governance/configuration/documentation]
- **Lines**: [count]
- **Key Content**: [brief description of what file contains]

#### File 2: [path/to/new/file.ext]
- **Purpose**: [why this file was added]
- **Authority**: [governance reference authorizing this addition]
- **Content Type**: [code/governance/configuration/documentation]
- **Lines**: [count]
- **Key Content**: [brief description of what file contains]

[... Continue for all added files ...]

**OR**

- [ ] No files added in this PR

**Summary**: [N] files added, [total lines] total

---

### Files Modified

#### File 1: [path/to/modified/file.ext]
- **Change Type**: [structural/content/both]
- **Lines Changed**: +[added] / -[removed]
- **Sections Modified**: [list section names/line ranges]
- **Reason**: [why this file was modified]
- **Authority**: [governance reference authorizing this change]
- **Breaking Change**: [yes/no]
- **Impact**: [description of impact]

**Key Changes**:
1. [First major change]
2. [Second major change]
3. [Third major change]

#### File 2: [path/to/modified/file.ext]
- **Change Type**: [structural/content/both]
- **Lines Changed**: +[added] / -[removed]
- **Sections Modified**: [list section names/line ranges]
- **Reason**: [why this file was modified]
- **Authority**: [governance reference authorizing this change]
- **Breaking Change**: [yes/no]
- **Impact**: [description of impact]

**Key Changes**:
1. [First major change]
2. [Second major change]
3. [Third major change]

[... Continue for all modified files ...]

**OR**

- [ ] No files modified in this PR

**Summary**: [N] files modified, +[added lines] / -[removed lines] total

---

### Files Removed

#### File 1: [path/to/removed/file.ext]
- **Reason**: [why this file was removed]
- **Authority**: [governance reference authorizing removal]
- **Approval**: [reference to approval/protocol - required for file removal]
- **Impact**: [what systems/processes are affected]
- **Replacement**: [what replaces this file, if applicable]
- **Backup**: [where original file is archived, if needed]

#### File 2: [path/to/removed/file.ext]
- **Reason**: [why this file was removed]
- **Authority**: [governance reference authorizing removal]
- **Approval**: [reference to approval/protocol]
- **Impact**: [what systems/processes are affected]
- **Replacement**: [what replaces this file, if applicable]
- **Backup**: [where original file is archived, if needed]

[... Continue for all removed files ...]

**OR**

- [ ] No files removed in this PR

**Summary**: [N] files removed

---

### Files Renamed/Moved

#### File 1: [old/path/file.ext] → [new/path/file.ext]
- **Reason**: [why file was renamed/moved]
- **Authority**: [governance reference]
- **Content Changed**: [yes/no]
- **Impact**: [what needs updating due to rename/move]
- **References Updated**: [list files that reference this file]

**OR**

- [ ] No files renamed or moved in this PR

---

## Change Statistics

**Overall Change Summary**:
- **Files Added**: [N] (+[lines] lines)
- **Files Modified**: [N] (+[added] / -[removed] lines)
- **Files Removed**: [N] (-[lines] lines)
- **Files Renamed/Moved**: [N]
- **Net Change**: +[total added] / -[total removed] lines
- **Total Files Changed**: [N]

---

## Change Impact Analysis

### Agent Contracts

**Contracts Modified**:
- [ ] `.github/agents/[agent-1].md` - [impact description]
- [ ] `.github/agents/[agent-2].md` - [impact description]

**OR**

- [ ] No agent contracts modified

**Contract Binding Changes**: [yes/no - were bindings added/removed/modified]

---

### Governance Canon

**Canonical Documents Modified**:
- [ ] `governance/canon/[document-1].md` - [impact description]
- [ ] `governance/canon/[document-2].md` - [impact description]

**OR**

- [ ] No canonical governance documents modified

**Tier-0 Changes**: [yes/no - were constitutional documents modified]

---

### Workflows and Gates

**Workflows Modified**:
- [ ] `.github/workflows/[workflow-1].yml` - [change description]
- [ ] `.github/workflows/[workflow-2].yml` - [change description]

**OR**

- [ ] No workflows modified

**Gates Modified**:
- [ ] [gate-name] - [change description]

**OR**

- [ ] No gates modified

---

### Application Code

**Code Areas Modified**:
- [ ] API Layer: [files] - [impact]
- [ ] UI Layer: [files] - [impact]
- [ ] Database Layer: [files] - [impact]
- [ ] Integration Layer: [files] - [impact]
- [ ] Infrastructure: [files] - [impact]

**OR**

- [ ] No application code modified

**Breaking Changes**: [yes/no - list any breaking changes]

---

### Documentation

**Documentation Updated**:
- [ ] README.md - [changes]
- [ ] Architecture docs - [changes]
- [ ] API docs - [changes]
- [ ] User guides - [changes]

**OR**

- [ ] No documentation changes

---

### Configuration and Infrastructure

**Configuration Changes**:
- [ ] Environment variables: [changes]
- [ ] Build configuration: [changes]
- [ ] Deployment configuration: [changes]
- [ ] CI/CD configuration: [changes]

**OR**

- [ ] No configuration changes

---

## Change Categories

**Primary Change Category**: [governance/code/infrastructure/documentation/test]

**Secondary Categories** (if applicable):
- [ ] Governance changes
- [ ] Code changes
- [ ] Infrastructure changes
- [ ] Documentation changes
- [ ] Test changes
- [ ] Configuration changes

---

## Ripple Completion

### Ripples Executed

**Ripple 1**: [file path]
- **Change**: [description]
- **Reason**: [why ripple was needed]
- **Status**: ✅ Complete

**Ripple 2**: [file path]
- **Change**: [description]
- **Reason**: [why ripple was needed]
- **Status**: ✅ Complete

[... Continue for all ripples ...]

**OR**

- [ ] No ripples required for this PR

### Ripple Validation

- [ ] All required ripples identified
- [ ] All ripples executed
- [ ] All ripples validated for consistency
- [ ] Cross-references verified
- [ ] Ripple documentation complete

---

## Cross-Repository Changes

**Do changes affect other repositories?**
- [ ] Yes - affects [repo-name] (document below)
- [ ] No - changes are local to this repository only

### If Yes - Other Repository Changes

**Repository**: [org]/[repo-name]
- **Files Affected**: [list files]
- **Change Type**: [layerdown/API contract/shared library]
- **Status**: [pending/in-progress/complete]
- **Coordination**: [who was notified/approved]
- **PR Link**: [link to PR in other repo, if applicable]

---

## Backward Compatibility

**Is this change backward compatible?**
- [ ] Yes - fully backward compatible
- [ ] No - breaking changes (document below)
- [ ] Partial - some breaking changes

### If Breaking Changes - Documentation

**Breaking Change 1**: [description]
- **Affected**: [what is affected]
- **Migration Path**: [how to migrate]
- **Deprecation Notice**: [when old behavior is removed]
- **Documentation**: [where migration is documented]

[... Continue for all breaking changes ...]

---

## Testing and Validation

**Changes Tested**:
- [ ] Unit tests: [N added/modified]
- [ ] Integration tests: [N added/modified]
- [ ] CST scenarios: [N executed]
- [ ] Manual testing: [description]

**Test Coverage**:
- **Before**: [percentage]%
- **After**: [percentage]%
- **Change**: [+/-percentage]%

---

## Change Record Sign-Off

### Completeness Verification

- [ ] All added files documented
- [ ] All modified files documented with changes
- [ ] All removed files documented with justification
- [ ] All renamed/moved files documented
- [ ] Change statistics calculated
- [ ] Impact analysis complete for all affected areas
- [ ] Ripples executed and validated
- [ ] Cross-repository impact assessed
- [ ] Backward compatibility documented
- [ ] Testing and validation documented

### Sign-Off

**Documented by**: [agent-name]  
**Role**: [agent role/contract]  
**Date**: [YYYY-MM-DD]  
**Authority**: AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md (Tier-0, Constitutional)

**I certify that this change record is complete and accurate to the best of my knowledge.**

---

## Audit Trail

**Git Commands Used**:
```bash
git status
git diff --stat
git log --oneline -n 10
```

**Verification Method**: [how changes were verified]

---

## Notes

[Any additional context, special considerations, or clarifications about the changes]

---

**Change Record Version**: 1.0.0 (based on PREHANDOVER_PROOF Template v3.0.0)
