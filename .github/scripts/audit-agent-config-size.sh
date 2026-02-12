#!/bin/bash
# Agent Config Size Audit Script
# Purpose: Verify all agent config files are within the 30,000 character limit
# Authority: AGENT_STRUCTURE_BEST_PRACTICES.md
# Version: 1.0.0

set -e

AGENTS_DIR=".github/agents"
MAX_SIZE=30000
WARN_SIZE=27000  # Warning threshold (90% of max)

echo "================================================"
echo "Agent Config Size Audit"
echo "Authority: AGENT_STRUCTURE_BEST_PRACTICES.md"
echo "Max Size: $MAX_SIZE characters"
echo "Warning Threshold: $WARN_SIZE characters (90%)"
echo "================================================"
echo ""

# Check if agents directory exists
if [ ! -d "$AGENTS_DIR" ]; then
    echo "❌ ERROR: $AGENTS_DIR directory not found"
    exit 1
fi

# Initialize counters
total_files=0
compliant_files=0
warning_files=0
failing_files=0

# Check each .md file in agents directory
for file in "$AGENTS_DIR"/*.md; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        size=$(wc -c < "$file")
        total_files=$((total_files + 1))
        
        # Calculate percentage
        percentage=$((size * 100 / MAX_SIZE))
        
        # Determine status
        if [ "$size" -gt "$MAX_SIZE" ]; then
            # FAILING - Over limit
            echo "❌ FAIL: $filename"
            echo "   Size: $size characters ($percentage% of limit)"
            echo "   Over by: $((size - MAX_SIZE)) characters"
            echo ""
            failing_files=$((failing_files + 1))
        elif [ "$size" -gt "$WARN_SIZE" ]; then
            # WARNING - Approaching limit
            echo "⚠️  WARN: $filename"
            echo "   Size: $size characters ($percentage% of limit)"
            echo "   Buffer: $((MAX_SIZE - size)) characters remaining"
            echo ""
            warning_files=$((warning_files + 1))
            compliant_files=$((compliant_files + 1))
        else
            # PASS - Well within limit
            echo "✅ PASS: $filename"
            echo "   Size: $size characters ($percentage% of limit)"
            echo ""
            compliant_files=$((compliant_files + 1))
        fi
    fi
done

# Summary
echo "================================================"
echo "Summary"
echo "================================================"
echo "Total Files: $total_files"
echo "Compliant (≤30K): $compliant_files"
echo "Warnings (27K-30K): $warning_files"
echo "Failing (>30K): $failing_files"
echo ""

if [ "$failing_files" -gt 0 ]; then
    echo "❌ AUDIT FAILED: $failing_files file(s) exceed character limit"
    echo ""
    echo "Action Required:"
    echo "1. Refactor failing files using reference-based protection model"
    echo "2. See: docs/governance/AGENT_STRUCTURE_BEST_PRACTICES.md"
    echo "3. Aim for <25K characters (leaves 5K buffer)"
    exit 1
elif [ "$warning_files" -gt 0 ]; then
    echo "⚠️  AUDIT WARNING: $warning_files file(s) approaching limit"
    echo ""
    echo "Recommendation:"
    echo "1. Proactively refactor files in warning zone"
    echo "2. Target <25K characters for safety buffer"
    echo "3. See: docs/governance/AGENT_STRUCTURE_BEST_PRACTICES.md"
    exit 0
else
    echo "✅ AUDIT PASSED: All files within character limit"
    exit 0
fi
