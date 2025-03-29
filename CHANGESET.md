# Using Changesets

This project uses [Changesets](https://github.com/changesets/changesets) for managing versioning and publishing.

## How to Contribute Changes

When making changes to packages in this monorepo, follow these steps:

1. Make your code changes in a feature branch
2. Add a changeset to describe your changes:

```bash
pnpm changeset
```

3. Select the packages you've modified
4. Choose the appropriate semver bump type:
   - `patch`: Bug fixes and minor changes
   - `minor`: New features (backward compatible)
   - `major`: Breaking changes
5. Write a summary of your changes (this will go in the changelog)
6. Commit the generated changeset file along with your code changes
7. Push your branch and create a pull request

## What Happens Behind the Scenes

1. When PRs are merged to the main branch, a GitHub Action will:
   - Create or update a "Version Packages" PR that applies all changesets
   - This PR will update package versions and changelogs

2. When the "Version Packages" PR is merged:
   - Package versions are updated according to changesets
   - Changelogs are generated
   - Git tags are created
   - Packages marked for publishing will be released

## Versioning Strategy

- We follow [Semantic Versioning](https://semver.org/)
- All public packages are versioned independently
- Internal dependencies are updated automatically with patch versions

## Changesets Configuration

Our changesets setup is configured in `.changeset/config.json`:

- `linked`: Packages with the same scope are linked for consistent versioning
- `commit`: Automated commits are enabled for version changes
- `access`: Packages are restricted (private)
- `baseBranch`: Main branch is used as the base for version comparisons