import { siteConfig } from "../../site.config";
import { notionConfig } from "./notion";

export const config = {
  blogTitle: siteConfig.blogTitle,
  owner: siteConfig.owner,
  github: siteConfig.github,
  imageCachingTime: siteConfig.imageCachingTime,
  notion: notionConfig,
};
