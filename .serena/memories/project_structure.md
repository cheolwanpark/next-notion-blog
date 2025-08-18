# Project Structure

## Root Directory
```
/
├── .eslintrc.json          # ESLint configuration
├── .gitignore              # Git ignore rules
├── .prettierrc             # Prettier formatting config
├── LICENSE                 # MIT License
├── README.md               # Project documentation
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies and scripts
├── site.config.js          # Site configuration (owner, title, Notion DB ID, etc.)
├── tsconfig.json           # TypeScript configuration
├── yarn.lock               # Yarn lock file
├── public/                 # Static assets
└── src/                    # Source code
```

## Source Directory Structure
```
src/
├── components/             # React components
│   ├── notion/            # Notion-specific components
│   ├── blank.tsx
│   ├── comments.tsx       # Giscus comments
│   ├── footer.tsx
│   ├── head.tsx           # HTML head meta tags
│   ├── intro.tsx
│   ├── navigation.tsx
│   ├── newlinetext.tsx
│   ├── posts.tsx          # Post list component
│   ├── scrolltotop.tsx
│   ├── searchable_posts.tsx # Search functionality
│   ├── spinner.tsx
│   └── textfield.tsx
│
├── config/                # Configuration files
│
├── pages/                 # Next.js pages (routing)
│   ├── api/              # API routes
│   ├── post/             # Individual post pages
│   ├── tag/              # Tag pages
│   ├── _app.tsx          # Next.js App component
│   ├── _document.tsx     # Next.js Document component
│   ├── index.tsx         # Home page
│   ├── robots.txt.ts     # Robots.txt generation
│   └── sitemap.xml.ts    # Sitemap generation
│
├── services/              # Business logic and utilities
│   ├── notion/           # Notion-related services
│   │   ├── api/         # Notion API interactions
│   │   ├── types/       # TypeScript types for Notion
│   │   ├── block.ts     # Block rendering logic
│   │   ├── page.ts      # Page processing
│   │   ├── query.ts     # Database queries
│   │   └── utils.ts     # Notion utilities
│   ├── darkmode.ts      # Dark mode functionality
│   ├── dayjs.ts         # Date handling
│   ├── font.ts          # Font configuration
│   ├── katex.ts         # LaTeX rendering
│   ├── prism.ts         # Code syntax highlighting
│   ├── utils.ts         # General utilities
│   ├── webmetadata.ts   # Web metadata utilities
│   └── youtube.ts       # YouTube embedding
│
└── styles/               # SASS/CSS styles
```

## Key Integration Points
- **Notion Integration**: `src/services/notion/` handles all Notion API interactions
- **Page Routing**: `src/pages/` follows Next.js file-based routing
- **Component Library**: `src/components/` contains all reusable React components
- **Configuration**: `site.config.js` contains all site-specific settings
- **Environment**: `.env.local` stores sensitive keys (NOTION_API_KEY)