#!/bin/bash
# detect-agent-changes.sh
# Authority: GOVERNANCE_LIAISON_ROLE_SURVEY.md
# Purpose: Detect whether a set of changed files includes agent-protected files.
#          If agent files are changed the caller must create a DRAFT PR and
#          generate an escalation document for CS2 review.
#
# Usage:
#   detect-agent-changes.sh [--files "file1 file2 ..."]
#
#   When --files is omitted the script uses "git diff --name-only HEAD~1 HEAD"
#   to obtain the list of changed files.
#
# Exit codes:
#   0  No agent files detected in the diff
#   1  Agent files detected – DRAFT PR + CS2 escalation required

set -euo pipefail

# ---------------------------------------------------------------------------
# Agent-protected path patterns (prefix match on repo-relative paths)
# ---------------------------------------------------------------------------
AGENT_PATTERNS=(
  ".github/agents/"
  "governance/canon/"
  "governance/agent-contracts/"
  ".agent-admin/governance/"
  ".github/workflows/"
)

# ---------------------------------------------------------------------------
# Parse arguments
# ---------------------------------------------------------------------------
FILES_ARG=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --files)
      FILES_ARG="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 2
      ;;
  esac
done

# ---------------------------------------------------------------------------
# Obtain changed file list
# ---------------------------------------------------------------------------
if [[ -n "$FILES_ARG" ]]; then
  # Accept space- or newline-separated list; normalise to one file per line
  CHANGED_FILES=$(echo "$FILES_ARG" | tr ' ' '\n' | grep -v '^$')
else
  # 4b825dc842a05fb1 is Git's well-known empty-tree SHA, used as a base ref
  # for the very first commit in a repository (where HEAD~1 does not exist).
  CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD 2>/dev/null || git diff --name-only 4b825dc842a05fb1..HEAD 2>/dev/null || echo "")
fi

if [[ -z "$CHANGED_FILES" ]]; then
  echo "ℹ️  No changed files detected."
  echo "agent_files_changed=false"
  exit 0
fi

# ---------------------------------------------------------------------------
# Check each changed file against agent patterns
# ---------------------------------------------------------------------------
MATCHED_FILES=()
while IFS= read -r FILE; do
  for PATTERN in "${AGENT_PATTERNS[@]}"; do
    if [[ "$FILE" == "${PATTERN}"* ]]; then
      MATCHED_FILES+=("$FILE")
      break
    fi
  done
done <<< "$CHANGED_FILES"

# ---------------------------------------------------------------------------
# Output result
# ---------------------------------------------------------------------------
if [[ ${#MATCHED_FILES[@]} -gt 0 ]]; then
  echo "🔴 AGENT FILES DETECTED"
  echo ""
  echo "The following agent-protected files are included in this change:"
  for F in "${MATCHED_FILES[@]}"; do
    echo "  - $F"
  done
  echo ""
  echo "Action required:"
  echo "  1. PR MUST be created as DRAFT"
  echo "  2. Escalation document MUST be generated in .agent-workspace/governance-liaison/escalation-inbox/"
  echo "  3. Only CS2 may merge this PR"
  echo ""
  echo "agent_files_changed=true"
  exit 1
else
  echo "✅ No agent-protected files in changed set."
  echo ""
  echo "agent_files_changed=false"
  exit 0
fi
