import { siteConfig } from "../../site.config";

// Notion configuration
const notionConfig = {
  apiToken: process.env["NOTION_API_TOKEN"] || null,
  databaseID: siteConfig.databseID,
};

// Giscus configuration
const giscusConfig = siteConfig.giscus
  ? {
      repo: siteConfig.giscus.repo,
      repoID: siteConfig.giscus.repoID,
      category: siteConfig.giscus.category,
      categoryID: siteConfig.giscus.categoryID,
    }
  : undefined;

export const config = {
  blogTitle: siteConfig.blogTitle,
  owner: siteConfig.owner,
  github: siteConfig.github,
  revalidateTime: siteConfig.revalidateTime,
  optimizeExpiringImages: siteConfig.optimizeExpiringImages,
  postsPerPage: siteConfig.postsPerPage,
  previewPosts: 3,
  baseURL: siteConfig.baseURL,
  defaultSiteDescription: siteConfig.defaultSiteDescription,
  googleSiteVerificationMetaTag: siteConfig.googleSiteVerificationMetaTag,
  notion: notionConfig,
  giscus: giscusConfig,
};
