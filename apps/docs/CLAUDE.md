# CLAUDE.md - Documentation Site

## SG Cars Trends Documentation

This directory contains the Mintlify documentation site for SG Cars Trends, available
at [docs.sgcarstrends.com](https://docs.sgcarstrends.com).

## Working relationship

- You can push back on ideas-this can lead to better documentation. Cite sources and explain your reasoning when you do
  so
- ALWAYS ask for clarification rather than making assumptions
- NEVER lie, guess, or make up information

## Project context

- **Platform**: Mintlify documentation platform
- **Format**: MDX files with YAML frontmatter
- **Config**: docs.json for navigation, theme, settings
- **Components**: Mintlify components and custom React components
- **Deployment**: Automatic deployment on push to main branch
- **URL**: https://docs.sgcarstrends.com

## Content Structure

- **API Reference**: Complete endpoint documentation with examples
- **Architecture**: System diagrams and technical documentation
- **Examples**: Code examples in multiple programming languages
- **Guides**: Developer guides for data models and integration patterns

## Content strategy

- Document just enough for user success - not too much, not too little
- Prioritise accuracy and usability of information
- Make content evergreen when possible
- Search for existing information before adding new content. Avoid duplication unless it is done for a strategic reason
- Check existing patterns for consistency
- Start by making the smallest reasonable changes

## Frontmatter requirements for pages

- title: Clear, descriptive page title
- description: Concise summary for SEO/navigation

## Writing standards

- Second-person voice ("you")
- Prerequisites at start of procedural content
- Test all code examples before publishing
- Match style and formatting of existing pages
- Include both basic and advanced use cases
- Language tags on all code blocks
- Alt text on all images
- Relative paths for internal links

## Git workflow

- NEVER use --no-verify when committing
- Ask how to handle uncommitted changes before starting
- Create a new branch when no clear branch exists for changes
- Commit frequently throughout development
- NEVER skip or disable pre-commit hooks

## SG Cars Trends Specific Guidelines

### Documentation Standards

- Keep API examples current with actual endpoint responses
- Update architecture diagrams when system changes occur
- Verify all code examples work with the current API version (v4.11.0)
- Include rate limiting and authentication information in all API docs

### Mintlify Best Practices

- Skip frontmatter on any MDX file
- Use absolute URLs for internal links
- Include untested code examples
- Make assumptions - always ask for clarification

### Available Commands

- `pnpm docs:dev`: Start development server
- `pnpm docs:build`: Build documentation
- `pnpm mintlify dev`: Start Mintlify dev server (when in apps/docs directory)
- `pnpm mintlify broken-links`: Check for broken links (when in apps/docs directory)
