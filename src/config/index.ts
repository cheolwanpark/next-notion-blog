import { siteConfig } from "../../site.config";
import { notionConfig } from "./notion";

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
};
