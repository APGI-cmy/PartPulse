# Execution Bootstrap Protocol

**Status**: Canonical Governance Document  
**Version**: 2.0.0  
**Authority**: Governance Administrator (Layer-Down from maturion-foreman-governance)  
**Effective Date**: 2026-01-12  
**Compliance Deadline**: 2026-02-11  
**Purpose**: Mandatory 7-step verification protocol before agent handover

---

## Authority and Scope

This protocol is layered down from `maturion-foreman-governance/governance/canon/EXECUTION_BOOTSTRAP_PROTOCOL.md` and is binding for all agents operating in this repository.

**Binding For**:
- Foreman (FM) agents
- Builder agents (API, UI, QA, Schema, Integration)
- Governance Liaison agents
- Any agent that creates or modifies workflows, gates, or execution artifacts

---

## Protocol Overview

The Execution Bootstrap Protocol mandates a **7-step verification process** that ALL agents MUST complete before handing over work. This protocol enforces the constitutional principle: **"CI = confirmation, NOT diagnostic"**.

### Core Principle

Agents MUST verify all execution checks pass locally BEFORE handover. CI serves as confirmation only, not as a diagnostic tool to discover failures after handover.

---

## 7-Step Verification Protocol

### Step 1: Identify ALL CI Jobs

**Action**: Open each relevant workflow file (`.github/workflows/*.yml`) and create a complete list of ALL jobs.

**Requirements**:
- List job names exactly as they appear in workflow
- Extract exact command for each job
- Do NOT skip jobs that "seem unrelated"
- Do NOT assume which jobs matter

**Example** (from qa-enforcement.yml):
```yaml
Jobs identified:
1. test-dodging-check → node qa/detect-test-dodging.js
2. qa-parking-check → node qa/parking/watcher.js
3. governance-sync-check → node qa/governance/sync-checker.js
4. deprecation-check → npx eslint --config eslint.config.deprecation.mjs ...
5. test-execution → npm run test:ci
6. merge-gate → (depends on all above)
```

**Failure Mode**: Confusing similar-sounding job names (e.g., `test-dodging-check` ≠ `test-execution`)

---

### Step 2: Execute EVERY Command Locally

**Action**: Run each command identified in Step 1 in your local environment.

**Requirements**:
- Run commands in order of dependency
- Use exact command as shown in workflow
- Capture output for each command
- Document any command that cannot be replicated

**Example**:
```bash
node qa/detect-test-dodging.js          # ✅ PASSED
node qa/parking/watcher.js              # ✅ PASSED
node qa/governance/sync-checker.js      # ✅ PASSED
npx eslint --config eslint.config.deprecation.mjs . # ✅ PASSED
npm run test:ci                         # ❌ FAILED (requires PostgreSQL)
```

---

### Step 3: Document Results for EACH Command

**Action**: Create evidence document showing result of each command execution.

**Requirements**:
- Show command executed
- Show exit code (0 = pass, non-zero = fail)
- Show relevant output (errors, warnings, summary)
- If command cannot be replicated, document why and what was attempted

**Format**:
```
Command: node qa/detect-test-dodging.js
Exit Code: 0
Output: ✓ No test dodging patterns detected

Command: npm run test:ci
Exit Code: 1
Output: Error: Cannot connect to database
Reason: Requires PostgreSQL service (available in CI, not locally)
Attempted: Tried to run but database connection failed
```

---

### Step 4: Fix ALL Failures

**Action**: For any command that fails, fix the issue before handover.

**Requirements**:
- Identify root cause of failure
- Implement fix
- Re-run command to verify fix
- Update evidence document with new result

**Exception**: If a command cannot be replicated locally for legitimate reasons (e.g., requires CI-specific services), document this clearly and explain why CI will pass.

---

### Step 5: Verify 100% Pass Rate

**Action**: Confirm that ALL commands either pass locally OR have documented legitimate reasons they cannot be replicated.

**Requirements**:
- All replicable commands show exit code 0
- All non-replicable commands have clear justification
- No "assumed passing" commands
- No commands skipped from verification

**Hard Rule**: <100% pass rate = handover blocked

---

### Step 6: Wait for GitHub Actions Completion

**Action**: After pushing commits, wait for ALL GitHub Actions workflow runs to complete.

**Requirements**:
- Push commits to trigger CI
- Wait for all workflows to finish (not just start)
- Verify each workflow shows green checkmark
- Capture URLs of successful workflow runs

**Prohibited**: 
- Claiming "all checks passing" before workflows complete
- Assuming workflows will pass based on local results only
- Providing handover proof without actual CI run URLs

---

### Step 7: Create PREHANDOVER_PROOF

**Action**: Create comprehensive evidence document proving all checks passed.

**Requirements**:
- List ALL jobs verified in Step 1
- Show results from Step 2 (local execution)
- Include CI run URLs from Step 6
- Statement: "Handover authorized, all checks green"
- Agent signature with date

**Template Location**: `governance/templates/PREHANDOVER_PROOF_TEMPLATE.md`

---

## PREHANDOVER_PROOF Requirements

Every PR that creates or modifies workflows, gates, or execution artifacts MUST include PREHANDOVER_PROOF as a PR comment before requesting review.

### Required Content

1. **Job Checklist**: Complete list of all CI jobs identified
2. **Local Execution Results**: Evidence of running each command locally
3. **CI Verification**: URLs to successful GitHub Actions runs
4. **Pass/Fail Status**: Clear indication for each check
5. **Authorization Statement**: "Handover authorized, all checks green"
6. **Limitations**: Any commands that could not be replicated locally (with justification)

### Example Format

```markdown
# PREHANDOVER_PROOF

**Date**: 2026-01-12  
**Agent**: governance-liaison  
**PR**: #150

## CI Jobs Verified

### qa-enforcement.yml (6 jobs)
1. ✅ test-dodging-check → Local: PASSED | CI: [Run #123](url)
2. ✅ qa-parking-check → Local: PASSED | CI: [Run #123](url)
3. ✅ governance-sync-check → Local: PASSED | CI: [Run #123](url)
4. ✅ deprecation-check → Local: PASSED | CI: [Run #123](url)
5. ⚠️ test-execution → Local: Cannot replicate (requires PostgreSQL service) | CI: [Run #123](url) PASSED
6. ✅ merge-gate → CI: [Run #123](url)

## Local Execution Evidence

[Command outputs showing successful execution]

## Limitations

- test-execution: Cannot run locally without PostgreSQL service container. Verified test suite structure is correct and no changes made to tests. CI confirmed PASSED with 220/220 tests.

## Authorization

✅ All required checks verified locally where possible
✅ All CI workflow runs completed successfully
✅ Evidence URLs provided above

**Handover authorized, all checks green.**

**Agent**: governance-liaison  
**Date**: 2026-01-12
```

---

## Constitutional Enforcement

### Authority

This protocol is derived from:
- Governance Liaison Agent contract (`.github/agents/governance-liaison.md`)
- BUILD_PHILOSOPHY.md (One-Time Build Law, CI as confirmation)
- Failure Learning #3 (qa/FAILURE_LEARNING_LOG.md)

### Violations

**Violation Types**:
1. **Missing Verification**: Handover without executing local checks
2. **Incomplete Verification**: Not verifying ALL jobs
3. **Premature Handover**: Not waiting for CI completion
4. **Missing Evidence**: No PREHANDOVER_PROOF provided
5. **False Claims**: Claiming checks passed without evidence

**Consequences**:
- PR must be remediated
- Failure logged in governance/incidents/protocol-violations/
- Repeat violations escalate to Repository Owner
- Pattern of violations may result in agent retraining or replacement

### Monitoring

**Tracked Metrics**:
- Number of PRs with PREHANDOVER_PROOF
- Number of protocol violations
- Time from local verification to CI completion
- Accuracy of PREHANDOVER_PROOF (false positives)

**Reporting**: Quarterly report submitted to Governance Administrator (see monitoring protocol)

---

## Integration with Agent Workflows

### For Builder Agents

**Category 8 (Builder PR Checklist)**:
- [ ] Execute complete 7-step verification protocol
- [ ] Provide PREHANDOVER_PROOF as PR comment
- [ ] Verify all CI jobs identified and verified locally
- [ ] Wait for GitHub Actions completion
- [ ] Include CI run URLs in proof

### For Foreman (FM) Agent

**Category 4 (FM PR Checklist)**:
- [ ] Verify builder provided PREHANDOVER_PROOF
- [ ] Validate proof is complete (all 7 steps)
- [ ] Confirm CI runs referenced in proof
- [ ] Verify CI runs are actually green
- [ ] Block merge if proof incomplete or invalid

### For Governance Liaison Agent

**Constitutional Obligation**:
- MUST perform PR-Gate Preflight before handover
- MUST provide PREHANDOVER_PROOF showing all governance checks passed
- MUST wait for CI confirmation before claiming green status
- MUST escalate if unable to achieve 100% green locally

---

## Exceptions and Escalations

### Legitimate Exceptions

Commands that **cannot** be replicated locally:
1. **PostgreSQL Service**: `npm run test:ci` requires PostgreSQL service container
2. **Environment Variables**: Commands requiring production secrets
3. **External Services**: Commands calling Supabase, Vercel, or other external services
4. **Platform-Specific**: Commands that only work in CI environment (e.g., specific OS requirements)

**Requirement**: Document exception, explain why it's legitimate, confirm CI will pass, provide CI URL as proof.

### Escalation Path

If agent cannot achieve 100% green status:
1. **Document** what is failing and why
2. **Attempt fixes** within scope
3. **Escalate to FM** if fixes require broader changes
4. **Escalate to Repository Owner** if constitutional conflict

**Never Acceptable**: 
- Handover with known failures
- Handover without attempting fixes
- Claiming "acceptable failure rate"

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | 2026-01-12 | Layer-down to PartPulse repository from canonical governance |
| 1.0.0 | 2026-01-08 | Initial canonical version in maturion-foreman-governance |

---

## Related Documents

**In This Repository**:
- `governance/templates/PREHANDOVER_PROOF_TEMPLATE.md` - Template for handover proof
- `.github/agents/governance-liaison.md` - Agent contract with PR-Gate Preflight mandate
- `qa/FAILURE_LEARNING_LOG.md` - Failure #3 documenting need for this protocol
- `governance/incidents/protocol-violations/README.md` - Violation tracking

**In Canonical Governance** (maturion-foreman-governance):
- `governance/canon/EXECUTION_BOOTSTRAP_PROTOCOL.md` - Canonical source
- `governance/canon/EXECUTION_BOOTSTRAP_PROTOCOL_MONITORING_AND_ENFORCEMENT.md` - Monitoring protocol
- `governance/templates/PREHANDOVER_PROOF_TEMPLATE.md` - Canonical template
- `governance/templates/EXECUTION_BOOTSTRAP_PROTOCOL_QUARTERLY_MONITORING_REPORT.template.md` - Report template

---

**This protocol is MANDATORY for all agents. No exceptions without Repository Owner approval.**

---

End of EXECUTION_BOOTSTRAP_PROTOCOL v2.0.0
