# ⚠️ Vercel Build Failure: Database Connection Error

## Error Messages

### Connection Error
```
Error: P1001: Can't reach database server at `db.csfbqbumimomonkxlmoa.supabase.co:5432`
Please make sure your database server is running.
Error: Command "npm run build" exited with 1
```

### Authentication Error (Invalid Credentials)
```
Error: P1000: Authentication failed against database server at `db.csfbqbumimomonkxlmoa.supabase.co`
the provided database credentials for `postgres` are not valid.
Error: Command "npm run build" exited with 1
```
**This error indicates wrong password or unencoded special characters. See Cause #5 below.**

### Authentication Error (Wrong Pooling Mode)
```
Error: SASL authentication failed
Datasource "db": PostgreSQL database "postgres" at "db.csfbqbumimomonkxlmoa.supabase.co:6543"
Error: Command "npm run build" exited with 1
```
**This error indicates you're using Transaction Pooling (port 6543). See Cause #2 below.**

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

### 2️⃣  Wrong Supabase Connection Pooling Mode ⚠️ **VERY COMMON**

**Prisma migrations require Session Mode (port 5432), NOT Transaction Mode (port 6543).**

**If you upgraded from Direct Connection to Transaction Pooler in Supabase, you must use Session Mode for migrations.**

Supabase provides THREE connection modes:
- ✅ **Session Mode Pooling** (port 5432) - **REQUIRED FOR MIGRATIONS**
- ❌ **Transaction Mode Pooling** (port 6543) - **DOES NOT WORK** with `prisma migrate deploy`
- ⚠️ **Direct Connection** (port 5432) - Works for migrations but less efficient

**Error if using Transaction Mode (port 6543)**:
```
Error: SASL authentication failed
Datasource "db": PostgreSQL database "postgres" at "db.xxx.supabase.co:6543"
```

**Why Transaction Mode fails**:
- Transaction pooling is designed for short-lived queries
- Prisma migrations need persistent session state
- SASL authentication requires full session support
- Transaction mode doesn't maintain the required connection state

**Solution - Get Session Mode Connection String**:
1. Go to Supabase Dashboard → Project Settings → Database
2. Scroll to **Connection Pooling** section
3. **Important**: You'll see TWO tabs:
   - **"Session mode"** - This is what you need ✅
   - **"Transaction mode"** - This is port 6543 ❌
4. Click the **"Session mode"** tab
5. Copy the connection string (will show port **5432**)
6. Update `DATABASE_URL` in Vercel with this Session Mode URL
7. **Verify the URL shows port 5432**, not 6543
8. Redeploy

**You can use BOTH modes simultaneously**:
- `DATABASE_URL` = Session Mode (port 5432) for migrations during build
- Optionally, use Transaction Mode (port 6543) for application queries at runtime (if needed)
- Set different env vars: `DATABASE_URL` vs `DATABASE_URL_POOLED` if you want both

**Example URLs**:
```bash
# ✅ Session Mode Pooling (USE THIS for DATABASE_URL)
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres

# ❌ Transaction Mode Pooling (port 6543 - DO NOT use for migrations)
postgresql://postgres.[project-ref]:[password]@db.[project-ref].supabase.co:6543/postgres

# ⚠️ Direct Connection (works for migrations but not recommended)
postgresql://postgres.[project-ref]:[password]@db.[project-ref].supabase.co:5432/postgres
```

**Visual Guide**:
```
Supabase Dashboard → Settings → Database

Look for section: "Connection Pooling"

You'll see two tabs:
┌─────────────────┬──────────────────┐
│  Session mode   │ Transaction mode │  ← Click "Session mode"
└─────────────────┴──────────────────┘

The URL shown will be port 5432 (Session)
NOT port 6543 (Transaction)
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

### 5️⃣  Password Contains Special Characters or Is Incorrect ⚠️ **COMMON**

**If you see "P1000: Authentication failed" error**, your password is likely wrong or contains unencoded special characters.

**Error if password is incorrect**:
```
Error: P1000: Authentication failed against database server
the provided database credentials for `postgres` are not valid
```

**Special characters that need encoding**:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `:` → `%3A` (if in password, not the separator)
- `/` → `%2F` (if in password, not in path)

**Solution**:
1. Go to Supabase Dashboard → Settings → Database
2. **Find your password** (in the Connection String section)
3. **Check for special characters** in the password
4. If special characters exist, **URL-encode them**
5. Rebuild the connection string:
   ```
   postgresql://postgres.[project]:[ENCODED_PASSWORD]@[host]:5432/postgres
   ```
6. Update DATABASE_URL in Vercel with the corrected connection string
7. Redeploy

**Example**:
```bash
# Original password: myP@ssw0rd!
# Encoded password: myP%40ssw0rd!
# Full URL:
postgresql://postgres.abc:[URL-ENCODED-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

**Alternative - Reset Password**:
If encoding doesn't work:
1. Go to Supabase Dashboard → Settings → Database
2. Click "Reset Database Password"
3. Choose a password WITHOUT special characters
4. Update DATABASE_URL in Vercel
5. Redeploy

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
