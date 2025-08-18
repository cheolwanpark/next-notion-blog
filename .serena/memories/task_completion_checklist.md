# Task Completion Checklist

When completing any development task in this project, ensure the following:

## 1. Code Quality Checks
- [ ] Run linter: `yarn lint` or `npm run lint`
- [ ] Ensure no TypeScript errors (strict mode is enabled)
- [ ] Format code according to Prettier config (2 spaces, double quotes, semicolons)
- [ ] Follow existing code patterns and conventions

## 2. Testing
- [ ] Test in development: `yarn dev` and check http://localhost:3000
- [ ] Verify functionality works as expected
- [ ] Check responsive design (mobile, tablet, desktop)
- [ ] Test dark mode if UI changes are involved
- [ ] Verify Notion integration still works if data fetching is modified

## 3. Build Verification
- [ ] Run production build: `yarn build`
- [ ] Ensure build completes without errors
- [ ] Check for any build warnings that need addressing

## 4. Performance
- [ ] Check bundle size if adding new dependencies: `ANALYZE=true yarn build`
- [ ] Ensure images are optimized (using next/image)
- [ ] Verify ISR (Incremental Static Regeneration) works correctly

## 5. Documentation
- [ ] Update README.md if adding new features or changing setup
- [ ] Add inline comments for complex logic
- [ ] Update environment variables documentation if needed

## 6. Git Hygiene
- [ ] Ensure .env.local is not committed
- [ ] Write clear, descriptive commit messages
- [ ] Check that no sensitive information is in the commit

## 7. Configuration
- [ ] Update site.config.js if adding new configuration options
- [ ] Ensure environment variables are documented

## Critical Files to Check
- `site.config.js` - Main configuration
- `package.json` - Dependencies and scripts
- `.env.local` - Environment variables (should not be committed)
- `next.config.js` - Next.js configuration