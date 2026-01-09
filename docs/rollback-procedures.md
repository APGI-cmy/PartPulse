# Rollback Procedures - PartPulse

## Purpose
This document defines rollback procedures for PartPulse deployments in accordance with the Defect Resolution and Maintenance Canon.

**Canonical Reference**: `maturion-foreman-governance/governance/canon/DEFECT_RESOLUTION_MAINTENANCE_CANON.md` Section 11  
**Effective Date**: 2026-01-09

---

## 1. Overview

### 1.1 Rollback Requirement

**Every production fix MUST have a defined rollback procedure before deployment.**

A rollback plan is required for:
- ✅ All production deployments
- ✅ All fix deployments
- ✅ All feature deployments
- ✅ All configuration changes
- ✅ All database migrations

### 1.2 Rollback Philosophy

**Rollback is NOT failure** - Rollback is a safety mechanism. Failed fix is the failure.

Rollback enables:
- Fast recovery from deployment issues
- Risk mitigation for production changes
- Confidence in deployment process
- Learning from deployment problems

---

## 2. Current Production Environment

### 2.1 Deployment Platform

**Platform**: Vercel  
**Environment**: Production  
**URL**: [Production URL]

### 2.2 Current Version

**Version**: [Current production version - e.g., v1.2.0]  
**Deployed**: [Deployment date]  
**Commit**: [Git commit SHA]

### 2.3 Dependencies

**Key Dependencies**:
- Database: PostgreSQL (via Supabase/managed service)
- Authentication: NextAuth.js
- Email: Nodemailer
- PDF Generation: PDFKit

---

## 3. Rollback Trigger Conditions

### 3.1 When to Rollback

Rollback SHOULD be triggered when:

**Critical Issues**:
- ❌ Application crashes or fails to start
- ❌ Database connection failures
- ❌ Authentication failures blocking all users
- ❌ Data corruption detected
- ❌ Security vulnerability introduced

**High Severity Issues**:
- ❌ Major functionality broken
- ❌ Significant user impact (>50% users affected)
- ❌ Performance degradation (>2x slower)
- ❌ Error rate spike (>10% requests failing)

**Medium Severity Issues**:
- Consider rollback if:
  - Fix available requires >4 hours
  - Business operations significantly impacted
  - Workaround not feasible

### 3.2 Rollback Authority

**Who Can Trigger Rollback**:
- Human owner (Johan Ras)
- Designated on-call engineer
- Team lead with production access

**Emergency Rollback**:
- Any team member with access can trigger in true emergency
- Must notify team immediately after

---

## 4. Vercel Deployment Rollback

### 4.1 Vercel Dashboard Rollback

**Fastest Method** (Recommended for emergencies):

1. **Access Vercel Dashboard**
   ```
   URL: https://vercel.com/apgi-cmy/partpulse
   ```

2. **Navigate to Deployments**
   - Click on project "PartPulse"
   - Go to "Deployments" tab
   - Find last known good deployment

3. **Promote Previous Deployment**
   - Click on last working deployment
   - Click "Promote to Production" button
   - Confirm promotion

4. **Verify Rollback**
   - Wait 1-2 minutes for propagation
   - Visit production URL
   - Verify application loads
   - Test critical functionality

**Timeline**: 2-5 minutes

### 4.2 Git-Based Rollback

**More Controlled Method** (Recommended for planned rollbacks):

1. **Identify Last Good Version**
   ```bash
   git log --oneline
   # Find commit SHA of last working version
   ```

2. **Create Rollback Branch**
   ```bash
   git checkout -b rollback/to-v{version}
   git reset --hard {COMMIT_SHA}
   git push origin rollback/to-v{version} --force
   ```

3. **Deploy Rollback via Vercel**
   - Vercel will auto-deploy the rollback branch
   - OR manually trigger deployment in Vercel dashboard

4. **Verify Rollback**
   - Check deployment logs
   - Verify production URL
   - Test critical paths

**Timeline**: 5-10 minutes

### 4.3 Emergency Rollback Script

**For Automated Rollback** (if configured):

```bash
#!/bin/bash
# Emergency rollback script
# Usage: ./rollback.sh <commit-sha>

COMMIT=$1
if [ -z "$COMMIT" ]; then
  echo "Usage: ./rollback.sh <commit-sha>"
  exit 1
fi

echo "Rolling back to commit: $COMMIT"
git checkout -b rollback/emergency-$(date +%s)
git reset --hard $COMMIT
git push origin HEAD --force

echo "Rollback initiated. Check Vercel dashboard for deployment status."
```

---

## 5. Database Migration Rollback

### 5.1 Prisma Migration Rollback

**PartPulse uses Prisma for database migrations.**

**IMPORTANT**: Database rollbacks are HIGH RISK. Prefer forward fixes when possible.

### 5.2 Rollback Procedure

**Step 1: Identify Migration to Rollback**
```bash
# List migrations
npx prisma migrate status

# Identify migration causing issues
```

**Step 2: Rollback Migration** (Use with EXTREME caution)
```bash
# Prisma does not support automatic rollback
# Manual approach required:

# 1. Restore database from backup (if available)
# OR

# 2. Write reverse migration manually
npx prisma migrate dev --name rollback_migration_name --create-only
# Edit generated migration file to reverse changes
npx prisma migrate deploy
```

**Step 3: Verify Database State**
```bash
# Check schema
npx prisma db pull

# Verify tables
# Run validation queries
```

### 5.3 Database Rollback Safety

**Best Practices**:
- ✅ Always backup database before migrations
- ✅ Test migrations in staging first
- ✅ Make migrations reversible when possible
- ✅ Avoid destructive changes (DROP, DELETE)
- ✅ Use additive changes (ADD column, not MODIFY)

**Additive Migration Pattern** (Safer):
```sql
-- Instead of:
ALTER TABLE users DROP COLUMN old_field;

-- Do:
ALTER TABLE users ADD COLUMN new_field VARCHAR(255);
-- Keep old_field, deprecate in code
-- Remove in future migration after data migrated
```

---

## 6. Configuration Rollback

### 6.1 Environment Variables

**Vercel Environment Variables**:

If configuration change caused issue:

1. **Access Vercel Dashboard**
   - Go to Project Settings
   - Navigate to Environment Variables

2. **Restore Previous Values**
   - Identify changed variable
   - Restore previous value
   - Redeploy (or wait for auto-redeploy)

3. **Verify Configuration**
   - Check application logs
   - Verify functionality

### 6.2 Code-Based Configuration

If configuration in code (e.g., `next.config.ts`):
- Rollback to previous commit (see Section 4.2)
- OR create hotfix PR reverting config change

---

## 7. Rollback Verification

### 7.1 Verification Checklist

After rollback, MUST verify:

**Application Health**:
- [ ] Application loads successfully
- [ ] No error messages on homepage
- [ ] Authentication works
- [ ] Database connection successful

**Critical Functionality**:
- [ ] User can log in
- [ ] Dashboard loads
- [ ] Parts list accessible
- [ ] User management works
- [ ] PDF generation works (if applicable)

**Data Integrity**:
- [ ] No data loss observed
- [ ] Recent transactions intact
- [ ] User data accessible

**Performance**:
- [ ] Response times normal
- [ ] No error spikes in logs
- [ ] No resource exhaustion

### 7.2 Verification Timeline

- **Immediate** (0-5 minutes): Basic health checks
- **Short-term** (5-30 minutes): Functionality verification
- **Medium-term** (30 minutes - 2 hours): Monitoring and user feedback
- **Long-term** (2-24 hours): Stability confirmation

---

## 8. Post-Rollback Protocol

### 8.1 Immediate Actions (Within 1 Hour)

1. **Document Rollback**
   - Create incident report
   - Document trigger and timing
   - Record rollback steps taken

2. **Verify System Stability**
   - Monitor error rates
   - Check user reports
   - Validate critical paths

3. **Communicate Rollback**
   - Notify team in communication channel
   - Update status page (if applicable)
   - Inform stakeholders

### 8.2 Within 24 Hours

1. **Root Cause Analysis**
   - Why did deployment fail?
   - What was missed in testing?
   - How did it pass CI/CD gates?

2. **Update Fix Architecture**
   - Incorporate learnings from failure
   - Update fix design
   - Add additional safety checks

3. **Strengthen Testing**
   - Add tests that would have caught issue
   - Improve staging validation
   - Enhance monitoring

### 8.3 Before Retry

1. **Original Defect Still Exists**
   - System is back to defective state
   - Original issue still needs fixing

2. **New Fix Attempt Requires**
   - Fresh FM authorization
   - Updated fix architecture
   - Additional testing requirements
   - Possibly human owner approval

3. **Learning Applied**
   - RCA findings incorporated
   - Additional safety measures added
   - Testing enhanced

**Rollback Does Not Close Defect Issue** - Defect remains open for proper fix.

---

## 9. Rollback Prevention

### 9.1 Pre-Deployment Safety

**Best practices to avoid needing rollback**:

✅ **Staging Validation**
- Deploy to staging first
- Test all critical paths
- Verify with production-like data

✅ **Gradual Rollout** (if supported)
- Canary deployment
- Percentage-based rollout
- Monitor before full deployment

✅ **Automated Testing**
- All tests passing in CI
- Integration tests included
- Load testing for performance changes

✅ **Manual Verification**
- FM validates before deployment
- Critical paths tested manually
- Deployment checklist completed

### 9.2 Monitoring and Alerting

**Set up monitoring for**:
- Error rates (spike detection)
- Response times (performance degradation)
- Database connection (availability)
- Authentication failures (auth issues)

**Alert thresholds**:
- Error rate >5% → Warning
- Error rate >10% → Critical
- Response time >2x normal → Warning
- Auth failure rate >1% → Critical

---

## 10. Rollback Contacts and Resources

### 10.1 Emergency Contacts

**Primary Contact**:
- Name: Johan Ras
- Role: Human Owner
- Availability: [Contact info]

**On-Call Engineer** (if designated):
- Name: [TBD]
- Contact: [TBD]

**Team Communication**:
- Channel: [Slack/Teams/Discord channel]
- Emergency Protocol: @mention @channel

### 10.2 Access and Credentials

**Required Access**:
- Vercel dashboard access
- GitHub repository admin access
- Database admin access (if needed)
- Environment variable access

**Credential Storage**:
- [Document secure credential storage location]

### 10.3 External Resources

**Vercel Documentation**:
- Deployments: https://vercel.com/docs/deployments
- Rollback: https://vercel.com/docs/deployments/rollback

**Prisma Documentation**:
- Migrations: https://www.prisma.io/docs/concepts/components/prisma-migrate

---

## 11. Rollback Testing

### 11.1 Rollback Drills

**Recommended**: Conduct rollback drill quarterly

**Drill Procedure**:
1. Deploy test change to production
2. Practice rollback procedure
3. Verify rollback successful
4. Document learnings
5. Update procedures

### 11.2 Staging Rollback Practice

**Practice in staging first**:
- Deploy to staging
- Practice Vercel rollback
- Practice git rollback
- Verify procedures work
- Refine documentation

---

## 12. Version History and Maintenance

**Version**: 1.0.0  
**Last Updated**: 2026-01-09  
**Last Tested**: [Date of last rollback drill]  
**Next Review**: 2026-04-09 (Quarterly)

### 12.1 Maintenance Requirements

This document MUST be updated when:
- Deployment platform changes
- Rollback procedures change
- New rollback methods added
- Rollback actually performed (lessons learned)
- Emergency contacts change

### 12.2 Update Responsibility

**Owner**: Governance Liaison  
**Review Cycle**: Quarterly  
**Update Trigger**: Any production rollback

---

## References

- **Canonical Source**: `maturion-foreman-governance/governance/canon/DEFECT_RESOLUTION_MAINTENANCE_CANON.md`
- **Process Documentation**: `/docs/defect-resolution-process.md`
- **Fix PR Template**: `/docs/fix-pr-template.md`
- **Deployment Guide**: `/architecture/DEPLOYMENT_GUIDE.md`

---

**END OF ROLLBACK PROCEDURES**
