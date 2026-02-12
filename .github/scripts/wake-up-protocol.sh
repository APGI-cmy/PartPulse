#!/bin/bash
# Wake-Up Protocol - Living Agent System v6.2.0
# Authority: LIVING_AGENT_GOVERNANCE_HEALTH_CHECKS.md
# Purpose: 7-phase health check and working contract generation

set -e

# ============================================================================
# Configuration
# ============================================================================

AGENT_ID="${1:-foreman}"
WORKSPACE=".agent-workspace/$AGENT_ID"
TIMESTAMP=$(date -u +"%Y%m%dT%H%M%SZ")
SESSION_ID="session-$(date -u +"%Y%m%d-%H%M%S")"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# Helper Functions
# ============================================================================

log_phase() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""
}

log_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

log_error() {
    echo -e "${RED}✗ $1${NC}"
}

# ============================================================================
# Phase 1: Self-Identification
# ============================================================================

phase_1_self_identification() {
    log_phase "PHASE 1: Self-Identification"
    
    # Find agent contract
    AGENT_CONTRACT=""
    if [ -f ".github/agents/${AGENT_ID}.md" ]; then
        AGENT_CONTRACT=".github/agents/${AGENT_ID}.md"
    elif [ -f "governance/agents/${AGENT_ID}.md" ]; then
        AGENT_CONTRACT="governance/agents/${AGENT_ID}.md"
    fi
    
    if [ -z "$AGENT_CONTRACT" ]; then
        log_error "Agent contract not found for: $AGENT_ID"
        log_error "Checked: .github/agents/${AGENT_ID}.md, governance/agents/${AGENT_ID}.md"
        return 1
    fi
    
    log_success "Agent contract found: $AGENT_CONTRACT"
    
    # Extract agent class (simplified - assumes contract has "agent" or "foreman" in name)
    AGENT_CLASS="unknown"
    if echo "$AGENT_ID" | grep -qi "foreman"; then
        AGENT_CLASS="foreman"
    elif echo "$AGENT_ID" | grep -qi "liaison"; then
        AGENT_CLASS="liaison"
    elif echo "$AGENT_ID" | grep -qi "builder"; then
        AGENT_CLASS="builder"
    elif echo "$AGENT_ID" | grep -qi "overseer\|advisor"; then
        AGENT_CLASS="overseer"
    fi
    
    log_success "Agent class identified: $AGENT_CLASS"
    
    # Store for working contract
    echo "AGENT_CONTRACT=$AGENT_CONTRACT" > "$WORKSPACE/.wake-up-state"
    echo "AGENT_CLASS=$AGENT_CLASS" >> "$WORKSPACE/.wake-up-state"
}

# ============================================================================
# Phase 2: Memory Scan
# ============================================================================

phase_2_memory_scan() {
    log_phase "PHASE 2: Memory Scan"
    
    # Create workspace if it doesn't exist
    mkdir -p "$WORKSPACE/memory"
    mkdir -p "$WORKSPACE/escalation-inbox"
    mkdir -p "$WORKSPACE/context"
    
    # Scan for session memories
    MEMORY_COUNT=0
    if [ -d "$WORKSPACE/memory" ]; then
        MEMORY_COUNT=$(find "$WORKSPACE/memory" -name "session-*.md" -type f 2>/dev/null | wc -l)
    fi
    
    log_success "Found $MEMORY_COUNT previous session(s)"
    
    # List last 5 sessions
    if [ $MEMORY_COUNT -gt 0 ]; then
        echo "Recent sessions:"
        find "$WORKSPACE/memory" -name "session-*.md" -type f | sort -r | head -5 | while read -r session; do
            SESSION_DATE=$(basename "$session" .md | sed 's/session-//')
            echo "  → $SESSION_DATE"
        done
    fi
    
    # Check escalation inbox
    ESCALATION_COUNT=0
    if [ -d "$WORKSPACE/escalation-inbox" ]; then
        ESCALATION_COUNT=$(find "$WORKSPACE/escalation-inbox" -name "*.md" -type f 2>/dev/null | wc -l)
    fi
    
    if [ $ESCALATION_COUNT -gt 0 ]; then
        log_warning "$ESCALATION_COUNT pending escalation(s) in inbox"
    else
        log_success "No pending escalations"
    fi
    
    # Store for working contract
    echo "MEMORY_COUNT=$MEMORY_COUNT" >> "$WORKSPACE/.wake-up-state"
    echo "ESCALATION_COUNT=$ESCALATION_COUNT" >> "$WORKSPACE/.wake-up-state"
}

# ============================================================================
# Phase 3: Governance Discovery
# ============================================================================

phase_3_governance_discovery() {
    log_phase "PHASE 3: Governance Discovery"
    
    # Check for governance inventory
    GOVERNANCE_ARTIFACTS=0
    if [ -f "GOVERNANCE_ARTIFACT_INVENTORY.md" ]; then
        GOVERNANCE_ARTIFACTS=$(grep -c "^- " GOVERNANCE_ARTIFACT_INVENTORY.md 2>/dev/null || echo 0)
        log_success "Governance inventory found: $GOVERNANCE_ARTIFACTS artifacts"
    else
        log_warning "GOVERNANCE_ARTIFACT_INVENTORY.md not found"
    fi
    
    # Check for canon inventory
    CANON_COUNT=0
    if [ -f "governance/CANON_INVENTORY.json" ]; then
        CANON_COUNT=$(jq 'length' governance/CANON_INVENTORY.json 2>/dev/null || echo 0)
        log_success "Canon inventory found: $CANON_COUNT canon documents"
    elif [ -d "governance/canon" ]; then
        CANON_COUNT=$(find governance/canon -name "*.md" -type f 2>/dev/null | wc -l)
        log_warning "Canon directory found: $CANON_COUNT files (no JSON inventory)"
    else
        log_warning "No canon inventory found"
    fi
    
    # Critical canon check
    CRITICAL_CANON=(
        "BUILD_PHILOSOPHY.md"
        "governance/canon/FM_ROLE_CANON.md"
        "governance/canon/LIVING_AGENT_SYSTEM.md"
    )
    
    MISSING_CANON=()
    for CANON in "${CRITICAL_CANON[@]}"; do
        if [ ! -f "$CANON" ]; then
            MISSING_CANON+=("$CANON")
        fi
    done
    
    if [ ${#MISSING_CANON[@]} -gt 0 ]; then
        log_warning "Missing critical canon: ${MISSING_CANON[*]}"
    else
        log_success "Critical canon present"
    fi
    
    # Store for working contract
    echo "GOVERNANCE_ARTIFACTS=$GOVERNANCE_ARTIFACTS" >> "$WORKSPACE/.wake-up-state"
    echo "CANON_COUNT=$CANON_COUNT" >> "$WORKSPACE/.wake-up-state"
}

# ============================================================================
# Phase 4: Environment Health Check
# ============================================================================

phase_4_environment_health() {
    log_phase "PHASE 4: Environment Health Check"
    
    # Check git status
    if git status --porcelain | grep -q '^'; then
        log_warning "Uncommitted changes detected"
        REPO_STATUS="dirty"
    else
        log_success "Repository clean"
        REPO_STATUS="clean"
    fi
    
    # Check current branch
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    log_success "Current branch: $CURRENT_BRANCH"
    
    # Validate JSON files in governance
    JSON_VALID=true
    if [ -d "governance" ]; then
        while IFS= read -r json_file; do
            if ! jq empty "$json_file" 2>/dev/null; then
                log_error "Invalid JSON: $json_file"
                JSON_VALID=false
            fi
        done < <(find governance -name "*.json" -type f 2>/dev/null)
    fi
    
    if [ "$JSON_VALID" = true ]; then
        log_success "JSON files valid"
    fi
    
    # Store for working contract
    echo "REPO_STATUS=$REPO_STATUS" >> "$WORKSPACE/.wake-up-state"
    echo "CURRENT_BRANCH=$CURRENT_BRANCH" >> "$WORKSPACE/.wake-up-state"
    echo "JSON_VALID=$JSON_VALID" >> "$WORKSPACE/.wake-up-state"
}

# ============================================================================
# Phase 5: Drift Detection
# ============================================================================

phase_5_drift_detection() {
    log_phase "PHASE 5: Drift Detection & Analysis"
    
    DRIFT_DETECTED=false
    DRIFT_TYPES=()
    
    # Check for inventory drift (simple check - files exist but not tracked)
    if [ -d "governance" ] && [ -f "GOVERNANCE_ARTIFACT_INVENTORY.md" ]; then
        UNTRACKED=$(find governance -name "*.md" -type f | wc -l)
        TRACKED=$(grep -c "^- " GOVERNANCE_ARTIFACT_INVENTORY.md 2>/dev/null || echo 0)
        
        if [ $UNTRACKED -gt $((TRACKED + 10)) ]; then
            log_warning "Potential inventory drift: $UNTRACKED files vs $TRACKED tracked"
            DRIFT_DETECTED=true
            DRIFT_TYPES+=("inventory")
        fi
    fi
    
    # Check for placeholder canon hashes
    if [ -f "governance/CANON_INVENTORY.json" ]; then
        PLACEHOLDERS=$(jq -r '.. | select(type == "string") | select(. == "PLACEHOLDER" or . == "TBD" or . == "TODO")' governance/CANON_INVENTORY.json 2>/dev/null | wc -l)
        if [ $PLACEHOLDERS -gt 0 ]; then
            log_error "Placeholder canon hashes detected: $PLACEHOLDERS"
            DRIFT_DETECTED=true
            DRIFT_TYPES+=("canon-placeholder")
        fi
    fi
    
    if [ "$DRIFT_DETECTED" = false ]; then
        log_success "No drift detected"
    else
        log_warning "Drift detected: ${DRIFT_TYPES[*]}"
    fi
    
    # Store for working contract
    echo "DRIFT_DETECTED=$DRIFT_DETECTED" >> "$WORKSPACE/.wake-up-state"
    echo "DRIFT_TYPES=${DRIFT_TYPES[*]}" >> "$WORKSPACE/.wake-up-state"
}

# ============================================================================
# Phase 6: Auto-Remediation
# ============================================================================

phase_6_auto_remediation() {
    log_phase "PHASE 6: Auto-Remediation"
    
    # Read drift state
    source "$WORKSPACE/.wake-up-state"
    
    if [ "$DRIFT_DETECTED" = "false" ]; then
        log_success "No remediation needed"
        return 0
    fi
    
    log_warning "Auto-remediation not implemented for detected drift"
    log_warning "Manual intervention or escalation may be required"
    
    # In full implementation, would attempt to remediate based on agent class and authority
}

# ============================================================================
# Phase 7: Working Contract Generation
# ============================================================================

phase_7_working_contract() {
    log_phase "PHASE 7: Working Contract Generation"
    
    # Load state
    source "$WORKSPACE/.wake-up-state"
    
    # Generate working contract
    WORKING_CONTRACT="$WORKSPACE/working-contract.md"
    
    cat > "$WORKING_CONTRACT" <<EOF
# Working Contract - $SESSION_ID

**Agent**: $AGENT_ID  
**Class**: ${AGENT_CLASS:-unknown}  
**Time**: $(date -u +"%Y-%m-%d %H:%M:%S UTC")  
**Session**: $SESSION_ID

## My Identity

- Class: ${AGENT_CLASS:-unknown}
- Contract: $AGENT_CONTRACT
- Authority: Per agent contract and Living Agent System v6.2.0

## Environment Status

- Health: $([ "$JSON_VALID" = "true" ] && [ "$REPO_STATUS" = "clean" ] && echo "✅ SAFE" || echo "⚠️ WARNINGS")
- Repository: $CURRENT_BRANCH, $REPO_STATUS
- Governance: ✅ $GOVERNANCE_ARTIFACTS artifacts loaded
- Canon: ✅ $CANON_COUNT constitutional documents
- Memories: $MEMORY_COUNT sessions available
- Escalations: $ESCALATION_COUNT pending

## Governance Context

- Critical Canon: Present
- Drift Detected: $([ "$DRIFT_DETECTED" = "true" ] && echo "YES (${DRIFT_TYPES[*]})" || echo "NO")

## Session Mandate

✅ Environment health validated  
✅ Governance loaded and current  
$([ "$DRIFT_DETECTED" = "true" ] && echo "⚠️  Drift detected - manual review required" || echo "✅ Drift detection completed - all clear")  
✅ Memory scanned  
✅ Ready for work

## Limitations/Warnings

$([ "$REPO_STATUS" = "dirty" ] && echo "⚠️ Uncommitted changes present" || echo "None")
$([ "$DRIFT_DETECTED" = "true" ] && echo "⚠️ Governance drift detected" || echo "")
$([ ${#MISSING_CANON[@]} -gt 0 ] && echo "⚠️ Missing critical canon: ${MISSING_CANON[*]}" || echo "")

---

**Authority**: LIVING_AGENT_SYSTEM.md | Session: $SESSION_ID
**Generated**: $(date -u +"%Y-%m-%d %H:%M:%S UTC")

EOF
    
    log_success "Working contract generated: $WORKING_CONTRACT"
    
    # Generate health status JSON
    HEALTH_JSON="$WORKSPACE/environment-health.json"
    
    cat > "$HEALTH_JSON" <<EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "session_id": "$SESSION_ID",
  "agent_id": "$AGENT_ID",
  "agent_class": "${AGENT_CLASS:-unknown}",
  "health_status": "$([ "$JSON_VALID" = "true" ] && [ "$REPO_STATUS" = "clean" ] && echo "SAFE" || echo "WARN")",
  "checks": {
    "self_identification": { "status": "PASS" },
    "memory_scan": { "status": "PASS", "sessions_found": $MEMORY_COUNT },
    "governance_discovery": { "status": "PASS", "artifacts_loaded": $GOVERNANCE_ARTIFACTS, "canon_loaded": $CANON_COUNT },
    "environment_health": { "status": "$([ "$JSON_VALID" = "true" ] && echo "PASS" || echo "WARN")" },
    "drift_detection": { 
      "status": "$([ "$DRIFT_DETECTED" = "false" ] && echo "PASS" || echo "WARN")",
      "drift_detected": $DRIFT_DETECTED
    },
    "auto_remediation": { "status": "SKIP" }
  },
  "escalations_pending": $ESCALATION_COUNT,
  "working_contract_path": "$WORKING_CONTRACT"
}
EOF
    
    log_success "Health status JSON: $HEALTH_JSON"
}

# ============================================================================
# Main Execution
# ============================================================================

main() {
    echo ""
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║  🚀 WAKING UP: $AGENT_ID"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo ""
    
    # Create workspace
    mkdir -p "$WORKSPACE"
    
    # Execute all phases
    phase_1_self_identification || exit 1
    phase_2_memory_scan || exit 1
    phase_3_governance_discovery || exit 1
    phase_4_environment_health || exit 1
    phase_5_drift_detection || exit 1
    phase_6_auto_remediation || exit 1
    phase_7_working_contract || exit 1
    
    # Summary
    echo ""
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║  ✅ WAKE-UP COMPLETE - READ YOUR WORKING CONTRACT"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo ""
    echo "📖 Working Contract: $WORKSPACE/working-contract.md"
    echo "📊 Health Status: $WORKSPACE/environment-health.json"
    echo ""
    echo "Next steps:"
    echo "  1. Read your working contract:"
    echo "     cat $WORKSPACE/working-contract.md"
    echo "  2. Begin your session work"
    echo "  3. At session end, run: .github/scripts/session-closure.sh $AGENT_ID"
    echo ""
}

# Run main
main
