# Scripts Directory

This directory contains utility scripts for PartPulse administration.

## Available Scripts

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
