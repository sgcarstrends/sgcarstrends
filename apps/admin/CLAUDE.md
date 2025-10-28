# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Documentation Access

When working with external libraries or frameworks, use the Context7 MCP tools to get up-to-date documentation:

1. Use `mcp__context7__resolve-library-id` to find the correct library ID for any package
2. Use `mcp__context7__get-library-docs` to retrieve comprehensive documentation and examples

This ensures you have access to the latest API documentation for dependencies like Next.js, Radix UI, Tailwind CSS, and
other libraries used in this admin dashboard.

# SG Cars Trends Admin Dashboard

## Project Overview

This is the admin dashboard (v4.11.0) for SG Cars Trends, built with Next.js 15.4.7 and shadcn/ui components. The dashboard provides
administrative functionality for managing the SG Cars Trends platform, including content management, data oversight, and
system monitoring.

**Note**: This is currently an unreleased application under development.

## Commands

### Development Commands

- **Start development server**: `pnpm dev` (uses Next.js with Turbopack for faster builds)
- **Build for production**: `pnpm build`
- **Start production server**: `pnpm start`
- **Lint code**: `pnpm lint` (Next.js ESLint)

## Architecture

### Tech Stack

- **Framework**: Next.js 15.4.7 with App Router and React 19.1.0
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS v4.1.11 with shadcn/ui design system
- **State Management**: Zustand v5.0.6 for client-side state
- **Data Fetching**: TanStack Query v5.84.1 (React Query)
- **Icons**: Lucide React v0.482.0
- **Development**: Turbopack for faster builds

### Project Structure

- **src/app/**: Next.js App Router pages and layouts
    - **layout.tsx**: Root layout with SidebarProvider and navigation
    - **page.tsx**: Dashboard overview with system status cards
    - **content/**: Content management pages (announcements, etc.)
- **src/components/**: React components
    - **app-sidebar.tsx**: Main navigation sidebar using shadcn/ui Sidebar components
    - **ui/**: shadcn/ui components (badge, button, card, dialog, sidebar, etc.)
- **src/hooks/**: Custom React hooks (use-mobile.ts)
- **src/lib/utils.ts**: Utility functions including cn() helper for class merging

### shadcn/ui Integration

This project uses shadcn/ui components extensively:

- **Component Location**: All shadcn/ui components are in `src/components/ui/`
- **Configuration**: `components.json` contains shadcn/ui configuration
- **Styling**: Uses Tailwind CSS with shadcn/ui's design tokens and CSS variables
- **Icons**: Lucide React icons integrated with shadcn/ui components
- **Path Alias**: `@admin/*` points to `src/*` for clean imports

### Navigation Structure

The admin dashboard uses shadcn/ui Sidebar components and includes:

- **Dashboard**: Overview with Card components showing system status
- **Data Management**: Car registrations and COE results (nested navigation)
- **Content Management**: Site announcements with Form components
- **Workflows**: Automated process monitoring
- **Analytics**: Data analytics and insights
- **System Health**: Application health monitoring
- **Users**: User management
- **Logs**: System and application logs
- **Settings**: Configuration management

## Code Style and Conventions

- **TypeScript**: Strict mode enabled with @admin/* path aliases
- **Formatting**: Biome with 2-space indentation, double quotes, and sorted Tailwind classes
- **shadcn/ui Pattern**: Use shadcn/ui components with proper TypeScript interfaces
- **Component Pattern**: Functional components with forwardRef when needed
- **File Naming**: kebab-case for files, PascalCase for components
- **Styling**: Tailwind CSS classes with cn() utility for conditional styling

## Key Features

### Dashboard Overview

- Uses shadcn/ui Card, Badge, and Button components
- System status monitoring with color-coded Badge variants
- Quick action grid using responsive Card layouts
- Recent activity feed with custom status indicators

### Content Management

- **Announcements**: Built with shadcn/ui Form components and Input/Label
- Toggle functionality using shadcn/ui Button variants
- Real-time preview with shadcn/ui styling
- Form validation with shadcn/ui error states

### Sidebar Navigation

- Implements shadcn/ui Sidebar with SidebarProvider
- Uses SidebarMenu, SidebarMenuItem, and SidebarMenuButton
- Active state management with Next.js usePathname
- Nested navigation support for grouped menu items

## shadcn/ui Component Usage

When working with components, use the existing shadcn/ui patterns:

- Import from `@admin/components/ui/[component-name]`
- Use proper TypeScript interfaces and ref forwarding
- Follow shadcn/ui styling conventions with CSS variables
- Utilise component variants and size props where available
- Use the cn() utility function for conditional classes

## Workspace Dependencies

This admin dashboard is part of the SG Cars Trends monorepo and uses shared packages:

- **@sgcarstrends/database**: Database schema and types
- **@sgcarstrends/types**: Shared TypeScript definitions
- **@sgcarstrends/utils**: Common utility functions including Redis configuration

## Current Status

This application is currently under development and has not been released. It is intended to provide administrative functionality for:

- Content management and moderation
- Data monitoring and analytics
- System health and performance tracking
- User management and permissions
- Workflow monitoring and debugging
