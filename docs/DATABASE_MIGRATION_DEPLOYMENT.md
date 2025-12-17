# Database Migration Deployment Standard - Vercel Automation

## Policy: Zero-Touch Migration Deployment

**MANDATE**: Prisma migrations MUST be deployed automatically from Vercel build environment using production DATABASE_URL. Local/sandbox database access is NOT acceptable.

## Why This Policy Exists

1. **Repeatability**: Same process every deployment, no manual steps
2. **Security**: No local access to production database required
3. **Automation**: Zero human intervention in deployment pipeline
4. **Auditability**: All migrations tracked in git and deployed via CI/CD
5. **Reliability**: Eliminates "works on my machine" database issues

## Implementation (Current Project)

### ✅ Already Configured

#### 1. Build Script Deploys Migrations

**File**: `package.json`
```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

**Execution Order** (CRITICAL):
1. `prisma generate` - Generate Prisma Client from schema
2. `prisma migrate deploy` - Apply pending migrations to DATABASE_URL
3. `next build` - Build Next.js application

**Why This Order**:
- Generate must run first to have Prisma Client available
- Migrations must run before build because Next.js may try to use database during build
- If migrations fail, build fails - preventing broken deployments

#### 2. Migration Files Committed to Git

**Files**: 
- `prisma/migrations/20251217163056_init/migration.sql`
- `prisma/migrations/migration_lock.toml`

**Critical**: These files MUST be in git. Never add to `.gitignore`.

#### 3. Vercel Environment Variables (Dual-URL Pattern)

**Required Variables**:

1. **DATABASE_URL** - For build-time migrations (Direct/Session Mode)
```
DATABASE_URL=postgresql://user:password@host:5432/database
```
- **Purpose**: Used by `prisma migrate deploy` during build
- **Requirement**: Must be Direct Connection or Session Mode pooling (port 5432)
- **Why**: Transaction pooling (port 6543) does NOT support migrations

2. **DATABASE_POOL_URL** - For runtime queries (Transaction Pooling - Optional)
```
DATABASE_POOL_URL=postgresql://user:password@host:6543/database
```
- **Purpose**: Used by PrismaClient at runtime for better performance
- **Benefit**: Transaction pooling optimizes connection usage on serverless
- **Fallback**: If not set, runtime will use DATABASE_URL

**Where to Set**:
- Vercel Dashboard → Project → Settings → Environment Variables
- Set BOTH variables for: Production, Preview, Development

**Supabase Configuration**:
- **DATABASE_URL**: Get from "Connection Pooling" → "Session mode" tab (port 5432)
- **DATABASE_POOL_URL**: Get from "Connection Pooling" → "Transaction mode" tab (port 6543)

**Why Two URLs**:
- Migrations need persistent session state (Session Mode)
- Runtime queries benefit from transaction pooling (Transaction Mode)
- Supabase supports both simultaneously
- `lib/prisma.ts` automatically uses DATABASE_POOL_URL if available, DATABASE_URL as fallback

**Verification**:
```bash
vercel env pull .env.vercel.local
grep DATABASE_URL .env.vercel.local
# Should show both DATABASE_URL and DATABASE_POOL_URL
```

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│  VERCEL BUILD PROCESS                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. git clone repository                                        │
│     ↓                                                          │
│  2. npm install                                                │
│     ↓                                                          │
│  3. npm run build                                              │
│     │                                                          │
│     ├─→ prisma generate                                        │
│     │   (creates @prisma/client)                               │
│     │                                                          │
│     ├─→ prisma migrate deploy  ← DATABASE_URL from Vercel      │
│     │   (reads prisma/migrations/*)                            │
│     │   (connects to production database)                      │
│     │   (applies pending migrations)                           │
│     │   (updates _prisma_migrations table)                     │
│     │                                                          │
│     └─→ next build                                             │
│         (builds application)                                   │
│                                                                 │
│  4. Deploy to production                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### What Happens During `prisma migrate deploy`

1. **Connects** to database using `DATABASE_URL` environment variable
2. **Reads** migration files from `prisma/migrations/` directory
3. **Checks** `_prisma_migrations` table for already-applied migrations
4. **Applies** only pending migrations in order
5. **Records** each migration in `_prisma_migrations` table
6. **Fails build** if any migration fails (preventing broken deployment)

### First Deployment Behavior

**Initial State**: Empty database (no tables)

**After First Build**:
- `_prisma_migrations` table created
- All migrations in `prisma/migrations/` applied
- All application tables created (User, Account, Session, etc.)
- Database ready for use

**Subsequent Deployments**:
- Only new migrations applied
- Existing tables unchanged
- Zero downtime

## Verification Checklist

After each deployment, verify:

- [ ] Vercel build logs show "prisma migrate deploy" step
- [ ] No migration errors in build logs
- [ ] Supabase shows all expected tables
- [ ] `_prisma_migrations` table exists and has entries
- [ ] Application can connect and query database

### Vercel Build Log Example (Success)

```
Running "npm run build"

> prisma generate
✔ Generated Prisma Client

> prisma migrate deploy
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "postgres" at "db.xxx.supabase.co:5432"

1 migration found in prisma/migrations

Applying migration `20251217163056_init`

The following migration(s) have been applied:

migrations/
  └─ 20251217163056_init/
    └─ migration.sql

All migrations have been successfully applied.

> next build
✔ Compiled successfully
```

### Supabase Verification

**SQL to check tables**:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Expected tables**:
- User
- Account  
- Session
- VerificationToken
- Invitation
- InternalTransfer
- InternalTransferItem
- WarrantyClaim
- WarrantyItem
- SystemLog
- internal_transfer_alias
- audit_log_alias
- _prisma_migrations

## Common Issues and Solutions

### Issue: "Can't reach database server"

**Symptom**: Build fails with `Error: P1001: Can't reach database server`

**Cause**: DATABASE_URL not set in Vercel or incorrect

**Solution**:
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Verify DATABASE_URL is set for Production
3. Verify connection string format: `postgresql://user:pass@host:5432/db`
4. Test connection from Vercel: Deploy a test branch

### Issue: "Migration failed"

**Symptom**: Build fails during `prisma migrate deploy`

**Cause**: Invalid SQL in migration file or database in inconsistent state

**Solution**:
1. Check Vercel build logs for specific SQL error
2. If migration is bad, create a new migration to fix it
3. Never edit existing migration files - create new ones
4. For emergencies, can manually fix database and mark migration as applied

### Issue: "No migrations found"

**Symptom**: Build succeeds but no tables created

**Cause**: Migration files not committed to git

**Solution**:
1. Verify `prisma/migrations/` exists locally
2. Verify NOT in `.gitignore`
3. `git add prisma/migrations/`
4. `git commit` and `git push`

### Issue: "Table already exists"

**Symptom**: Migration fails with "relation already exists"

**Cause**: Migration already applied manually or database has old state

**Solution**:
```sql
-- Mark migration as applied without running it
INSERT INTO "_prisma_migrations" 
(id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
VALUES 
(gen_random_uuid(), '', NOW(), '20251217163056_init', NULL, NULL, NOW(), 1);
```

## Migration Workflow for Future Changes

### Adding New Tables or Columns

1. **Update schema**:
   ```bash
   # Edit prisma/schema.prisma
   # Add new model or fields
   ```

2. **Create migration** (DO NOT RUN):
   ```bash
   # Generate migration files only (won't connect to DB)
   npx prisma migrate dev --name add_new_feature --create-only
   ```

3. **Review migration SQL**:
   ```bash
   cat prisma/migrations/TIMESTAMP_add_new_feature/migration.sql
   ```

4. **Commit and push**:
   ```bash
   git add prisma/migrations/
   git commit -m "Add migration for new feature"
   git push
   ```

5. **Vercel deploys automatically**:
   - Picks up new migration files
   - Runs `prisma migrate deploy` during build
   - Applies migration to production database
   - Builds application with new schema

### NEVER Do These Things

❌ **Don't run migrations locally** against production database  
❌ **Don't manually create tables** in production  
❌ **Don't edit existing migration files** (create new ones instead)  
❌ **Don't skip migrations** by removing files  
❌ **Don't put migrations in .gitignore**  
❌ **Don't remove `prisma migrate deploy` from build script**

### ALWAYS Do These Things

✅ **Always commit migration files** to git  
✅ **Always let Vercel run migrations** during build  
✅ **Always use `--create-only`** when creating migrations locally  
✅ **Always review migration SQL** before committing  
✅ **Always test migrations** on a preview deployment first  
✅ **Always use `prisma migrate dev --name descriptive_name --create-only`**

## Testing Strategy

### Local Development

Use a separate local database for development:

```env
# .env.local (not committed)
DATABASE_URL="postgresql://localhost:5432/partpulse_dev"
```

**Local workflow**:
```bash
# Create and apply migrations locally
npx prisma migrate dev --name my_changes

# This will:
# 1. Generate migration files
# 2. Apply to local DB
# 3. Generate Prisma Client
```

### Preview Deployments

Every PR gets a preview deployment that:
1. Uses preview DATABASE_URL (or same as production)
2. Runs migrations automatically
3. Tests migration in isolated environment
4. Fails build if migration fails

### Production Deployments

Merging to main:
1. Triggers production build
2. Runs migrations automatically
3. Deploys application
4. Zero manual steps

## Governance and QA

### Automated Tests

**File**: `__tests__/deployment/database-schema-deployment.test.ts`

Tests validate:
- Migration files exist and are NOT gitignored
- Build script includes `prisma migrate deploy`
- Migration order is correct
- Migration SQL creates required tables
- Schema is consistent with migrations

### Build-Time Validation

Vercel build will fail if:
- Migration files are missing
- Migration SQL is invalid  
- Database connection fails
- Migration conflicts with existing schema

### Manual Verification (First Deploy Only)

After first production deployment:
1. Check Vercel build logs for migration success
2. Connect to Supabase and verify tables exist
3. Test user registration to confirm database works
4. Document deployment date and migration version

## Standard for All Projects

This pattern must be replicated in every project:

### Required Files

```
prisma/
  schema.prisma              # Database schema
  migrations/                # Migration files (committed to git)
    migration_lock.toml      # Provider lock file
    TIMESTAMP_init/          # Initial migration
      migration.sql          # SQL to create tables
    TIMESTAMP_feature/       # Additional migrations
      migration.sql
```

### Required Configuration

**package.json**:
```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

**.gitignore** (must NOT include):
```
# ❌ NEVER IGNORE MIGRATIONS
# prisma/migrations  ← DO NOT ADD THIS LINE
```

**Vercel Environment Variables**:
```
DATABASE_URL=postgresql://...
```

### Required Tests

Every project must have:
- Migration existence validation
- Build script validation  
- Schema consistency validation
- End-to-end deployment validation

## Migration History and Audit Trail

### Viewing Applied Migrations

**SQL query**:
```sql
SELECT 
  migration_name,
  started_at,
  finished_at,
  applied_steps_count
FROM "_prisma_migrations"
ORDER BY started_at DESC;
```

### Migration File Tracking

Every migration is tracked in:
1. **Git history** - who created it, when, why
2. **_prisma_migrations table** - when applied, checksum
3. **Vercel build logs** - deployment evidence
4. **FL/CI log** - if migration fixed an issue

## Emergency Procedures

### Rolling Back a Migration

Prisma doesn't support automatic rollback. To revert:

1. **Create a new migration** that reverses the change:
   ```bash
   npx prisma migrate dev --name revert_bad_change --create-only
   ```

2. **Write reverse SQL** in the new migration file

3. **Commit and deploy** the reversal migration

### Fixing a Failed Migration

If a migration fails in production:

1. **DO NOT panic** - database is likely in a partial state
2. **Check Vercel logs** for exact error
3. **Fix the issue**:
   - If SQL is wrong: Create new migration with fix
   - If data conflict: Manually resolve data issue in database
   - If schema conflict: Create migration to reconcile
4. **Redeploy** to apply fix

### Database Backup Before Major Migrations

For large schema changes:

1. **Backup production database** via Supabase dashboard
2. **Test migration** on preview deployment first
3. **Deploy to production** only after preview success
4. **Verify** tables and data after deployment

## Success Criteria

This deployment pattern is successful when:

✅ No manual database access required  
✅ Migrations deploy automatically on every build  
✅ Database schema matches code schema  
✅ Zero-downtime deployments  
✅ Full audit trail of all changes  
✅ Reproducible across all environments  
✅ New developers can deploy without database credentials  

## Related Documentation

- `qa/FAILURE_LEARNING_LOG.md` - Failure #3: Why this pattern is mandatory
- `__tests__/deployment/database-schema-deployment.test.ts` - Automated validation
- `VERCEL_DEPLOYMENT_FIX.md` - General deployment guide
- `prisma/schema.prisma` - Current database schema

---

**Last Updated**: 2025-12-17  
**Status**: Active Standard for All Projects  
**Compliance**: Mandatory per Governance Policy
