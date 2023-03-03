import { siteConfig } from "../../site.config";
import { notionConfig } from "./notion";

export const config = {
  blogTitle: siteConfig.blogTitle,
  github: siteConfig.github,
  notion: notionConfig,
};
