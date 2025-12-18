# Quick Reference: Database Migration Deployment

## ✅ Current Status

This project is **CORRECTLY CONFIGURED** for automatic database migration deployment from Vercel.

## 🚀 How It Works

When you push code to GitHub:

1. **Vercel starts a build**
2. **Runs `npm run build`** which executes:
   ```bash
   prisma generate        # Generate Prisma Client
   prisma migrate deploy  # Apply migrations to production database
   next build            # Build Next.js application
   ```
3. **Migrations applied automatically** to the DATABASE_URL from Vercel environment variables
4. **Application deployed** with schema in sync

**Zero manual steps required!**

## 🔍 Verify Configuration

Run this anytime to check configuration is correct:

```bash
npm run verify:db-deployment
```

Should output: ✅ VALIDATION PASSED

## 📝 Adding New Migrations

When you need to change the database schema:

### 1. Edit Schema

```bash
# Edit prisma/schema.prisma
# Add new models, fields, or relationships
```

### 2. Create Migration (Without Applying It)

```bash
# This creates migration files but doesn't connect to database
npx prisma migrate dev --name add_your_feature --create-only
```

### 3. Review Generated SQL

```bash
# Check the generated migration
cat prisma/migrations/TIMESTAMP_add_your_feature/migration.sql
```

### 4. Commit and Push

```bash
git add prisma/migrations/
git commit -m "Add migration for new feature"
git push
```

### 5. Automatic Deployment

- Vercel picks up the new migration files
- Runs `prisma migrate deploy` during build
- Applies migration to production database
- Deploys updated application

**That's it!** No manual database access needed.

## 🚨 Emergency: Roll Back a Migration

Prisma doesn't support automatic rollback. To revert:

1. **Create a reverse migration**:
   ```bash
   npx prisma migrate dev --name revert_bad_change --create-only
   ```

2. **Write SQL to undo the change** in the new migration file

3. **Commit and push** - Vercel will apply the reversal

## 📚 Full Documentation

- **Complete Guide**: [docs/DATABASE_MIGRATION_DEPLOYMENT.md](./DATABASE_MIGRATION_DEPLOYMENT.md)
- **Failure Analysis**: [qa/FAILURE_LEARNING_LOG.md](../qa/FAILURE_LEARNING_LOG.md) (Failure #3)
- **Tests**: [__tests__/deployment/database-schema-deployment.test.ts](../__tests__/deployment/database-schema-deployment.test.ts)

## 🎯 Quick Checklist

Before deploying database changes:

- [ ] Schema updated in `prisma/schema.prisma`
- [ ] Migration created with `--create-only`
- [ ] Migration SQL reviewed
- [ ] Migration files committed to git
- [ ] `npm run verify:db-deployment` passes
- [ ] Tested on preview deployment
- [ ] Ready to merge

## 🔐 Environment Variables

Required in Vercel for all environments (Production, Preview, Development):

```env
DATABASE_URL=postgresql://user:password@host:5432/database
```

Set at: **Vercel Dashboard → Project → Settings → Environment Variables**

## ❌ Common Mistakes to Avoid

### DON'T:
- ❌ Run migrations manually against production
- ❌ Create tables manually in production
- ❌ Edit existing migration files
- ❌ Add `prisma/migrations` to `.gitignore`
- ❌ Remove `prisma migrate deploy` from build script
- ❌ Use `prisma db push` in production

### DO:
- ✅ Let Vercel run migrations automatically
- ✅ Commit all migration files to git
- ✅ Use `--create-only` for local migration creation
- ✅ Test migrations on preview deployments first
- ✅ Review migration SQL before committing

## 📊 Check Migration Status

### In Vercel Build Logs

Look for:
```
> prisma migrate deploy
✔ Applied migration 20251217163056_init
All migrations have been successfully applied.
```

### In Supabase

Run SQL query:
```sql
SELECT migration_name, finished_at 
FROM "_prisma_migrations" 
ORDER BY finished_at DESC;
```

## 🆘 Troubleshooting

### Build fails with "Can't reach database server"

**Fix**: Verify DATABASE_URL is set in Vercel environment variables

### Build fails with "Migration failed"

**Fix**: Check Vercel logs for SQL error, create new migration to fix

### Tables not created after deployment

**Fix**: 
1. Check Vercel build logs for migration errors
2. Verify migration files are committed to git
3. Run `npm run verify:db-deployment`

## 📞 Need Help?

1. Run verification: `npm run verify:db-deployment`
2. Check documentation: [docs/DATABASE_MIGRATION_DEPLOYMENT.md](./DATABASE_MIGRATION_DEPLOYMENT.md)
3. Review FL/CI log: [qa/FAILURE_LEARNING_LOG.md](../qa/FAILURE_LEARNING_LOG.md)
4. Check test suite: [__tests__/deployment/database-schema-deployment.test.ts](../__tests__/deployment/database-schema-deployment.test.ts)

---

**Last Updated**: 2025-12-17  
**Status**: Production-Ready
