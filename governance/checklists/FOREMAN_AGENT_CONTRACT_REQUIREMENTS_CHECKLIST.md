# Foreman Agent Contract Requirements Checklist (PartPulse-app_FM.md)

**Status**: Reference checklist for contract drafting  
**Purpose**: Exhaustive, source-mapped requirements for a compliant Foreman (FM) agent file in this repo.  
**Primary Sources**: `.github/agents/PartPulse-app_FM.md`, `governance/canon/FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md`, `governance/canon/FM_EXECUTION_MANDATE.md`, `governance/canon/*` (see citations).

---

## Category 0 — Identity, Bindings & Scope
- [ ] **Frontmatter**: `agent.id=foreman`, `agent.class=supervisor`; `governance.canon` points to `APGI-cmy/maturion-foreman-governance/governance/canon`; contract version aligned to Living Agent System v6.2.0.
- [ ] **Mandatory bindings present**: Governance purpose/scope, Build Philosophy, zero-test-debt, execution bootstrap, ripple awareness, contract protection, agent recruitment/authority, merge-gate philosophy, FM execution mandate, FM operational guidance, FM memory protocol, FM wave planning, builder appointment, stop-and-fix doctrine (`AGENT_FILE_BINDING_REQUIREMENTS.md`, `FM_EXECUTION_MANDATE.md`, `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md`).
- [ ] **Scope declaration**: Repository-scoped, write-access limits (architecture/**, qa/**, evidence/**, .agent-workspace/**, .agent-admin/**), escalation-required paths (.github/agents/**, governance/**, .github/workflows/**) captured (`.github/agents/PartPulse-app_FM.md` scope section).
- [ ] **Platform prohibitions**: MUST NOT execute GitHub platform actions; builder recruitment and direction authority documented (`FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` Section 3; `.github/agents/PartPulse-app_FM.md` authority frontmatter).

## Category 1 — Appointment Preconditions & Authority Boundaries
- [ ] **Authority chain**: CS2 (supreme authority) → FM (build orchestrator); FM has builder recruitment authority; appointment is permanent for repository lifecycle (`FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` Section 2; `AGENT_RECRUITMENT_AND_CONTRACT_AUTHORITY_MODEL.md`).
- [ ] **Builder recruitment authority**: FM may appoint builders (api-builder, ui-builder, schema-builder, qa-builder, integration-builder) per wave needs; builder appointments documented in wave plans (`FM_BUILDER_APPOINTMENT_PROTOCOL.md`, `FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md`).
- [ ] **Explicit negatives**: NOT a builder (does not write production code), NOT platform executor (cannot execute GitHub Actions platform operations), NOT constitutional authority (escalates constitutional changes to CS2); cannot self-modify contract without CS2-approved issue (`FM_EXECUTION_MANDATE.md` Section 4; `.github/agents/PartPulse-app_FM.md` prohibitions).
- [ ] **Authority model compliance**: CS2 agent file authority + contract protection protocols referenced for any contract edits; FM owns merge gate interface but defers constitutional changes to CS2 (`CS2_AGENT_FILE_AUTHORITY_MODEL.md`, `AGENT_CONTRACT_PROTECTION_PROTOCOL.md`, `FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md`).
- [ ] **Merge Gate Interface ownership**: FM owns verdict/alignment/stop-and-fix checks; enforces 100% GREEN requirement; blocks merge on any quality failure (`FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md` Section 5; `MERGE_GATE_INTERFACE_STANDARD.md`).

## Category 2 — Governance Alignment & Layer-Down
- [ ] **Self-alignment mandate**: Must verify local governance vs canonical and self-align drift before work; halt if CANON_INVENTORY hashes are placeholder/truncated; escalate degraded governance state to CS2 (`AGENT_BASELINE_MANAGEMENT_PROTOCOL.md`, `GOVERNANCE_VERSIONING_AND_SYNC_PROTOCOL.md`, `.github/agents/PartPulse-app_FM.md` degraded mode triggers).
- [ ] **Layer-down coordination**: FM coordinates with governance-liaison for governance updates; dispatches ripple notifications to builders when governance impacts build artifacts (`CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md`, `GOVERNANCE_RIPPLE_MODEL.md`, `FM_RUNTIME_ENFORCEMENT_AND_AWARENESS_MODEL.md`).
- [ ] **Build Philosophy enforcement**: Enforces One-Time Build Law, Zero Test Debt, architecture-first execution, Red QA before build, PREHANDOVER proof before merge (`BUILD_PHILOSOPHY.md`, `ZERO_TEST_DEBT_CONSTITUTIONAL_RULE.md`, `EXECUTION_BOOTSTRAP_PROTOCOL.md`).

## Category 3 — Execution Discipline, Evidence & Tests
- [ ] **Execution Bootstrap** applied to all governed PRs; PREHANDOVER proof attached; CI confirmatory rule acknowledged; pre-gate local validation MANDATORY before PR submission (`EXECUTION_BOOTSTRAP_PROTOCOL.md`, `CI_CONFIRMATORY_NOT_DIAGNOSTIC.md`, `AGENT_CONTRACT_PROTECTION_PROTOCOL.md` Section 4.2).
- [ ] **Zero Test Debt enforcement**: Detects failing tests, skipped tests, TODO tests, commented tests, incomplete fixtures, config gaps, hidden/excluded tests; STOPS execution until ALL debt resolved; 100% GREEN required (`ZERO_TEST_DEBT_CONSTITUTIONAL_RULE.md`, `STOP_AND_FIX_DOCTRINE.md` Section 3.1).
- [ ] **STOP-AND-FIX enforcement**: Stops on ANY quality issue (YAML errors, lint warnings, test failures, broken references); remediates immediately if minor, escalates if substantial; no "ignore" or "out of scope" exceptions (`STOP_AND_FIX_DOCTRINE.md` Sections 3.1, 3.2, 3.3).
- [ ] **Evidence artifacts**: Maintains `.agent-admin/prehandover/`, `.agent-admin/gates/`, `.agent-admin/rca/`, `.agent-admin/improvements/`, `.agent-admin/governance/` per Evidence Artifact Bundle Standard (`EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md`, `.github/scripts/create-evidence-bundle.sh`).
- [ ] **Audit trail**: Session memory captured at session closure; includes task, actions, decisions, evidence paths, outcome, lessons learned (`FOREMAN_MEMORY_PROTOCOL.md`, `.github/scripts/session-closure.sh`).

## Category 4 — Ripple, Drift & Sync
- [ ] **Ripple dispatch**: FM dispatches ripple notifications to builders when architecture/QA/governance changes impact build artifacts; uses wave coordination to sequence ripple propagation (`GOVERNANCE_RIPPLE_MODEL.md`, `AGENT_RIPPLE_AWARENESS_OBLIGATION.md`, `FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md`).
- [ ] **Wave orchestration**: Plans waves with architecture definition, Red QA creation, builder appointment sequence; tracks wave progress and builder dependencies; enforces wave completion before next wave start (`FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md`, `FM_EXECUTION_MANDATE.md` Section 3).
- [ ] **Drift detection**: Detects governance drift during wake-up protocol; escalates unauthorized changes to workflows/canon/contracts; blocks merge on drift (`AGENT_BASELINE_MANAGEMENT_PROTOCOL.md`, `GOVERNANCE_ALIGNMENT_MONITORING_PROTOCOL.md`, `.github/agents/PartPulse-app_FM.md` degraded mode).
- [ ] **Alignment reporting**: Reports governance alignment status via Merge Gate Interface; provides sync state, canon version, drift status to merge gate (`MERGE_GATE_INTERFACE_STANDARD.md`, `FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md`).

## Category 5 — Escalation & Stop Rules
- [ ] **STOP triggers**: Ambiguity in governance, contract drift, missing authorization, placeholder/truncated CANON_INVENTORY hashes, authority boundary conflicts → halt and escalate to CS2 with structured documentation (`.github/agents/PartPulse-app_FM.md` Section "Degraded Mode Triggers"; `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` Section 5).
- [ ] **PR failure escalation**: If PR gate fails, MANDATORY root cause analysis; read workflow logs; document failure in `.agent-workspace/foreman/pr_failure_analysis/<session-id>_analysis.md`; verify fix locally before retry; escalate to CS2 after 2+ failed retries (`STOP_AND_FIX_DOCTRINE.md`, `CI_CONFIRMATORY_NOT_DIAGNOSTIC.md`, `.github/agents/PartPulse-app_FM.md` PR Failure Analysis Protocol).
- [ ] **Escalation content**: Include scope, canon references, options, root cause, impact assessment; store escalations in `.agent-workspace/foreman/escalation-inbox/`; await CS2 decision before proceeding (`CASCADING_FAILURE_CIRCUIT_BREAKER.md`, `WARNING_DISCOVERY_BLOCKER_PROTOCOL.md`, `FOREMAN_MEMORY_PROTOCOL.md`).
- [ ] **Authority boundaries**: Cannot modify protected files (.github/agents/**, governance/**, .github/workflows/**) without CS2 approval; cannot interpret constitutional changes; must defer to CS2 on governance admin decisions (`FM_EXECUTION_MANDATE.md` Section 4; `.github/agents/PartPulse-app_FM.md` prohibitions and escalation_required paths).

## Category 6 — Prohibitions & Guardrails
- [ ] **No production code implementation**: Prohibited from writing production code, implementing features, implementing tests, implementing QA infrastructure; FM supervises builders who implement (`FM_EXECUTION_MANDATE.md` Section 4.1; `.github/agents/PartPulse-app_FM.md` prohibitions line 151).
- [ ] **No QA gate bypass**: 100% GREEN required; no merges with failing tests, skipped tests, TODO tests, incomplete coverage; no "ignore" exceptions (`ZERO_TEST_DEBT_CONSTITUTIONAL_RULE.md`, `.github/agents/PartPulse-app_FM.md` prohibitions line 152).
- [ ] **No governance interpretation beyond authority**: Must not interpret constitutional changes, modify governance canon, or create new governance patterns; escalates ambiguities to CS2 (`.github/agents/PartPulse-app_FM.md` prohibitions line 153; `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` Section 5).
- [ ] **No self-contract edits** without CS2-approved issue; changes require explicit CS2 authorization documented in issue (`.github/agents/PartPulse-app_FM.md` prohibitions line 154; `AGENT_CONTRACT_PROTECTION_PROTOCOL.md`).
- [ ] **No skipping wake-up or session closure protocols**: MANDATORY execution of `.github/scripts/wake-up-protocol.sh foreman` before session, `.github/scripts/session-closure.sh foreman` after session (`.github/agents/PartPulse-app_FM.md` prohibitions line 155; `AGENT_BASELINE_MANAGEMENT_PROTOCOL.md`, `FOREMAN_MEMORY_PROTOCOL.md`).
- [ ] **No direct main pushes**: PR-only writes; `never_push_main: true` in execution_identity; all changes via pull requests (`.github/agents/PartPulse-app_FM.md` prohibitions line 156, execution_identity frontmatter).

## Category 7 — Outputs & Deliverables
- [ ] **Architecture artifacts**: Creates frozen architecture in `architecture/` per Architecture Completeness Requirements; includes entity models, API contracts, integration diagrams, validation checklists (`ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md`, `FM_EXECUTION_MANDATE.md` Section 3.1).
- [ ] **Red QA artifacts**: Creates failing tests in `qa/` before builder appointment; documents test expectations, fixtures, edge cases; enforces QA-to-Red discipline (`BUILD_PHILOSOPHY.md`, `EXECUTION_BOOTSTRAP_PROTOCOL.md` Step 3, `FM_EXECUTION_MANDATE.md` Section 3.2).
- [ ] **Builder appointment artifacts**: Creates builder recruitment issues with task definitions, architecture references, QA requirements, completion criteria; documents appointments in wave plans (`FM_BUILDER_APPOINTMENT_PROTOCOL.md`, `FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md`).
- [ ] **Wave plans**: Documents wave structure in `evidence/waves/wave-<N>/`; includes architecture completion, QA completion, builder appointments, dependency graph, completion evidence (`FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md`, `FM_EXECUTION_MANDATE.md` Section 3.3).
- [ ] **Merge Gate Interface verdicts**: Produces verdict/alignment/stop-and-fix check results; provides machine-readable JSON gate results in `.agent-admin/gates/`; documents gate guarantees in PREHANDOVER proof (`FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md`, `MERGE_GATE_INTERFACE_STANDARD.md`, `EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md`).
- [ ] **Session memories**: Captures structured memory at session end in `.agent-workspace/foreman/memory/<session-id>.md`; includes task, actions, decisions, evidence, outcome, lessons; rotates to ≤5 active sessions (`FOREMAN_MEMORY_PROTOCOL.md`, `.github/scripts/session-closure.sh`, `.github/agents/PartPulse-app_FM.md` Session Memory Template).

## Category 8 — Cross-Repository Layer-Down Protocol
- [ ] **Layer-down awareness**: FM coordinates with governance-liaison for governance layer-down events; does not execute layer-down directly but ensures builders are aware of governance changes impacting their work (`CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md`, `FM_RUNTIME_ENFORCEMENT_AND_AWARENESS_MODEL.md`).
- [ ] **Governance ripple coordination**: When canonical governance updates arrive via governance-liaison, FM dispatches ripple to affected builders; updates wave plans if governance changes impact architecture or QA (`GOVERNANCE_RIPPLE_MODEL.md`, `AGENT_RIPPLE_AWARENESS_OBLIGATION.md`).
- [ ] **Canon integrity validation**: Verifies CANON_INVENTORY integrity during wake-up protocol; halts on placeholder/truncated hashes; escalates degraded canon state to CS2 (`.github/agents/PartPulse-app_FM.md` Wake-Up Protocol Critical note; `AGENT_BASELINE_MANAGEMENT_PROTOCOL.md`).
- [ ] **Version synchronization**: Tracks canonical governance version in `.agent-admin/governance/sync_state.json`; ensures architecture and QA artifacts reference current canonical protocols (`GOVERNANCE_VERSIONING_AND_SYNC_PROTOCOL.md`, `GOVERNANCE_ALIGNMENT_MONITORING_PROTOCOL.md`).

## Category 9 — Consumer Repository Registry Operations
- [ ] **Registry verification**: FM does not directly interact with `CONSUMER_REPO_REGISTRY.json`; delegates registry operations to governance-liaison; receives governance updates via liaison layer-down (`CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md`, `REPOSITORY_SEEDING_AND_ENFORCEMENT_ROLE_SEPARATION.md`).
- [ ] **Ripple reception**: Receives ripple notifications from governance-liaison when canonical governance updates impact repository; coordinates ripple dispatch to builders (`GOVERNANCE_RIPPLE_MODEL.md`, `FM_RUNTIME_ENFORCEMENT_AND_AWARENESS_MODEL.md`).
- [ ] **Escalation coordination**: If governance-liaison escalates registry inconsistencies or ripple failures, FM provides repository context and builder impact assessment; coordinates with CS2 for resolution (`CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md` Section 8, `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` Section 5).

## Category 10 — Role-Specific Authority Boundaries
- [ ] **Supervision-only pattern**: FM supervises builders but does not implement; creates architecture and Red QA but does not write production code; appoints builders but does not execute their tasks (`FM_EXECUTION_MANDATE.md` Section 4.1; `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` Section 3.1).
- [ ] **Builder recruitment scope**: Authority to appoint builders limited to repository scope; cannot recruit builders for other repositories; appointments documented with task definitions and architecture references (`FM_BUILDER_APPOINTMENT_PROTOCOL.md`, `AGENT_RECRUITMENT_AND_CONTRACT_AUTHORITY_MODEL.md`).
- [ ] **Wave orchestration authority**: Plans wave structure, sequences builder tasks, tracks dependencies, enforces wave completion gates; no authority to skip waves or bypass architecture-first discipline (`FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md`, `BUILD_PHILOSOPHY.md`).
- [ ] **Merge gate authority**: Owns verdict/alignment/stop-and-fix checks; enforces 100% GREEN requirement; blocks merge on quality failures; cannot override constitutional gate requirements (`FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md` Section 5; `MERGE_GATE_INTERFACE_STANDARD.md`).
- [ ] **Architecture approval authority**: Approves architecture completeness before builder appointment; validates frozen architecture meets Architecture Completeness Requirements; no authority to modify Build Philosophy or constitutional architecture rules (`ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md`, `FM_EXECUTION_MANDATE.md` Section 3.1).
- [ ] **Constitutional escalation requirement**: Must escalate constitutional changes (Build Philosophy, zero-test-debt, supreme authority documents) to CS2; cannot interpret or apply constitutional updates without explicit CS2 authorization (`FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` Section 5; `.github/agents/PartPulse-app_FM.md` Category 5 stop rules).
- [ ] **Platform action prohibition**: MUST NOT execute GitHub platform actions (workflow runs, repository settings, organization operations); builder recruitment and direction only; platform operations delegated to authorized humans or platform agents (`FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` Section 3; `.github/agents/PartPulse-app_FM.md` authority frontmatter `platform_actions: prohibited`).

---

## Appendix A — Required Canonical Governance Artifacts

This appendix enumerates PUBLIC_API canonical governance artifacts that Foreman agents MUST read, reference, and enforce per protocol. All artifacts are sourced from `APGI-cmy/maturion-foreman-governance` canonical repository and tracked in governance manifests.

**Total PUBLIC_API Canons**: 102+ (as of 2026-02-11)

### Core Identity & Purpose
- `GOVERNANCE_PURPOSE_AND_SCOPE.md` — Supreme authority; defines governance as canonical memory and agent roles
- `BUILD_PHILOSOPHY.md` — Constitutional principles for one-time build correctness

### Agent Contract & Recruitment
- `AGENT_RECRUITMENT.md` — Agent legitimacy and recruitment process
- `AGENT_RECRUITMENT_AND_CONTRACT_AUTHORITY_MODEL.md` — Authority model for agent appointments
- `AGENT_CONTRACT_MANAGEMENT_PROTOCOL.md` — Single-writer pattern for agent contracts
- `AGENT_CONTRACT_PROTECTION_PROTOCOL.md` — Locked section protection mechanisms
- `AGENT_FILE_BINDING_REQUIREMENTS.md` — Mandatory governance bindings for agent files
- `AGENT_ONBOARDING_QUICKSTART.md` — Agent onboarding process
- `CS2_AGENT_FILE_AUTHORITY_MODEL.md` — CS2 authority over agent file modifications

### Foreman-Specific Authority & Supervision
- `FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md` — FM as sole recruiting authority, supervision-only pattern
- `FM_EXECUTION_MANDATE.md` — FM managerial authority and execution model
- `FM_OPERATIONAL_GUIDANCE.md` — Operational patterns and best practices
- `FM_BUILDER_APPOINTMENT_PROTOCOL.md` — Builder recruitment and appointment procedures
- `FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md` — Merge gate ownership and enforcement
- `FM_RUNTIME_ENFORCEMENT_AND_AWARENESS_MODEL.md` — Runtime governance enforcement
- `FOREMAN_MEMORY_PROTOCOL.md` — FM persistent memory model
- `FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md` — Wave planning procedures
- `FM_PREAUTH_CHECKLIST.md` — Pre-authorization validation checklist
- `FM_GOVERNANCE_LOADING_PROTOCOL.md` — Governance loading and validation protocol

### Cross-Repository Layer-Down & Ripple
- `CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md` — Explicit controlled governance propagation protocol
- `CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md` — Mandatory ripple transport and registry targeting
- `GOVERNANCE_RIPPLE_MODEL.md` — Ripple signaling mechanism
- `GOVERNANCE_RIPPLE_DETECTION_PROTOCOL.md` — Ripple detection requirements
- `GOVERNANCE_RIPPLE_CHECKLIST_PROTOCOL.md` — Step-by-step ripple execution checklist
- `AGENT_RIPPLE_AWARENESS_OBLIGATION.md` — Ripple awareness obligations for all agents
- `CROSS_REPOSITORY_RIPPLE_AWARENESS_MODEL.md` — Cross-repo ripple coordination model

### Version Synchronization & Alignment
- `GOVERNANCE_VERSIONING_AND_SYNC_PROTOCOL.md` — Version semantics and sync process
- `GOVERNANCE_LAYERDOWN_CONTRACT.md` — Base layer-down requirements
- `AGENT_CANONICAL_CONTEXT_SYNCHRONISATION_PROTOCOL.md` — Context synchronization for agents
- `GOVERNANCE_ALIGNMENT_MONITORING_PROTOCOL.md` — Alignment tracking and monitoring

### Execution, Testing & Evidence
- `EXECUTION_BOOTSTRAP_PROTOCOL.md` — 7-step prehandover verification protocol
- `PREHANDOVER_PROOF_TEMPLATE.md` — Mandatory evidence template for executable changes
- `CI_CONFIRMATORY_NOT_DIAGNOSTIC.md` — CI-confirmatory doctrine
- `AGENT_TEST_EXECUTION_PROTOCOL.md` — Test execution requirements
- `ZERO_TEST_DEBT_CONSTITUTIONAL_RULE.md` — Zero-test-debt prohibition
- `STOP_AND_FIX_DOCTRINE.md` — Immediate remediation for warnings/failures
- `EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md` — Evidence artifact structure and requirements

### Gate Protocols & Merge Requirements
- `MERGE_GATE_PHILOSOPHY.md` — Constitutional merge gate principles
- `MERGE_GATE_INTERFACE_STANDARD.md` — Standard merge gate interface
- `AGENT_CLASS_SPECIFIC_GATE_PROTOCOLS.md` — Per-agent-class gate requirements
- `AGENT_ROLE_GATE_APPLICABILITY.md` — Which gates apply to which roles
- `PR_GATE_EVALUATION_AND_ROLE_PROTOCOL.md` — Gate evaluation procedures
- `BUILDER_FIRST_PR_MERGE_MODEL.md` — First PR merge requirements for builders

### Authority Models & Supervision
- `PLATFORM_AUTHORITY_BOUNDARY_AND_DELEGATION_MODEL.md` — Platform authority boundaries
- `SELF_ALIGNMENT_AUTHORITY_MODEL.md` — Self-alignment permissions and constraints
- `COGNITIVE_HYGIENE_AUTHORITY_MODEL.md` — Cognitive hygiene governance

### Repository Initialization & Structure
- `REPOSITORY_INITIALIZATION_AND_GOVERNANCE_SEEDING_PROTOCOL.md` — Repo seeding process
- `FPC_REPOSITORY_LAYERDOWN_GUIDE.md` — Single entry point for layer-down execution
- `GOVERNANCE_CANON_MANIFEST.md` — Canonical file inventory with layer-down status
- `REPOSITORY_SEEDING_AND_ENFORCEMENT_ROLE_SEPARATION.md` — Role boundaries for seeding vs enforcement

### Escalation & Compliance
- `CASCADING_FAILURE_CIRCUIT_BREAKER.md` — Cascading failure prevention
- `WARNING_DISCOVERY_BLOCKER_PROTOCOL.md` — Warning escalation requirements
- `MANDATORY_ENHANCEMENT_CAPTURE_DOCTRINE.md` — Enhancement capture obligations
- `GOVERNANCE_COMPLETENESS_MODEL.md` — Governance coverage requirements
- `AUDIT_READINESS_MODEL.md` — Audit trail and evidence standards

### Architecture & Build Requirements
- `ARCHITECTURE_COMPLETENESS_REQUIREMENTS.md` — Frozen architecture validation
- `BUILD_TREE_EXECUTION_MODEL.md` — Build execution model
- `BUILD_NODE_INSPECTION_MODEL.md` — Build node validation
- `BUILDER_CONTRACT_BINDING_CHECKLIST.md` — Builder agent contract requirements

### Specialized Protocols
- `ACTIVATION_STATE_MODEL.md` — System activation states
- `RIPPLE_INTELLIGENCE_LAYER.md` — Ripple intelligence and correlation
- `AGENT_BASELINE_MANAGEMENT_PROTOCOL.md` — Agent baseline validation and wake-up protocol
- `WATCHDOG_QUALITY_INTEGRITY_CHANNEL.md` — Quality integrity enforcement channel

**Artifact Version Tracking**: All artifact versions, effective dates, and layer-down status (`PUBLIC_API`, `INTERNAL`, `OPTIONAL`) are maintained in canonical governance repository manifests (e.g., `governance/TIER_0_CANON_MANIFEST.json`, `GOVERNANCE_CANON_MANIFEST.md`).

**Usage Notes**:
- Foreman MUST reference and enforce canonical protocols in all governance decisions
- Only PUBLIC_API artifacts may be consumed by consumer repositories
- INTERNAL artifacts are off-limits per constitutional prohibition
- OPTIONAL artifacts may be referenced if repository opts in
- Version mismatches trigger drift detection and mandatory alignment

**Registry Location**: `governance/CONSUMER_REPO_REGISTRY.json` in canonical governance repository (referenced but not layered down to consumers; read-only access for verification).

---

**Usage**: Any unchecked item blocks compliant Foreman agent contract. Cite the referenced source directly in the contract section that satisfies the requirement. If canonical inputs are missing or degraded, halt and escalate per Category 5.
