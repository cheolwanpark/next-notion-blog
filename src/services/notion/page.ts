import { isFullPage } from "@notionhq/client";
import {
  PageObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import dayjs from "dayjs";
import { PageMeta } from "./types";
import { plainText } from "./utils";

export const getPageMeta = (
  page: PageObjectResponse | PartialPageObjectResponse,
): PageMeta | null => {
  try {
    if (isFullPage(page)) {
      const title = page.properties["Name"];
      const author = page.properties["Author"];
      const description = page.properties["Description"];
      const tags = page.properties["Tags"];
      const isPublic = page.properties["Public"];
      const featured = page.properties["Featured"];
      const published = page.properties["Published"];
      const updated = page.last_edited_time;
      return {
        title: title.type === "title" ? plainText(title.title) : "",
        author: author.type === "rich_text" ? plainText(author.rich_text) : "",
        description:
          description.type === "rich_text"
            ? plainText(description.rich_text)
            : "",
        tags:
          tags.type === "multi_select"
            ? tags.multi_select.map((option) => option.name)
            : [],
        public: isPublic.type === "checkbox" ? isPublic.checkbox : false,
        featured: featured.type === "checkbox" ? featured.checkbox : false,
        published:
          published.type === "date"
            ? dayjs(published.date!.start).toJSON()
            : dayjs().toJSON(),
        updated: dayjs(updated).toJSON(),
      };
    } else {
      return null;
    }
  } catch (_) {
    return null;
  }
};
