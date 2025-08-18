# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 13 blog application that uses Notion as a CMS. It's inspired by the PaperMod theme and provides a clean, minimalist blog experience with features like dark mode, search, code highlighting, and LaTeX support.

## Essential Commands

### Development
```bash
# Install dependencies
yarn install

# Start development server (http://localhost:3000)
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Run linter
yarn lint

# Analyze bundle size
ANALYZE=true yarn build
```

### Code Quality Workflow
When completing any task, always run:
1. `yarn lint` - Check for linting errors
2. `yarn build` - Ensure production build succeeds

## Project Architecture

### Core Technologies
- **Framework**: Next.js 13.2.3 with TypeScript 4.9.5
- **Styling**: Pico.css + SASS
- **CMS**: Notion API
- **Comments**: Giscus (GitHub Discussions)
- **State**: SWR for data fetching

### Key Configuration Files
- `site.config.js` - Main site configuration (owner, title, Notion database ID, etc.)
- `.env.local` - Environment variables (NOTION_API_KEY)
- `next.config.js` - Next.js configuration with image optimization

### Architecture Patterns

#### Data Flow
1. **Notion Integration**: `src/services/notion/` handles all Notion API calls
   - `api/` - Direct API interactions
   - `types/` - TypeScript type definitions
   - `query.ts` - Database queries
   - `page.ts` - Page processing
   - `block.ts` - Block rendering

2. **Page Generation**: Uses Next.js ISR (Incremental Static Regeneration)
   - Revalidation time: 15 minutes (configured in site.config.js)
   - Static generation with dynamic revalidation

3. **Routing Structure**:
   - `/` - Home page with post list
   - `/post/[slug]` - Individual blog posts
   - `/tag/[tag]` - Posts filtered by tag
   - `/api/` - API routes for dynamic functionality

#### Component Organization
- **Pages** (`src/pages/`): Next.js page components and API routes
- **Components** (`src/components/`): Reusable React components
  - `notion/` - Notion-specific rendering components
  - UI components like navigation, footer, comments
- **Services** (`src/services/`): Business logic and utilities
  - Notion API integration
  - Rendering services (KaTeX, Prism, YouTube)
  - Dark mode handling

## Code Style Guidelines

- **TypeScript**: Strict mode enabled
- **Formatting**: 2 spaces, double quotes, semicolons (Prettier)
- **Path Aliases**: Use `@/*` for `src/*` imports
- **Components**: Functional components with TypeScript interfaces
- **File Naming**: lowercase with underscores or kebab-case

## Critical Implementation Details

### Notion Integration
- Database ID is configured in `site.config.js` (note: field is named `databseID` with typo)
- API key must be set in `.env.local` as `NOTION_API_KEY`
- Integration requires read access to the Notion database

### Image Optimization
- Uses Sharp and Plaiceholder for image processing
- Remote images are allowed from all HTTPS sources
- Minimum cache TTL matches revalidation time

### Search Implementation
- Client-side search in `src/components/searchable_posts.tsx`
- Searches through post titles and summaries

### Comments System
- Giscus configuration in `site.config.js`
- Uses GitHub Discussions for comment storage
- Repository and category IDs must be configured

## Common Development Tasks

### Adding a New Feature
1. Create components in `src/components/`
2. Add business logic in `src/services/`
3. Update types if needed in appropriate `types/` directories
4. Run `yarn lint` and `yarn build` before committing

### Modifying Notion Integration
1. Check `src/services/notion/api/` for API calls
2. Update types in `src/services/notion/types/`
3. Test with actual Notion database to ensure compatibility

### Updating Site Configuration
1. Edit `site.config.js` for site-wide settings
2. For sensitive data, use environment variables in `.env.local`
3. Remember to update Vercel environment variables for production

## Deployment Notes

- Optimized for Vercel deployment
- Environment variables must be configured in deployment platform
- Build command: `yarn build`
- Output directory: `.next`
- Start command: `yarn start`