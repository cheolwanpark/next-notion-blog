import { client } from "./client";
import { notionErrorHandler } from "./error";

export const notion = {
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
};
