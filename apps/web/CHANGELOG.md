# @sgcarstrends/web

## [4.0.0](https://github.com/sgcarstrends/sgcarstrends/compare/web-v3.0.1...web-v4.0.0) (2025-07-23)


### ⚠ BREAKING CHANGES

* All packages now use unified versioning starting at v3.0.0
* Replace manual changeset workflow with automated semantic-release
* Project structure has been completely reorganized from a single backend service to a monorepo containing both API and web applications.
* Repository structure has been reorganized as a full-stack monorepo

### feat\

* migrate web app into monorepo setup ([cf5bea3](https://github.com/sgcarstrends/sgcarstrends/commit/cf5bea33a045e0cac8bf66571dfe7c09d7d419d3)), closes [#238](https://github.com/sgcarstrends/sgcarstrends/issues/238)
* migrate web into monorepo ([532f849](https://github.com/sgcarstrends/sgcarstrends/commit/532f84978126f4eaf3e0d66333e5a1240a053e5e))


### Features

* complete database consolidation and update configurations ([7bd5ec7](https://github.com/sgcarstrends/sgcarstrends/commit/7bd5ec7dc7d8c070698373d435f59e54d85be07b))
* migrate from changesets to semantic-release ([a091c5e](https://github.com/sgcarstrends/sgcarstrends/commit/a091c5e55d28bcda8d50ec2d30b357c62fcb6894))


### Bug Fixes

* broken HeroUI styling ([c6f6f5c](https://github.com/sgcarstrends/sgcarstrends/commit/c6f6f5c6056d177fb66f8469518709ac22c1a7e1))
* build errors ([2d3c27d](https://github.com/sgcarstrends/sgcarstrends/commit/2d3c27d4fb8fbc3f6b5e8c0735ce1c444bc64119))
* sync car logos on build ([305fc30](https://github.com/sgcarstrends/sgcarstrends/commit/305fc30937efcc38842e8fa8970a78ca901be2ed))
* **web:** build errors ([e75c4e5](https://github.com/sgcarstrends/sgcarstrends/commit/e75c4e57d5c2d28eef7b72fda6588015fc7a96de))
* **web:** error 500 in make page due to invalid logo ([c3b53eb](https://github.com/sgcarstrends/sgcarstrends/commit/c3b53ebcdacddca421af6cbb8bd2c87263f50730))


### Code Refactoring

* migrate from semantic-release to changesets with unified versioning ([f73b9e6](https://github.com/sgcarstrends/sgcarstrends/commit/f73b9e6683e16cf0debf492a4d70ac8d1629c619))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @sgcarstrends/database bumped to 4.0.0
    * @sgcarstrends/types bumped to 4.0.0
    * @sgcarstrends/utils bumped to 4.0.0

## 3.0.1

### Patch Changes

- [`c3b53eb`](https://github.com/sgcarstrends/sgcarstrends/commit/c3b53ebcdacddca421af6cbb8bd2c87263f50730) Thanks [@ruchernchong](https://github.com/ruchernchong)! - Fix an error where the make page crashes when it is not able to load the respective logo

- Updated dependencies []:
  - @sgcarstrends/database@3.0.1
  - @sgcarstrends/types@3.0.1
  - @sgcarstrends/utils@3.0.1
