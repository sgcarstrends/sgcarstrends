# Semantic Release Workflow

This project now uses **semantic-release** for automated versioning and releasing. This replaces the previous changeset workflow.

## Overview

Semantic-release automatically determines version bumps and generates releases based on **conventional commit messages**. No more manual changelog creation!

## Conventional Commit Format

All commit messages must follow this format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- `feat`: New feature (minor version bump)
- `fix`: Bug fix (patch version bump)
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `build`: Build system changes
- `revert`: Reverting changes

### Scopes
- `api`: API service changes
- `web`: Web application changes
- `docs`: Documentation site changes
- `types`: Shared types package changes
- `utils`: Shared utils package changes
- `deps`: Dependency updates
- `release`: Release-related changes
- `ci`: CI/CD configuration
- `root`: Root-level changes

### Breaking Changes
For major version bumps, include `BREAKING CHANGE:` in the commit footer or use `!` after type/scope:

```
feat(api)!: remove deprecated endpoint
```

## Examples

```bash
# Minor version bump (new feature)
git commit -m "feat(api): add user authentication endpoint"

# Patch version bump (bug fix)
git commit -m "fix(web): resolve chart rendering issue"

# No version bump (documentation)
git commit -m "docs(api): update README with new endpoints"

# Major version bump (breaking change)
git commit -m "feat(api)!: restructure API response format

BREAKING CHANGE: All API responses now include metadata wrapper"
```

## Release Process

### Automatic Releases
- Releases happen automatically when commits are pushed to `main` branch
- GitHub Actions runs tests, builds, and creates releases for each changed package
- Changelogs are automatically generated
- Git tags are created with format `@sgcarstrends/<package>@<version>`

### Manual Testing
Test your changes locally before pushing:

```bash
# Dry run to see what would be released
pnpm release:dry

# Dry run for all packages
pnpm release:all:dry
```

### Package Scripts
- `pnpm release`: Run semantic-release for root
- `pnpm release:dry`: Dry run for root
- `pnpm release:all`: Release all packages sequentially
- `pnpm release:all:dry`: Dry run for all packages

## Commit Validation

The project uses **commitlint** with **husky** to validate commit messages:

- Invalid commit messages will be rejected
- Validation happens on every commit
- Use the conventional commit format to pass validation

## Migration Notes

### What Changed
- ✅ No more manual changeset creation
- ✅ Automatic version bumping based on commit messages
- ✅ Auto-generated changelogs
- ✅ Consistent release process across all packages

### Developer Workflow
1. Write code
2. Commit with conventional message format
3. Push to feature branch
4. Create PR to `main`
5. Merge PR → automatic release happens

### Emergency Releases
If you need to release immediately:
1. Ensure your commit messages follow conventional format
2. Push directly to `main` (if you have permissions)
3. GitHub Actions will handle the release

## Troubleshooting

### Commit Message Rejected
```
✖ subject may not be empty [subject-empty]
✖ type may not be empty [type-empty]
```
**Solution**: Use conventional commit format: `type(scope): description`

### No Release Generated
- Check if your commit types trigger releases (`feat`, `fix`, `perf`)
- Documentation and style changes don't trigger releases
- Use `feat` for new features, `fix` for bug fixes

### Release Failed
- Check GitHub Actions logs
- Ensure all tests pass
- Verify no lint errors
- Check if semantic-release configuration is valid

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Release](https://semantic-release.gitbook.io/)
- [Commitlint](https://commitlint.js.org/)