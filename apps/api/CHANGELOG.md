# @sgcarstrends/api

## 2.0.0

### Major Changes

- [#229](https://github.com/sgcarstrends/backend/pull/229) [`8732342`](https://github.com/sgcarstrends/backend/commit/8732342fe2959b54989f1355b5c031f1a9056eb3) Thanks [@ruchernchong](https://github.com/ruchernchong)! - Restructure job orchestrator into the API

### Minor Changes

- [#213](https://github.com/sgcarstrends/backend/pull/213) [`78da448`](https://github.com/sgcarstrends/backend/commit/78da4480ecd7dfcbad6c1cae6270a74d51cda40d) Thanks [@ruchernchong](https://github.com/ruchernchong)! - Clean up Car endpoints

- [#206](https://github.com/sgcarstrends/backend/pull/206) [`f38fe06`](https://github.com/sgcarstrends/backend/commit/f38fe0641ee1356fd589385b7d7964914bcb9c30) Thanks [@ruchernchong](https://github.com/ruchernchong)! - Add compare metrics endpoint for cars

- [#223](https://github.com/sgcarstrends/backend/pull/223) [`14e4150`](https://github.com/sgcarstrends/backend/commit/14e41507c4e11b42dcce698753baf7cb12fd8474) Thanks [@ruchernchong](https://github.com/ruchernchong)! - Update API endpoints for response to be consistent

- [#210](https://github.com/sgcarstrends/backend/pull/210) [`115d699`](https://github.com/sgcarstrends/backend/commit/115d69906b790074319aa304cce6739d87f419d0) Thanks [@ruchernchong](https://github.com/ruchernchong)! - Add API endpoint to get the top fuel and vehicle types for a month

- [#233](https://github.com/sgcarstrends/backend/pull/233) [`a858555`](https://github.com/sgcarstrends/backend/commit/a85855576d9e0be877053df5b2de99fb365d9e69) Thanks [@ruchernchong](https://github.com/ruchernchong)! - Move database schema in packages into API itself

- [#219](https://github.com/sgcarstrends/backend/pull/219) [`b873035`](https://github.com/sgcarstrends/backend/commit/b87303585e52aa4405e68df7e14bcecb1c2b71b1) Thanks [@ruchernchong](https://github.com/ruchernchong)! - Add endpoints for fuel and vehicle types by month

### Patch Changes

- [#221](https://github.com/sgcarstrends/backend/pull/221) [`d849574`](https://github.com/sgcarstrends/backend/commit/d849574ec2b81a5e27f89346ede18bde2b7c98bf) Thanks [@ruchernchong](https://github.com/ruchernchong)! - Implement proper health check on API

- [#212](https://github.com/sgcarstrends/backend/pull/212) [`cee6886`](https://github.com/sgcarstrends/backend/commit/cee6886c851ab7e329c3b371881f3fb91bdbc0b6) Thanks [@ruchernchong](https://github.com/ruchernchong)! - Update cars endpoint to return data by fuel and vehicle type

- [#217](https://github.com/sgcarstrends/backend/pull/217) [`4c5fbce`](https://github.com/sgcarstrends/backend/commit/4c5fbce2a610db22130bf27869a5c04651123449) Thanks [@ruchernchong](https://github.com/ruchernchong)! - Fix Makes API returning errors

- [#208](https://github.com/sgcarstrends/backend/pull/208) [`e829e69`](https://github.com/sgcarstrends/backend/commit/e829e695bb9555fc9160b3b4667e61d844c0df0b) Thanks [@ruchernchong](https://github.com/ruchernchong)! - Setup documentation using OpenAPI and Scalar

- Updated dependencies [[`a858555`](https://github.com/sgcarstrends/backend/commit/a85855576d9e0be877053df5b2de99fb365d9e69), [`9fd546c`](https://github.com/sgcarstrends/backend/commit/9fd546c797b2e29a76ac0d38eadb6bd15774d9d0)]:
  - @sgcarstrends/types@0.2.0
  - @sgcarstrends/utils@0.2.0

## 1.6.0

### Minor Changes

- [#187](https://github.com/sgcarstrends/backend/pull/187) [`6390ee8`](https://github.com/sgcarstrends/backend/commit/6390ee83e871b46c80ecb289979dd9d2e029bb1b) Thanks [@ruchernchong](https://github.com/ruchernchong)! - Invalidate cache on successful database updates

### Patch Changes

- [#202](https://github.com/sgcarstrends/backend/pull/202) [`cac0ee1`](https://github.com/sgcarstrends/backend/commit/cac0ee13ca27f7cd98d4b6dc1aa3433ca6c6cdef) Thanks [@ruchernchong](https://github.com/ruchernchong)! - Update SST deployer

- Updated dependencies [[`c0c3a1e`](https://github.com/sgcarstrends/backend/commit/c0c3a1e489be9b5b914d823eedc51bb9346c7c56), [`6390ee8`](https://github.com/sgcarstrends/backend/commit/6390ee83e871b46c80ecb289979dd9d2e029bb1b)]:
  - @sgcarstrends/utils@0.1.0
  - @sgcarstrends/schema@0.1.0
  - @sgcarstrends/types@0.1.0

## 1.5.2

### Patch Changes

- [#156](https://github.com/sgcarstrends/backend/pull/156) [`41b1b5c`](https://github.com/sgcarstrends/backend/commit/41b1b5c9338cb0f1837bc525edaf02acf9a64cfc) Thanks [@ruchernchong](https://github.com/ruchernchong)! - Use Drizzle ORM + Upstash Redis caching

## 1.5.1

### Patch Changes

- [#122](https://github.com/sgcarstrends/backend/pull/122) [`fc5bdc0`](https://github.com/sgcarstrends/backend/commit/fc5bdc05725dd8c6508c84bdf5f5cc1083ec2447) Thanks [@ruchernchong](https://github.com/ruchernchong)! - Add cars registration endpoint

## 1.5.0

### Minor Changes

- [#119](https://github.com/sgcarstrends/backend/pull/119) [`6fee1de`](https://github.com/sgcarstrends/backend/commit/6fee1de2e4c9716499dedd719d3c054f1e7866f0) Thanks [@ruchernchong](https://github.com/ruchernchong)! - Add car trends comparison API

### Patch Changes

- Updated dependencies [[`43ae487`](https://github.com/sgcarstrends/backend/commit/43ae4875699821fd1fc5b7001d7e36f6b9e25da2)]:
  - @sgcarstrends/utils@0.0.3
  - @sgcarstrends/schema@0.0.3
  - @sgcarstrends/types@0.0.3

## 1.4.2

### Patch Changes

- [`24633c0`](https://github.com/sgcarstrends/backend/commit/24633c0bb7a556284aeba155c3094312ea5144f8) Thanks [@ruchernchong](https://github.com/ruchernchong)! - Refactor fetching data for cars

## 1.4.1

### Patch Changes

- [#116](https://github.com/sgcarstrends/backend/pull/116) [`a02d5cd`](https://github.com/sgcarstrends/backend/commit/a02d5cda9d1fa4788413921848be2dd3146e2dfa) Thanks [@ruchernchong](https://github.com/ruchernchong)! - Fix API not returning the correct numbers for MPV

- Updated dependencies [[`a02d5cd`](https://github.com/sgcarstrends/backend/commit/a02d5cda9d1fa4788413921848be2dd3146e2dfa)]:
  - @sgcarstrends/types@0.0.2
  - @sgcarstrends/utils@0.0.2
  - @sgcarstrends/schema@0.0.2

## 1.4.0

### Minor Changes

- [`a8f0771`](https://github.com/sgcarstrends/backend/commit/a8f07710fa0fdbd58f9c20e0cf7b79d86afe8b0b) Thanks [@ruchernchong](https://github.com/ruchernchong)! - Migrate to monorepo setup
