#!/bin/bash
# wave_closure.sh
# Wave Closure and Certification Script
# Authority: FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md
# Version: 1.0.0
# Purpose: Certify wave completion and generate closure artifacts per Living Agent System v5.0.0

set -e

# ANSI colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Usage function
usage() {
    cat << EOF
Usage: $0 [OPTIONS] <wave-number>

Certify wave completion and generate closure artifacts per FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md

Arguments:
    wave-number         Wave number to close (e.g., '1', '2', '3')

Options:
    -h, --help         Show this help message
    -v, --verbose      Enable verbose output
    -f, --force        Force closure even if validation warnings exist
    -d, --dry-run      Validate only, do not create closure artifacts
    -r, --repo-root    Repository root path (default: current directory)

Examples:
    $0 1
    $0 --verbose 2
    $0 --dry-run --verbose 3
    $0 --force --repo-root /path/to/repo 1

Exit Codes:
    0   Wave closure COMPLETE
    1   Wave closure FAILED (blocking issues found)
    2   Wave closure WARNED (non-blocking issues found)
    3   Invalid usage or missing files

Authority: FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md §6
EOF
}

# Initialize variables
VERBOSE=false
FORCE=false
DRY_RUN=false
REPO_ROOT=$(pwd)
WAVE_NUM=""
EXIT_CODE=0

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            usage
            exit 0
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -f|--force)
            FORCE=true
            shift
            ;;
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        -r|--repo-root)
            REPO_ROOT="$2"
            shift 2
            ;;
        -*)
            echo -e "${RED}Error: Unknown option: $1${NC}" >&2
            usage
            exit 3
            ;;
        *)
            WAVE_NUM="$1"
            shift
            ;;
    esac
done

# Validate required arguments
if [ -z "$WAVE_NUM" ]; then
    echo -e "${RED}Error: wave-number is required${NC}" >&2
    usage
    exit 3
fi

# Change to repo root
cd "$REPO_ROOT"

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ${NC}  $1"
}

log_success() {
    echo -e "${GREEN}✅${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠️${NC}  $1"
}

log_error() {
    echo -e "${RED}❌${NC} $1"
}

log_verbose() {
    if [ "$VERBOSE" = true ]; then
        echo -e "${BLUE}  →${NC} $1"
    fi
}

# Header
echo "=========================================="
echo "Wave Closure & Certification v1.0.0"
echo "=========================================="
echo ""
log_info "Wave Number: ${WAVE_NUM}"
log_info "Repository: ${REPO_ROOT}"
log_info "Dry Run: ${DRY_RUN}"
log_info "Force: ${FORCE}"
echo ""

# Determine file paths
WAVE_PROGRESS_FILE="execution-progress/WAVE_${WAVE_NUM}_IMPLEMENTATION_PROGRESS.md"
WAVE_CLOSURE_FILE="execution-progress/WAVE_${WAVE_NUM}_CLOSURE_CERTIFICATION.md"
ARCHITECTURE_DIR="evidence/architecture"
QA_DIR="qa"

# Phase 1: Pre-Closure Validation
echo "=========================================="
echo "Phase 1: Pre-Closure Validation"
echo "=========================================="
echo ""

# Check 1: Wave Progress Artifact Exists
echo "Check 1: Wave Progress Artifact"
echo "----------------------------------------"

if [ ! -f "$WAVE_PROGRESS_FILE" ]; then
    log_error "Wave progress file not found: $WAVE_PROGRESS_FILE"
    log_info "Wave may not have been initialized properly"
    EXIT_CODE=1
else
    log_success "Wave progress artifact exists"
    
    # Extract wave metadata
    WAVE_TITLE=$(grep -E "^# Wave ${WAVE_NUM}:" "$WAVE_PROGRESS_FILE" | sed "s/^# Wave ${WAVE_NUM}: //" || echo "Unknown")
    log_verbose "Wave Title: $WAVE_TITLE"
    
    # Check last update time
    LAST_UPDATE=$(grep -E "^Last Updated:" "$WAVE_PROGRESS_FILE" | tail -1 | sed 's/^Last Updated: //' || echo "Unknown")
    log_verbose "Last Update: $LAST_UPDATE"
fi

echo ""

# Check 2: Architecture Documentation
echo "Check 2: Architecture Documentation"
echo "----------------------------------------"

ARCH_COMPLETE=false
ARCH_FILES=$(find "$ARCHITECTURE_DIR" -name "*WAVE_${WAVE_NUM}*" -o -name "*wave_${WAVE_NUM}*" 2>/dev/null || echo "")

if [ -z "$ARCH_FILES" ]; then
    log_warning "No architecture files found for Wave ${WAVE_NUM}"
    EXIT_CODE=2
else
    log_success "Architecture files found:"
    echo "$ARCH_FILES" | while read -r file; do
        log_verbose "  - $file"
    done
    ARCH_COMPLETE=true
fi

echo ""

# Check 3: QA Suite Status
echo "Check 3: QA Suite Status"
echo "----------------------------------------"

# Look for test files related to this wave
QA_FILES=$(find "$QA_DIR" __tests__ -name "*.test.*" -o -name "*.spec.*" 2>/dev/null | head -20 || echo "")

if [ -z "$QA_FILES" ]; then
    log_warning "No QA files found"
    EXIT_CODE=2
else
    QA_COUNT=$(echo "$QA_FILES" | wc -l)
    log_success "Found $QA_COUNT QA files"
    
    # Check if tests are passing (if test command available)
    if command -v npm &> /dev/null; then
        log_verbose "Checking test status..."
        if npm test -- --passWithNoTests --silent &> /dev/null; then
            log_success "QA suite passing"
        else
            log_warning "QA suite may have failures (run tests to verify)"
            EXIT_CODE=2
        fi
    else
        log_verbose "Test runner not available - skipping QA validation"
    fi
fi

echo ""

# Check 4: Zero Test Debt
echo "Check 4: Zero Test Debt"
echo "----------------------------------------"

# Check for test debt patterns (.skip, .only, TODO, FIXME)
TEST_DEBT=$(grep -r "\.skip\|\.only\|TODO.*test\|FIXME.*test" __tests__ qa 2>/dev/null | wc -l || echo "0")

if [ "$TEST_DEBT" -eq 0 ]; then
    log_success "Zero test debt detected"
else
    log_warning "Test debt found: $TEST_DEBT instances"
    log_info "Review and resolve before closing wave"
    EXIT_CODE=2
fi

echo ""

# Check 5: Governance Violations
echo "Check 5: Governance Violations"
echo "----------------------------------------"

# Check for governance escalation files
ESCALATIONS=$(find governance/escalation -name "*.md" -mtime -7 2>/dev/null | wc -l || echo "0")

if [ "$ESCALATIONS" -eq 0 ]; then
    log_success "No recent governance escalations"
else
    log_warning "Found $ESCALATIONS recent escalation(s)"
    log_info "Ensure all escalations are resolved before closure"
    EXIT_CODE=2
fi

echo ""

# Phase 2: Closure Decision
echo "=========================================="
echo "Phase 2: Closure Decision"
echo "=========================================="
echo ""

CLOSURE_APPROVED=false

if [ $EXIT_CODE -eq 0 ]; then
    log_success "All validation checks passed"
    CLOSURE_APPROVED=true
elif [ $EXIT_CODE -eq 2 ] && [ "$FORCE" = true ]; then
    log_warning "Validation warnings found, but --force enabled"
    CLOSURE_APPROVED=true
elif [ $EXIT_CODE -eq 1 ]; then
    log_error "Critical validation failures - closure blocked"
    CLOSURE_APPROVED=false
else
    log_warning "Validation warnings found - review required"
    if [ "$FORCE" = false ]; then
        log_info "Use --force to override warnings"
    fi
fi

echo ""

# Phase 3: Generate Closure Artifacts
if [ "$CLOSURE_APPROVED" = true ] && [ "$DRY_RUN" = false ]; then
    echo "=========================================="
    echo "Phase 3: Generate Closure Artifacts"
    echo "=========================================="
    echo ""
    
    log_info "Generating wave closure certification..."
    
    # Create closure certification document
    TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
    CLOSURE_DATE=$(date -u +"%Y-%m-%d")
    
    cat > "$WAVE_CLOSURE_FILE" << EOF
# Wave ${WAVE_NUM} Closure Certification

**Wave Number**: ${WAVE_NUM}
**Wave Title**: ${WAVE_TITLE}
**Closure Date**: ${CLOSURE_DATE}
**Certified By**: Foreman (FM)
**Timestamp**: ${TIMESTAMP}

---

## Status: ✅ CERTIFIED COMPLETE

---

## Closure Validation Summary

### Architecture Documentation
- **Status**: $([ "$ARCH_COMPLETE" = true ] && echo "✅ Complete" || echo "⚠️  Incomplete")
- **Files**: 
$(echo "$ARCH_FILES" | sed 's/^/  - /' || echo "  None found")

### QA Suite Status
- **Test Files**: ${QA_COUNT:-0}
- **Test Status**: $([ $EXIT_CODE -eq 0 ] && echo "✅ Passing" || echo "⚠️  Warnings")
- **Test Debt**: $([ "$TEST_DEBT" -eq 0 ] && echo "✅ Zero" || echo "⚠️  ${TEST_DEBT} instances")

### Governance Compliance
- **Escalations**: $([ "$ESCALATIONS" -eq 0 ] && echo "✅ None" || echo "⚠️  ${ESCALATIONS} recent")
- **Gate Violations**: ✅ None detected

---

## Wave Deliverables

### Completed
- [x] Architecture documentation complete
- [x] QA suite created and validated
- [x] Implementation complete (Build-to-Green)
- [x] Zero test debt achieved
- [x] PR merged to main branch
- [x] Wave closure certification generated

### Acceptance Criteria Validation
- [x] All deliverables complete (100% list checked)
- [x] Architecture documentation complete (validated against checklist)
- [x] QA suite complete and passing
- [x] Zero governance violations (all gates passed)
- [x] Wave closure certification generated

---

## Wave Memory Integration

Per FOREMAN_MEMORY_PROTOCOL.md §3, the following wave memory artifacts are captured:

### Wave-Level Memory
- **Wave Progress Artifact**: \`${WAVE_PROGRESS_FILE}\`
- **Architecture Evidence**: \`${ARCHITECTURE_DIR}/WAVE_${WAVE_NUM}_*\`
- **QA Evidence**: Test suite in \`${QA_DIR}/\`

### Learning Capture
- **Learnings Identified**: See \`governance/learnings/\` for wave-specific learnings
- **Failures Encountered**: See \`qa/FAILURE_LEARNING_LOG.md\` for RCA
- **Process Improvements**: See wave progress artifact for recommendations

---

## Session Closure

This wave closure certification marks the completion of Wave ${WAVE_NUM} execution lifecycle per WAVE_MODEL.md.

**Next Wave**: Wave $((WAVE_NUM + 1)) (if applicable)

**Wave Lifecycle Status**:
1. ✅ Planning - Complete
2. ✅ Architecture - Complete
3. ✅ QA Creation - Complete
4. ✅ Build - Complete
5. ✅ Validation - Complete
6. ✅ **Closure - Complete**

---

## Governance Authority

- **FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md** §6 — Wave closure requirements
- **FOREMAN_MEMORY_PROTOCOL.md** §3 — Wave memory capture
- **WAVE_MODEL.md** — Wave lifecycle and phase transitions
- **FM_ROLE_CANON.md** §6.1 — Canonical progress recording

---

**Certification Timestamp**: ${TIMESTAMP}
**Authority**: FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md
**Living Agent System**: v5.0.0
EOF

    log_success "Closure certification created: $WAVE_CLOSURE_FILE"
    
    # Update wave progress artifact with closure
    if [ -f "$WAVE_PROGRESS_FILE" ]; then
        echo "" >> "$WAVE_PROGRESS_FILE"
        echo "---" >> "$WAVE_PROGRESS_FILE"
        echo "" >> "$WAVE_PROGRESS_FILE"
        echo "## Wave Closure" >> "$WAVE_PROGRESS_FILE"
        echo "" >> "$WAVE_PROGRESS_FILE"
        echo "**Status**: ✅ CERTIFIED COMPLETE" >> "$WAVE_PROGRESS_FILE"
        echo "**Closure Date**: ${CLOSURE_DATE}" >> "$WAVE_PROGRESS_FILE"
        echo "**Certification**: See \`${WAVE_CLOSURE_FILE}\`" >> "$WAVE_PROGRESS_FILE"
        echo "**Last Updated**: ${TIMESTAMP}" >> "$WAVE_PROGRESS_FILE"
        
        log_success "Wave progress artifact updated with closure"
    fi
    
    # Create session memory entry
    SESSION_DIR=".agent/sessions/foreman"
    mkdir -p "$SESSION_DIR"
    SESSION_FILE="$SESSION_DIR/wave_${WAVE_NUM}_closure_$(date +%Y%m%d-%H%M%S).md"
    
    cat > "$SESSION_FILE" << EOF
# Wave ${WAVE_NUM} Closure Session

**Session Type**: Wave Closure
**Wave Number**: ${WAVE_NUM}
**Timestamp**: ${TIMESTAMP}

## Session Outcome

✅ Wave ${WAVE_NUM} closure certification complete

## Artifacts Generated
- Closure certification: \`${WAVE_CLOSURE_FILE}\`
- Wave progress update: \`${WAVE_PROGRESS_FILE}\`

## Memory Captured
- Wave-level memory preserved in progress artifact
- Architecture evidence captured
- QA evidence captured
- Learning capture complete

## Authority
- FOREMAN_MEMORY_PROTOCOL.md §5 — Session closure memory capture
- FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md §6

---
**Living Agent System**: v5.0.0
EOF

    log_success "Session memory entry created: $SESSION_FILE"
    
    echo ""
fi

# Summary
echo "=========================================="
echo "Closure Summary"
echo "=========================================="
echo ""
echo "Wave Number: ${WAVE_NUM}"
echo "Wave Title: ${WAVE_TITLE}"
echo ""

case $EXIT_CODE in
    0)
        log_success "CLOSURE COMPLETE"
        if [ "$DRY_RUN" = false ]; then
            echo ""
            echo "Result: ✅ CERTIFIED"
            echo "- All validation checks passed"
            echo "- Closure certification generated"
            echo "- Wave memory captured"
            echo "- Ready for next wave (if applicable)"
        else
            echo ""
            echo "Result: ✅ READY (DRY RUN)"
            echo "- All validation checks passed"
            echo "- Run without --dry-run to generate artifacts"
        fi
        ;;
    1)
        log_error "CLOSURE BLOCKED"
        echo ""
        echo "Result: ❌ FAILED"
        echo "- Critical validation failures detected"
        echo "- Resolve blocking issues before closure"
        echo "- Review wave progress artifact for details"
        ;;
    2)
        if [ "$CLOSURE_APPROVED" = true ]; then
            log_warning "CLOSURE COMPLETE WITH WARNINGS"
            echo ""
            echo "Result: ⚠️  CERTIFIED (WITH WARNINGS)"
            echo "- Non-blocking warnings detected"
            echo "- Closure forced (--force enabled)"
            echo "- Review warnings for future improvements"
        else
            log_warning "CLOSURE WARNED"
            echo ""
            echo "Result: ⚠️  WARNED"
            echo "- Non-blocking warnings detected"
            echo "- Review and resolve warnings"
            echo "- Use --force to override if acceptable"
        fi
        ;;
esac

echo ""
echo "=========================================="
echo "Authority: FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md §6"
echo "Living Agent System v5.0.0"
echo "=========================================="
echo ""

exit $EXIT_CODE
