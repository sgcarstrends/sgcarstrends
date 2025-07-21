module.exports = {
  extends: [
    "@commitlint/config-conventional",
    "@commitlint/config-lerna-scopes",
  ],
  rules: {
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
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
        "db",
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
