# SG Cars Trends

## [4.0.0](https://github.com/sgcarstrends/sgcarstrends/compare/v3.3.0...v4.0.0) (2025-07-26)


### ⚠ BREAKING CHANGES

* All packages now use unified versioning starting at v3.0.0
* Replace manual changeset workflow with automated semantic-release
* Project structure has been completely reorganized from a single backend service to a monorepo containing both API and web applications.
* Repository structure has been reorganized as a full-stack monorepo

### feat\

* migrate web app into monorepo setup ([cf5bea3](https://github.com/sgcarstrends/sgcarstrends/commit/cf5bea33a045e0cac8bf66571dfe7c09d7d419d3)), closes [#238](https://github.com/sgcarstrends/sgcarstrends/issues/238)
* migrate web into monorepo ([532f849](https://github.com/sgcarstrends/sgcarstrends/commit/532f84978126f4eaf3e0d66333e5a1240a053e5e))


### Features

* add BetaChip and NewChip components ([ff227ac](https://github.com/sgcarstrends/sgcarstrends/commit/ff227acad34241fb72164299a6c66edd16b26303))
* add blog and visitors links to navigation ([1e59f12](https://github.com/sgcarstrends/sgcarstrends/commit/1e59f121beefaa488642b7673729e8a4e2a8945f))
* add car makes overview ([069800a](https://github.com/sgcarstrends/sgcarstrends/commit/069800a4bb8dd745fe574e8ae77d46caffb50f40))
* add chart descriptions and accessibility features ([7094f9b](https://github.com/sgcarstrends/sgcarstrends/commit/7094f9bec62416d9a98905acc35ef6660ba4e663))
* add chart visualisation to fuel and vehicle overview pages ([10fbe60](https://github.com/sgcarstrends/sgcarstrends/commit/10fbe60bcf1c22e5b5b5ad8bd386a2191b8ee064))
* add customised 404 page not found ([422c257](https://github.com/sgcarstrends/sgcarstrends/commit/422c25782ad2379e51007c35f8418dd222f0806d))
* add FAQ to navbar and fix React key warning ([df0ea2a](https://github.com/sgcarstrends/sgcarstrends/commit/df0ea2a92a3388c2495815026505d011800b7395))
* add fire reaction to Telegram messages ([a6c8cc3](https://github.com/sgcarstrends/sgcarstrends/commit/a6c8cc3cc7379e19195c59819a8e4f45be10d8ed))
* add footer ([c60d073](https://github.com/sgcarstrends/sgcarstrends/commit/c60d073f2902b8d9fb4781d53704b692d49e6ba4))
* add loading indicator ([1310390](https://github.com/sgcarstrends/sgcarstrends/commit/13103905c7ea75e3213714635408e80f6195b37a))
* add overview pages for fuel and vehicle types ([ad37412](https://github.com/sgcarstrends/sgcarstrends/commit/ad374124c220d63901836d26a41879fc1affd3a8))
* add terms of service and privacy policy pages ([ea6529e](https://github.com/sgcarstrends/sgcarstrends/commit/ea6529e653c7d8cdfaa7b9eeb9d41f6077cae397))
* complete database consolidation and update configurations ([7bd5ec7](https://github.com/sgcarstrends/sgcarstrends/commit/7bd5ec7dc7d8c070698373d435f59e54d85be07b))
* create shared database package with consolidated schemas ([3d512ff](https://github.com/sgcarstrends/sgcarstrends/commit/3d512ffbab98e279f0a2c2a6af70db4496dbfe29))
* enhance maintenance notice with Framer Motion animations and improved UX ([cb78ea0](https://github.com/sgcarstrends/sgcarstrends/commit/cb78ea0888c7b9442bcc4093c2653ff92face6a8))
* enhance navigation dropdown with icons and descriptions ([fba6576](https://github.com/sgcarstrends/sgcarstrends/commit/fba6576add1f483bf58b4a08def3b60ea769705f))
* implement /coe/latest route with HeroUI components ([c4eed67](https://github.com/sgcarstrends/sgcarstrends/commit/c4eed6719b39c71c3ee58cc94ec9d4a2909e3818))
* implement basic llm.txt file for AI SEO optimization ([68c6980](https://github.com/sgcarstrends/sgcarstrends/commit/68c69802ae1be9a321fdfd8fd54fae4c26ef5f65))
* implement basic llm.txt file for AI SEO optimization ([af7bb26](https://github.com/sgcarstrends/sgcarstrends/commit/af7bb26d3623513e7eb4b6e60df87d82da5050e1)), closes [#285](https://github.com/sgcarstrends/sgcarstrends/issues/285)
* implement comprehensive structured data schemas (JSON-LD) ([ea206bf](https://github.com/sgcarstrends/sgcarstrends/commit/ea206bf83b3de3e902e646d9a3d64b71ec9976a2))
* implement comprehensive structured data schemas (JSON-LD) ([872a10a](https://github.com/sgcarstrends/sgcarstrends/commit/872a10a4e2e65cf251853962554b6a02d26211d7)), closes [#286](https://github.com/sgcarstrends/sgcarstrends/issues/286)
* improve Telegram message formatting ([2b354b0](https://github.com/sgcarstrends/sgcarstrends/commit/2b354b0f67ee79d814ffcf36fb579abd80a82781))
* migrate database migrations to shared package ([50bacc9](https://github.com/sgcarstrends/sgcarstrends/commit/50bacc918b0354ba4e9110b70278d571b9a21f1c))
* migrate from changesets to semantic-release ([a091c5e](https://github.com/sgcarstrends/sgcarstrends/commit/a091c5e55d28bcda8d50ec2d30b357c62fcb6894))
* migrate months and makes selector to autocomplete ([1c3d586](https://github.com/sgcarstrends/sgcarstrends/commit/1c3d586424f1c417cbf30d58e4991397d836c25b))
* migrate sidebar to navbar ([14fccb8](https://github.com/sgcarstrends/sgcarstrends/commit/14fccb8e4f5c6778497b5adbda7fed8e052b2e9b))
* optimize API calls with React cache and ISR ([db6be89](https://github.com/sgcarstrends/sgcarstrends/commit/db6be8915e75bf028fb545dd3259b7380827a54f))
* remove y/y comparison for registration stats ([f718b41](https://github.com/sgcarstrends/sgcarstrends/commit/f718b41dc255cdedfb034957ee7d08c3f1872c20))
* **web:** Add additional COE pages ([39d8329](https://github.com/sgcarstrends/sgcarstrends/commit/39d8329150038a34ff27396329c94ddafc8ae20f))


### Bug Fixes

* **api:** broken workflows route ([9651e26](https://github.com/sgcarstrends/sgcarstrends/commit/9651e26142fd2d6ae876a225cde4828199b72ef1))
* **api:** clean up domain names ([be5271b](https://github.com/sgcarstrends/sgcarstrends/commit/be5271b17ecb04bd4f69127ae72dcec41c8e42d1))
* broken HeroUI styling ([c6f6f5c](https://github.com/sgcarstrends/sgcarstrends/commit/c6f6f5c6056d177fb66f8469518709ac22c1a7e1))
* build errors ([2d3c27d](https://github.com/sgcarstrends/sgcarstrends/commit/2d3c27d4fb8fbc3f6b5e8c0735ce1c444bc64119))
* car logos not being fetched properly ([c84fdf4](https://github.com/sgcarstrends/sgcarstrends/commit/c84fdf41fc6391d3165fd761ec32442e2c936d3f))
* correct CategoryCountSchema field name from label to name ([663148f](https://github.com/sgcarstrends/sgcarstrends/commit/663148fa01cc019bc14a85d3068152e8b041e9d6))
* expand hybrid fuel types ([456d5bb](https://github.com/sgcarstrends/sgcarstrends/commit/456d5bbbf9fc96ebe1f362ac0319a096da3af0a8))
* handle Twitter 280-character limit for non-premium accounts ([de27cf3](https://github.com/sgcarstrends/sgcarstrends/commit/de27cf3edf811d69252ea58cbbf4a13d7bbd2038))
* handle Twitter 280-character limit for non-premium accounts ([21cc1df](https://github.com/sgcarstrends/sgcarstrends/commit/21cc1df5888b6ec22e980665aa17bad8fd2bfa12))
* middleware not working correctly ([495b72d](https://github.com/sgcarstrends/sgcarstrends/commit/495b72d71ec997e4f0fe33114642fc3e8e5fc151))
* remove duplicate Twitter commit entry from changelog ([927fad1](https://github.com/sgcarstrends/sgcarstrends/commit/927fad1992ffd3f2c515535bcc08658fbe6680e5))
* remove structured data ([2283ca5](https://github.com/sgcarstrends/sgcarstrends/commit/2283ca5a1309bc54bcc450ea27d604f57e9a5870))
* sync car logos on build ([305fc30](https://github.com/sgcarstrends/sgcarstrends/commit/305fc30937efcc38842e8fa8970a78ca901be2ed))
* **web:** build errors ([e75c4e5](https://github.com/sgcarstrends/sgcarstrends/commit/e75c4e57d5c2d28eef7b72fda6588015fc7a96de))
* **web:** error 500 in make page due to invalid logo ([c3b53eb](https://github.com/sgcarstrends/sgcarstrends/commit/c3b53ebcdacddca421af6cbb8bd2c87263f50730))
* **web:** layout too stretched on larger screens ([a5f8b32](https://github.com/sgcarstrends/sgcarstrends/commit/a5f8b3210813eec18df2b7db130909e62ce2d991))
* **web:** remove misleading commercial faq ([4542d02](https://github.com/sgcarstrends/sgcarstrends/commit/4542d0231925591d23eebdbdca743f25a31cf869))
* **web:** value caught by SonarCloud ([1d7c264](https://github.com/sgcarstrends/sgcarstrends/commit/1d7c26439494663c098622f46980cd0b64e4741e))


### Performance Improvements

* **ci:** improve release workflow speed and add Turbo caching ([8c43f6b](https://github.com/sgcarstrends/sgcarstrends/commit/8c43f6bab9fb25aa4c03ad674c93fbc1d679187b))


### Code Refactoring

* migrate from semantic-release to changesets with unified versioning ([f73b9e6](https://github.com/sgcarstrends/sgcarstrends/commit/f73b9e6683e16cf0debf492a4d70ac8d1629c619))

## [3.3.0](https://github.com/sgcarstrends/sgcarstrends/compare/v3.2.0...v3.3.0) (2025-07-25)


### Features

* add BetaChip and NewChip components ([ff227ac](https://github.com/sgcarstrends/sgcarstrends/commit/ff227acad34241fb72164299a6c66edd16b26303))
* add fire reaction to Telegram messages ([a6c8cc3](https://github.com/sgcarstrends/sgcarstrends/commit/a6c8cc3cc7379e19195c59819a8e4f45be10d8ed))
* improve Telegram message formatting ([2b354b0](https://github.com/sgcarstrends/sgcarstrends/commit/2b354b0f67ee79d814ffcf36fb579abd80a82781))
* migrate months and makes selector to autocomplete ([1c3d586](https://github.com/sgcarstrends/sgcarstrends/commit/1c3d586424f1c417cbf30d58e4991397d836c25b))
* optimize API calls with React cache and ISR ([db6be89](https://github.com/sgcarstrends/sgcarstrends/commit/db6be8915e75bf028fb545dd3259b7380827a54f))


### Bug Fixes

* **api:** clean up domain names ([be5271b](https://github.com/sgcarstrends/sgcarstrends/commit/be5271b17ecb04bd4f69127ae72dcec41c8e42d1))
* correct CategoryCountSchema field name from label to name ([663148f](https://github.com/sgcarstrends/sgcarstrends/commit/663148fa01cc019bc14a85d3068152e8b041e9d6))
* handle Twitter 280-character limit for non-premium accounts ([de27cf3](https://github.com/sgcarstrends/sgcarstrends/commit/de27cf3edf811d69252ea58cbbf4a13d7bbd2038))
* handle Twitter 280-character limit for non-premium accounts ([21cc1df](https://github.com/sgcarstrends/sgcarstrends/commit/21cc1df5888b6ec22e980665aa17bad8fd2bfa12))
* remove duplicate Twitter commit entry from changelog ([927fad1](https://github.com/sgcarstrends/sgcarstrends/commit/927fad1992ffd3f2c515535bcc08658fbe6680e5))
* **web:** remove misleading commercial faq ([4542d02](https://github.com/sgcarstrends/sgcarstrends/commit/4542d0231925591d23eebdbdca743f25a31cf869))
* **web:** value caught by SonarCloud ([1d7c264](https://github.com/sgcarstrends/sgcarstrends/commit/1d7c26439494663c098622f46980cd0b64e4741e))

## v3.0.0 (2025-07-20)

### 🎉 Unified Versioning Migration

This release marks the migration from semantic-release to changesets with unified versioning across all packages.

#### 📦 All Packages Now at v3.0.0
- **Web App**: Breaking changes migration (was 2.8.0 → 3.0.0)  
- **API**: Bundled into unified versioning (was 3.0.0 → unified 3.0.0)
- **Documentation**: Aligned with platform version
- **Types & Utils**: Aligned with platform version

#### 🔄 Release Process Changes
- **Migrated** from semantic-release to changesets
- **Unified versioning**: All packages version together
- **Simplified workflow**: Single release per version
- **Team collaboration**: Changeset files for release notes

#### 🛠️ Technical Changes
- Consolidated all package versions to 3.0.0
- Fixed versioning strategy for all @sgcarstrends/* packages
- Updated GitHub Actions workflow for changesets
- Cleaned up individual package release tags and releases

---
**Going forward:** All packages will maintain the same version number, ensuring compatibility and simplified dependency management.
