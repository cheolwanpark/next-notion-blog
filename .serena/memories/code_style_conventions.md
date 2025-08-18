# Code Style and Conventions

## TypeScript Configuration
- **Strict mode**: Enabled
- **Target**: ES5
- **Module**: ESNext
- **Path aliases**: `@/*` maps to `./src/*`
- **JSX**: Preserve
- **Isolated modules**: true

## Code Formatting (Prettier)
- **Tab width**: 2 spaces
- **Use tabs**: false
- **Trailing comma**: all
- **Semicolons**: true
- **Quotes**: Double quotes
- **Single quote**: false

## ESLint
- Extends `next/core-web-vitals` configuration
- Enforces Next.js best practices and web vitals

## File Structure
- **Pages**: `src/pages/` - Next.js page routing
- **Components**: `src/components/` - React components
- **Services**: `src/services/` - Business logic and utilities
- **Styles**: `src/styles/` - SASS/CSS files
- **Config**: `src/config/` - Configuration files
- **Notion types**: `src/services/notion/types/`
- **Notion API**: `src/services/notion/api/`

## Naming Conventions
- **Files**: lowercase with underscores or kebab-case (e.g., `searchable_posts.tsx`, `site.config.js`)
- **Components**: PascalCase for React components
- **Functions/Variables**: camelCase
- **Types/Interfaces**: PascalCase
- **Constants**: Often camelCase or UPPER_CASE for config

## Import Organization
- Typically organized by:
  1. External packages
  2. Next.js specific imports
  3. Local components
  4. Local services/utilities
  5. Types
  6. Styles

## React Patterns
- Functional components with hooks
- TypeScript for type safety
- Props interfaces defined for components