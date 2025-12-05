# PartPulse Operations Manual

## Overview

This manual provides operational guidelines for managing and maintaining the PartPulse application in production.

## Daily Operations

### User Management

#### Creating New Users

1. Navigate to `/users/invite`
2. Enter user email and select role (Admin or Technician)
3. System generates temporary password
4. User receives invitation email
5. User must change password on first login

#### Resetting User Passwords

1. Navigate to Settings > Admin > User Management
2. Find user in list
3. Click "Reset Password"
4. System generates new temporary password
5. Provide password to user securely (do not email)

### Form Submissions

#### Internal Transfer Workflow

1. Technician fills out Internal Transfer form
2. System validates and sanitizes input
3. PDF receipt generated automatically
4. Email confirmation sent (if configured)
5. Transfer appears in reports dashboard

#### Warranty Claim Workflow

1. Technician fills out Warranty Claim form
2. System validates parts information
3. PDF generated with Trane branding
4. Admin reviews and approves/rejects
5. Updated PDF generated with admin signature
6. Status updated in system

## Monitoring

### System Health Checks

**Application Status**
- Check uptime at `/api/health`
- Monitor response times
- Review error logs daily

**Database Health**
- Check connection pool usage
- Monitor query performance
- Review slow query logs

**Storage Status**
- Monitor disk usage (local storage)
- Check S3 bucket size (if using S3)
- Verify file permissions

### Performance Monitoring

**Metrics to Track**
- API response times (target: <200ms)
- Database query times (target: <50ms)
- Page load times (target: <2.5s)
- Error rates (target: <1%)

**Caching**
- Reports cached for 5 minutes
- Cache automatically cleared on data changes
- Manual cache clear: Restart application

## Security Operations

### Access Control

**Role Permissions**
- **Admin**: Full system access, user management, reports, settings
- **Technician**: Submit forms, view own submissions, basic reports

**Session Management**
- Sessions expire after 24 hours of inactivity
- Tokens refresh every hour
- Force logout: Admin can reset user password

### Security Monitoring

**Failed Login Attempts**
- View in Settings > Admin > System Logs
- Automatic lockout after 5 failed attempts (per rate limiting)
- Monitor for suspicious patterns

**Audit Logging**
- All actions logged with user ID and timestamp
- Logs stored in database
- Review logs weekly for anomalies

## Maintenance

### Regular Updates

**Weekly Tasks**
- Review error logs
- Check system performance metrics
- Verify backup integrity

**Monthly Tasks**
- Update dependencies: `npm update`
- Review security advisories
- Test disaster recovery procedures
- Clean up old logs (>90 days)

**Quarterly Tasks**
- Security audit
- Performance optimization review
- Capacity planning review
- Update documentation

### Database Maintenance

**Backups**
- Automated daily backups at 2 AM UTC
- Retention: 30 days
- Test restore monthly

**Migrations**
- Run migrations during low-traffic windows
- Always backup before migration
- Test migrations in staging first

**Cleanup**
- Archive old records (>1 year) quarterly
- Vacuum database monthly (PostgreSQL)

### Storage Maintenance

**Local Storage**
- Monitor disk usage
- Clean up orphaned files monthly
- Maximum storage: 100GB recommended

**S3 Storage**
- Enable lifecycle policies
- Archive old PDFs to Glacier after 1 year
- Monitor costs

## Backup and Recovery

### Backup Procedures

**Database Backup**
```bash
# Manual backup
pg_dump partpulse > backup_$(date +%Y%m%d).sql

# Restore
psql partpulse < backup_20240101.sql
```

**File Storage Backup**
```bash
# Local storage
tar -czf storage_backup_$(date +%Y%m%d).tar.gz storage/

# S3 storage - enable versioning and cross-region replication
```

### Disaster Recovery

**Recovery Time Objective (RTO)**: 4 hours  
**Recovery Point Objective (RPO)**: 24 hours

**Recovery Steps**
1. Restore database from latest backup
2. Restore file storage
3. Update environment variables
4. Test application functionality
5. Verify data integrity
6. Resume normal operations

## Troubleshooting

### Common Issues

**Issue: Users cannot login**
- Check AUTH_SECRET is set correctly
- Verify database connectivity
- Check rate limiting logs
- Ensure HTTPS is enabled

**Issue: PDFs not generating**
- Check storage provider configuration
- Verify file permissions (local storage)
- Check S3 credentials (S3 storage)
- Review error logs

**Issue: Slow performance**
- Check database query performance
- Verify caching is enabled
- Review server resources (CPU, memory)
- Check for long-running queries

**Issue: Email not sending**
- Verify email service credentials
- Check email domain configuration
- Review email logs
- Test with different recipient

### Log Analysis

**Access Logs**
```bash
# View recent activity
tail -f logs/access.log

# Search for errors
grep "ERROR" logs/application.log

# Count requests per hour
cat logs/access.log | grep "$(date +%Y-%m-%d-%H)" | wc -l
```

**Error Logs**
- Located in Settings > Admin > System Logs
- Filter by event type, user, date range
- Export logs for analysis

## Contact and Escalation

### Support Levels

**Level 1**: Standard user issues
- Users unable to login
- Form submission errors
- General questions
- Response time: 4 hours

**Level 2**: System issues
- Performance degradation
- Database connectivity
- Storage issues
- Response time: 2 hours

**Level 3**: Critical outages
- Complete system failure
- Data loss
- Security incidents
- Response time: 30 minutes

### Emergency Contacts

**System Administrator**: [Contact Info]
**Database Administrator**: [Contact Info]
**Security Team**: [Contact Info]
**DevOps Team**: [Contact Info]

## Best Practices

### User Support

1. Always verify user identity before resetting passwords
2. Document all administrative actions
3. Provide clear instructions to users
4. Follow up on reported issues

### Data Management

1. Never delete data without backup
2. Archive old records instead of deleting
3. Verify data integrity after migrations
4. Document all manual data changes

### Security

1. Use strong passwords (minimum 16 characters)
2. Enable 2FA for admin accounts (when available)
3. Review access logs weekly
4. Report security incidents immediately

### Performance

1. Monitor cache hit rates
2. Optimize slow queries
3. Scale resources proactively
4. Document performance baselines

## Change Management

### Making Changes

1. Test changes in staging environment
2. Document changes in change log
3. Schedule changes during maintenance windows
4. Notify users of planned downtime
5. Have rollback plan ready
6. Monitor system after changes

### Maintenance Windows

**Scheduled Maintenance**: 
- Sunday 2 AM - 4 AM UTC (weekly)
- Notify users 48 hours in advance

**Emergency Maintenance**:
- As needed for critical issues
- Notify users immediately

## Reporting

### Daily Reports
- System uptime
- Error count
- Active users
- Form submissions

### Weekly Reports
- Performance metrics
- Security incidents
- User growth
- Storage usage

### Monthly Reports
- System health summary
- Security audit
- Capacity planning
- Cost analysis

## Appendix

### Useful Commands

```bash
# Check application status
pm2 status partpulse

# Restart application
pm2 restart partpulse

# View logs
pm2 logs partpulse

# Database migrations
npx prisma migrate deploy

# Seed database
npm run db:seed

# Clear cache
# (Restart application)
pm2 restart partpulse
```

### Configuration Files

- Environment: `.env.production`
- Database: `prisma/schema.prisma`
- Security: `lib/security/`
- Storage: `lib/storage/`

### Important URLs

- Application: `https://your-domain.com`
- Admin Panel: `https://your-domain.com/settings/admin`
- Reports: `https://your-domain.com/reports`
- System Logs: `https://your-domain.com/settings/admin` (System Logs tab)
