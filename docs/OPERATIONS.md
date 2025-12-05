# PartPulse Operations Manual

This manual provides guidance for day-to-day operations and maintenance of the PartPulse application.

## Table of Contents

1. [User Management](#user-management)
2. [System Monitoring](#system-monitoring)
3. [Data Management](#data-management)
4. [Troubleshooting](#troubleshooting)
5. [Maintenance Tasks](#maintenance-tasks)
6. [Security Operations](#security-operations)

## User Management

### Creating New Users

**Admin users can invite new technicians and admins:**

1. Navigate to **Settings** → **Users** → **Invite User**
2. Enter user email and select role (Technician or Admin)
3. Click **Send Invitation**
4. User receives invitation email with setup link
5. User clicks link and sets password
6. Account is activated

**Via API:**
```bash
curl -X POST https://yourdomain.com/api/users/invite \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: YOUR_TOKEN" \
  -d '{
    "email": "user@example.com",
    "role": "technician"
  }'
```

### Resetting Passwords

**Admin password reset:**

1. Navigate to **Settings** → **Admin** → **Users**
2. Find user and click **Reset Password**
3. Temporary password is generated
4. Admin provides password to user securely
5. User must change password on first login

**Self-service password reset (if enabled):**
- User clicks "Forgot Password" on login page
- Receives reset email
- Follows link to set new password

### Deactivating Users

1. Navigate to **Settings** → **Admin** → **Users**
2. Find user and click **Deactivate**
3. Confirm deactivation
4. User loses access immediately
5. User data is retained for audit purposes

### Role Changes

To change a user's role:

1. Navigate to **Settings** → **Admin** → **Users**
2. Click **Edit** on user
3. Select new role
4. Save changes
5. User's access updates immediately

## System Monitoring

### Health Checks

**Application Health:**
- URL: `/api/health`
- Expected: `{"status":"ok"}`
- Frequency: Every 5 minutes

**Database Health:**
- Check connection count
- Monitor slow queries
- Review error logs

**Storage Health:**
- Monitor disk usage (local)
- Check S3 bucket size and costs (cloud)
- Verify file accessibility

### Performance Metrics

**Key Metrics to Monitor:**

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Response Time (avg) | < 200ms | > 500ms |
| Response Time (p95) | < 500ms | > 1000ms |
| Error Rate | < 0.1% | > 1% |
| CPU Usage | < 70% | > 85% |
| Memory Usage | < 80% | > 90% |
| Database Connections | < 80% pool | > 90% pool |

### Log Review

**Daily log review:**
```bash
# View application logs
tail -f /var/log/partpulse/app.log

# Search for errors
grep ERROR /var/log/partpulse/app.log | tail -20

# Check authentication failures
grep "AUTH_FAILED" /var/log/partpulse/app.log
```

**Log locations:**
- Application: `/var/log/partpulse/app.log`
- Database: `/var/log/postgresql/`
- Nginx: `/var/log/nginx/`
- Vercel: Integrated dashboard

### Alerts Configuration

Set up alerts for:
- Application errors (> 10 per hour)
- Failed login attempts (> 5 per user per hour)
- High response times (p95 > 1s)
- Database connection pool exhaustion
- Storage quota (> 90% used)
- Email delivery failures

## Data Management

### Backup Schedule

**Automated Backups:**
- Database: Daily at 2:00 AM UTC
- Files (S3): Continuous replication
- Configuration: Weekly

**Retention Policy:**
- Daily backups: 7 days
- Weekly backups: 4 weeks
- Monthly backups: 12 months

### Backup Verification

**Monthly verification (first Monday):**
1. Download latest backup
2. Restore to test environment
3. Verify data integrity
4. Test critical workflows
5. Document results

### Data Export

**Export Internal Transfers:**
```bash
# Via Admin Dashboard
Settings → Admin → Reports → Export Transfers

# Via API
curl https://yourdomain.com/api/reports/transfers?format=csv \
  -H "Authorization: Bearer TOKEN"
```

**Export Warranty Claims:**
```bash
# Via Admin Dashboard
Settings → Admin → Reports → Export Claims

# Via API
curl https://yourdomain.com/api/reports/claims?format=csv \
  -H "Authorization: Bearer TOKEN"
```

### Data Retention

**Retention Periods:**
- Internal Transfers: 7 years
- Warranty Claims: 10 years (regulatory requirement)
- Audit Logs: 3 years
- System Logs: 90 days

**Archival Process:**
1. Export data older than retention period
2. Store in cold storage (S3 Glacier)
3. Delete from production database
4. Document archival in audit log

## Troubleshooting

### Common Issues

#### 1. Users Cannot Login

**Symptoms:** Login fails with "Invalid credentials"

**Diagnosis:**
```bash
# Check user exists
npx prisma studio
# Query: SELECT * FROM User WHERE email = 'user@example.com'

# Check authentication logs
grep "user@example.com" /var/log/partpulse/auth.log
```

**Resolution:**
- Verify email is correct (case-sensitive)
- Reset password for user
- Check account is not locked/disabled
- Verify AUTH_SECRET is configured

#### 2. Email Not Sending

**Symptoms:** Users not receiving emails

**Diagnosis:**
```bash
# Check email service status
curl -X POST https://api.resend.com/emails/test \
  -H "Authorization: Bearer $RESEND_API_KEY"

# Check application logs
grep "EMAIL" /var/log/partpulse/app.log | tail -20
```

**Resolution:**
- Verify RESEND_API_KEY is valid
- Check email service quota/limits
- Verify sender domain is verified
- Check spam folder
- Review email service dashboard

#### 3. PDF Generation Fails

**Symptoms:** Downloads fail or return errors

**Diagnosis:**
```bash
# Check storage configuration
echo $STORAGE_PROVIDER
echo $STORAGE_LOCAL_PATH

# Verify write permissions
ls -la storage/pdfs/

# Check storage space
df -h
```

**Resolution:**
- Verify storage configuration
- Check file system permissions
- Ensure adequate disk space
- Review PDF template syntax
- Check S3 credentials (if using S3)

#### 4. Slow Performance

**Symptoms:** Pages load slowly

**Diagnosis:**
```bash
# Check database query performance
# Run EXPLAIN on slow queries

# Monitor resource usage
top
htop

# Check database connections
# Query: SELECT count(*) FROM pg_stat_activity
```

**Resolution:**
- Optimize database queries
- Add database indexes
- Increase server resources
- Enable caching
- Review application code for N+1 queries

### Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| 401 | Unauthorized | User needs to login |
| 403 | Forbidden | User lacks permissions |
| 404 | Not Found | Resource doesn't exist |
| 429 | Rate Limited | Wait and retry |
| 500 | Server Error | Check logs, contact support |

## Maintenance Tasks

### Daily Tasks

- [ ] Review error logs
- [ ] Check system health dashboard
- [ ] Verify backup completion
- [ ] Monitor performance metrics

### Weekly Tasks

- [ ] Review user activity reports
- [ ] Check security alerts
- [ ] Review failed login attempts
- [ ] Update system documentation
- [ ] Check storage usage

### Monthly Tasks

- [ ] Test backup restore
- [ ] Review and optimize database
- [ ] Update dependencies (security patches)
- [ ] Review and rotate logs
- [ ] Audit user accounts
- [ ] Generate monthly reports

### Quarterly Tasks

- [ ] Rotate secrets (see SECRET_ROTATION.md)
- [ ] Security audit
- [ ] Performance review
- [ ] Capacity planning review
- [ ] Disaster recovery test
- [ ] Update documentation

## Security Operations

### Security Monitoring

**Monitor for:**
- Unusual login patterns
- Failed authentication attempts
- Permission escalation attempts
- Unusual data access patterns
- Suspicious API usage

**Review daily:**
```bash
# Failed logins
grep "AUTH_FAILED" /var/log/partpulse/auth.log | tail -50

# Admin actions
grep "ADMIN_ACTION" /var/log/partpulse/audit.log | tail -20

# Rate limit violations
grep "RATE_LIMIT" /var/log/partpulse/app.log
```

### Incident Response

**If security incident detected:**

1. **Contain:**
   - Disable affected user accounts
   - Rotate compromised credentials
   - Block suspicious IP addresses

2. **Investigate:**
   - Review audit logs
   - Identify scope of breach
   - Document timeline

3. **Remediate:**
   - Patch vulnerabilities
   - Update security controls
   - Restore from backup if needed

4. **Report:**
   - Notify management
   - Document incident
   - Update security procedures

### Access Review

**Monthly access review:**
1. List all active users
2. Verify role assignments
3. Deactivate unnecessary accounts
4. Review admin access
5. Document findings

### Security Updates

**Apply security updates promptly:**

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Run security audit
npm audit

# Fix vulnerabilities
npm audit fix
```

## Performance Optimization

### Database Optimization

**Monthly optimization:**
```sql
-- Analyze tables
ANALYZE;

-- Vacuum database
VACUUM;

-- Reindex
REINDEX DATABASE partpulse;
```

### Cache Management

**Clear cache if issues:**
```bash
# Application cache
curl -X POST https://yourdomain.com/api/cache/clear \
  -H "Authorization: Bearer ADMIN_TOKEN"

# CDN cache (if using CloudFront)
aws cloudfront create-invalidation --distribution-id ID --paths "/*"
```

### Query Optimization

Monitor slow queries and optimize:
1. Add appropriate indexes
2. Optimize query structure
3. Use database query plan analysis
4. Consider caching frequently accessed data

## Support Escalation

### Support Levels

**Level 1: User Support**
- Password resets
- Basic troubleshooting
- How-to questions

**Level 2: Technical Support**
- Application errors
- Performance issues
- Integration problems

**Level 3: Engineering**
- System outages
- Security incidents
- Critical bugs

### Contact Information

- Level 1 Support: support@example.com
- Level 2 Support: tech-support@example.com
- Level 3 Emergency: [Emergency hotline]
- Security Issues: security@example.com

## Appendix

### Useful Commands

```bash
# Check application version
curl https://yourdomain.com/api/version

# View active sessions
npx prisma studio
# Query: SELECT count(*) FROM Session WHERE expires > NOW()

# Generate system report
node scripts/system-report.js > report.txt
```

### Environment Variables

See `.env.example` for complete list of configuration options.

### API Documentation

Full API documentation available at: `https://yourdomain.com/api/docs`

---

**Last Updated:** 2024-01-01
**Document Owner:** Operations Team
**Review Schedule:** Quarterly
