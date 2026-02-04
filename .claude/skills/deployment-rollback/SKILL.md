---
name: deployment-rollback
description: Rollback failed deployments, restore previous versions, and handle deployment emergencies. Use when deployments fail, critical bugs are discovered in production, performance degrades after deployment, or emergency recovery is needed.
allowed-tools: Read, Edit, Write, Bash, Grep
---

# Deployment Rollback Skill

## Quick Rollback

```bash
# SST rollback to previous version
sst deploy --stage production --to v1.1.0

# Or checkout previous tag and redeploy
git checkout v1.1.0
sst deploy --stage production

# Service-specific rollback
sst deploy api --stage production --to v1.1.0
```

## Database Rollback

```bash
# Rollback last migration
pnpm -F @sgcarstrends/database db:rollback

# Rollback to specific migration
pnpm -F @sgcarstrends/database db:rollback --to 20240115_initial

# Restore from backup
pg_dump $DATABASE_URL > backup-pre-deploy.sql  # Before deploy
psql $DATABASE_URL < backup-pre-deploy.sql     # Restore if needed
```

## Lambda Version Rollback

```bash
# List versions
aws lambda list-versions-by-function --function-name sgcarstrends-api-prod

# Update alias to previous version
aws lambda update-alias \
  --function-name sgcarstrends-api-prod \
  --name production \
  --function-version 42
```

## Git-Based Rollback

```bash
# Revert specific commit
git revert <commit-hash>
git push origin main  # CI redeploys

# Create rollback branch
git checkout -b rollback/v1.1.0
git reset --hard v1.1.0
git push origin rollback/v1.1.0
gh pr create --title "Rollback to v1.1.0" --body "Emergency rollback"
```

## Cache Invalidation

```bash
# Clear Redis
redis-cli -h $REDIS_HOST FLUSHALL

# Clear CloudFront CDN
aws cloudfront create-invalidation --distribution-id E123 --paths "/*"
```

## Health Checks During Rollback

```bash
curl -f https://api.sgcarstrends.com/health || echo "API unhealthy"
curl -f https://sgcarstrends.com || echo "Web unhealthy"
psql $DATABASE_URL -c "SELECT 1" || echo "Database unreachable"
```

## Rollback Checklist

**Pre-Rollback:**
- [ ] Identify issue and severity
- [ ] Determine scope (full/partial)
- [ ] Check backup availability
- [ ] Notify team

**During:**
- [ ] Rollback application code
- [ ] Rollback database if needed
- [ ] Clear caches
- [ ] Verify health checks
- [ ] Run smoke tests

**Post:**
- [ ] Monitor error rates
- [ ] Verify functionality restored
- [ ] Document what happened
- [ ] Create postmortem

## Common Scenarios

**Critical Bug:**
```bash
sst deploy --stage production --to v1.1.0
curl https://api.sgcarstrends.com/health
aws cloudfront create-invalidation --distribution-id E123 --paths "/*"
```

**Database Migration Failure:**
```bash
pnpm -F @sgcarstrends/database db:rollback
git checkout v1.1.0
sst deploy --stage production
```

**Partial Rollback (API only):**
```bash
sst deploy api --stage production --to v1.1.0
```

## Troubleshooting

**Rollback fails:**
```bash
git checkout v1.1.0 && pnpm install && pnpm build && pnpm deploy:prod --force
```

**Database schema mismatch:**
```bash
pnpm -F @sgcarstrends/database db:rollback
# Or restore backup: psql $DATABASE_URL < backup-pre-deploy.sql
```

## Best Practices

1. **Always Backup**: Create backups before deployments
2. **Test Rollback**: Practice rollback procedures in staging
3. **Feature Flags**: Use for quick feature disabling without rollback
4. **Monitor Closely**: Watch metrics during and after rollback
5. **Document Everything**: Record what happened and why

## References

- SST Deployments: https://docs.sst.dev/deployment
- See `monitoring` skill for debugging issues
