# Secret Rotation Guide

This guide provides procedures for rotating secrets and credentials in the PartPulse application.

## Overview

Regular secret rotation is a critical security practice that:
- Limits the exposure window if credentials are compromised
- Reduces the risk of unauthorized access
- Meets compliance requirements for security standards

**Recommended Rotation Schedule:**
- Production secrets: Every 90 days
- Development secrets: Every 180 days
- Compromised secrets: Immediately

## Secrets Inventory

### Critical Secrets

| Secret | Location | Purpose | Rotation Impact |
|--------|----------|---------|-----------------|
| `AUTH_SECRET` | Environment | NextAuth.js JWT signing | High - invalidates all sessions |
| `DATABASE_URL` | Environment | Database connection | High - requires downtime |
| `RESEND_API_KEY` | Environment | Email service | Medium - emails will fail |
| `STORAGE_S3_ACCESS_KEY_ID` | Environment | S3 storage access | Medium - file operations will fail |
| `STORAGE_S3_SECRET_ACCESS_KEY` | Environment | S3 storage access | Medium - file operations will fail |

## Rotation Procedures

### 1. AUTH_SECRET Rotation

**Impact:** All users will be logged out and need to sign in again.

**Steps:**

1. Generate new secret: `openssl rand -base64 32`
2. Update environment variables in production
3. Deploy the change
4. Verify login functionality
5. Notify users about forced logout

### 2. Database Credentials Rotation

**Impact:** Application will lose database connectivity during rotation.

**Steps:**

1. Schedule maintenance window
2. Create new database credentials
3. Test new credentials
4. Update environment variables
5. Deploy and verify
6. Revoke old credentials

### 3. Email Service API Key Rotation

**Impact:** Email notifications will fail until rotation is complete.

**Steps:**

1. Generate new API key from provider dashboard
2. Test new key
3. Update environment variables
4. Deploy
5. Verify email delivery
6. Revoke old key

### 4. S3 Access Keys Rotation

**Impact:** File uploads and PDF generation will fail during rotation.

**Steps:**

1. Create new IAM access key
2. Update environment variables
3. Deploy
4. Verify file operations
5. Deactivate old key

## Emergency Rotation

If a secret is compromised:

1. Rotate the compromised secret immediately
2. Monitor logs for suspicious activity
3. Investigate the breach
4. Notify stakeholders
5. Document the incident

## Best Practices

1. **Never commit secrets to git**
2. **Use a password manager** for team secret sharing
3. **Principle of least privilege** - grant minimum necessary permissions
4. **Monitor and audit** access logs regularly
5. **Document rotation dates**

## Checklist

Before rotating:
- [ ] Identify all services using the secret
- [ ] Plan maintenance window if needed
- [ ] Prepare new secret value
- [ ] Test in development/staging
- [ ] Notify stakeholders
- [ ] Have rollback plan ready

After rotating:
- [ ] Verify application functionality
- [ ] Monitor error logs for 24 hours
- [ ] Revoke old secret
- [ ] Update documentation
- [ ] Record rotation in audit log

## Rollback Procedure

If issues occur after rotation:

1. Identify the problem from logs
2. Restore previous secret value
3. Redeploy
4. Verify restoration
5. Investigate and retry rotation
