# User Creation and Recovery Guide

This guide explains how to manually create users or recover access when locked out of PartPulse.

## Scenarios

### Scenario 1: First Admin Already Created, Need to Add Yourself

If you see "Setup Already Complete" when accessing `/auth/first-admin`, it means an admin user already exists in the database (typically from the seed script). If you need to add yourself to the database, you have two options:

#### Option A: Run the Database Seed (Recommended for Initial Setup)

The seed script (`prisma/seed.ts`) creates default users including:
- `admin@partpulse.com` (password: `admin123`)
- `tech@partpulse.com` (password: `tech123`)  
- `johan.ras2@outlook.com` (password: `TemporaryPassword123!@#`)

To run the seed:

```bash
npm run db:seed
```

After running the seed, you can:
1. Sign in with `johan.ras2@outlook.com` and password `TemporaryPassword123!@#`
2. Change your password immediately via the user settings
3. Or use the "Forgot Password" feature to set a new password

#### Option B: Use the Manual User Creation Script

If you need to create a specific user or update an existing user's password:

```bash
npm run db:create-user
```

This interactive script will prompt you for:
- Email address
- Full name
- Role (admin or technician)
- Temporary password (minimum 16 characters)

**Example:**
```bash
$ npm run db:create-user

=== PartPulse User Creation Tool ===

Email address: johan.ras2@outlook.com
Full name: Johan Ras
Role (admin/technician) [technician]: admin
Temporary password (min 16 chars): MySecurePassword123!@#

Creating user...

✅ User created successfully!
   Email: johan.ras2@outlook.com
   Name: Johan Ras
   Role: admin
   ID: clxxxxxxxxxxxxxxxxxx

The user can now:
1. Sign in with the provided password
2. Reset their password via the "Forgot Password" link
```

**If the user already exists**, the script will ask if you want to update their password:

```bash
⚠️  User with email johan.ras2@outlook.com already exists
Do you want to update their password? (yes/no): yes

✅ Password updated successfully!
```

### Scenario 2: Forgot Your Password (User Already in Database)

If you're already in the database but forgot your password:

1. Navigate to `/auth/signin`
2. Click "Forgot password?"
3. Enter your email address
4. Click "Send Reset Link"

**Note:** In the current implementation, password reset links are logged to the server console rather than sent via email. Check your server logs for the reset URL:

```bash
# Look for a line like:
Password reset requested for johan.ras2@outlook.com. Reset URL: http://localhost:3000/auth/reset-password?token=...
```

Copy the URL and paste it into your browser to complete the password reset.

### Scenario 3: Need to Create Additional Users as Admin

Once you're logged in as an admin:

1. Navigate to the **Invite** page from the sidebar (✉ icon)
2. Fill in the invitation form:
   - Full Name
   - Email Address
   - Role (Administrator or Technician)
   - Optional: Personal message
3. Click "Send Invitation"
4. Share the invitation link with the new user

The new user will receive an invitation link (or you can copy it from the success message) to complete their registration.

## Password Requirements

All passwords must meet these security requirements:
- At least 16 characters long
- At least one uppercase letter
- At least one number
- At least one special character (!@#$%^&*(),.?":{}|<>)

## Security Notes

1. **Temporary Passwords:** Always change temporary passwords immediately after first login
2. **Seed Script:** The seed script uses `upsert`, so running it multiple times won't create duplicate users
3. **Password Reset Links:** Reset links expire after 1 hour for security
4. **Invitation Links:** Invitation links expire after 7 days for security

## Troubleshooting

### "Failed to process password reset request"

This error occurs when:
- Your email address is not in the database
- There's a server error

**Solution:** Use the manual user creation script (Option B above) to add yourself to the database.

### "Setup Already Complete" on /auth/first-admin

This is expected behavior once an admin user exists. It's a security feature to prevent multiple people from creating admin accounts.

**Solution:** Use the seed script (Option A) or manual user creation script (Option B) to add yourself to the database.

### Cannot See Password Reset Link

The current implementation logs reset links to the server console instead of sending emails (for development/demo purposes).

**Solution:** 
- Check your server logs/console output for the reset URL
- In production, configure email service (see `DEPLOYMENT.md`) to send reset emails automatically

## Related Documentation

- [USER_MANAGEMENT.md](./USER_MANAGEMENT.md) - Complete user management guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment and initial setup instructions
- [OPERATIONS.md](./OPERATIONS.md) - Day-to-day operations manual
