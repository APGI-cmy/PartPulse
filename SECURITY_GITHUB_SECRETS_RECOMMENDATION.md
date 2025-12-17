# Security Recommendation: GitHub Actions Secrets

## Current State

The CI workflow (`.github/workflows/qa-enforcement.yml`) currently has sensitive credentials hardcoded as environment variables:
- `SMTP_PASS`: Gmail app password
- `AUTH_SECRET`: NextAuth secret key
- `SUPABASE_SERVICE_KEY`: Supabase service role JWT token

## Security Concern

While these credentials are already present in `.env.example` (which is committed to the repository), having them in the workflow file increases the exposure surface. Anyone with repository read access can see these credentials.

## Recommendation

### 1. Store Secrets in GitHub

Navigate to your repository settings and add these as GitHub Actions secrets:

1. Go to: `Settings` → `Secrets and variables` → `Actions`
2. Click `New repository secret`
3. Add the following secrets:

| Secret Name | Value | Source |
|-------------|-------|--------|
| `SMTP_PASS` | `purntgtitomgninx` | Gmail app password |
| `AUTH_SECRET` | `5JAY98Nnv05gnSaI4iZg3Uv3TkyRtMQCRYuJ1B2qxxM=` | NextAuth secret |
| `SUPABASE_SERVICE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabase service role key |

### 2. Update Workflow to Use Secrets

After adding secrets to GitHub, update `.github/workflows/qa-enforcement.yml`:

```yaml
- name: Run test suite
  env:
    # ... other vars ...
    SMTP_PASS: ${{ secrets.SMTP_PASS }}
    AUTH_SECRET: ${{ secrets.AUTH_SECRET }}
    SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
```

## Alternative: Accept Current Configuration

If you prefer to keep the current configuration because:
- These credentials are already in `.env.example` (publicly visible)
- The repository is private
- You plan to rotate these credentials anyway

Then the current configuration is acceptable, but consider:
1. Rotating the Gmail app password periodically
2. Rotating the AUTH_SECRET
3. Using IP restrictions on Supabase service key if possible

## Additional Security Measures

### Gmail App Password
- Enable 2FA on the Gmail account
- Use a dedicated service account for sending emails
- Rotate the app password every 90 days

### NextAuth Secret
- Rotate the AUTH_SECRET periodically
- Use a strong, randomly generated secret (current one appears secure)

### Supabase Service Key
- Consider using Supabase Row Level Security (RLS) policies
- Limit service key usage to only what's necessary
- Monitor Supabase audit logs for unusual activity

## Implementation Priority

**High Priority:**
- [ ] Move SMTP_PASS to GitHub secret
- [ ] Move AUTH_SECRET to GitHub secret  
- [ ] Move SUPABASE_SERVICE_KEY to GitHub secret

**Medium Priority:**
- [ ] Set up credential rotation schedule
- [ ] Enable 2FA on Gmail account
- [ ] Review Supabase RLS policies

**Low Priority:**
- [ ] Consider using a secrets management service (e.g., HashiCorp Vault, AWS Secrets Manager)
- [ ] Implement automated credential rotation

## Testing After Implementation

After moving secrets to GitHub Actions, verify:
1. CI workflow runs successfully
2. Tests pass with secrets from GitHub
3. Email sending works in test environment
4. Supabase storage operations work

## Current Risk Assessment

**Risk Level:** Medium

**Reasoning:**
- Credentials are already in `.env.example` (mitigating factor)
- Repository visibility determines actual exposure
- No evidence of credential compromise
- Functional testing requirements necessitate valid credentials

**Recommendation:** Proceed with moving to GitHub secrets at earliest convenience, but current configuration is acceptable for immediate deployment needs.
