#!/bin/bash
# Script to create required GitHub labels for Defect Resolution Process
# 
# Purpose: Create 11 required GitHub labels as defined in:
#   - /docs/github-labels-configuration.md
#   - Defect Resolution & Maintenance Canon (PR #136)
#
# Prerequisites:
#   - GitHub CLI (gh) installed
#   - Authenticated with appropriate repository permissions
#   - Run from repository root directory
#
# Usage:
#   bash scripts/create-defect-labels.sh
#
# Reference: https://github.com/APGI-cmy/PartPulse/labels

set -e  # Exit on error
set -u  # Exit on undefined variable

echo "========================================="
echo "Creating Defect Resolution Labels"
echo "Repository: APGI-cmy/PartPulse"
echo "========================================="
echo ""

# Classification Labels (3)
echo "Creating Classification Labels..."
gh label create "defect-bug" \
  --color "d73a4a" \
  --description "Functional defect - behavior does not match specification" \
  --force || { echo "  ⚠️  Failed to create defect-bug"; exit 1; }

gh label create "defect-feature" \
  --color "0075ca" \
  --description "Missing capability - required functionality not implemented" \
  --force || { echo "  ⚠️  Failed to create defect-feature"; exit 1; }

gh label create "defect-tech-debt" \
  --color "fbca04" \
  --description "Quality/architectural issue - creates maintenance burden" \
  --force || { echo "  ⚠️  Failed to create defect-tech-debt"; exit 1; }

echo "✅ Classification labels created"
echo ""

# Severity Labels (4)
echo "Creating Severity Labels..."
gh label create "severity-critical" \
  --color "b60205" \
  --description "Production down, data loss, security breach, blocking users" \
  --force || { echo "  ⚠️  Failed to create severity-critical"; exit 1; }

gh label create "severity-high" \
  --color "d93f0b" \
  --description "Major functionality broken, significant user impact" \
  --force || { echo "  ⚠️  Failed to create severity-high"; exit 1; }

gh label create "severity-medium" \
  --color "fbca04" \
  --description "Functionality degraded, moderate user impact, workaround available" \
  --force || { echo "  ⚠️  Failed to create severity-medium"; exit 1; }

gh label create "severity-low" \
  --color "0e8a16" \
  --description "Minor issue, cosmetic, limited impact" \
  --force || { echo "  ⚠️  Failed to create severity-low"; exit 1; }

echo "✅ Severity labels created"
echo ""

# Status Labels (3)
echo "Creating Status Labels..."
gh label create "fix-in-progress" \
  --color "1d76db" \
  --description "Fix work underway" \
  --force || { echo "  ⚠️  Failed to create fix-in-progress"; exit 1; }

gh label create "fix-deployed" \
  --color "0e8a16" \
  --description "Fix deployed to production" \
  --force || { echo "  ⚠️  Failed to create fix-deployed"; exit 1; }

gh label create "fix-verified" \
  --color "006b75" \
  --description "Defect confirmed resolved in production" \
  --force || { echo "  ⚠️  Failed to create fix-verified"; exit 1; }

echo "✅ Status labels created"
echo ""

# Special Label (1)
echo "Creating Special Labels..."
gh label create "ripple" \
  --color "e99695" \
  --description "Requires cross-repo awareness" \
  --force || { echo "  ⚠️  Failed to create ripple"; exit 1; }

echo "✅ Special labels created"
echo ""

echo "========================================="
echo "✅ All 11 labels created successfully!"
echo "========================================="
echo ""
echo "Verification:"
echo "  View labels: https://github.com/APGI-cmy/PartPulse/labels"
echo "  Or run: gh label list"
echo ""
echo "Next steps:"
echo "  1. Verify labels in GitHub UI (Settings → Labels)"
echo "  2. Test label application on a test issue"
echo "  3. Update issue with verification screenshot"
echo ""
