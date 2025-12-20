# Tag Push Instructions for v0.1.0-baseline

## Context

This PR creates the baseline release tag `v0.1.0-baseline` on commit `058c991fe36877d9f5416ba0a7d786394ce71535`.

The tag has been created locally in this PR branch, but needs to be pushed to the remote repository after this PR is merged.

## Post-Merge Actions Required

After this PR is merged to `main`, the tag must be manually pushed to GitHub.

### Step 1: Ensure you're on main branch
```bash
git checkout main
git pull origin main
```

### Step 2: Verify the tag exists locally
```bash
git tag -l v0.1.0-baseline
```

Expected output:
```
v0.1.0-baseline
```

### Step 3: Verify tag points to correct commit
```bash
git show v0.1.0-baseline --no-patch
```

Expected output should show:
- Tag: `v0.1.0-baseline`
- Commit: `058c991...`
- Message: "Baseline release: Stable CI-GREEN system following Unit A remediation"

### Step 4: Push the tag to origin
```bash
git push origin v0.1.0-baseline
```

Expected output:
```
To https://github.com/MaturionISMS/PartPulse.git
 * [new tag]         v0.1.0-baseline -> v0.1.0-baseline
```

### Step 5: Verify tag in GitHub UI

1. Navigate to: https://github.com/MaturionISMS/PartPulse/tags
2. Verify `v0.1.0-baseline` appears in the tag list
3. Click on the tag to verify it points to commit `058c991`

## Verification

After pushing the tag, verify:
- ✅ Tag appears in GitHub repository under "Tags"
- ✅ Tag points to commit `058c991fe36877d9f5416ba0a7d786394ce71535`
- ✅ `RELEASE_GOVERNANCE.md` exists in repository root
- ✅ CI status remains GREEN (no configuration changes were made)

## Troubleshooting

### If tag doesn't exist after PR merge
The tag may not have been included in the merge. Recreate it:

```bash
git checkout main
git pull origin main
git tag -a v0.1.0-baseline 058c991 -m "Baseline release: Stable CI-GREEN system following Unit A remediation"
git push origin v0.1.0-baseline
```

### If tag push fails with authentication error
Ensure you have proper GitHub authentication configured:
- Use SSH: `git remote set-url origin git@github.com:MaturionISMS/PartPulse.git`
- Or use GitHub CLI: `gh auth login`

### If tag already exists remotely
Check if someone already pushed it:
```bash
git ls-remote --tags origin v0.1.0-baseline
```

If it exists and points to the correct commit, no action needed.

## Cleanup

After successful tag push, this instruction file can be deleted:
```bash
git rm TAG_PUSH_INSTRUCTIONS.md
git commit -m "Remove tag push instructions (task complete)"
git push origin main
```

---

**This file should be removed after the tag is successfully pushed to GitHub.**
