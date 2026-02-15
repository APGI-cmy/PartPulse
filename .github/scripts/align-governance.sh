#!/bin/bash
# Governance Alignment Script
# Authority: CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md
# Purpose: Verify governance alignment and create PR on drift detection
# Usage: ./align-governance.sh [canonical_commit] [inventory_version]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
GOVERNANCE_DIR="$REPO_ROOT/.agent-admin/governance"
RIPPLE_LOG="$GOVERNANCE_DIR/ripple-log.json"
SYNC_STATE="$GOVERNANCE_DIR/sync_state.json"
DRIFT_DIR="$GOVERNANCE_DIR/drift"

# Canonical governance repository
CANONICAL_REPO="APGI-cmy/maturion-foreman-governance"
CANONICAL_BRANCH="main"

# Arguments (optional)
CANONICAL_COMMIT="${1:-}"
INVENTORY_VERSION="${2:-}"

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  GOVERNANCE ALIGNMENT CHECK"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Ensure directories exist
mkdir -p "$GOVERNANCE_DIR"
mkdir -p "$DRIFT_DIR"

# Initialize sync state if missing
if [ ! -f "$SYNC_STATE" ]; then
  echo "{\"last_sync\":null,\"canonical_commit\":null,\"inventory_version\":null,\"alignment_status\":\"unknown\",\"drift_detected\":false,\"last_check\":null,\"schema_version\":\"1.0.0\"}" > "$SYNC_STATE"
fi

# Initialize ripple log if missing
if [ ! -f "$RIPPLE_LOG" ]; then
  echo "{\"ripple_events\":[],\"last_updated\":null,\"schema_version\":\"1.0.0\"}" > "$RIPPLE_LOG"
fi

# Read current sync state
CURRENT_COMMIT=$(jq -r '.canonical_commit // "null"' "$SYNC_STATE")
CURRENT_VERSION=$(jq -r '.inventory_version // "null"' "$SYNC_STATE")
LAST_CHECK=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "Current State:"
echo "  Canonical Commit: $CURRENT_COMMIT"
echo "  Inventory Version: $CURRENT_VERSION"
echo "  Last Check: $LAST_CHECK"
echo ""

# Fetch latest canonical governance
echo "Fetching canonical governance from $CANONICAL_REPO..."
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

cd "$TEMP_DIR"
git clone --depth 1 --branch "$CANONICAL_BRANCH" "https://github.com/$CANONICAL_REPO.git" canonical 2>&1 | head -5
cd canonical

LATEST_COMMIT=$(git rev-parse HEAD)
echo "Latest Canonical Commit: $LATEST_COMMIT"

# Read canonical inventory version if available
if [ -f "governance/CANON_INVENTORY.json" ]; then
  LATEST_VERSION=$(jq -r '.version // "unknown"' governance/CANON_INVENTORY.json)
  echo "Latest Inventory Version: $LATEST_VERSION"
else
  LATEST_VERSION="unknown"
  echo "⚠️  CANON_INVENTORY.json not found in canonical repo"
fi

echo ""

# Check for drift
DRIFT_DETECTED=false
DRIFT_REASONS=()

if [ "$CANONICAL_COMMIT" != "" ] && [ "$CANONICAL_COMMIT" != "null" ]; then
  # Use provided commit (from repository_dispatch)
  echo "Using provided canonical commit: $CANONICAL_COMMIT"
  TARGET_COMMIT="$CANONICAL_COMMIT"
  TARGET_VERSION="$INVENTORY_VERSION"
  
  if [ "$CURRENT_COMMIT" != "$TARGET_COMMIT" ]; then
    DRIFT_DETECTED=true
    DRIFT_REASONS+=("Canonical commit mismatch: $CURRENT_COMMIT -> $TARGET_COMMIT")
  fi
else
  # Use fetched latest commit (scheduled fallback)
  TARGET_COMMIT="$LATEST_COMMIT"
  TARGET_VERSION="$LATEST_VERSION"
  
  if [ "$CURRENT_COMMIT" != "$LATEST_COMMIT" ]; then
    DRIFT_DETECTED=true
    DRIFT_REASONS+=("Canonical commit behind: $CURRENT_COMMIT -> $LATEST_COMMIT")
  fi
fi

if [ "$CURRENT_VERSION" != "$TARGET_VERSION" ] && [ "$TARGET_VERSION" != "unknown" ] && [ "$TARGET_VERSION" != "null" ]; then
  DRIFT_DETECTED=true
  DRIFT_REASONS+=("Inventory version mismatch: $CURRENT_VERSION -> $TARGET_VERSION")
fi

# Report drift status
if [ "$DRIFT_DETECTED" = true ]; then
  echo "🔴 DRIFT DETECTED"
  echo ""
  echo "Drift Reasons:"
  for REASON in "${DRIFT_REASONS[@]}"; do
    echo "  - $REASON"
  done
  echo ""
  
  # Update sync state with drift
  jq --arg commit "$TARGET_COMMIT" \
     --arg version "$TARGET_VERSION" \
     --arg check "$LAST_CHECK" \
     '.drift_detected = true | .alignment_status = "drift" | .last_check = $check | .canonical_commit = $commit | .inventory_version = $version' \
     "$SYNC_STATE" > "$SYNC_STATE.tmp"
  mv "$SYNC_STATE.tmp" "$SYNC_STATE"
  
  # Log drift to file
  DRIFT_LOG="$DRIFT_DIR/drift-$(date +%Y%m%d-%H%M%S).json"
  echo "{\"timestamp\":\"$LAST_CHECK\",\"current_commit\":\"$CURRENT_COMMIT\",\"target_commit\":\"$TARGET_COMMIT\",\"current_version\":\"$CURRENT_VERSION\",\"target_version\":\"$TARGET_VERSION\",\"reasons\":$(jq -n --argjson reasons "$(printf '%s\n' "${DRIFT_REASONS[@]}" | jq -R . | jq -s .)" '$reasons')}" > "$DRIFT_LOG"
  
  echo "📄 Drift logged to: $(basename $DRIFT_LOG)"
  echo ""
  
  # Return to repo root before PR creation
  cd "$REPO_ROOT"
  
  # Create PR if running in CI with bot token
  if [ -n "${GITHUB_ACTIONS:-}" ] && [ -n "${MATURION_BOT_TOKEN:-}" ]; then
    echo "🔧 Creating alignment PR..."
    
    # Use stable branch name (prevents duplicate PRs)
    BRANCH_NAME="governance-alignment-auto"
    
    # Check for existing open governance alignment PRs
    echo "Checking for existing governance alignment PRs..."
    EXISTING_PRS=$(gh pr list --state open --label "governance-ripple-required" --json number,headRefName | jq -r '.[] | select(.headRefName == "governance-alignment-auto") | .number')
    
    if [ -n "$EXISTING_PRS" ]; then
      echo "⚠️  Existing governance alignment PR found: #$EXISTING_PRS"
      echo "Updating existing PR instead of creating duplicate..."
      
      # Switch to existing branch and update
      git fetch origin "$BRANCH_NAME" || true
      git checkout "$BRANCH_NAME" 2>/dev/null || git checkout -b "$BRANCH_NAME"
      git merge --strategy-option=theirs origin/main -m "Merge latest main" || true
    else
      echo "No existing PR found - creating new alignment PR"
      
      # Delete local branch if exists
      git branch -D "$BRANCH_NAME" 2>/dev/null || true
      
      # Delete remote branch if exists
      git push origin --delete "$BRANCH_NAME" 2>/dev/null || true
      
      # Create new branch
      git checkout -b "$BRANCH_NAME"
    fi
    
    git config --global user.email "bot@maturion.com"
    git config --global user.name "Maturion Bot"
    
    git add "$SYNC_STATE" "$DRIFT_LOG"
    git commit -m "governance: drift detected - alignment required

Canonical commit: $TARGET_COMMIT
Inventory version: $TARGET_VERSION

Drift reasons:
$(printf '%s\n' "${DRIFT_REASONS[@]}")

Authority: CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md" || echo "No changes to commit"
    
    # Force-push to prevent race conditions when concurrent governance events occur
    # This ensures the branch can be updated even if multiple ripple events trigger simultaneously
    # Reference: R_Roster PR #122, Issue #299
    git push -u origin "$BRANCH_NAME" --force
    
    if [ -z "$EXISTING_PRS" ]; then
      # Create new PR with auto-merge enabled
      echo "Creating new PR with auto-merge enabled..."
      gh pr create \
        --title "governance: automatic alignment required" \
        --body "## Governance Drift Detected

**Canonical Commit**: \`$TARGET_COMMIT\`  
**Inventory Version**: \`$TARGET_VERSION\`

### Drift Reasons
$(printf '- %s\n' "${DRIFT_REASONS[@]}")

### Required Actions
1. Review drift log: \`.agent-admin/governance/drift/\`
2. Execute layer-down protocol per governance-liaison contract
3. Update local governance artifacts to match canonical
4. Verify SHA256 hashes per REQ-CM-001
5. Update sync state on completion

**Authority**: CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md § 5
**Assignee**: @governance-liaison

---

🤖 **Auto-merge enabled** - This PR will merge automatically once all checks pass." \
        --label "governance-ripple-required" \
        --label "governance-only" \
        --label "governance" \
        --label "automated" \
        --label "agent:liaison"
      
      # Enable auto-merge on the created PR
      PR_NUMBER=$(gh pr list --head "$BRANCH_NAME" --json number -q '.[0].number')
      if [ -n "$PR_NUMBER" ]; then
        echo "Enabling auto-merge on PR #$PR_NUMBER..."
        gh pr merge "$PR_NUMBER" --auto --squash || echo "⚠️  Auto-merge enablement failed - may require manual enablement"
      fi
      
      echo "✅ Alignment PR created with auto-merge enabled"
    else
      echo "✅ Existing alignment PR updated"
    fi
  else
    echo "ℹ️  Not running in CI or MATURION_BOT_TOKEN not set - PR creation skipped"
  fi
  
  exit 1  # Exit with error to signal drift
else
  echo "✅ ALIGNMENT VERIFIED"
  echo ""
  echo "No drift detected - governance is aligned"
  
  # Update sync state
  jq --arg commit "$TARGET_COMMIT" \
     --arg version "$TARGET_VERSION" \
     --arg check "$LAST_CHECK" \
     '.drift_detected = false | .alignment_status = "aligned" | .last_check = $check | .canonical_commit = $commit | .inventory_version = $version' \
     "$SYNC_STATE" > "$SYNC_STATE.tmp"
  mv "$SYNC_STATE.tmp" "$SYNC_STATE"
  
  exit 0
fi
