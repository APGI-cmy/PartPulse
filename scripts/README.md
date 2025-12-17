# Scripts Directory

This directory contains utility scripts for PartPulse administration.

## Available Scripts

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
