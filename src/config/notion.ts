import { siteConfig } from "../../site.config";

export const notionConfig = {
  apiToken: process.env["NOTION_API_TOKEN"] || null,
  databaseID: siteConfig.databseID,
};
