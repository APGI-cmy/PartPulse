# Scripts Directory

This directory contains utility scripts for PartPulse administration and governance.

## Available Scripts

### Governance & Living Agent System Scripts

#### validate_baseline.sh

**Purpose:** Agent baseline validation at startup per Living Agent System v5.0.0

**Usage:**
```bash
scripts/validate_baseline.sh [OPTIONS] <agent-type>
```

**Options:**
- `-h, --help`: Show help message
- `-v, --verbose`: Enable verbose output
- `-a, --auto-fix`: Attempt auto-remediation for minor drift
- `-r, --repo-root <path>`: Repository root path

**Examples:**
```bash
# Validate api-builder agent
scripts/validate_baseline.sh api-builder

# Validate with auto-fix enabled
scripts/validate_baseline.sh --auto-fix governance-liaison

# Verbose validation
scripts/validate_baseline.sh --verbose ForemanApp-agent
```

**What it validates:**
1. File existence (baseline and instance)
2. Version currency (baseline vs instance)
3. Content integrity (LOCKED sections)
4. Governance references (canonical file availability)
5. Mandatory sections (structural validation)

**Exit Codes:**
- `0`: Validation PASSED
- `1`: Validation FAILED (critical drift - escalation required)
- `2`: Validation WARNED (minor drift detected)
- `3`: Invalid usage or missing files

**Authority:** `governance/canon/AGENT_BASELINE_MANAGEMENT_PROTOCOL.md` §5

**Related Documentation:**
- [AGENT_BASELINE_MANAGEMENT_PROTOCOL.md](../governance/canon/AGENT_BASELINE_MANAGEMENT_PROTOCOL.md)
- [LIVING_AGENT_SYSTEM_V5_LAYER_DOWN_COMPLETION.md](../LIVING_AGENT_SYSTEM_V5_LAYER_DOWN_COMPLETION.md)

---

#### wave_closure.sh

**Purpose:** Wave completion certification and closure per Living Agent System v5.0.0

**Usage:**
```bash
scripts/wave_closure.sh [OPTIONS] <wave-number>
```

**Options:**
- `-h, --help`: Show help message
- `-v, --verbose`: Enable verbose output
- `-f, --force`: Force closure even if validation warnings exist
- `-d, --dry-run`: Validate only, do not create closure artifacts
- `-r, --repo-root <path>`: Repository root path

**Examples:**
```bash
# Close Wave 1
scripts/wave_closure.sh 1

# Dry-run validation for Wave 2
scripts/wave_closure.sh --dry-run --verbose 2

# Force closure with warnings
scripts/wave_closure.sh --force 3
```

**What it validates:**
1. Wave progress artifact existence
2. Architecture documentation completeness
3. QA suite status (tests passing)
4. Zero test debt verification
5. Governance violations check

**What it generates:**
1. Wave closure certification document
2. Wave progress artifact update
3. Session memory entry for FM

**Exit Codes:**
- `0`: Wave closure COMPLETE
- `1`: Wave closure FAILED (blocking issues found)
- `2`: Wave closure WARNED (non-blocking issues found)
- `3`: Invalid usage or missing files

**Authority:** `governance/canon/FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md` §6

**Related Documentation:**
- [FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md](../governance/canon/FOREMAN_WAVE_PLANNING_AND_ISSUE_ARTIFACT_GENERATION_PROTOCOL.md)
- [FOREMAN_MEMORY_PROTOCOL.md](../governance/canon/FOREMAN_MEMORY_PROTOCOL.md)

---

### Administration Scripts

### create-defect-labels.sh

**Purpose:** Create required GitHub labels for Defect Resolution Process

**Usage:**
```bash
bash scripts/create-defect-labels.sh
```

**Prerequisites:**
- GitHub CLI (`gh`) installed
- Authenticated with repository access (`gh auth login`)

**What it creates:**
- 3 Classification labels (`defect-bug`, `defect-feature`, `defect-tech-debt`)
- 4 Severity labels (`severity-critical`, `severity-high`, `severity-medium`, `severity-low`)
- 3 Status labels (`fix-in-progress`, `fix-deployed`, `fix-verified`)
- 1 Special label (`ripple`)

**Features:**
- Creates all 11 labels with correct colors and descriptions
- Uses `--force` flag to update existing labels
- Provides clear status messages
- Includes verification instructions

**Use Cases:**
- Initial setup of Defect Resolution Process (PR #136)
- Recovering deleted labels
- Updating label descriptions to match canonical requirements

**Related Documentation:**
- [/docs/label-creation-verification.md](../docs/label-creation-verification.md) - Complete verification checklist
- [/docs/github-labels-configuration.md](../docs/github-labels-configuration.md) - Label taxonomy and usage
- [/docs/defect-resolution-process.md](../docs/defect-resolution-process.md) - Defect resolution process

### create-user.ts

**Purpose:** Manually create a user or update an existing user's password in the database.

**Usage:**
```bash
npm run db:create-user
```

**Interactive Prompts:**
- Email address
- Full name  
- Role (admin or technician)
- Temporary password (minimum 16 characters)

**Features:**
- Creates new users if they don't exist
- Updates passwords for existing users (with confirmation)
- Validates email format
- Enforces minimum password length
- Provides clear success/error messages

**Use Cases:**
- Adding yourself to the database when locked out
- Creating admin users outside the normal invitation flow
- Resetting a user's password manually
- Initial system setup

**Example:**
```bash
$ npm run db:create-user

=== PartPulse User Creation Tool ===

Email address: admin@company.com
Full name: Admin User
Role (admin/technician) [technician]: admin
Temporary password (min 16 chars): SecurePassword123!@#

Creating user...

✅ User created successfully!
   Email: admin@company.com
   Name: Admin User
   Role: admin
   ID: clxxxxxxxxxxxxxxxxxx
```

## Related Documentation

- [USER_CREATION_RECOVERY.md](../docs/USER_CREATION_RECOVERY.md) - Complete user creation and recovery guide
- [USER_MANAGEMENT.md](../docs/USER_MANAGEMENT.md) - User management guide
- [OPERATIONS.md](../docs/OPERATIONS.md) - Operations manual

## Security Notes

1. **Temporary Passwords:** Always use strong temporary passwords (16+ characters)
2. **Change Immediately:** Users should change temporary passwords upon first login
3. **Script Access:** This script requires direct database access - use carefully in production
4. **Audit Logging:** User creation is not currently logged via this script (unlike web UI)
