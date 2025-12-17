# User Management Guide

## Overview

PartPulse uses a secure, invitation-based user management system. This guide explains how to create accounts and invite users to the system.

## Initial Setup: Creating the First Admin

### When is this available?

The first-time admin setup is **only available when no admin accounts exist** in the system. This is a one-time setup process.

### How to create the first admin:

1. Navigate to `/auth/first-admin`
2. Fill in the required information:
   - Full Name
   - Email Address
   - Password (must meet security requirements)
   - Confirm Password
3. Click "Create Admin Account"
4. You will be redirected to the sign-in page

### First Admin Setup Page Screenshot

![First Admin Setup](https://github.com/user-attachments/assets/0f2d534c-cb3b-46e5-9062-6a3b66a2d301)

### What if I see "Setup Already Complete"?

If you see this message, it means an admin account has already been created. This is normal and expected after the initial setup is complete.

## Adding Additional Users

### Important: There is NO public signup page

PartPulse does not have a public signup page. **All new users must be invited by an administrator.**

### How to invite a new user (Admin only):

1. **Sign in** to your admin account
2. **Navigate to the "Invite" page** from the sidebar menu (you'll see a ✉ icon)
3. Fill in the invitation form:
   - Full Name of the person you're inviting
   - Email Address
   - Role (Administrator or Technician)
   - Optional: Personal message
4. Click "Send Invitation"
5. You'll receive an **invitation link** that you can share with the user

### Sign In Page

![Sign In Page](https://github.com/user-attachments/assets/4ba60335-f33d-4fb4-9482-bd514f876a10)

## User Signup Process (For Invited Users)

When someone receives an invitation:

1. They receive an invitation link (e.g., `/auth/signup?token=abc123...`)
2. They click the link and are taken to the signup page
3. The signup page displays their pre-filled information (name, email, role)
4. They create a password that meets security requirements:
   - At least 16 characters long
   - One uppercase letter
   - One number
   - One special character
5. They confirm the password
6. They click "Complete Registration"
7. They're redirected to sign in with their new credentials

## User Roles

### Administrator
- Can manage all users
- Can invite new users (admins and technicians)
- Can approve warranty claims
- Has access to all system features
- Can access admin dashboard and settings

### Technician
- Can submit internal transfers
- Can submit warranty claims
- Can view reports
- Cannot manage users or access admin features

## Security Features

- **Invitation tokens expire after 7 days** for security
- **Strong password requirements** enforce security best practices
- **Session timeout after 8 hours** of inactivity
- **No public registration** prevents unauthorized access
- **Self-service password reset** with time-limited tokens (1 hour expiry)
- **Email enumeration protection** - reset requests always return success

## Frequently Asked Questions

### Q: How do I create a new user account?

**A:** You cannot create a user account directly. An administrator must invite you. If you're an admin, use the "Invite" feature in the sidebar.

### Q: Why can't I access the first-admin setup page?

**A:** This page is only available when no admin accounts exist. Once an admin has been created, this page is permanently disabled for security reasons.

**If you need to add yourself to the database:** See [USER_CREATION_RECOVERY.md](./USER_CREATION_RECOVERY.md) for instructions on using the database seed script or manual user creation tool.

### Q: I received an invitation link but it says it's expired. What do I do?

**A:** Contact your administrator to send you a new invitation. Invitation links are only valid for 7 days for security reasons.

### Q: Can I change my role from Technician to Administrator?

**A:** No. Only administrators can change user roles. Contact your administrator if you need elevated permissions.

### Q: How do I reset my password?

**A:** Click "Forgot password?" on the sign-in page. Enter your email address, and you'll receive a password reset link. The link is valid for 1 hour for security reasons.

**Note:** In the current implementation, password reset links are logged to the server console. In production, these should be sent via email. Contact your administrator if you need to retrieve a reset link.

### Q: What if I don't receive the password reset email?

**A:** Currently, password reset links are logged to the server console rather than sent via email. Contact your administrator to retrieve the reset link. In production, this will be sent via email automatically.

### Q: I received a password reset link but it says it's expired. What do I do?

**A:** Password reset links expire after 1 hour for security reasons. Simply request a new password reset link from the sign-in page.

## Dashboard After Sign In

Once signed in, you'll see the main dashboard with access to:

- Internal Transfer (record parts removed from stock)
- Warranty Claims (document parts for warranty work)
- Reports (view and filter notifications)
- Invite (admin only - invite new users)
- Admin Dashboard (admin only - manage settings)

![Dashboard](https://github.com/user-attachments/assets/23c92505-ada9-47c7-93e3-88628b9434a3)

## Summary

- **First admin:** One-time setup via `/auth/first-admin`
- **Additional users:** Must be invited by an admin via the "Invite" feature
- **No public signup:** All user creation is controlled and audited
- **Password reset:** Self-service via "Forgot password?" link on sign-in page
- **Secure by design:** Invitation-based system ensures only authorized users can access the application

For technical details about deployment and operations, see [OPERATIONS.md](./OPERATIONS.md).
