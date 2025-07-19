module.exports = {
  extends: [
    "@commitlint/config-conventional",
    "@commitlint/config-lerna-scopes",
  ],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        // Apps
        "api",
        "web",
        "docs",
        // Packages
        "types",
        "utils",
        // Special scopes
        "deps",
        "release",
        "ci",
        "root",
      ],
    ],
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
      ],
    ],
  },
};
