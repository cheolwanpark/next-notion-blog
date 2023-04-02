import { siteConfig } from "../../site.config";
import { notionConfig } from "./notion";

export const config = {
  blogTitle: siteConfig.blogTitle,
  owner: siteConfig.owner,
  github: siteConfig.github,
  revalidateTime: siteConfig.revalidateTime,
  postsPerPage: siteConfig.postsPerPage,
  previewPosts: siteConfig.previewPosts,
  notion: notionConfig,
};
