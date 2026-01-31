# CLAUDE.md - Infrastructure

This directory contains the SST (Serverless Stack) v3.17.10 infrastructure configuration for SG Cars Trends.

## Infrastructure Architecture

- **Framework**: SST v3.17.10
- **Cloud Provider**: AWS (Singapore region: ap-southeast-1)
- **Architecture**: arm64
- **Runtime**: Node.js 22.x
- **DNS**: Cloudflare
- **Domain**: sgcarstrends.com
- **Current Version**: v4.11.0

## Stage Configuration

### Permanent Stages
- **prod**: Production environment (apex domain: sgcarstrends.com)
- **staging**: Staging environment (staging.sgcarstrends.com)

### Ephemeral Stages
- **PR stages**: `pr-{number}` - Created for pull request previews
- **dev**: Local development stage

## Domain Strategy

**Permanent stages**: `sgcarstrends.com` (prod), `staging.sgcarstrends.com`
**Ephemeral stages**: `{stage}.dev.sgcarstrends.com`

See `domain-management` skill for DNS configuration and routing patterns.

## File Structure

- **config.ts**: Shared configuration (permanent stages)
- **router.ts**: Domain routing and URL management
- **web.ts**: Next.js web application configuration (includes API routes and Vercel WDK workflows)

## Key Infrastructure Components

### Router (router.ts)
- Cloudflare DNS integration
- Dynamic subdomain generation based on stage type
- Wildcard subdomain support for permanent stages

### Configuration (config.ts)
- Stage type detection for permanent vs ephemeral stages

## Development Guidelines

### Adding New Infrastructure
1. Follow the existing pattern of stage-specific configuration
2. Use `isPermanentStage` to differentiate between permanent and ephemeral stages
3. Leverage the shared router for domain management
4. Add environment variables directly to the web.ts configuration

### Stage Management

Permanent stages use full router with Cloudflare DNS, ephemeral stages reference existing router. See `sst-deployment` skill for stage management patterns.

### Environment Variables
- Set environment variables directly in Lambda function configuration
- Use `process.env.VARIABLE_NAME as string` for required variables
- Add validation in application code for critical environment variables
- Use environment-specific defaults where appropriate

## Deployment Commands

See `sst-deployment` skill for deployment workflows and stage management commands.

## Best Practices

1. **Stage Isolation**: Each stage is completely isolated with its own resources
2. **Resource Cleanup**: Ephemeral stages should be removed after use (handled by GitHub Actions)
3. **DNS Management**: Let SST handle DNS for permanent stages, reference existing for ephemeral
4. **Security**: Use least-privilege IAM roles and ensure environment variables are properly secured
5. **Monitoring**: Each stage has its own CloudWatch logs and metrics