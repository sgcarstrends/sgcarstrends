## [4.0.3](https://github.com/sgcarstrends/sgcarstrends/compare/v4.0.2...v4.0.3) (2025-07-28)

### Bug Fixes

* feature flag in mobile menu ([97dca1d](https://github.com/sgcarstrends/sgcarstrends/commit/97dca1dfbe8b501318361b11498330bdcf2c3528))

## [4.0.2](https://github.com/sgcarstrends/sgcarstrends/compare/v4.0.1...v4.0.2) (2025-07-28)

### Bug Fixes

* mobile menu not closing when navigation item clicked ([783cef1](https://github.com/sgcarstrends/sgcarstrends/commit/783cef15db7004ed4de443c08f86a2907535f65b))

## [4.0.1](https://github.com/sgcarstrends/sgcarstrends/compare/v4.0.0...v4.0.1) (2025-07-26)

### Reverts

* Revert "feat: improve Telegram message formatting" ([204d061](https://github.com/sgcarstrends/sgcarstrends/commit/204d061e069022502cab53304e5794ae6cf016be))

## [4.0.0](https://github.com/sgcarstrends/sgcarstrends/compare/v3.1.0...v4.0.0) (2025-07-26)

### ⚠ BREAKING CHANGES

* setup SST infrastructure for monorepo setup (#416)

# [3.1.0](https://github.com/sgcarstrends/sgcarstrends/compare/v3.0.0...v3.1.0) (2025-07-26)

### Bug Fixes

* **api:** clean up domain names ([be5271b](https://github.com/sgcarstrends/sgcarstrends/commit/be5271b17ecb04bd4f69127ae72dcec41c8e42d1))
* correct CategoryCountSchema field name from label to name ([663148f](https://github.com/sgcarstrends/sgcarstrends/commit/663148fa01cc019bc14a85d3068152e8b041e9d6))
* handle Twitter 280-character limit for non-premium accounts ([21cc1df](https://github.com/sgcarstrends/sgcarstrends/commit/21cc1df5888b6ec22e980665aa17bad8fd2bfa12))
* remove duplicate Twitter commit entry from changelog ([927fad1](https://github.com/sgcarstrends/sgcarstrends/commit/927fad1992ffd3f2c515535bcc08658fbe6680e5))
* **web:** error 500 in make page due to invalid logo ([c3b53eb](https://github.com/sgcarstrends/sgcarstrends/commit/c3b53ebcdacddca421af6cbb8bd2c87263f50730))
* **web:** layout too stretched on larger screens ([a5f8b32](https://github.com/sgcarstrends/sgcarstrends/commit/a5f8b3210813eec18df2b7db130909e62ce2d991))
* **web:** remove misleading commercial faq ([4542d02](https://github.com/sgcarstrends/sgcarstrends/commit/4542d0231925591d23eebdbdca743f25a31cf869))
* **web:** value caught by SonarCloud ([1d7c264](https://github.com/sgcarstrends/sgcarstrends/commit/1d7c26439494663c098622f46980cd0b64e4741e))


### Features

* add BetaChip and NewChip components ([ff227ac](https://github.com/sgcarstrends/sgcarstrends/commit/ff227acad34241fb72164299a6c66edd16b26303))
* add fire reaction to Telegram messages ([a6c8cc3](https://github.com/sgcarstrends/sgcarstrends/commit/a6c8cc3cc7379e19195c59819a8e4f45be10d8ed))
* implement semantic-release for automated versioning ([1e399c6](https://github.com/sgcarstrends/sgcarstrends/commit/1e399c666ca56cad5ee199c194b15ff38ee00279))
* improve Telegram message formatting ([2b354b0](https://github.com/sgcarstrends/sgcarstrends/commit/2b354b0f67ee79d814ffcf36fb579abd80a82781))
* migrate months and makes selector to autocomplete ([1c3d586](https://github.com/sgcarstrends/sgcarstrends/commit/1c3d586424f1c417cbf30d58e4991397d836c25b))
* optimize API calls with React cache and ISR ([db6be89](https://github.com/sgcarstrends/sgcarstrends/commit/db6be8915e75bf028fb545dd3259b7380827a54f))

# 3.0.0 (2025-07-21)

🎉 **Unified Versioning Migration**

This release marks the migration from semantic-release to changesets with unified versioning across all packages.

### 📦 All Packages Now at v3.0.0
- **Web App**: Breaking changes migration
- **API**: Bundled into unified versioning
- **Documentation**: Aligned with platform version
- **Types & Utils**: Aligned with platform version

### 🔄 Release Process Changes
- **Migrated** from semantic-release to changesets
- **Unified versioning**: All packages version together
- **Simplified workflow**: Single release per version
- **Team collaboration**: Changeset files for release notes

### 🛠️ Technical Changes
- Consolidated all package versions to 3.0.0
- Fixed versioning strategy for all @sgcarstrends/* packages
- Updated GitHub Actions workflow for changesets
- Cleaned up individual package release tags and releases

---
**Going forward:** All packages will maintain the same version number, ensuring compatibility and simplified dependency management.
