#!/bin/bash
# validate_baseline.sh
# Agent Baseline Validation Script
# Authority: AGENT_BASELINE_MANAGEMENT_PROTOCOL.md
# Version: 1.0.0
# Purpose: Validate agent contracts against canonical baselines per Living Agent System v5.0.0

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
Usage: $0 [OPTIONS] <agent-type>

Validate agent contract against canonical baseline per AGENT_BASELINE_MANAGEMENT_PROTOCOL.md

Arguments:
    agent-type          Agent type to validate (e.g., 'api-builder', 'governance-liaison')

Options:
    -h, --help         Show this help message
    -v, --verbose      Enable verbose output
    -a, --auto-fix     Attempt auto-remediation for minor drift (Level 1)
    -r, --repo-root    Repository root path (default: current directory)

Examples:
    $0 api-builder
    $0 --auto-fix governance-liaison
    $0 --verbose --repo-root /path/to/repo ForemanApp-agent

Exit Codes:
    0   Validation PASSED
    1   Validation FAILED (critical drift - escalation required)
    2   Validation WARNED (minor drift detected)
    3   Invalid usage or missing files

Authority: AGENT_BASELINE_MANAGEMENT_PROTOCOL.md §5
EOF
}

# Initialize variables
VERBOSE=false
AUTO_FIX=false
REPO_ROOT=$(pwd)
AGENT_TYPE=""
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
        -a|--auto-fix)
            AUTO_FIX=true
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
            AGENT_TYPE="$1"
            shift
            ;;
    esac
done

# Validate required arguments
if [ -z "$AGENT_TYPE" ]; then
    echo -e "${RED}Error: agent-type is required${NC}" >&2
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
echo "Agent Baseline Validation v1.0.0"
echo "=========================================="
echo ""
log_info "Validating agent: ${AGENT_TYPE}"
log_info "Repository: ${REPO_ROOT}"
log_info "Auto-fix: ${AUTO_FIX}"
echo ""

# Determine file paths
INSTANCE_FILE=".github/agents/${AGENT_TYPE}.md"
BASELINE_FILE="governance/agents/${AGENT_TYPE}.md"

# Check 1: File Existence
echo "Check 1: File Existence"
echo "----------------------------------------"

if [ ! -f "$INSTANCE_FILE" ]; then
    log_error "Instance file not found: $INSTANCE_FILE"
    exit 3
fi
log_success "Instance file exists: $INSTANCE_FILE"

# Note: In consumer repos, baseline may not exist locally
if [ ! -f "$BASELINE_FILE" ]; then
    log_warning "Baseline file not found locally (expected in consumer repos)"
    log_info "Using instance file as reference for validation"
    BASELINE_FILE="$INSTANCE_FILE"
    BASELINE_MODE="instance"
else
    log_success "Baseline file exists: $BASELINE_FILE"
    BASELINE_MODE="canonical"
fi

echo ""

# Check 2: Version Currency
echo "Check 2: Version Currency"
echo "----------------------------------------"

extract_version() {
    local file="$1"
    # Try different version patterns
    grep -E "^\*\*Version\*\*:|^Version:" "$file" | head -1 | sed -E 's/.*[Vv]ersion[^:]*: ?([0-9]+\.[0-9]+\.[0-9]+).*/\1/'
}

INSTANCE_VERSION=$(extract_version "$INSTANCE_FILE")
BASELINE_VERSION=$(extract_version "$BASELINE_FILE")

log_verbose "Instance version: ${INSTANCE_VERSION:-not found}"
log_verbose "Baseline version: ${BASELINE_VERSION:-not found}"

if [ -z "$INSTANCE_VERSION" ]; then
    log_warning "Instance version not found in file"
    EXIT_CODE=2
elif [ "$BASELINE_MODE" = "canonical" ]; then
    if [ -z "$BASELINE_VERSION" ]; then
        log_warning "Baseline version not found in file"
        EXIT_CODE=2
    elif [ "$INSTANCE_VERSION" != "$BASELINE_VERSION" ]; then
        log_warning "Version mismatch: Instance v${INSTANCE_VERSION}, Baseline v${BASELINE_VERSION}"
        EXIT_CODE=2
        
        if [ "$AUTO_FIX" = true ]; then
            log_info "Auto-fix enabled: Attempting remediation..."
            cp "$BASELINE_FILE" "$INSTANCE_FILE"
            log_success "Instance updated from baseline"
            INSTANCE_VERSION="$BASELINE_VERSION"
            EXIT_CODE=0
        else
            log_info "Run with --auto-fix to attempt auto-remediation"
        fi
    else
        log_success "Version match: v${INSTANCE_VERSION}"
    fi
else
    log_success "Instance version: v${INSTANCE_VERSION}"
fi

echo ""

# Check 3: Content Integrity (LOCKED Sections)
echo "Check 3: Content Integrity"
echo "----------------------------------------"

# Extract and compare LOCKED sections
# Per AGENT_CONTRACT_PROTECTION_PROTOCOL.md, LOCKED sections should be identical

if [ "$BASELINE_MODE" = "canonical" ]; then
    # Look for LOCKED section markers
    LOCKED_SECTIONS=$(grep -n "^## .*<!-- LOCKED -->" "$BASELINE_FILE" | cut -d: -f2 || echo "")
    
    if [ -n "$LOCKED_SECTIONS" ]; then
        log_verbose "Found LOCKED sections in baseline"
        
        # For each LOCKED section, compare with instance
        LOCKED_MISMATCH=false
        while IFS= read -r section; do
            if grep -q "$section" "$INSTANCE_FILE"; then
                log_verbose "LOCKED section present: $section"
            else
                log_error "LOCKED section missing or modified: $section"
                LOCKED_MISMATCH=true
                EXIT_CODE=1
            fi
        done <<< "$LOCKED_SECTIONS"
        
        if [ "$LOCKED_MISMATCH" = false ]; then
            log_success "LOCKED sections validated"
        else
            log_error "CRITICAL DRIFT: LOCKED sections differ - CS2 escalation required"
            EXIT_CODE=1
        fi
    else
        log_info "No LOCKED sections found (may not be required for this agent type)"
    fi
else
    log_info "Baseline mode: instance - skipping LOCKED section validation"
fi

echo ""

# Check 4: Governance References
echo "Check 4: Governance References"
echo "----------------------------------------"

# Extract referenced governance files
REFERENCED_FILES=$(grep -oE 'governance/canon/[A-Za-z0-9_-]+\.md' "$INSTANCE_FILE" | sort -u || echo "")

if [ -n "$REFERENCED_FILES" ]; then
    MISSING_REFS=false
    MISSING_COUNT=0
    
    while IFS= read -r ref_file; do
        if [ -f "$ref_file" ]; then
            log_verbose "Reference exists: $ref_file"
        else
            log_warning "Missing reference: $ref_file"
            MISSING_REFS=true
            MISSING_COUNT=$((MISSING_COUNT + 1))
        fi
    done <<< "$REFERENCED_FILES"
    
    if [ "$MISSING_REFS" = false ]; then
        log_success "All governance references exist"
    else
        log_warning "Missing $MISSING_COUNT governance reference(s) - may need layer-down"
        EXIT_CODE=2
    fi
else
    log_info "No governance references found"
fi

echo ""

# Check 5: Mandatory Sections
echo "Check 5: Mandatory Sections"
echo "----------------------------------------"

# Per .agent.schema.md, validate mandatory sections
# Note: Agent contracts may use different section naming conventions
# Check for key concepts rather than exact section names
MANDATORY_CONCEPTS=(
    "Responsibilities|Mission|Core Responsibilities"
    "Constraints|Prohibitions|Limitations"
    "Authority|Authority References"
)

MISSING_SECTIONS=false
for concept_pattern in "${MANDATORY_CONCEPTS[@]}"; do
    concept_name=$(echo "$concept_pattern" | cut -d'|' -f1)
    if grep -qE "^## .*(${concept_pattern})" "$INSTANCE_FILE"; then
        log_verbose "Mandatory concept present: $concept_name"
    else
        log_warning "Concept not clearly marked: $concept_name (may be embedded)"
        # Don't fail on this - just warn
    fi
done

# Check for minimum content
LINE_COUNT=$(wc -l < "$INSTANCE_FILE")
if [ "$LINE_COUNT" -lt 50 ]; then
    log_error "Agent file too short ($LINE_COUNT lines) - may be incomplete"
    MISSING_SECTIONS=true
    EXIT_CODE=1
else
    log_verbose "Agent file has $LINE_COUNT lines"
fi

if [ "$MISSING_SECTIONS" = false ]; then
    log_success "Structural validation passed"
else
    log_error "CRITICAL DRIFT: Agent file appears incomplete - CS2 escalation required"
    EXIT_CODE=1
fi

echo ""

# Summary
echo "=========================================="
echo "Validation Summary"
echo "=========================================="
echo ""
echo "Agent Type: ${AGENT_TYPE}"
echo "Instance Version: ${INSTANCE_VERSION:-unknown}"
echo "Baseline Version: ${BASELINE_VERSION:-N/A}"
echo "Baseline Mode: ${BASELINE_MODE}"
echo ""

case $EXIT_CODE in
    0)
        log_success "VALIDATION PASSED - Agent may proceed"
        echo ""
        echo "Result: ✅ PASS"
        echo "- All checks passed"
        echo "- Baseline and instance are synchronized"
        echo "- No governance gaps detected"
        ;;
    1)
        log_error "VALIDATION FAILED - CRITICAL DRIFT DETECTED"
        echo ""
        echo "Result: ❌ FAIL"
        echo "- Critical drift detected (LOCKED sections or mandatory sections)"
        echo "- Agent MUST NOT PROCEED"
        echo "- CS2 escalation required"
        echo ""
        echo "Action Required:"
        echo "1. Create escalation file in governance/escalation/"
        echo "2. Document drift details"
        echo "3. Await CS2 resolution"
        ;;
    2)
        log_warning "VALIDATION WARNED - MINOR DRIFT DETECTED"
        echo ""
        echo "Result: ⚠️  WARN"
        echo "- Minor drift detected (version mismatch or missing references)"
        if [ "$AUTO_FIX" = true ]; then
            echo "- Auto-remediation attempted"
        else
            echo "- Auto-remediation not attempted (use --auto-fix)"
        fi
        echo "- Agent may proceed with caution"
        ;;
    *)
        log_error "Unknown validation state"
        EXIT_CODE=1
        ;;
esac

echo ""
echo "=========================================="
echo "Authority: AGENT_BASELINE_MANAGEMENT_PROTOCOL.md §5"
echo "Living Agent System v5.0.0"
echo "=========================================="
echo ""

exit $EXIT_CODE
