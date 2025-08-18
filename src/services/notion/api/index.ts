import { client } from "./client";
import { notionErrorHandler } from "./error";

export const notion = client ? {
  databases: {
    query: notionErrorHandler(client.databases.query),
  },
  pages: {
    retrieve: notionErrorHandler(client.pages.retrieve),
  },
  blocks: {
    children: {
      list: notionErrorHandler(client.blocks.children.list),
    },
    retrieve: notionErrorHandler(client.blocks.retrieve),
  },
} : {
  databases: {
    query: () => { throw new Error("Notion API token not configured"); },
  },
  pages: {
    retrieve: () => { throw new Error("Notion API token not configured"); },
  },
  blocks: {
    children: {
      list: () => { throw new Error("Notion API token not configured"); },
    },
    retrieve: () => { throw new Error("Notion API token not configured"); },
  },
};
