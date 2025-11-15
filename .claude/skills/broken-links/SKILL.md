---
name: broken-links
description: Check for broken links in documentation, markdown files, and website pages. Use when maintaining documentation, before releases, or investigating 404 errors.
allowed-tools: Read, Edit, Write, Bash, Grep
---

# Broken Links Skill

This skill helps you find and fix broken links in documentation and web pages.

## When to Use This Skill

- Before documentation releases
- After refactoring documentation
- Investigating 404 errors
- Migrating documentation
- Updating external references
- Checking API documentation
- Verifying cross-references

## Link Types to Check

- **Internal links**: `/docs/api`, `./components/button.md`
- **External links**: `https://nextjs.org`, `https://github.com/...`
- **Anchor links**: `#installation`, `/docs/api#methods`
- **Image links**: `![Logo](./logo.png)`
- **API references**: Links in OpenAPI specs

## Mintlify Link Checking

### Built-in Command

```bash
# Check broken links in Mintlify docs
cd apps/docs
pnpm mintlify broken-links

# Output:
# Checking for broken links...
# ✓ docs/architecture/system.md
# ✓ docs/architecture/workflows.md
# ✗ docs/api/cars.md
#   - Line 15: https://example.com/broken-link (404)
#   - Line 23: ./missing-file.md (File not found)

# Check specific directory
pnpm mintlify broken-links docs/architecture

# Check with verbose output
pnpm mintlify broken-links --verbose
```

### Configuration

```json
// apps/docs/mint.json
{
  "openapi": ["/api/openapi.json"],
  "navigation": [
    {
      "group": "Documentation",
      "pages": ["docs/introduction", "docs/getting-started"]
    }
  ],
  // Broken link checking configuration
  "validation": {
    "checkLinks": true,
    "ignorePatterns": [
      "https://localhost:*",
      "https://127.0.0.1:*"
    ]
  }
}
```

## Markdown Link Check

### Installation

```bash
# Install markdown-link-check
pnpm add -D markdown-link-check

# Or use globally
npm install -g markdown-link-check
```

### Basic Usage

```bash
# Check single file
npx markdown-link-check README.md

# Check all markdown files
find . -name "*.md" -not -path "*/node_modules/*" | xargs -n1 markdown-link-check

# Save results
find . -name "*.md" | xargs -n1 markdown-link-check > link-check-results.txt

# Check only specific directory
find apps/docs -name "*.md" | xargs -n1 markdown-link-check
```

### Configuration

```json
// .markdown-link-check.json
{
  "ignorePatterns": [
    {
      "pattern": "^http://localhost"
    },
    {
      "pattern": "^https://127.0.0.1"
    }
  ],
  "replacementPatterns": [
    {
      "pattern": "^/docs",
      "replacement": "https://docs.sgcarstrends.com/docs"
    }
  ],
  "httpHeaders": [
    {
      "urls": ["https://api.sgcarstrends.com"],
      "headers": {
        "Authorization": "Bearer ${DOCS_TOKEN}"
      }
    }
  ],
  "timeout": "10s",
  "retryOn429": true,
  "retryCount": 3,
  "aliveStatusCodes": [200, 206, 301, 302]
}
```

### Usage with Config

```bash
# Use configuration file
npx markdown-link-check README.md -c .markdown-link-check.json

# Check all files with config
find . -name "*.md" -not -path "*/node_modules/*" | \
  xargs -n1 markdown-link-check -c .markdown-link-check.json
```

## Broken Link Checker (Web)

### Installation

```bash
# Install broken-link-checker
pnpm add -D broken-link-checker

# Or use globally
npm install -g broken-link-checker
```

### Check Website

```bash
# Check production website
npx blc https://sgcarstrends.com -ro

# Flags:
# -r: Recursive (follow links)
# -o: Check external links
# -v: Verbose output

# Check staging
npx blc https://staging.sgcarstrends.com -ro

# Check local dev server
npx blc http://localhost:3000 -ro

# Exclude specific URLs
npx blc https://sgcarstrends.com -ro \
  --exclude "https://twitter.com/*" \
  --exclude "https://linkedin.com/*"

# Save results
npx blc https://sgcarstrends.com -ro > broken-links.txt
```

### Configuration File

```json
// .blcrc
{
  "filterLevel": 3,
  "recursive": true,
  "excludeExternalLinks": false,
  "excludeInternalLinks": false,
  "excludeLinksToSamePage": true,
  "honorRobotExclusions": true,
  "maxSocketsPerHost": 1,
  "rateLimit": 500,
  "excludedKeywords": [
    "localhost",
    "127.0.0.1",
    "twitter.com",
    "linkedin.com"
  ]
}
```

## CI Integration

### GitHub Actions

```yaml
# .github/workflows/check-links.yml
name: Check Links

on:
  pull_request:
    paths:
      - "apps/docs/**"
      - "**/*.md"
  schedule:
    - cron: "0 0 * * 0"  # Weekly on Sunday

jobs:
  check-markdown-links:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Check markdown links
        uses: gaurav-nelson/github-action-markdown-link-check@v1
        with:
          config-file: ".markdown-link-check.json"
          folder-path: "apps/docs"
          file-extension: ".md"

  check-mintlify-links:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install

      - name: Check Mintlify broken links
        run: |
          cd apps/docs
          pnpm mintlify broken-links

  check-website-links:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install

      - name: Build website
        run: pnpm -F @sgcarstrends/web build

      - name: Start website
        run: |
          cd apps/web
          pnpm start &
          sleep 10

      - name: Check website links
        run: npx blc http://localhost:3000 -ro --exclude "*/twitter.com/*"

      - name: Stop website
        run: pkill -f "next start"
```

## Common Link Issues

### 1. Relative Path Errors

```markdown
<!-- ❌ Wrong relative path -->
[API Docs](../api/cars.md)  <!-- File doesn't exist -->

<!-- ✅ Correct relative path -->
[API Docs](./api/cars.md)

<!-- ✅ Absolute path from root -->
[API Docs](/docs/api/cars.md)
```

### 2. Case Sensitivity

```markdown
<!-- ❌ Case mismatch (on Linux/macOS) -->
[README](./readme.md)  <!-- File is README.md -->

<!-- ✅ Correct case -->
[README](./README.md)
```

### 3. Missing Anchors

```markdown
<!-- ❌ Anchor doesn't exist -->
[Installation](#instalation)  <!-- Typo: instalation -->

<!-- ✅ Correct anchor -->
[Installation](#installation)

<!-- ✅ Check anchor exists in target file -->
[API Reference](./api.md#get-cars)
```

### 4. External Link Issues

```bash
# Check if external links are accessible
curl -I https://example.com/api/docs

# If 404, update or remove link

# ❌ Broken external link
[Docs](https://old-site.com/docs)  # Site moved

# ✅ Updated link
[Docs](https://new-site.com/docs)
```

## Fix Broken Links

### Find and Replace

```bash
# Find all occurrences of broken link
grep -r "old-domain.com" apps/docs/

# Replace in all files
find apps/docs -name "*.md" -exec sed -i '' 's/old-domain.com/new-domain.com/g' {} +

# Or use modern tools
fd -e md -x sd 'old-domain.com' 'new-domain.com'
```

### Automated Fix Script

```bash
#!/bin/bash
# fix-links.sh

# Check if file has broken links
check_links() {
  local file=$1
  echo "Checking $file..."

  # Run markdown-link-check
  if ! markdown-link-check "$file" -c .markdown-link-check.json; then
    echo "Broken links found in $file"
    return 1
  fi

  return 0
}

# Fix common issues
fix_common_issues() {
  local file=$1

  # Fix relative paths
  sed -i '' 's|\.\./\.\./docs|/docs|g' "$file"

  # Fix case sensitivity
  sed -i '' 's|readme\.md|README.md|g' "$file"

  # Update old domain
  sed -i '' 's|old-site\.com|new-site.com|g' "$file"
}

# Main
for file in $(find apps/docs -name "*.md"); do
  if ! check_links "$file"; then
    echo "Attempting to fix $file..."
    fix_common_issues "$file"
    check_links "$file"
  fi
done
```

## Link Validation in Code

### Validate Links in Tests

```typescript
// apps/docs/__tests__/links.test.ts
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("Documentation Links", () => {
  const docsDir = path.join(process.cwd(), "apps/docs");

  it("should have no broken internal links", async () => {
    const files = getAllMarkdownFiles(docsDir);
    const brokenLinks: string[] = [];

    for (const file of files) {
      const content = fs.readFileSync(file, "utf-8");
      const links = extractInternalLinks(content);

      for (const link of links) {
        const targetPath = resolveLink(file, link);
        if (!fs.existsSync(targetPath)) {
          brokenLinks.push(`${file}: ${link} -> ${targetPath}`);
        }
      }
    }

    expect(brokenLinks).toEqual([]);
  });

  it("should have valid anchor links", async () => {
    const files = getAllMarkdownFiles(docsDir);
    const brokenAnchors: string[] = [];

    for (const file of files) {
      const content = fs.readFileSync(file, "utf-8");
      const anchorLinks = extractAnchorLinks(content);
      const headings = extractHeadings(content);

      for (const anchor of anchorLinks) {
        const anchorId = anchor.replace("#", "").toLowerCase();
        if (!headings.includes(anchorId)) {
          brokenAnchors.push(`${file}: ${anchor}`);
        }
      }
    }

    expect(brokenAnchors).toEqual([]);
  });
});

function getAllMarkdownFiles(dir: string): string[] {
  // Recursively get all .md files
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules") {
      files.push(...getAllMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function extractInternalLinks(content: string): string[] {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links: string[] = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const url = match[2];
    // Internal links start with ./ or / or are relative
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      links.push(url.split("#")[0]); // Remove anchor
    }
  }

  return links;
}

function extractAnchorLinks(content: string): string[] {
  const linkRegex = /\[([^\]]+)\]\((#[^)]+)\)/g;
  const anchors: string[] = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    anchors.push(match[2]);
  }

  return anchors;
}

function extractHeadings(content: string): string[] {
  const headingRegex = /^#+\s+(.+)$/gm;
  const headings: string[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const heading = match[1]
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    headings.push(heading);
  }

  return headings;
}

function resolveLink(fromFile: string, link: string): string {
  const dir = path.dirname(fromFile);
  return path.resolve(dir, link);
}
```

## OpenAPI Link Validation

### Check API Documentation Links

```bash
# Validate OpenAPI spec links
npx @redocly/cli lint apps/docs/api/openapi.json

# Check for broken API endpoints
curl -f https://api.sgcarstrends.com/v1/cars || echo "Endpoint broken"

# Validate all endpoints in spec
jq -r '.paths | keys[]' apps/docs/api/openapi.json | while read endpoint; do
  echo "Checking $endpoint..."
  curl -f "https://api.sgcarstrends.com$endpoint" || echo "Broken: $endpoint"
done
```

## Best Practices

### 1. Regular Checks

```bash
# ✅ Check links weekly
# Set up CI schedule or local cron job

# Weekly check
0 0 * * 0 cd /path/to/repo && make check-links
```

### 2. Use Absolute Paths

```markdown
<!-- ❌ Relative paths break when moving files -->
[API](../../api/cars.md)

<!-- ✅ Absolute paths from docs root -->
[API](/docs/api/cars.md)

<!-- ✅ Or use full URL -->
[API](https://docs.sgcarstrends.com/api/cars)
```

### 3. Test Before Committing

```bash
# ✅ Pre-commit hook
# .husky/pre-commit
#!/bin/sh

# Check links in staged markdown files
git diff --cached --name-only --diff-filter=ACMR | grep "\.md$" | \
  xargs -I {} markdown-link-check {} -c .markdown-link-check.json
```

### 4. Document External Dependencies

```markdown
<!-- ✅ Note when external links are critical -->
<!-- IMPORTANT: This link is referenced in production -->
[API Reference](https://api.sgcarstrends.com/docs)

<!-- ✅ Or use link checker config to monitor -->
```

## Troubleshooting

### False Positives

```json
// .markdown-link-check.json
{
  "ignorePatterns": [
    {
      "pattern": "^http://localhost"
    },
    {
      "pattern": "^https://example.com"  // Ignore example URLs
    }
  ],
  "aliveStatusCodes": [200, 206, 301, 302, 403]  // 403 might be valid
}
```

### Rate Limiting

```bash
# Issue: Rate limited by external sites
# Solution: Slow down checks

# Use rate limit in config
{
  "timeout": "10s",
  "retryOn429": true,
  "retryCount": 3
}

# Or check with delay
for file in *.md; do
  markdown-link-check "$file"
  sleep 2
done
```

### Private Links

```bash
# Issue: Private URLs return 401/403
# Solution: Add authentication

# Use httpHeaders in config
{
  "httpHeaders": [
    {
      "urls": ["https://private-api.com"],
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      }
    }
  ]
}
```

## References

- Mintlify Broken Links: https://mintlify.com/docs/cli/broken-links
- markdown-link-check: https://github.com/tcort/markdown-link-check
- broken-link-checker: https://github.com/stevenvachon/broken-link-checker
- Related files:
  - `apps/docs/mint.json` - Mintlify configuration
  - `.markdown-link-check.json` - Link check configuration
  - Root CLAUDE.md - Documentation guidelines

## Best Practices Summary

1. **Check Regularly**: Run link checks weekly or before releases
2. **Automate**: Use CI to catch broken links early
3. **Absolute Paths**: Prefer absolute paths for documentation links
4. **Configure Ignores**: Exclude localhost and example URLs
5. **Monitor External**: Track critical external dependencies
6. **Test Locally**: Validate links before committing
7. **Fix Quickly**: Address broken links as soon as detected
8. **Document**: Note critical external links in config
