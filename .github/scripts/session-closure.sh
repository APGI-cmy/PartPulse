#!/bin/bash
# Session Closure Protocol - Living Agent System v6.2.0
# Authority: FOREMAN_MEMORY_PROTOCOL.md, LIVING_AGENT_SYSTEM.md
# Purpose: Capture session memory, rotate old memories, store evidence

set -e

# ============================================================================
# Configuration
# ============================================================================

AGENT_ID="${1:-foreman}"
WORKSPACE=".agent-workspace/$AGENT_ID"
TIMESTAMP=$(date -u +"%Y%m%dT%H%M%SZ")
SESSION_ID="session-$(date -u +"%Y%m%d-%H%M%S")"
SESSION_FILE="$WORKSPACE/memory/$SESSION_ID.md"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# Helper Functions
# ============================================================================

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
# Session Memory Capture
# ============================================================================

capture_session_memory() {
    echo ""
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║  🔒 SESSION CLOSURE: $AGENT_ID"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo ""
    
    # Create memory directory if it doesn't exist
    mkdir -p "$WORKSPACE/memory"
    
    # Find agent contract to extract contract version
    AGENT_CONTRACT=""
    CONTRACT_VERSION="unknown"
    
    if [ -f ".github/agents/${AGENT_ID}.md" ]; then
        AGENT_CONTRACT=".github/agents/${AGENT_ID}.md"
    elif [ -f "governance/agents/${AGENT_ID}.md" ]; then
        AGENT_CONTRACT="governance/agents/${AGENT_ID}.md"
    fi
    
    if [ -n "$AGENT_CONTRACT" ]; then
        # Try to extract version from contract (look for Version: or v pattern)
        CONTRACT_VERSION=$(grep -oP "(?<=Version:\s)[\d\.]+" "$AGENT_CONTRACT" | head -1 || echo "unknown")
        if [ "$CONTRACT_VERSION" = "unknown" ]; then
            CONTRACT_VERSION=$(grep -oP "v[\d\.]+" "$AGENT_CONTRACT" | head -1 || echo "unknown")
        fi
    fi
    
    # Get current branch and last commit
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
    LAST_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
    
    # Create session memory template
    cat > "$SESSION_FILE" <<EOF
# Session Memory: $SESSION_ID

## Agent
- Name: $AGENT_ID
- Contract: ${CONTRACT_VERSION}
- Date: $(date -u +"%Y-%m-%d")
- Time: $(date -u +"%H:%M:%S UTC")

## Context
- Branch: $CURRENT_BRANCH
- Commit: $LAST_COMMIT

## Task
*Session task description - to be filled by reviewing PR/issue*

EOF
    
    # Try to extract task from recent commit messages
    RECENT_COMMITS=$(git log --oneline -3 2>/dev/null || echo "")
    if [ -n "$RECENT_COMMITS" ]; then
        echo "Recent commits:" >> "$SESSION_FILE"
        echo '```' >> "$SESSION_FILE"
        echo "$RECENT_COMMITS" >> "$SESSION_FILE"
        echo '```' >> "$SESSION_FILE"
        echo "" >> "$SESSION_FILE"
    fi
    
    cat >> "$SESSION_FILE" <<EOF

## Actions Taken
- *Action 1*
- *Action 2*

## Decisions Made
- *Decision 1*: Rationale
- *Decision 2*: Rationale

## Evidence Collection
- Prehandover proof: *path or "none"*
- Gate results: *path or "none"*
- Continuous improvements: *path or "none"*

## Outcome
*Success/Partial/Blocked* - Brief description

## Lessons

### What Worked Well
- *Item 1*

### What Was Challenging
- *Challenge 1*

### Future Sessions Should Know
- *Critical insight 1*

---
**Authority**: FOREMAN_MEMORY_PROTOCOL.md, Living Agent System v6.2.0  
**Session**: $SESSION_ID  
**Captured**: $(date -u +"%Y-%m-%d %H:%M:%S UTC")
EOF
    
    log_success "Session memory template created: $SESSION_FILE"
    echo "   → Edit this file to document your session"
}

# ============================================================================
# Memory Rotation
# ============================================================================

rotate_memories() {
    echo ""
    echo "Rotating session memories (keeping last 5)..."
    
    # Count session files
    MEMORY_COUNT=$(find "$WORKSPACE/memory" -name "session-*.md" -type f 2>/dev/null | wc -l)
    
    if [ $MEMORY_COUNT -le 5 ]; then
        log_success "Memory count OK: $MEMORY_COUNT sessions (max 5)"
        return 0
    fi
    
    # Archive old memories
    ARCHIVE_DIR="$WORKSPACE/memory/archive"
    mkdir -p "$ARCHIVE_DIR"
    
    # Find oldest sessions beyond the 5 most recent
    OLD_SESSIONS=$(find "$WORKSPACE/memory" -maxdepth 1 -name "session-*.md" -type f | sort | head -n $((MEMORY_COUNT - 5)))
    
    ARCHIVED_COUNT=0
    for SESSION in $OLD_SESSIONS; do
        mv "$SESSION" "$ARCHIVE_DIR/"
        ARCHIVED_COUNT=$((ARCHIVED_COUNT + 1))
    done
    
    log_success "Archived $ARCHIVED_COUNT old session(s) to archive/"
}

# ============================================================================
# Evidence Verification
# ============================================================================

verify_evidence() {
    echo ""
    echo "Verifying evidence artifacts..."
    
    # Check for common evidence locations
    EVIDENCE_FOUND=false
    EVIDENCE_PATHS=()
    
    if [ -f "PREHANDOVER_PROOF.md" ] || ls PREHANDOVER_PROOF_*.md 1> /dev/null 2>&1; then
        EVIDENCE_FOUND=true
        EVIDENCE_PATHS+=("PREHANDOVER_PROOF")
        log_success "Found: PREHANDOVER_PROOF"
    fi
    
    if [ -f ".agent-admin/gates/gate-results.json" ]; then
        EVIDENCE_FOUND=true
        EVIDENCE_PATHS+=(".agent-admin/gates/gate-results.json")
        log_success "Found: gate-results.json"
    fi
    
    if [ -f ".agent-admin/improvements/improvements.md" ]; then
        EVIDENCE_FOUND=true
        EVIDENCE_PATHS+=(".agent-admin/improvements/improvements.md")
        log_success "Found: improvements.md"
    fi
    
    if [ ! "$EVIDENCE_FOUND" = true ]; then
        log_warning "No evidence artifacts found"
        log_warning "Consider creating evidence bundle for governance compliance"
    fi
}

# ============================================================================
# Escalation Check
# ============================================================================

check_escalations() {
    echo ""
    echo "Checking escalation inbox..."
    
    ESCALATION_COUNT=0
    if [ -d "$WORKSPACE/escalation-inbox" ]; then
        ESCALATION_COUNT=$(find "$WORKSPACE/escalation-inbox" -name "*.md" -type f 2>/dev/null | wc -l)
    fi
    
    if [ $ESCALATION_COUNT -gt 0 ]; then
        log_warning "$ESCALATION_COUNT pending escalation(s) in inbox"
        echo "   → Review and address escalations before next session"
    else
        log_success "No pending escalations"
    fi
}

# ============================================================================
# Update Learning Artifacts
# ============================================================================

update_learning_artifacts() {
    echo ""
    echo "Updating learning artifacts..."
    
    # Create personal directory if it doesn't exist
    mkdir -p "$WORKSPACE/personal"
    
    # Initialize lessons-learned.md if it doesn't exist
    if [ ! -f "$WORKSPACE/personal/lessons-learned.md" ]; then
        cat > "$WORKSPACE/personal/lessons-learned.md" <<EOF
# Lessons Learned - $AGENT_ID

This file captures lessons learned across sessions for continuous improvement.

## Lessons

### $(date -u +"%Y-%m-%d")
- Session: $SESSION_ID
- Lesson: *Document your lesson here*

---
Last updated: $(date -u +"%Y-%m-%d %H:%M:%S UTC")
EOF
        log_success "Created: lessons-learned.md"
    else
        log_success "Exists: lessons-learned.md (remember to update)"
    fi
    
    # Initialize patterns.md if it doesn't exist
    if [ ! -f "$WORKSPACE/personal/patterns.md" ]; then
        cat > "$WORKSPACE/personal/patterns.md" <<EOF
# Patterns - $AGENT_ID

This file captures recurring patterns discovered across sessions.

## Patterns

### Pattern: *Pattern Name*
- **Observed**: $(date -u +"%Y-%m-%d")
- **Context**: *When this pattern appears*
- **Solution**: *How to handle it*
- **Sessions**: $SESSION_ID

---
Last updated: $(date -u +"%Y-%m-%d %H:%M:%S UTC")
EOF
        log_success "Created: patterns.md"
    else
        log_success "Exists: patterns.md (remember to update)"
    fi
}

# ============================================================================
# Main Execution
# ============================================================================

main() {
    capture_session_memory
    rotate_memories
    verify_evidence
    check_escalations
    update_learning_artifacts
    
    echo ""
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║  ✅ SESSION CLOSURE COMPLETE"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo ""
    echo "Session Memory: $SESSION_FILE"
    echo ""
    echo "Next steps:"
    echo "  1. Edit session memory to document your work"
    echo "  2. Update lessons-learned.md and patterns.md"
    echo "  3. Commit all changes to PR"
    echo "  4. Verify evidence bundle completeness"
    echo ""
}

# Run main
main
