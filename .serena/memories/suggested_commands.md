# Development Commands

## Package Management
- **Install dependencies**: `yarn install` or `npm install`
- **Add dependency**: `yarn add <package>` or `npm install <package>`
- **Add dev dependency**: `yarn add -D <package>` or `npm install -D <package>`

## Development & Build
- **Start development server**: `yarn dev` or `npm run dev` (runs on http://localhost:3000)
- **Build for production**: `yarn build` or `npm run build`
- **Start production server**: `yarn start` or `npm run start`
- **Analyze bundle**: `ANALYZE=true yarn build` or `ANALYZE=true npm run build`

## Code Quality
- **Run linter**: `yarn lint` or `npm run lint`
- **Format code**: Uses Prettier (no dedicated script, use editor integration or `npx prettier --write .`)

## Testing
Note: No test scripts are currently configured in package.json. Tests would need to be added.

## Git Commands
- **Check status**: `git status`
- **Stage changes**: `git add .` or `git add <file>`
- **Commit**: `git commit -m "message"`
- **Push**: `git push origin <branch>`
- **Pull latest**: `git pull origin main`

## Notion Setup
1. Set up NOTION_API_KEY in `.env.local`
2. Configure database ID in `site.config.js` (databseID field)
3. Ensure Notion integration has read access to the database

## Environment Variables
Create `.env.local` file with:
```
NOTION_API_KEY="<YOUR_NOTION_INTERNAL_INTEGRATION_TOKEN>"
```

## Deployment
- Push to GitHub and connect to Vercel for automatic deployment
- Configure environment variables in Vercel dashboard