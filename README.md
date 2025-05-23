# Next.js Notion PaperMod Starter

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deployed with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F<YOUR_GITHUB_USERNAME>%2Fnext-notion-papermod)
<!-- It's recommended to replace the above Vercel badge URL with the specific one for your project once deployed. -->

This is a Next.js starter template for creating a blog using Notion as a CMS, inspired by the PaperMod theme.

## Key Features

*   **Notion as CMS:** Easily manage your blog content from Notion.
*   **PaperMod Inspired Design:** Clean, minimalist, and fast, built with Pico.css.
*   **Responsive:** Adapts to all screen sizes.
*   **Dark Mode:** Automatic dark mode based on system preference.
*   **Fast & Lightweight:** Optimized for performance.
*   **Search Functionality:** Built-in search for your posts.
*   **Giscus Comments:** Integrated comments system using GitHub Discussions.
*   **Syntax Highlighting:** Code blocks are highlighted using PrismJS.
*   **LaTeX Support:** Write mathematical notations with KaTeX.
*   **SEO Friendly:**
    *   Meta tags and JSON-LD for rich snippets.
    *   Open Graph protocol for social media sharing.
    *   Automatic sitemap generation (`sitemap.xml`).
    *   `robots.txt` provided.
*   **Easy to Customize:** Configure site settings via `site.config.js`.
*   **Image Optimization:** Uses `next/image` and Plaiceholder for optimized images.
*   **Vercel Analytics & OG Image Generation:** Ready for Vercel deployment.

## Getting Started

### Prerequisites

*   Node.js (v16.x or higher recommended)
*   Yarn (or npm)
*   A Notion account

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/<YOUR_GITHUB_USERNAME>/next-notion-papermod.git
    cd next-notion-papermod
    ```
    *(Remember to replace `<YOUR_GITHUB_USERNAME>` with the actual path if you've forked it, or the original repo path if you're cloning directly).*

2.  **Install dependencies:**
    ```bash
    yarn install
    # or
    # npm install
    ```

3.  **Set up Notion:**
    *   **Duplicate a Notion Database:** If you have a specific Notion blog template you want users to start with, mention it here. Otherwise, users will need to create or use an existing Notion database. The structure should generally include properties like `Title` (Title), `Slug` (Text), `Published` (Date), `Tags` (Multi-select), `Summary` (Text), etc.
    *   **Create a Notion Integration:**
        1.  Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations).
        2.  Click "New integration".
        3.  Give it a name (e.g., "My Blog Integration").
        4.  Select the workspace where your database resides.
        5.  Ensure "Read content" capabilities are selected. You might need "Update content" or "Insert content" if you plan to add features that modify Notion content programmatically in the future, but for reading a blog, "Read content" is sufficient.
        6.  Click "Submit".
        7.  Copy the "Internal Integration Token". This will be your `NOTION_API_KEY`.
    *   **Connect the Integration to your Database:**
        1.  Open your Notion database.
        2.  Click the `...` menu in the top right corner.
        3.  Scroll down to "Add connections".
        4.  Find and select the integration you just created.
    *   **Get your Notion Database ID:**
        1.  The Database ID is part of the URL of your Notion database. For example, if your database URL is `https://www.notion.so/your-workspace/abcdef1234567890abcdef1234567890?v=...`, then `abcdef1234567890abcdef1234567890` is your Database ID.
        2.  The `site.config.js` file already contains a `databseID` (note the typo, it's `databseID` in the config, so reference it as is for now) field. You will need to replace its value with your own database ID.

4.  **Set up Environment Variables:**
    Create a file named `.env.local` in the root of the project and add the following variables:

    ```env
    NOTION_API_KEY="<YOUR_NOTION_INTERNAL_INTEGRATION_TOKEN>"
    # You can leave NOTION_DATABASE_ID here if you prefer,
    # or manage it directly in site.config.js as it currently is.
    # If you add it here, it would typically override the one in site.config.js if the code is set up to do so.
    # For now, follow the project's current convention of setting it in site.config.js.

    # Example for Giscus (optional, if you want to use your own repo for comments)
    # GISCUS_REPO="your-github-username/your-repo-name"
    # GISCUS_REPO_ID="your_repo_id"
    # GISCUS_CATEGORY="your_giscus_category_name"
    # GISCUS_CATEGORY_ID="your_giscus_category_id"
    ```
    *   Replace `<YOUR_NOTION_INTERNAL_INTEGRATION_TOKEN>` with the token you copied.
    *   For Giscus variables, refer to the `site.config.js` for the current project's setup or if you want to customize it to your own repository.

5.  **Configure `site.config.js`:**
    Open `site.config.js` and update the following fields with your information:
    *   `owner`: Your name or organization.
    *   `blogTitle`: The title of your blog.
    *   `github`: Your GitHub username (for footer links, etc.).
    *   `databseID`: **Crucial!** Replace this with your Notion Database ID.
    *   `baseURL`: The production URL of your blog (e.g., `https://yourblog.com`).
    *   `defaultSiteDescription`: Your blog's default meta description.
    *   `googleSiteVerificationMetaTag` (optional): If you use Google Search Console.
    *   `giscus`: Update this object if you want to use your own GitHub Discussions for comments.

6.  **Run the development server:**
    ```bash
    yarn dev
    # or
    # npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Configuration

Most of the blog's customization can be done by editing the `site.config.js` file. Here's an overview of the available options:

*   `owner`: Your name or the blog owner's name.
*   `blogTitle`: The main title of your blog, used in meta tags and the site header.
*   `github`: Your GitHub username. Used for links in the footer or other parts of the site.
*   `databseID`: **Important!** The ID of your Notion database that holds your blog posts. (Note the current typo: `databseID` in the file).
*   `revalidateTime`: The interval in seconds for Next.js Incremental Static Regeneration (ISR). This determines how often pages are re-built with fresh data from Notion (e.g., `15 * 60` for 15 minutes).
*   `optimizeExpiringImages`: A boolean flag related to image optimization.
*   `postsPerPage`: The number of posts to display on pages that list multiple posts (e.g., the main posts page).
*   `baseURL`: The absolute base URL of your deployed blog (e.g., `https://blog.codingvillain.com`). This is important for SEO and generating correct canonical URLs.
*   `defaultSiteDescription`: A default description for your site, used in meta tags.
*   `googleSiteVerificationMetaTag`: If you're using Google Search Console, you can put your verification tag content here.
*   `giscus`: Configuration object for Giscus comments.
    *   `repo`: The GitHub repository for Giscus comments (e.g., `user/repo`).
    *   `repoID`: The ID of the Giscus repository.
    *   `category`: The discussion category in your Giscus repository.
    *   `categoryID`: The ID of the Giscus category.

To change your blog's settings, modify the values in this file. Remember that changes to `databseID` are critical for fetching your content from Notion.

### Environment Variables

While most configurations are in `site.config.js`, sensitive keys or environment-specific settings are managed via a `.env.local` file:

*   `NOTION_API_KEY`: Your Notion integration token. **Required**.
*   You can also store Giscus settings (`GISCUS_REPO`, `GISCUS_REPO_ID`, etc.) in `.env.local` if you prefer not to have them directly in `site.config.js`, though you'd need to adjust the Giscus component to read from `process.env` if it doesn't already.

## Deployment

This Next.js blog can be deployed to any platform that supports Node.js applications. Vercel (from the creators of Next.js) is a highly recommended platform for deploying Next.js sites.

### Vercel

1.  **Push your code to a Git repository** (e.g., GitHub, GitLab, Bitbucket).
2.  **Sign up or log in to Vercel** using your Git provider.
3.  **Import your Git repository** into Vercel.
    *   Vercel will typically auto-detect that it's a Next.js project and configure the build settings correctly.
4.  **Configure Environment Variables:**
    *   In your Vercel project settings, add the same environment variables you defined in your `.env.local` file:
        *   `NOTION_API_KEY`
        *   (If applicable) `GISCUS_REPO`, `GISCUS_REPO_ID`, `GISCUS_CATEGORY`, `GISCUS_CATEGORY_ID`
        *   Ensure the `baseURL` in `site.config.js` is set to your Vercel production domain.
5.  **Deploy.**

Vercel will automatically build and deploy your site. Subsequent pushes to your connected Git branch will trigger automatic redeployments.

### Other Platforms

For other platforms like Netlify, AWS Amplify, or your own server:

*   **Build Command:** `yarn build` (or `npm run build`)
*   **Output Directory:** `.next`
*   **Start Command:** `yarn start` (or `npm run start`)

You will need to configure environment variables on your chosen platform similar to the Vercel setup. Ensure the platform serves the application from the `.next` directory and runs the `start` command.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

*   This project is inspired by the clean and fast [Hugo PaperMod theme](https://github.com/adityatelange/hugo-PaperMod).
*   Built with [Next.js](https://nextjs.org/), [Notion API](https://developers.notion.com/), and [Pico.css](https://picocss.com/).
*   Thanks to the open-source community for the various libraries and tools that make this possible.
