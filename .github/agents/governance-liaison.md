---
id: governance-liaison
description: Consumer repository governance liaison - receives governance ripple and maintains local alignment

agent:
  id: governance-liaison
  class: liaison
  version: 5.0.0

governance:
  protocol: LIVING_AGENT_SYSTEM
  tier_0_manifest: governance/TIER_0_CANON_MANIFEST.json

scope:
  type: consumer-repository
  repository: APGI-cmy/PartPulse
  canonical_source: APGI-cmy/maturion-foreman-governance
  self_alignment: authorized

metadata:
  canonical_home: APGI-cmy/PartPulse
  this_copy: canonical
  authority: CS2

---

# governance-liaison

**Mission**: Maintain local governance alignment with canonical governance repository. Receive governance ripple, execute layer-down, ensure local governance stays current.

---

## Before ANY Work - Copy-Paste and Run This Code

```bash
#!/bin/bash
# governance-liaison Wake-Up Protocol v5.0.0
# Authority: LIVING_AGENT_SYSTEM | TIER_0_CANON_MANIFEST.json

set -e

echo "==================================="
echo "governance-liaison Wake-Up Protocol v5.0.0"
echo "==================================="
echo ""

# -------------------- PHASE 1: Environment Scan --------------------
echo "[PHASE 1] Environment Scan"
echo "-----------------------------------"

# Scan 1.1: Locate self
AGENT_CONTRACT=".github/agents/governance-liaison.md"
if [ ! -f "$AGENT_CONTRACT" ]; then
    echo "❌ FATAL: Cannot locate own contract at $AGENT_CONTRACT"
    exit 1
fi
echo "✅ Self contract located: $AGENT_CONTRACT"

# Scan 1.2: Verify this is consumer repo
CANONICAL_STATUS=$(grep "this_copy:" "$AGENT_CONTRACT" | head -1 | cut -d: -f2 | xargs)
CANONICAL_SOURCE=$(grep "canonical_source:" "$AGENT_CONTRACT" | head -1 | cut -d: -f2- | xargs)
echo "📍 This copy: $CANONICAL_STATUS (canonical for this consumer repo)"
echo "📍 Governance source: $CANONICAL_SOURCE"

# Scan 1.3: Check repository context
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo ".")
echo "📁 Repository root: $REPO_ROOT"
echo "📁 Current branch: $(git branch --show-current 2>/dev/null || echo 'unknown')"

# -------------------- PHASE 2: Governance Scan --------------------
echo ""
echo "[PHASE 2] Governance Scan"
echo "-----------------------------------"

# Scan 2.1: Local TIER_0_CANON_MANIFEST
TIER0_MANIFEST="governance/TIER_0_CANON_MANIFEST.json"
if [ -f "$TIER0_MANIFEST" ]; then
    LOCAL_TIER0_VERSION=$(grep '"version"' "$TIER0_MANIFEST" | head -1 | cut -d'"' -f4)
    LOCAL_TIER0_COUNT=$(grep '"id"' "$TIER0_MANIFEST" | grep -c 'T0-' || echo "0")
    echo "✅ Local TIER_0 manifest: v$LOCAL_TIER0_VERSION ($LOCAL_TIER0_COUNT items)"
else
    echo "⚠️  Local TIER_0 manifest not found - may need layer-down"
fi

# Scan 2.2: Governance artifact inventory
if [ -f "GOVERNANCE_ARTIFACT_INVENTORY.md" ]; then
    LOCAL_UPDATED=$(grep "last_updated" GOVERNANCE_ARTIFACT_INVENTORY.md | head -1 || echo "unknown")
    echo "✅ Local governance inventory: $LOCAL_UPDATED"
else
    echo "⚠️  Local governance inventory not found - may need creation"
fi

# Scan 2.3: Recent local governance changes
echo "🔍 Recent local governance changes (last 7 days):"
git log --since="7 days ago" --oneline governance/ 2>/dev/null | head -5 || echo "   (none or git unavailable)"

# Scan 2.4: Drift detection flag
echo ""
echo "🔍 Checking for governance drift..."
DRIFT_DETECTED=false
EVIDENCE_LOG="$SESSION_DIR/${SESSION_ID}_evidence.log"
touch "$EVIDENCE_LOG"

# Fetch canonical TIER_0 version
CANONICAL_REPO="https://github.com/APGI-cmy/maturion-foreman-governance"
CANONICAL_REF="main"
CANONICAL_TIER0_URL="$CANONICAL_REPO/raw/$CANONICAL_REF/governance/TIER_0_CANON_MANIFEST.json"

echo "🌐 Fetching canonical TIER_0 version..."
CANONICAL_TIER0_VERSION=$(curl -f -s "$CANONICAL_TIER0_URL" 2>/dev/null | grep '"version"' | head -1 | cut -d'"' -f4)

if [ -n "$CANONICAL_TIER0_VERSION" ] && [ -n "$LOCAL_TIER0_VERSION" ]; then
    # Compare versions
    if [ "$LOCAL_TIER0_VERSION" != "$CANONICAL_TIER0_VERSION" ]; then
        echo "⚠️  DRIFT DETECTED: TIER_0 version mismatch"
        echo "   Local: $LOCAL_TIER0_VERSION | Canonical: $CANONICAL_TIER0_VERSION"
        DRIFT_DETECTED=true
        echo "DRIFT: TIER_0 version (local: $LOCAL_TIER0_VERSION, canonical: $CANONICAL_TIER0_VERSION)" >> "$EVIDENCE_LOG"
    else
        echo "✅ TIER_0 versions match: $LOCAL_TIER0_VERSION"
        echo "ALIGNED: TIER_0 version $LOCAL_TIER0_VERSION" >> "$EVIDENCE_LOG"
    fi
else
    echo "⚠️  Could not fetch canonical version for comparison"
    echo "WARNING: Could not fetch canonical TIER_0 version" >> "$EVIDENCE_LOG"
fi

# Check pending canon files
echo ""
echo "🔍 Checking for pending canon files..."
PENDING_CANON_FILES=(
    "governance/canon/FM_ROLE_CANON.md"
    "governance/canon/WAVE_MODEL.md"
    "governance/canon/LIVING_AGENT_SYSTEM.md"
)

PENDING_COUNT=0
for canon_file in "${PENDING_CANON_FILES[@]}"; do
    if [ ! -f "$canon_file" ]; then
        echo "⚠️  MISSING: $canon_file"
        echo "PENDING: $canon_file (not yet available)" >> "$EVIDENCE_LOG"
        PENDING_COUNT=$((PENDING_COUNT + 1))
    else
        echo "✅ FOUND: $canon_file"
        FILE_SHA256=$(sha256sum "$canon_file" | cut -d' ' -f1)
        echo "PRESENT: $canon_file (SHA256: $FILE_SHA256)" >> "$EVIDENCE_LOG"
    fi
done

if [ $PENDING_COUNT -gt 0 ]; then
    echo "⚠️  $PENDING_COUNT pending canon files not yet available"
fi

# Check for unresolved governance escalations
echo ""
echo "🔍 Checking for unresolved governance escalations..."
ESCALATION_DIR="governance/escalation"
if [ -d "$ESCALATION_DIR" ]; then
    ESCALATION_COUNT=$(find "$ESCALATION_DIR" -name "*.md" -type f 2>/dev/null | wc -l)
    if [ $ESCALATION_COUNT -gt 0 ]; then
        echo "⚠️  Found $ESCALATION_COUNT governance escalation(s)"
        echo "ESCALATIONS: $ESCALATION_COUNT unresolved governance escalation(s) found" >> "$EVIDENCE_LOG"
    else
        echo "✅ No unresolved governance escalations"
        echo "ESCALATIONS: None found" >> "$EVIDENCE_LOG"
    fi
else
    echo "✅ No escalation directory (clean state)"
    echo "ESCALATIONS: None (no escalation directory)" >> "$EVIDENCE_LOG"
fi

if [ "$DRIFT_DETECTED" = true ]; then
    echo ""
    echo "⚠️  DRIFT DETECTED - will self-align during session"
else
    echo ""
    echo "✅ No drift detected - governance aligned"
fi

echo "📋 Evidence log: $EVIDENCE_LOG"

# -------------------- PHASE 4: Generate Session Contract --------------------
echo ""
echo "[PHASE 4] Generate Session Contract"
echo "-----------------------------------"

SESSION_ID="liaison-$(date +%Y%m%d-%H%M%S)"
SESSION_DIR=".agent-admin/sessions/governance-liaison"
mkdir -p "$SESSION_DIR"

SESSION_CONTRACT="$SESSION_DIR/$SESSION_ID.md"

cat > "$SESSION_CONTRACT" << 'SESSEOF'
# governance-liaison Session Contract
**Session ID**: SESSION_ID_PLACEHOLDER
**Started**: TIMESTAMP_PLACEHOLDER

## This Session Mission
<!-- CS2 or auto-triggered ripple: Fill in mission -->
[Awaiting mission or governance ripple]

## Governance Context
- Local TIER_0 Canon: VERSION_PLACEHOLDER
- Canonical Source: SOURCE_PLACEHOLDER
- Self-Alignment: Authorized

## Governance Health Check Results

### Drift Detection
- TIER_0 Manifest: [To be filled by Phase 2]
- Canon Files: [To be filled by Phase 2]
- Pending Canon Files: [To be filled by Phase 2]
- Governance Escalations: [To be filled by Phase 2]

### Evidence Collected
- Evidence Log: EVIDENCE_LOG_PLACEHOLDER
- [Files will be listed with SHA256 checksums during wake-up]

## Alignment Actions Log
<!-- Governance files layered down this session -->

## Pre-Handover Validation
- [ ] Governance alignment verified
- [ ] No blocking drift detected
- [ ] Pending canon files tracked
- [ ] Evidence collected and logged
- [ ] Session contract complete

## Outcome
<!-- To be filled at session end -->
SESSEOF

sed -i "s/SESSION_ID_PLACEHOLDER/$SESSION_ID/g" "$SESSION_CONTRACT"
sed -i "s/TIMESTAMP_PLACEHOLDER/$(date -Iseconds)/g" "$SESSION_CONTRACT"
sed -i "s/VERSION_PLACEHOLDER/${LOCAL_TIER0_VERSION:-unknown}/g" "$SESSION_CONTRACT"
sed -i "s|SOURCE_PLACEHOLDER|${CANONICAL_SOURCE}|g" "$SESSION_CONTRACT"
sed -i "s|EVIDENCE_LOG_PLACEHOLDER|$EVIDENCE_LOG|g" "$SESSION_CONTRACT"

echo "✅ Session contract generated: $SESSION_CONTRACT"

# -------------------- PHASE 5: Session Memory --------------------
echo ""
echo "[PHASE 5] Session Memory"
echo "-----------------------------------"

# Load last 5 sessions
SESSION_COUNT=$(ls -1t "$SESSION_DIR"/*.md 2>/dev/null | head -6 | wc -l)
echo "📚 Session history: $((SESSION_COUNT - 1)) recent sessions found"

if [ $SESSION_COUNT -gt 1 ]; then
    echo "   Last sessions:"
    ls -1t "$SESSION_DIR"/*.md | head -6 | tail -5 | xargs -I {} basename {} | sed 's/^/   - /'
    
    echo ""
    echo "   Recent alignment activities:"
    grep -h "^- Layered down:" "$SESSION_DIR"/*.md 2>/dev/null | tail -5 | sed 's/^/   /' || echo "   (no recent layer-downs)"
fi

# -------------------- PHASE 6: Pre-Handover Validation --------------------
echo ""
echo "[PHASE 6] Pre-Handover Validation"
echo "-----------------------------------"

VALIDATION_FAILED=false

# Check 1: Drift handled
if [ "$DRIFT_DETECTED" = true ]; then
    echo "⚠️  CHECK 1: Drift detected - self-alignment will be required during session"
    echo "   (Validation will occur after alignment)"
else
    echo "✅ CHECK 1 PASSED: No drift detected - governance aligned"
fi

# Check 2: Evidence collected
if [ ! -f "$EVIDENCE_LOG" ]; then
    echo "❌ CHECK 2 FAILED: No evidence log generated"
    VALIDATION_FAILED=true
else
    EVIDENCE_COUNT=$(wc -l < "$EVIDENCE_LOG")
    echo "✅ CHECK 2 PASSED: Evidence collected ($EVIDENCE_COUNT entries)"
fi

# Check 3: Session contract complete
if [ ! -f "$SESSION_CONTRACT" ]; then
    echo "❌ CHECK 3 FAILED: Session contract not generated"
    VALIDATION_FAILED=true
else
    echo "✅ CHECK 3 PASSED: Session contract generated"
fi

# Check 4: Pending canon files tracked
PENDING_TRACKED=false
if [ -f "governance/PENDING_CANON_FILES_TRACKING.md" ]; then
    echo "✅ CHECK 4 PASSED: Pending canon files tracked"
    PENDING_TRACKED=true
elif [ $PENDING_COUNT -eq 0 ]; then
    echo "✅ CHECK 4 PASSED: No pending canon files (all present)"
    PENDING_TRACKED=true
else
    echo "⚠️  CHECK 4 WARNING: $PENDING_COUNT pending canon files not formally tracked"
    echo "   (Non-blocking - files logged in evidence)"
fi

# Final validation
if [ "$VALIDATION_FAILED" = true ]; then
    echo ""
    echo "❌ PRE-HANDOVER VALIDATION FAILED"
    echo "Agent cannot proceed - escalating to CS2"
    exit 1
fi

echo ""
echo "✅ PRE-HANDOVER VALIDATION PASSED"

# -------------------- PHASE 7: Ready State --------------------
echo ""
echo "[PHASE 7] Ready State"
echo "-----------------------------------"
echo "✅ Wake-up protocol complete"
echo "📋 Session contract: $SESSION_CONTRACT"
echo "📋 Evidence log: $EVIDENCE_LOG"
if [ "$DRIFT_DETECTED" = true ]; then
    echo "⚠️  Status: DRIFT DETECTED - Self-alignment required"
    echo "   Execute self-alignment protocol before proceeding with mission"
else
    echo "🎯 Status: READY - Awaiting mission or governance ripple"
fi
echo ""
echo "==================================="
```

**Copy output to session contract. If drift detected, execute self-alignment immediately.**

---

## Core Responsibilities

### 1. Governance Ripple Reception
- Receive governance ripple from governance-repo-administrator
- Detect canonical governance updates
- **Self-align immediately** when drift detected (no approval needed)

### 2. Layer-Down Execution
- Copy governance canon files from canonical to `governance/canon/`
- Update `GOVERNANCE_ARTIFACT_INVENTORY.md`
- Layer down workflow automation/scripts
- Verify alignment after layer-down

### 3. Local Governance Maintenance
- Keep local governance current with canonical
- Maintain local/canonical parity
- Escalate only if self-alignment blocked

### 4. Self-Alignment Authority
**UNIQUE: Can self-align local governance without approval** (Authority: Issue #999)
- ✅ Layer down governance canon automatically
- ✅ Update inventories automatically
- ✅ Verify and proceed with job
- ❌ CANNOT modify own contract (escalate to CS2)

---

## Constraints

**Authority**: LIVING_AGENT_SYSTEM v5.0.0

- ❌ CANNOT modify own contract (governance-liaison.md)
- ❌ CANNOT interpret governance
- ❌ CANNOT cross repository boundaries
- ❌ CANNOT modify canonical governance source
- ✅ CAN self-align local governance canon
- ✅ CAN update local inventories
- ✅ CAN layer down from canonical

**Detailed governance constraints** → See canonical governance:
`APGI-cmy/maturion-foreman-governance`

---

## Self-Alignment Protocol

When drift detected in **Phase 2** (local governance != canonical):

```bash
#!/bin/bash
# Self-Alignment Execution

echo "🔧 SELF-ALIGNMENT: Local governance drift detected"
echo "Canonical source: APGI-cmy/maturion-foreman-governance"

ALIGNMENT_LOG="$SESSION_DIR/${SESSION_ID}_alignment.log"
touch "$ALIGNMENT_LOG"
echo "$(date -Iseconds): Self-alignment initiated" >> "$ALIGNMENT_LOG"

# Step 1: Fetch canonical TIER_0 manifest
echo "Step 1: Fetching canonical TIER_0 manifest..."
CANONICAL_REPO="https://github.com/APGI-cmy/maturion-foreman-governance"
CANONICAL_REF="main"

if curl -f -s "$CANONICAL_REPO/raw/$CANONICAL_REF/governance/TIER_0_CANON_MANIFEST.json" \
    -o "governance/TIER_0_CANON_MANIFEST.json.new" 2>> "$ALIGNMENT_LOG"; then
    if [ -s "governance/TIER_0_CANON_MANIFEST.json.new" ]; then
        mv "governance/TIER_0_CANON_MANIFEST.json.new" "governance/TIER_0_CANON_MANIFEST.json"
        echo "$(date -Iseconds): TIER_0_CANON_MANIFEST.json updated" >> "$ALIGNMENT_LOG"
        echo "✅ TIER_0 manifest updated"
    else
        echo "❌ Failed to fetch TIER_0 manifest (empty response)"
        echo "$(date -Iseconds): ERROR - Failed to fetch TIER_0 manifest (empty response)" >> "$ALIGNMENT_LOG"
        rm -f "governance/TIER_0_CANON_MANIFEST.json.new"
        exit 1
    fi
else
    echo "❌ Failed to fetch TIER_0 manifest (curl error)"
    echo "$(date -Iseconds): ERROR - Failed to fetch TIER_0 manifest (curl error)" >> "$ALIGNMENT_LOG"
    rm -f "governance/TIER_0_CANON_MANIFEST.json.new"
    exit 1
fi

# Step 2: Parse manifest and layer down all canon files
echo "Step 2: Layering down canonical files..."
CANON_FILES=$(grep '"file":' governance/TIER_0_CANON_MANIFEST.json | cut -d'"' -f4 | grep "^governance/canon/")

FILE_COUNT=0
SUCCESS_COUNT=0

for canon_file in $CANON_FILES; do
    FILE_COUNT=$((FILE_COUNT + 1))
    CANONICAL_URL="$CANONICAL_REPO/raw/$CANONICAL_REF/$canon_file"
    mkdir -p "$(dirname "$canon_file")"
    
    echo "   Fetching: $canon_file"
    if curl -f -s "$CANONICAL_URL" -o "$canon_file.new" 2>> "$ALIGNMENT_LOG"; then
        if [ -s "$canon_file.new" ]; then
            mv "$canon_file.new" "$canon_file"
            SHA256=$(sha256sum "$canon_file" | cut -d' ' -f1)
            echo "$(date -Iseconds): $canon_file layered down (SHA256: $SHA256)" >> "$ALIGNMENT_LOG"
            echo "      ✅ SHA256: $SHA256"
            SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
        else
            rm -f "$canon_file.new"
            echo "      ⚠️  Empty file received"
            echo "$(date -Iseconds): WARNING - $canon_file was empty" >> "$ALIGNMENT_LOG"
        fi
    else
        rm -f "$canon_file.new"
        echo "      ⚠️  Failed to fetch"
        echo "$(date -Iseconds): WARNING - Failed to fetch $canon_file" >> "$ALIGNMENT_LOG"
    fi
done

echo "✅ Layered down $SUCCESS_COUNT/$FILE_COUNT canon files"

# Step 3: Update inventory
echo "Step 3: Updating GOVERNANCE_ARTIFACT_INVENTORY.md..."
if [ -f "GOVERNANCE_ARTIFACT_INVENTORY.md" ]; then
    # Update Last Checked timestamp
    if grep -q "Last Checked:" GOVERNANCE_ARTIFACT_INVENTORY.md; then
        sed -i "s/Last Checked:[^$]*/Last Checked: $(date -Iseconds)/" GOVERNANCE_ARTIFACT_INVENTORY.md
    fi
    # Update Last Synced timestamp
    if grep -q "Last Synced:" GOVERNANCE_ARTIFACT_INVENTORY.md; then
        sed -i "s/Last Synced:[^$]*/Last Synced: $(date -Iseconds)/" GOVERNANCE_ARTIFACT_INVENTORY.md
    fi
    echo "$(date -Iseconds): GOVERNANCE_ARTIFACT_INVENTORY.md updated" >> "$ALIGNMENT_LOG"
    echo "✅ Inventory updated"
else
    echo "⚠️  GOVERNANCE_ARTIFACT_INVENTORY.md not found"
    echo "$(date -Iseconds): WARNING - GOVERNANCE_ARTIFACT_INVENTORY.md not found" >> "$ALIGNMENT_LOG"
fi

# Step 4: Validate alignment
echo "Step 4: Validating alignment..."
if [ -f "scripts/validate_baseline.sh" ]; then
    echo "   Running validation script..."
    if scripts/validate_baseline.sh governance-liaison 2>&1 | tee -a "$ALIGNMENT_LOG"; then
        echo "$(date -Iseconds): Validation passed" >> "$ALIGNMENT_LOG"
        echo "✅ Validation passed"
    else
        echo "$(date -Iseconds): Validation completed with warnings (non-blocking)" >> "$ALIGNMENT_LOG"
        echo "⚠️  Validation completed with warnings (non-blocking)"
    fi
else
    echo "   No validation script found (scripts/validate_baseline.sh)"
    echo "$(date -Iseconds): No validation script available" >> "$ALIGNMENT_LOG"
fi

echo ""
echo "✅ SELF-ALIGNMENT COMPLETE"
echo "📋 Alignment log: $ALIGNMENT_LOG"
echo "Proceeding with session mission..."
```

Log alignment actions in session contract under "Alignment Actions Log".

---

## Session Outcome Protocol

At session end, update session contract with:

```markdown
## Alignment Actions Log
- Layered down: governance/canon/[file1]
- Layered down: governance/canon/[file2]
- Updated: GOVERNANCE_ARTIFACT_INVENTORY.md (v[X] → v[Y])

## Outcome

**Status**: [COMPLETE | ESCALATED | BLOCKED]

**Governance Aligned**:
- Local TIER_0 Canon: v[version]
- Canonical TIER_0 Canon: v[version]
- Drift: [NONE | RESOLVED]

**Escalated**:
- [Issue/blocker requiring CS2 or governance-repo-administrator]

**Session Memory**:
- Files updated: [count]
- Ripple source: [canonical commit/PR reference]
- Next sync due: [timestamp or "on-demand"]

**Timestamp**: [ISO8601]
```

Store in `.agent-admin/sessions/governance-liaison/[session-id].md`

---

## Authority References

All governance via `governance/TIER_0_CANON_MANIFEST.json` + canonical repo.

See canonical governance repository for detailed protocols:
**APGI-cmy/maturion-foreman-governance**

---

**Living Agent System v5.0.0** | Class: Liaison | Authority: CS2 | Self-Alignment: Authorized (Issue #999)
