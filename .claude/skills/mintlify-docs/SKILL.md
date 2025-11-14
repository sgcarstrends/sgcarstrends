---
name: mintlify-docs
description: Write and maintain documentation using Mintlify for developer docs, API references, and guides. Use when creating new documentation, updating existing docs, or organizing documentation structure.
allowed-tools: Read, Edit, Write, Bash, Grep, Glob
---

# Mintlify Documentation Skill

This skill helps you create and maintain comprehensive developer documentation using Mintlify.

## When to Use This Skill

- Creating new documentation pages
- Updating existing documentation
- Organizing documentation structure
- Adding API references
- Creating guides and tutorials
- Updating navigation and sidebar
- Adding interactive components
- Checking for broken links

## Mintlify Overview

Mintlify is a modern documentation platform that provides:
- **Beautiful UI**: Modern, responsive documentation site
- **MDX Support**: Write docs in Markdown with React components
- **API Playground**: Interactive API testing
- **Search**: Built-in search functionality
- **Dark Mode**: Automatic dark mode support
- **Versioning**: Documentation versioning support
- **Analytics**: Built-in analytics
- **Custom Components**: Add custom React components

## Project Structure

```
apps/docs/
├── mint.json                    # Mintlify configuration
├── introduction.mdx             # Homepage
├── quickstart.mdx               # Getting started guide
├── architecture/                # Architecture documentation
│   ├── system.mdx
│   ├── workflows.mdx
│   ├── database.mdx
│   ├── api.mdx
│   ├── infrastructure.mdx
│   └── social.mdx
├── diagrams/                    # Mermaid diagram sources
│   ├── system-architecture.mmd
│   ├── workflow-sequence.mmd
│   └── database-erd.mmd
├── api-reference/               # API documentation
│   ├── introduction.mdx
│   ├── cars/
│   │   ├── get-makes.mdx
│   │   └── get-models.mdx
│   └── coe/
│       └── get-results.mdx
├── guides/                      # How-to guides
│   ├── deployment.mdx
│   ├── local-development.mdx
│   └── testing.mdx
└── components/                  # Custom components
    └── Example.tsx
```

## Configuration

### mint.json

```json
{
  "name": "SG Cars Trends",
  "logo": {
    "dark": "/logo/dark.svg",
    "light": "/logo/light.svg"
  },
  "favicon": "/favicon.svg",
  "colors": {
    "primary": "#0D9373",
    "light": "#07C983",
    "dark": "#0D9373",
    "anchors": {
      "from": "#0D9373",
      "to": "#07C983"
    }
  },
  "topbarLinks": [
    {
      "name": "Support",
      "url": "mailto:hi@mintlify.com"
    }
  ],
  "topbarCtaButton": {
    "name": "Dashboard",
    "url": "https://dashboard.mintlify.com"
  },
  "tabs": [
    {
      "name": "API Reference",
      "url": "api-reference"
    },
    {
      "name": "Architecture",
      "url": "architecture"
    }
  ],
  "anchors": [
    {
      "name": "Documentation",
      "icon": "book-open-cover",
      "url": "https://mintlify.com/docs"
    },
    {
      "name": "Community",
      "icon": "slack",
      "url": "https://mintlify.com/community"
    },
    {
      "name": "Blog",
      "icon": "newspaper",
      "url": "https://mintlify.com/blog"
    }
  ],
  "navigation": [
    {
      "group": "Get Started",
      "pages": [
        "introduction",
        "quickstart",
        "development"
      ]
    },
    {
      "group": "Architecture",
      "pages": [
        "architecture/system",
        "architecture/workflows",
        "architecture/database",
        "architecture/api",
        "architecture/infrastructure",
        "architecture/social"
      ]
    },
    {
      "group": "API Documentation",
      "pages": [
        "api-reference/introduction",
        "api-reference/authentication",
        "api-reference/errors"
      ]
    },
    {
      "group": "Cars",
      "pages": [
        "api-reference/cars/get-makes",
        "api-reference/cars/get-models"
      ]
    },
    {
      "group": "COE",
      "pages": [
        "api-reference/coe/get-results",
        "api-reference/coe/get-latest"
      ]
    }
  ],
  "footerSocials": {
    "twitter": "https://twitter.com/mintlify",
    "github": "https://github.com/mintlify",
    "linkedin": "https://www.linkedin.com/company/mintsearch"
  }
}
```

## Writing Documentation

### Basic MDX Page

```mdx
---
title: "Getting Started"
description: "Learn how to get started with SG Cars Trends API"
---

# Getting Started

Welcome to SG Cars Trends! This guide will help you get started with our API.

## Prerequisites

Before you begin, ensure you have:

- Node.js 20 or later
- pnpm installed
- PostgreSQL database
- Upstash Redis account

## Installation

<Steps>
  <Step title="Clone the repository">
    ```bash
    git clone https://github.com/sgcarstrends/sgcarstrends.git
    cd sgcarstrends
    ```
  </Step>

  <Step title="Install dependencies">
    ```bash
    pnpm install
    ```
  </Step>

  <Step title="Set up environment variables">
    Copy `.env.example` to `.env` and fill in your credentials:

    ```bash
    DATABASE_URL=postgresql://user:password@localhost:5432/sgcarstrends
    UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
    UPSTASH_REDIS_REST_TOKEN=your-token
    ```
  </Step>

  <Step title="Run migrations">
    ```bash
    pnpm db:migrate
    ```
  </Step>

  <Step title="Start development server">
    ```bash
    pnpm dev
    ```
  </Step>
</Steps>

## Next Steps

<CardGroup cols={2}>
  <Card title="Architecture" icon="diagram-project" href="/architecture/system">
    Learn about the system architecture
  </Card>
  <Card title="API Reference" icon="code" href="/api-reference">
    Explore the API endpoints
  </Card>
  <Card title="Deployment" icon="rocket" href="/guides/deployment">
    Deploy to production
  </Card>
  <Card title="Examples" icon="sparkles" href="/examples">
    View code examples
  </Card>
</CardGroup>
```

### API Reference Page

```mdx
---
title: "Get Car Makes"
api: "GET /api/v1/cars/makes"
description: "Retrieve a list of all car makes with registration counts"
---

# Get Car Makes

Returns a list of all car makes registered in Singapore, along with their registration counts.

## Query Parameters

<ParamField query="month" type="string" optional>
  Filter by month in YYYY-MM format (e.g., "2024-01")
</ParamField>

<ParamField query="limit" type="number" default={100}>
  Maximum number of results to return (1-1000)
</ParamField>

<ParamField query="offset" type="number" default={0}>
  Number of results to skip for pagination
</ParamField>

## Response

<ResponseField name="makes" type="array">
  Array of car makes with registration counts

  <Expandable title="properties">
    <ResponseField name="make" type="string">
      Car manufacturer name (e.g., "Toyota", "Honda")
    </ResponseField>

    <ResponseField name="count" type="number">
      Number of registrations for this make
    </ResponseField>

    <ResponseField name="percentage" type="number">
      Percentage of total registrations
    </ResponseField>
  </Expandable>
</ResponseField>

<RequestExample>
```bash cURL
curl -X GET 'https://api.sgcarstrends.com/api/v1/cars/makes?month=2024-01'
```

```javascript JavaScript
const response = await fetch(
  'https://api.sgcarstrends.com/api/v1/cars/makes?month=2024-01'
);
const data = await response.json();
```

```python Python
import requests

response = requests.get(
    'https://api.sgcarstrends.com/api/v1/cars/makes',
    params={'month': '2024-01'}
)
data = response.json()
```
</RequestExample>

<ResponseExample>
```json 200 OK
[
  {
    "make": "Toyota",
    "count": 1542,
    "percentage": 18.5
  },
  {
    "make": "Honda",
    "count": 1234,
    "percentage": 14.8
  },
  {
    "make": "BMW",
    "count": 987,
    "percentage": 11.9
  }
]
```

```json 400 Bad Request
{
  "error": {
    "code": "INVALID_MONTH",
    "message": "Month must be in YYYY-MM format"
  }
}
```

```json 500 Internal Server Error
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```
</ResponseExample>
```

## Components

### Callouts

```mdx
<Note>
  This is a note callout for general information.
</Note>

<Info>
  This is an info callout for helpful tips.
</Info>

<Warning>
  This is a warning callout for important notices.
</Warning>

<Tip>
  This is a tip callout for best practices.
</Tip>

<Check>
  This is a success callout for confirmations.
</Check>
```

### Code Blocks

```mdx
```typescript
// TypeScript code with syntax highlighting
interface CarMake {
  make: string;
  count: number;
  percentage: number;
}

const makes: CarMake[] = await fetch('/api/v1/cars/makes')
  .then(res => res.json());
\```

```bash
# Bash commands
pnpm install
pnpm dev
\```
```

### Cards

```mdx
<CardGroup cols={2}>
  <Card title="Quick Start" icon="rocket" href="/quickstart">
    Get up and running in 5 minutes
  </Card>

  <Card title="API Reference" icon="code" href="/api-reference">
    Complete API documentation
  </Card>

  <Card title="Examples" icon="sparkles" href="/examples">
    Sample code and use cases
  </Card>

  <Card title="Support" icon="life-ring" href="/support">
    Get help from our team
  </Card>
</CardGroup>
```

### Accordions

```mdx
<AccordionGroup>
  <Accordion title="How do I get an API key?">
    API keys are currently not required. The API is publicly accessible.
  </Accordion>

  <Accordion title="What's the rate limit?">
    The API is rate-limited to 100 requests per minute per IP address.
  </Accordion>

  <Accordion title="Can I use this in production?">
    Yes! The API is production-ready and actively maintained.
  </Accordion>
</AccordionGroup>
```

### Tabs

```mdx
<Tabs>
  <Tab title="JavaScript">
    ```javascript
    const response = await fetch('/api/v1/cars/makes');
    const data = await response.json();
    \```
  </Tab>

  <Tab title="Python">
    ```python
    response = requests.get('/api/v1/cars/makes')
    data = response.json()
    \```
  </Tab>

  <Tab title="cURL">
    ```bash
    curl -X GET 'https://api.sgcarstrends.com/api/v1/cars/makes'
    \```
  </Tab>
</Tabs>
```

### Mermaid Diagrams

```mdx
```mermaid
graph TD
    A[User Request] --> B[API Gateway]
    B --> C[Lambda Function]
    C --> D[Database]
    D --> C
    C --> B
    B --> A
\```
```

## Development

### Local Development

```bash
# Start Mintlify dev server
cd apps/docs
pnpm mintlify dev

# Server runs on http://localhost:3000
```

### Hot Reload

Mintlify automatically reloads when you:
- Edit MDX files
- Update mint.json
- Add new pages

### Preview Changes

```bash
# Preview production build locally
pnpm mintlify dev
```

## Deployment

### Automatic Deployment

Mintlify docs are deployed automatically:
- **Trigger**: Push to main branch
- **Platform**: Mintlify hosting
- **URL**: https://docs.sgcarstrends.com

### Manual Deployment

```bash
# Build for production (if needed)
pnpm mintlify build

# Deploy (usually handled by Mintlify)
# No manual deployment needed with Mintlify hosting
```

## Broken Links Check

### Check Links

```bash
# Check for broken links
cd apps/docs
pnpm mintlify broken-links

# Example output:
# Checking for broken links...
# ✓ No broken links found
#
# Or if broken:
# ✗ Found 2 broken links:
# - /api-reference/invalid-page (referenced in introduction.mdx)
# - /guides/missing-guide (referenced in quickstart.mdx)
```

### Fix Broken Links

1. Review the broken links output
2. Update references in source files
3. Re-run broken-links check
4. Commit fixes

## Best Practices

### 1. Clear Structure

```mdx
# ❌ Poor structure
## Installation
Some text here
### Step 1
More text
## Usage
Text

# ✅ Good structure
# Installation

Follow these steps to install:

<Steps>
  <Step title="Clone repository">...</Step>
  <Step title="Install dependencies">...</Step>
</Steps>

# Usage

Here's how to use the API:
```

### 2. Use Appropriate Components

```mdx
# ❌ Plain text for important info
Note: This is important information you should know.

# ✅ Use callout components
<Warning>
  This is important information you should know.
</Warning>
```

### 3. Include Code Examples

```mdx
# ❌ No examples
The API returns a list of car makes.

# ✅ Include examples
The API returns a list of car makes:

```json
[
  { "make": "Toyota", "count": 1542 },
  { "make": "Honda", "count": 1234 }
]
\```
```

### 4. Keep Navigation Organized

```json
// ❌ Flat navigation
"navigation": [
  {
    "group": "Pages",
    "pages": [
      "intro",
      "api-cars",
      "api-coe",
      "guide-deploy",
      "arch-system"
    ]
  }
]

// ✅ Grouped navigation
"navigation": [
  {
    "group": "Get Started",
    "pages": ["introduction", "quickstart"]
  },
  {
    "group": "Architecture",
    "pages": ["architecture/system", "architecture/database"]
  },
  {
    "group": "API Reference",
    "pages": ["api-reference/cars", "api-reference/coe"]
  }
]
```

## Troubleshooting

### Dev Server Not Starting

```bash
# Issue: Port 3000 already in use
# Solution: Kill process or use different port

lsof -ti:3000 | xargs kill -9
# Or
PORT=3001 pnpm mintlify dev
```

### Changes Not Reflecting

```bash
# Issue: Hot reload not working
# Solution: Restart dev server

# Stop server (Ctrl+C)
pnpm mintlify dev
```

### Broken Images

```mdx
# Issue: Images not loading
# Solution: Ensure images are in public/ directory

# ❌ Wrong path
![Logo](/images/logo.png)

# ✅ Correct path (from public/)
![Logo](/logo.png)
```

### Navigation Not Updating

```json
// Issue: New pages not showing in sidebar
// Solution: Add to navigation in mint.json

{
  "navigation": [
    {
      "group": "Guides",
      "pages": [
        "guides/existing-page",
        "guides/new-page"  // Add new page here
      ]
    }
  ]
}
```

## Package.json Scripts

```json
{
  "scripts": {
    "dev": "mintlify dev",
    "install": "mintlify install",
    "broken-links": "mintlify broken-links"
  }
}
```

## References

- Mintlify Documentation: https://mintlify.com/docs
- MDX Documentation: https://mdxjs.com
- Mermaid Diagrams: https://mermaid.js.org
- Related files:
  - `apps/docs/mint.json` - Mintlify configuration
  - `apps/docs/` - Documentation source files
  - Root CLAUDE.md - Documentation guidelines

## Best Practices Summary

1. **Clear Structure**: Use headings and components appropriately
2. **Code Examples**: Include examples for all API endpoints
3. **Visual Aids**: Use diagrams, cards, and callouts
4. **Navigation**: Organize docs into logical groups
5. **Search-Friendly**: Use descriptive titles and descriptions
6. **Broken Links**: Regularly check for broken links
7. **Consistency**: Follow consistent formatting across all pages
8. **Accessibility**: Use semantic HTML and alt text for images
