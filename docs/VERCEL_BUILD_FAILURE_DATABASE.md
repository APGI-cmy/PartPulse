# ⚠️ Vercel Build Failure: Database Connection Error

## Error Message
```
Error: P1001: Can't reach database server at `db.csfbqbumimomonkxlmoa.supabase.co:5432`
Please make sure your database server is running at `db.csfbqbumimomonkxlmoa.supabase.co:5432`.
Error: Command "npm run build" exited with 1
```

## Root Cause

The Vercel build is failing during the `prisma migrate deploy` step because:

**DATABASE_URL environment variable is NOT set in Vercel** or the database is not reachable.

## Solution: Set DATABASE_URL in Vercel

### Step 1: Get Your Supabase Connection String

1. Go to your Supabase project dashboard
2. Navigate to: **Settings** → **Database**
3. Find the **Connection string** section
4. Copy the **Connection pooling** string (or Direct connection)
5. It should look like: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres`

### Step 2: Add DATABASE_URL to Vercel

1. Go to: [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **PartPulse**
3. Navigate to: **Settings** → **Environment Variables**
4. Click: **Add New**
5. Set:
   - **Name**: `DATABASE_URL`
   - **Value**: Your Supabase connection string from Step 1
   - **Environments**: Check all three: ✅ Production, ✅ Preview, ✅ Development
6. Click: **Save**

### Step 3: Redeploy

After adding DATABASE_URL:

**Option A: Redeploy from Vercel Dashboard**
1. Go to: **Deployments** tab
2. Find the failed deployment
3. Click the **⋯** menu button
4. Select: **Redeploy**

**Option B: Push a new commit**
```bash
git commit --allow-empty -m "Trigger redeploy after setting DATABASE_URL"
git push
```

The build will succeed once DATABASE_URL is set.

## Why This Happens

The build script includes:
```bash
"build": "prisma generate && prisma migrate deploy && next build"
```

The `prisma migrate deploy` command:
1. Reads `DATABASE_URL` from environment variables
2. Connects to the database
3. Applies pending migrations

**If DATABASE_URL is not set or database is unreachable, the build fails.**

This is **intentional** - we want builds to fail if migrations can't be applied, preventing deployment of a broken application.

## Verification

After setting DATABASE_URL and redeploying, you should see in Vercel build logs:

```
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
✔ Build Completed
```

## Common Issues

### Issue: "Still can't connect after setting DATABASE_URL"

**Check:**
1. DATABASE_URL format is correct: `postgresql://...`
2. Password doesn't contain special characters that need URL encoding
3. Supabase project is running (check Supabase dashboard)
4. You saved the environment variable in Vercel
5. You redeployed after saving

### Issue: "Which Supabase connection string should I use?"

**Recommendation**: Use **Connection pooling** (port 5432) for better reliability.

If you have issues, try the **Direct connection** string.

### Issue: "Do I need to set other environment variables?"

Yes, for full functionality you'll need:

**Required:**
- `DATABASE_URL` - Database connection
- `AUTH_SECRET` - NextAuth secret (generate with: `openssl rand -base64 32`)
- `NEXTAUTH_URL` - Your Vercel deployment URL

**For Email (optional):**
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`, `ADMIN_EMAIL`

**For Storage (optional):**
- `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_BUCKET`

See `.env.example` for complete list.

## Prevention

This error is now documented as **FL/CI Failure #4** in `qa/FAILURE_LEARNING_LOG.md`.

**To prevent this in future projects:**
1. Set environment variables BEFORE first deployment
2. Use Vercel's environment variable preview during setup
3. Follow deployment checklist in `docs/DATABASE_MIGRATION_DEPLOYMENT.md`

## Related Documentation

- **Setup Guide**: `docs/DATABASE_MIGRATION_DEPLOYMENT.md`
- **Quick Reference**: `docs/QUICK_REFERENCE_DB_MIGRATIONS.md`
- **Environment Variables**: `.env.example`
- **Failure Learning**: `qa/FAILURE_LEARNING_LOG.md`

---

**Next Action**: Set DATABASE_URL in Vercel (Step 2 above) and redeploy.

Once DATABASE_URL is set, migrations will deploy automatically and the application will be fully functional.
