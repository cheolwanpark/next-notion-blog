import { siteConfig } from "../../site.config";
import { notionConfig } from "./notion";

export const config = {
  blogTitle: siteConfig.blogTitle,
  owner: siteConfig.owner,
  github: siteConfig.github,
  postsListRevalidateTime: siteConfig.postsListRevalidateTime,
  revalidateTime: siteConfig.revalidateTime,
  postsPerPage: siteConfig.postsPerPage,
  previewPosts: siteConfig.previewPosts,
  baseURL: siteConfig.baseURL,
  defaultSiteDescription: siteConfig.defaultSiteDescription,
  notion: notionConfig,
  secret: process.env["SECRET"] || "secret",
};
