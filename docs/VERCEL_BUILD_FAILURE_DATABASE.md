# ⚠️ Vercel Build Failure: Database Connection Error

## Error Message
```
Error: P1001: Can't reach database server at `db.csfbqbumimomonkxlmoa.supabase.co:5432`
Please make sure your database server is running at `db.csfbqbumimomonkxlmoa.supabase.co:5432`.
Error: Command "npm run build" exited with 1
```

## Most Likely Causes (In Order)

### 1️⃣  Supabase Database Is Paused ⭐ **MOST COMMON**

**Supabase databases automatically pause after ~1 week of inactivity.**

**Solution**:
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. If you see "Database is paused" - click **Resume** or **Restore**
4. Wait for database to become active (30-60 seconds)
5. Redeploy in Vercel

**Prevention**: Keep database active by querying it regularly, or upgrade to paid plan.

---

### 2️⃣  Wrong Connection String Port

Supabase provides two connection URLs:
- **Connection Pooling** (port 5432) - Recommended for Vercel
- **Direct Connection** (port 6543) - Alternative

**Solution**:
1. Go to Supabase Dashboard → Settings → Database
2. Find **Connection string** section
3. Copy the **Connection pooling** URL (port 5432)
4. Update DATABASE_URL in Vercel with this URL
5. Redeploy

**Example URLs**:
```bash
# Connection Pooling (use this)
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres

# Direct Connection (alternative)
postgresql://postgres.[project-ref]:[password]@db.[project-ref].supabase.co:6543/postgres
```

---

### 3️⃣  DATABASE_URL Not Set in Vercel

**Solution**: Set DATABASE_URL in Vercel environment variables

1. Go to: [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **PartPulse**
3. Navigate to: **Settings** → **Environment Variables**
4. Click: **Add New**
5. Set:
   - **Name**: `DATABASE_URL`
   - **Value**: Your Supabase connection string (from #2 above)
   - **Environments**: Check all three: ✅ Production, ✅ Preview, ✅ Development
6. Click: **Save**
7. Redeploy

---

### 4️⃣  IP Whitelisting Required

Some Supabase projects require IP whitelisting.

**Check**:
1. Supabase Dashboard → Settings → Database
2. Look for "Network Restrictions" or "IP Allow List"

**Solution if enabled**:
- Vercel uses dynamic IPs
- Add `0.0.0.0/0` to allow all IPs (required for Vercel)
- OR disable IP restrictions if not needed

---

### 5️⃣  Password Contains Special Characters

If your database password has special characters, they must be URL-encoded.

**Special characters that need encoding**:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`

**Solution**:
1. Find your password in Supabase Dashboard → Settings → Database
2. URL-encode special characters
3. Update DATABASE_URL in Vercel with encoded password

---

## Step-by-Step Resolution

### Step 1: Check Database Status

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. **Is database paused?**
   - If YES: Click **Resume/Restore**
   - If NO: Continue to Step 2

### Step 2: Verify DATABASE_URL

1. Go to Supabase Dashboard → Settings → Database
2. Copy the **Connection pooling** URL (port 5432)
3. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
4. Check if DATABASE_URL exists
   - If NO: Add it (see #3 above)
   - If YES: Verify it matches the Supabase URL

### Step 3: Test Connection Format

The DATABASE_URL should look like:
```
postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

**Key parts**:
- Protocol: `postgresql://`
- Port: `:5432` (connection pooling) or `:6543` (direct)
- Database: `/postgres` at the end

### Step 4: Redeploy

After making changes:

**Option A: From Vercel Dashboard**
1. Go to: **Deployments** tab
2. Find the failed deployment
3. Click the **⋯** menu
4. Select: **Redeploy**

**Option B: Push new commit**
```bash
git commit --allow-empty -m "Trigger redeploy after fixing DATABASE_URL"
git push
```

### Step 5: Check Build Logs

The new build will show detailed diagnostics:
```
🔄 Deploying Prisma migrations...
✅ DATABASE_URL is set
📍 Connection: postgresql://***:***@aws-0-us-east-1.pooler.supabase.com:5432/postgres
🔍 Diagnostics:
   Host: aws-0-us-east-1.pooler.supabase.com
   Port: 5432
   Environment: production
```

If it still fails, the error message will indicate which of the 5 causes above is the issue.

---

## Successful Build Looks Like

```
🔄 Deploying Prisma migrations...
✅ DATABASE_URL is set
📍 Connection: postgresql://***:***@aws-0-us-east-1.pooler.supabase.com:5432/postgres

🔍 Diagnostics:
   Host: aws-0-us-east-1.pooler.supabase.com
   Port: 5432
   Environment: production

🔌 Connecting to database and deploying migrations...

Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "postgres" at "aws-0-us-east-1.pooler.supabase.com:5432"

1 migration found in prisma/migrations

Applying migration `20251217163056_init`

The following migration(s) have been applied:

migrations/
  └─ 20251217163056_init/
    └─ migration.sql

All migrations have been successfully applied.

✅ SUCCESS: Migrations deployed successfully!
```

---

## Quick Troubleshooting Checklist

Work through this checklist in order:

- [ ] **Is Supabase database running?** (Check Supabase dashboard)
- [ ] **Is DATABASE_URL set in Vercel?** (Check environment variables)
- [ ] **Using Connection Pooling URL?** (Port 5432, not 6543)
- [ ] **Password URL-encoded?** (If it has special characters)
- [ ] **IP restrictions disabled?** (Or 0.0.0.0/0 whitelisted)

---

## Still Failing?

If you've checked all 5 causes and it's still failing:

1. **Check Supabase Status**: [status.supabase.com](https://status.supabase.com)
2. **Test connection locally**: 
   ```bash
   psql "$DATABASE_URL"
   ```
3. **Contact Supabase Support** with your project ref
4. **Check Vercel region**: Ensure it matches Supabase region

---

## Root Cause

The Vercel build is failing during the `prisma migrate deploy` step because it cannot establish a connection to the Supabase database.

## Why This Happens

The build script includes:
```bash
"build": "prisma generate && node scripts/deploy-migrations.js && next build"
```

The `deploy-migrations.js` script:
1. Reads `DATABASE_URL` from environment variables
2. Connects to the database
3. Applies pending migrations

**If the database is unreachable, the build fails.**

This is **intentional** - we want builds to fail if migrations can't be applied, preventing deployment of a broken application.

---

## Prevention

This error is documented as **FL/CI Failure #4** in `qa/FAILURE_LEARNING_LOG.md`.

**To prevent this in future:**
1. Ensure DATABASE_URL is set BEFORE first deployment
2. Use Connection Pooling URL (port 5432)
3. Keep Supabase database active (or use paid plan)
4. Monitor Supabase dashboard for pause warnings
5. Test DATABASE_URL format before deploying

---

## Related Documentation

- **Setup Guide**: `docs/DATABASE_MIGRATION_DEPLOYMENT.md`
- **Quick Reference**: `docs/QUICK_REFERENCE_DB_MIGRATIONS.md`
- **Environment Variables**: `.env.example`
- **Failure Learning**: `qa/FAILURE_LEARNING_LOG.md`

---

**Most Likely Fix**: Resume your paused Supabase database and redeploy.
