import { config } from "@/config";
import { Client } from "@notionhq/client";

const getClient = () => {
  if (config.notion.apiToken) {
    return new Client({
      auth: config.notion.apiToken,
    });
  } else {
    return null;
  }
};

export const client: Client = getClient()!;
